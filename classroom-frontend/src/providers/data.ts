import { BaseRecord, DataProvider, GetListParams, GetListResponse } from "@refinedev/core";

type SubjectRecord = BaseRecord & {
   code: string;
   name: string;
   department: string;
   description: string;
};

const mockSubjects: SubjectRecord[] = [
   {
      id: "1",
      code: "CS101",
      name: "Introduction to Computer Science",
      department: "Computer Science",
      description: "Foundational concepts in programming, algorithms, and computational thinking.",
      createdAt: new Date().toISOString(),
   },
   {
      id: "2",
      code: "BIO210",
      name: "Molecular Biology",
      department: "Biology",
      description: "Structure and function of DNA, RNA, proteins, and gene regulation.",
   
      createdAt: new Date().toISOString(),},
   {
      id: "3",
      code: "ECON220",
      name: "Macroeconomics",
      department: "Economics",
      description: "Economic growth, inflation, unemployment, and fiscal/monetary policy.",
      createdAt: new Date().toISOString(),
   },
];

export const dataProvider: DataProvider = {
   getList: async <TData extends BaseRecord = BaseRecord>({ resource }:
   GetListParams): Promise<GetListResponse<TData>> => {
       if(resource !== 'subjects') return {data: [] as TData[], total: 0};

     return {
            data: mockSubjects as unknown as TData[],
            total: mockSubjects.length,
     }


  },

  getOne : async () => { throw new Error("This function is not implemented yet.") },
  create : async () => { throw new Error("This function is not implemented yet.") },
  update : async () => { throw new Error("This function is not implemented yet.") },
 
  deleteOne : async () => { throw new Error("This function is not implemented yet.") },

  getApiUrl: () => '',
  }