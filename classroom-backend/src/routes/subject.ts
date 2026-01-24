import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import express from 'express';
import { departments, subjects } from '../db/schema';
import { db } from '../db';
import { authenticate } from '../middleware/auth-middleware';

const router = express.Router();

// Apply authentication middleware
// router.use(authenticate);

// Get all subjects with optional search, department filter, and pagination
router.get('/', async (req, res) => {
    try {
        const { search, department, page = 1, limit = 10 } = req.query;
        
        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
        const limitPerPage = Math.max(1, parseInt(String(limit), 10) || 10);

        const offset = (currentPage - 1) * limitPerPage;

        const filterConditions = [];

        if (search) {
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`)
                )
            );
        }

        if (department) {
            const deptPattern = `%${String(department).replace(/%/g, '\\%')}%`;
            filterConditions.push(
                ilike(departments.name, deptPattern)
            );
        }

        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;
        
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereClause);

        const totalCount = countResult[0]?.count ?? 0;

        const subjectsList = await db
            .select({
                ...getTableColumns(subjects),
                department: { ...getTableColumns(departments) }
            })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereClause)
            .orderBy(desc(subjects.createdAt))
            .limit(limitPerPage)
            .offset(offset);

        res.status(200).json({
            data: subjectsList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage)
            },
            message: 'Subjects retrieved successfully'
        });
    } catch (error) {
        console.error('GET /subjects error:', error);
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
});

// Get subject by ID
router.get('/:id', async (req, res) => {
    try {
        const subjectId = parseInt(req.params.id);

        if (isNaN(subjectId)) {
            return res.status(400).json({ error: 'Invalid subject ID' });
        }

        const [subject] = await db
            .select({
                ...getTableColumns(subjects),
                department: { ...getTableColumns(departments) }
            })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(eq(subjects.id, subjectId));

        if (!subject) {
            return res.status(404).json({ 
                error: 'Subject not found',
                message: 'Subject not found' 
            });
        }

        res.status(200).json({
            data: subject,
            message: 'Subject retrieved successfully'
        });
    } catch (error) {
        console.error('GET /subjects/:id error:', error);
        res.status(500).json({ error: 'Failed to fetch subject' });
    }
});

// Create subject
router.post('/', async (req, res) => {
    try {
        const { departmentId, name, code, description } = req.body;

        // Validate required fields
        if (!departmentId || !name || !code) {
            return res.status(400).json({
                error: 'Department, name, and code are required',
                message: 'Missing required fields'
            });
        }

        // Check if department exists
        const [departmentExists] = await db
            .select()
            .from(departments)
            .where(eq(departments.id, departmentId))
            .limit(1);

        if (!departmentExists) {
            return res.status(404).json({
                error: 'Department not found',
                message: 'The selected department does not exist'
            });
        }

        // Check if subject code already exists
        const [existingSubject] = await db
            .select()
            .from(subjects)
            .where(eq(subjects.code, code))
            .limit(1);

        if (existingSubject) {
            return res.status(409).json({
                error: 'Subject code already exists',
                message: 'A subject with this code already exists'
            });
        }

        // Create subject
        const [createdSubject] = await db
            .insert(subjects)
            .values({
                departmentId,
                name,
                code,
                description: description || null
            })
            .returning();

        if (!createdSubject) {
            return res.status(500).json({
                error: 'Failed to create subject',
                message: 'Internal server error'
            });
        }

        res.status(201).json({
            data: createdSubject,
            message: 'Subject created successfully'
        });
    } catch (error) {
        console.error('POST /subjects error:', error);
        res.status(500).json({ 
            error: 'Failed to create subject',
            message: 'An error occurred while creating the subject'
        });
    }
});

// Update subject
router.put('/:id', async (req, res) => {
    try {
        const subjectId = parseInt(req.params.id);

        if (isNaN(subjectId)) {
            return res.status(400).json({ error: 'Invalid subject ID' });
        }

        const { departmentId, name, code, description } = req.body;

        // Check if subject exists
        const [existingSubject] = await db
            .select()
            .from(subjects)
            .where(eq(subjects.id, subjectId))
            .limit(1);

        if (!existingSubject) {
            return res.status(404).json({
                error: 'Subject not found',
                message: 'Subject not found'
            });
        }

        // If code is being changed, check if new code already exists
        if (code && code !== existingSubject.code) {
            const [codeExists] = await db
                .select()
                .from(subjects)
                .where(eq(subjects.code, code))
                .limit(1);

            if (codeExists) {
                return res.status(409).json({
                    error: 'Subject code already exists',
                    message: 'A subject with this code already exists'
                });
            }
        }

        // If department is being changed, check if it exists
        if (departmentId && departmentId !== existingSubject.departmentId) {
            const [departmentExists] = await db
                .select()
                .from(departments)
                .where(eq(departments.id, departmentId))
                .limit(1);

            if (!departmentExists) {
                return res.status(404).json({
                    error: 'Department not found',
                    message: 'The selected department does not exist'
                });
            }
        }

        // Build update object
        const updateValues: Record<string, any> = {};
        if (departmentId !== undefined) updateValues.departmentId = departmentId;
        if (name !== undefined) updateValues.name = name;
        if (code !== undefined) updateValues.code = code;
        if (description !== undefined) updateValues.description = description;

        if (Object.keys(updateValues).length === 0) {
            return res.status(400).json({
                error: 'No fields to update',
                message: 'At least one field must be provided'
            });
        }

        // Update subject
        const [updatedSubject] = await db
            .update(subjects)
            .set(updateValues)
            .where(eq(subjects.id, subjectId))
            .returning();

        res.status(200).json({
            data: updatedSubject,
            message: 'Subject updated successfully'
        });
    } catch (error) {
        console.error('PUT /subjects/:id error:', error);
        res.status(500).json({ error: 'Failed to update subject' });
    }
});

// Delete subject
router.delete('/:id', async (req, res) => {
    try {
        const subjectId = parseInt(req.params.id);

        if (isNaN(subjectId)) {
            return res.status(400).json({ error: 'Invalid subject ID' });
        }

        const [deletedSubject] = await db
            .delete(subjects)
            .where(eq(subjects.id, subjectId))
            .returning();

        if (!deletedSubject) {
            return res.status(404).json({
                error: 'Subject not found',
                message: 'Subject not found'
            });
        }

        res.status(200).json({
            data: deletedSubject,
            message: 'Subject deleted successfully'
        });
    } catch (error) {
        console.error('DELETE /subjects/:id error:', error);
        res.status(500).json({ error: 'Failed to delete subject' });
    }
});

export default router;