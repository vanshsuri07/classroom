import express from "express";
import { eq, desc, ilike, sql, or } from "drizzle-orm";
import { db } from "../db";
import { departments } from "../db/schema";
import { authenticate } from "../middleware/auth-middleware";

const router = express.Router();

// Apply authentication middleware
// router.use(authenticate);

// Get all departments with optional search and pagination
router.get("/", async (req, res) => {
  try {
    const { search, page = 1, limit = 100 } = req.query;

    const currentPage = Math.max(1, Number(page));
    const limitPerPage = Math.max(1, Math.min(Number(limit), 100));
    const offset = (currentPage - 1) * limitPerPage;

    let query = db.select().from(departments);

    // Add search filter if provided
    if (search && typeof search === "string") {
      query = query.where(
        or(
          ilike(departments.name, `%${search}%`),
          ilike(departments.code, `%${search}%`)
        )
      ) as any;
    }

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(departments)
      .where(
        search && typeof search === "string"
          ? or(
              ilike(departments.name, `%${search}%`),
              ilike(departments.code, `%${search}%`)
            )
          : undefined
      );

    const totalCount = countResult[0]?.count ?? 0;

    // Get paginated results
    const departmentsList = await query
      .orderBy(desc(departments.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: departmentsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
      message: "Departments retrieved successfully",
    });
  } catch (error) {
    console.error("GET /departments error:", error);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

// Get department by ID
router.get("/:id", async (req, res) => {
  try {
    const departmentId = parseInt(req.params.id);

    if (isNaN(departmentId)) {
      return res.status(400).json({ error: "Invalid department ID" });
    }

    const [department] = await db
      .select()
      .from(departments)
      .where(eq(departments.id, departmentId));

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.status(200).json({
      data: department,
      message: "Department retrieved successfully",
    });
  } catch (error) {
    console.error("GET /departments/:id error:", error);
    res.status(500).json({ error: "Failed to fetch department" });
  }
});

// Create department
router.post("/", async (req, res) => {
  try {
    const { code, name, description } = req.body;

    if (!code || !name) {
      return res.status(400).json({
        error: "Code and name are required",
      });
    }

    const [createdDepartment] = await db
      .insert(departments)
      .values({ code, name, description })
      .returning();

    res.status(201).json({
      data: createdDepartment,
      message: "Department created successfully",
    });
  } catch (error) {
    console.error("POST /departments error:", error);
    res.status(500).json({ error: "Failed to create department" });
  }
});

// Update department
router.put("/:id", async (req, res) => {
  try {
    const departmentId = parseInt(req.params.id);

    if (isNaN(departmentId)) {
      return res.status(400).json({ error: "Invalid department ID" });
    }

    const { code, name, description } = req.body;

    const updateValues: Record<string, any> = {};
    if (code !== undefined) updateValues.code = code;
    if (name !== undefined) updateValues.name = name;
    if (description !== undefined) updateValues.description = description;

    if (Object.keys(updateValues).length === 0) {
      return res.status(400).json({
        error: "At least one field must be provided",
      });
    }

    const [updatedDepartment] = await db
      .update(departments)
      .set(updateValues)
      .where(eq(departments.id, departmentId))
      .returning();

    if (!updatedDepartment) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.status(200).json({
      data: updatedDepartment,
      message: "Department updated successfully",
    });
  } catch (error) {
    console.error("PUT /departments/:id error:", error);
    res.status(500).json({ error: "Failed to update department" });
  }
});

// Delete department
router.delete("/:id", async (req, res) => {
  try {
    const departmentId = parseInt(req.params.id);

    if (isNaN(departmentId)) {
      return res.status(400).json({ error: "Invalid department ID" });
    }

    const [deletedDepartment] = await db
      .delete(departments)
      .where(eq(departments.id, departmentId))
      .returning();

    if (!deletedDepartment) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.status(200).json({
      data: deletedDepartment,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /departments/:id error:", error);
    res.status(500).json({ error: "Failed to delete department" });
  }
});

export default router;