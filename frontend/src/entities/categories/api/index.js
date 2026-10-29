// api/categories.js
import http from "shared/libs/apiClient";
import { CategoriesArrayDTO, CategoriesPageDTO, CategoryDTO, UpdateCategoryReq } from "./schemas";
import {
  fromCategoriesListDTO,
  fromCategoryDTO,
  toCreateCategoryDTO,
  toUpdateCategoryDTO,
} from "./mappers";
import { toFormData } from "shared/libs/toFormData";

const BASE_PATH = "/categories";

// ------------------ LIST ------------------
export async function listCategories(filters = {}, { signal } = {}) {
  const params = {};
  if (filters.q) params.q = filters.q;

  const { data } = await http.get(BASE_PATH, { params, signal });
  const parsed = Array.isArray(data)
    ? CategoriesArrayDTO.safeParse(data)
    : CategoriesPageDTO.safeParse(data);
  if (!parsed.success) throw new Error("Invalid CategoriesListDTO");
  return fromCategoriesListDTO(parsed.data); // ← FE model
}

// ------------------ DETAIL ------------------
export async function getCategory(id, { signal } = {}) {
  const { data } = await http.get(`${BASE_PATH}/${id}`, { signal });
  const parsed = CategoryDTO.safeParse(data.data);
  if (!parsed.success) throw new Error("Invalid CategoryDTO");
  return fromCategoryDTO(parsed.data); // ← FE model
}

// ------------------ CREATE (FormData) ------------------
export async function createCategory(model, { signal } = {}) {
  const form = toFormData(toCreateCategoryDTO(model));
  const { data } = await http.post(BASE_PATH, form, { signal });
  const parsed = CategoryDTO.safeParse(data.data);
  if (!parsed.success) throw new Error("Invalid CategoryDTO");
  return fromCategoryDTO(parsed.data);
}

// ------------------ UPDATE (FormData + id en URL) ------------------
export async function updateCategory(id, model, { signal } = {}) {
  // No se pasa id porque va en la URL
  const dto = toUpdateCategoryDTO(model);
  if (!UpdateCategoryReq.safeParse(dto).success) throw new Error("Invalid UpdateCategoryReq");

  const form = toFormData(dto);
  const { data } = await http.put(`${BASE_PATH}/${id}`, form, { signal });

  const parsed = CategoryDTO.safeParse(data.data);
  if (!parsed.success) throw new Error("Invalid CategoryDTO");
  return fromCategoryDTO(parsed.data);
}

// ------------------ DELETE (id en URL) ------------------
export async function deleteCategory(id, { signal } = {}) {
  await http.delete(`${BASE_PATH}/${id}`, { signal });
  return { id };
}
