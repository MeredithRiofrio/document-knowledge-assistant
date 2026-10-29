// entities/documents/api.js
import http from "shared/libs/apiClient";
import {
  DocumentsArrayDTO,
  DocumentsPageDTO,
  DocumentDTO,
  CreateDocumentReq,
  UpdateDocumentReq,
  ReplaceDocumentReq,
} from "./schemas";
import {
  fromDocumentsListDTO,
  fromDocumentDTO,
  toCreateDocumentDTO,
  toUpdateDocumentDTO,
  toReplaceDocumentDTO,
} from "./mappers";
import { toFormData } from "shared/libs/toFormData";
import { DocChunksDTO } from "entities/documentChunks/api/schemas";
import { fromDocChunksDTO } from "entities/documentChunks/api/mappers";

const BASE_PATH = "/documents";

// ------------------ LIST ------------------
export async function listDocuments(filters = {}, { signal } = {}) {
  const params = {};
  if (filters.q) params.q = filters.q;
  if (filters.categoryId) params.category_id = filters.categoryId;
  if (filters.subcategoryId) params.subcategory_id = filters.subcategoryId;

  const { data } = await http.get(BASE_PATH, { params, signal });
  const parsed = Array.isArray(data)
    ? DocumentsArrayDTO.safeParse(data)
    : DocumentsPageDTO.safeParse(data);
  if (!parsed.success) throw new Error("Invalid DocumentsListDTO");
  return fromDocumentsListDTO(parsed.data); // ← FE model unificado
}

// ------------------ DETAIL ------------------
export async function getDocument(id, { signal } = {}) {
  const { data } = await http.get(`${BASE_PATH}/${id}`, { signal });
  const parsed = DocumentDTO.safeParse(data.data);
  if (!parsed.success) throw new Error("Invalid DocumentDTO");
  return fromDocumentDTO(parsed.data); // ← FE model
}

// ------------------ CREATE (FormData) ------------------
export async function createDocument(model, { signal } = {}) {
  const dto = toCreateDocumentDTO(model); // ← nombres/shape que espera el back
  if (!CreateDocumentReq.safeParse(dto).success) throw new Error("Invalid CreateDocumentReq");
  const form = toFormData(dto);
  // No seteamos Content-Type manualmente; axios detecta FormData y pone el boundary
  const { data } = await http.post(BASE_PATH, form, { timeout: 0 }, { signal });
  const parsed = DocumentDTO.safeParse(data.data);
  if (!parsed.success) throw new Error("Invalid DocumentDTO");
  return fromDocumentDTO(parsed.data);
}

// ------------------ UPDATE (FormData + id en URL) ------------------
export async function updateDocument(id, model, { signal } = {}) {
  // No pasamos id al dto porque va en la URL
  const dto = toUpdateDocumentDTO(model);
  if (!UpdateDocumentReq.safeParse(dto).success) throw new Error("Invalid UpdateDocumentReq");
  // No seteamos Content-Type manualmente; axios pone el boundary (Este es raw)
  const { data } = await http.put(`${BASE_PATH}/chunks/${id}`, dto, { timeout: 0 }, { signal });
  const parsed = DocChunksDTO.safeParse(data.data);
  if (!parsed.success) throw new Error("Invalid DocChunksDTO");
  return fromDocChunksDTO(parsed.data);
}

// ------------------ REPLACE (FormData + id en URL) ------------------
export async function replaceDocument(id, model, { signal } = {}) {
  // No pasamos id al dto porque va en la URL
  const dto = toReplaceDocumentDTO(model);
  if (!ReplaceDocumentReq.safeParse(dto).success) throw new Error("Invalid ReplaceDocumentReq");
  const form = toFormData(dto);
  const { data } = await http.put(`${BASE_PATH}/${id}`, form, { timeout: 0 }, { signal });
  // Si tu back usa override, podrías hacer:
  // const form = toFormData({ ...dto, _method: "PUT" })
  // const { data } = await http.post(`${BASE_PATH}/${id}`, form, { signal })

  const parsed = DocumentDTO.safeParse(data.data);
  if (!parsed.success) throw new Error("Invalid DocumentDTO");
  return fromDocumentDTO(parsed.data);
}

// ------------------ DELETE (id en URL) ------------------
export async function deleteDocument(id, { signal } = {}) {
  await http.delete(`${BASE_PATH}/${id}`, { signal });
  return { id };
}
