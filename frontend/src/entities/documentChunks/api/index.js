// api.js
import http from "shared/libs/apiClient";
import { DocChunksDTO, UpdateChunkReq, DeleteChunkReq } from "./schemas";
import { fromDocChunksDTO, toUpdateChunkDTO, toDeleteChunkDTO } from "./mappers";

const BASE_PATH = "/documents/chunks";

export async function getDocChunks(id, { signal } = {}) {
  const { data } = await http.get(`${BASE_PATH}/${id}`, { signal });
  const parsed = DocChunksDTO.safeParse(data.data);
  if (!parsed.success) throw new Error("Invalid DocChunksDTO");
  return fromDocChunksDTO(parsed.data); // ← FE model
}

// ------------------ UPDATE (FormData + id en URL) ------------------
export async function updateDocChunks(id, model, { signal } = {}) {
  // No pasamos id al dto porque va en la URL
  const dto = toUpdateChunkDTO(model);
  if (!UpdateChunkReq.safeParse(dto).success) throw new Error("Invalid UpdateChunkReq");
  // No seteamos Content-Type manualmente; axios pone el boundary (Este es raw)
  const { data } = await http.put(`${BASE_PATH}/${id}`, dto, { signal, timeout: 0 });
  const parsed = DocChunksDTO.safeParse(data.data);
  if (!parsed.success) throw new Error("Invalid DocChunksDTO");
  return fromDocChunksDTO(parsed.data);
}

// ------------------ DELETE (id en URL) ------------------
export async function deleteDocChunks(id, model, { signal } = {}) {
  // No pasamos id al dto porque va en la URL
  const dto = toDeleteChunkDTO(model);
  if (!DeleteChunkReq.safeParse(dto).success) throw new Error("Invalid DeleteChunkReq");
  // No seteamos Content-Type manualmente; axios pone el boundary (Este es raw)
  const { data } = await http.delete(`${BASE_PATH}/${id}`, { data: dto, signal, timeout: 0 });
  const parsed = DocChunksDTO.safeParse(data.data);
  if (!parsed.success) throw new Error("Invalid DocChunksDTO");
  return fromDocChunksDTO(parsed.data);
}
