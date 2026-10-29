// api/subcategories.js
import http from "shared/libs/apiClient";
import {
  SubcategoriesArrayDTO,
  SubcategoriesPageDTO,
  SubcategoryDTO,
  UpdateSubcategoryReq,
} from "./schemas";
import {
  fromSubcategoriesListDTO,
  fromSubcategoryDTO,
  toCreateSubcategoryDTO,
  toUpdateSubcategoryDTO,
} from "./mappers";
import { toFormData } from "shared/libs/toFormData";

const BASE_PATH = "/subcategories";

// ------------------ LIST ------------------
export async function listSubcategories(filters = {}, { signal } = {}) {
  const params = {};
  if (filters.q) params.q = filters.q;
  if (filters.categoryId) params.category_id = filters.categoryId;

  const { data } = await http.get(BASE_PATH, { params, signal });
  const parsed = Array.isArray(data)
    ? SubcategoriesArrayDTO.safeParse(data)
    : SubcategoriesPageDTO.safeParse(data);
  if (!parsed.success) throw new Error("Invalid SubcategoriesListDTO");
  return fromSubcategoriesListDTO(parsed.data); // FE model unificado
}

// ------------------ DETAIL ------------------
export async function getSubcategory(id, { signal } = {}) {
  const { data } = await http.get(`${BASE_PATH}/${id}`, { signal });
  const parsed = SubcategoryDTO.safeParse(data.data);
  if (!parsed.success) throw new Error("Invalid SubcategoryDTO");
  return fromSubcategoryDTO(parsed.data); // FE model
}

// ------------------ CREATE (FormData) ------------------ Se maneja en el documento
// export async function createSubcategory(model, { signal } = {}) {
//   const dto = toCreateSubcategoryDTO(model); // nombres que espera el back
//   if (!CreateSubcategoryReq.safeParse(dto).success) throw new Error("Invalid CreateSubcategoryReq");

//   const form = toFormData(dto);
//   // No seteamos Content-Type manualmente; axios lo detecta
//   const { data } = await http.post(BASE_PATH, form, { signal });

//   const parsed = SubcategoryDTO.safeParse(data);
//   if (!parsed.success) throw new Error("Invalid SubcategoryDTO");
//   return fromSubcategoryDTO(parsed.data);
// }

// ------------------ CREATE (FormData) ------------------
export async function createSubcategory(model, { signal } = {}) {
  const form = toFormData(toCreateSubcategoryDTO(model));
  const { data } = await http.post(BASE_PATH, form, { signal });
  const parsed = SubcategoryDTO.safeParse(data.data);
  if (!parsed.success) throw new Error("Invalid SubcategoryDTO");
  return fromSubcategoryDTO(parsed.data);
}

// ------------------ UPDATE (FormData + id en URL) ------------------
export async function updateSubcategory(id, model, { signal } = {}) {
  // No pasamos id al dto porque va en la URL
  const dto = toUpdateSubcategoryDTO(model);
  if (!UpdateSubcategoryReq.safeParse(dto).success) throw new Error("Invalid UpdateSubcategoryReq");

  const form = toFormData(dto);
  const { data } = await http.put(`${BASE_PATH}/${id}`, form, { signal });
  // Si tu back usa override de método:
  // const form = toFormData({ ...dto, _method: "PUT" })
  // const { data } = await http.post(`${BASE_PATH}/${id}`, form, { signal })

  const parsed = SubcategoryDTO.safeParse(data.data);
  if (!parsed.success) throw new Error("Invalid SubcategoryDTO");
  return fromSubcategoryDTO(parsed.data);
}

// ------------------ DELETE (id en URL) ------------------
export async function deleteSubcategory(id, { signal } = {}) {
  await http.delete(`${BASE_PATH}/${id}`, { signal });
  return { id };
}
