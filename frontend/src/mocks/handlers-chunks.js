// src/mocks/handlers-chunks.js
import { http, HttpResponse, delay } from "msw";
import { initialChunksByDocument } from "./data";

const API = "";

// Mapa en memoria: docId -> array de chunks
let chunksByDoc = Object.fromEntries(
  Object.entries(initialChunksByDocument).map(([id, chunks]) => [
    id,
    chunks.map((item) => ({ ...item })),
  ])
);

function forcedError(req) {
  const url = new URL(req.url);
  return url.searchParams.get("__error") || req.headers.get("x-mock-error");
}

// ------------------ GET chunks by document ------------------
export const getDocChunksHandler = http.get(
  `${API}/documents/chunks/:id`,
  async ({ params, request }) => {
    await delay(180);
    const fe = forcedError(request);
    if (fe) {
      return HttpResponse.json({ message: "Error simulado (chunks)" }, { status: +fe });
    }

    const { id } = params;
    const list = chunksByDoc[String(id)] || [];

    const dto = {
      doc_id: String(id),
      chunks_list: list,
    };

    return HttpResponse.json({ status: "success", message: "Document chunks loaded", data: dto });
  }
);

export const updateDocChunksHandler = http.put(
  `${API}/documents/chunks/:id`,
  async ({ params, request }) => {
    const payload = await request.json();
    const chunks = chunksByDoc[String(params.id)] || [];
    for (const update of payload.chunks_update || []) {
      const item = chunks.find((chunk) => chunk.chunk_id === String(update.chunk_id));
      if (item) item.chunk_text = String(update.new_chunk);
    }
    const data = { doc_id: String(params.id), chunks_list: chunks };
    return HttpResponse.json({ status: "success", message: "Document chunks updated", data });
  }
);

export const deleteDocChunksHandler = http.delete(
  `${API}/documents/chunks/:id`,
  async ({ params, request }) => {
    const payload = await request.json();
    const ids = new Set((payload.chunks_delete || []).map((item) => String(item.chunk_id)));
    const chunks = chunksByDoc[String(params.id)] || [];
    chunksByDoc[String(params.id)] = chunks.filter((chunk) => !ids.has(chunk.chunk_id));
    const deleted = chunks.filter((chunk) => ids.has(chunk.chunk_id));
    const data = { doc_id: String(params.id), chunks_list: deleted };
    return HttpResponse.json({ status: "success", message: "Document chunks deleted", data });
  }
);

// ------------------ Export group ------------------
export const chunkHandlers = [getDocChunksHandler, updateDocChunksHandler, deleteDocChunksHandler];
