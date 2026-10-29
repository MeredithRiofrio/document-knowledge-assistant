import { z } from "zod";

export const CategoryDTO = z.object({
  category_id: z.string(),
  category_name: z.string(),
  subcategory_count: z.union([z.string(), z.number()]).optional(),
});

export const CategoriesArrayDTO = z.array(CategoryDTO);

export const CategoriesPageDTO = z.object({
  data: z.array(CategoryDTO),
  page: z.number().optional(),
  page_size: z.number().optional(),
  total: z.number().optional(),
});

// export const CreateCategoryReq = z.object({
//   category_name: z.string().min(1),
// });

// export const UpdateCategoryReq = CreateCategoryReq.partial();

export const UpdateCategoryReq = z
  .object({
    category_name: z.string().min(1),
  })
  .strict();
