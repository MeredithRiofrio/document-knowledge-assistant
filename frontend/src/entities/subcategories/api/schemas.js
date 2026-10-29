import { z } from "zod";

export const SubcategoryDTO = z.object({
  subcategory_id: z.string(),
  subcategory_name: z.string(),
  category_id: z.string(),
  document_count: z.union([z.string(), z.number()]).optional(),
});

export const SubcategoriesArrayDTO = z.array(SubcategoryDTO);

export const SubcategoriesPageDTO = z.object({
  data: z.array(SubcategoryDTO),
  page: z.number().optional(),
  page_size: z.number().optional(),
  total: z.number().optional(),
});

// export const CreateSubcategoryReq = z.object({
//   subcategory_name: z.string().min(1),
//   category_id: z.string().min(1),
// });

// El ID es por la URL
export const UpdateSubcategoryReq = z
  .object({
    category_id: z.string().min(1).optional(),
    subcategory_name: z.string().min(1).optional(),
  })
  .strict();
