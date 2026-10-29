// src/mocks/handlers-documents.js
import { http, HttpResponse, delay } from "msw";
import { mockState } from "./data/state";

// Ajusta si tu axios usa baseURL absoluto:
const API = ""; // ej. "http://localhost:8000/api"

/* eslint-disable prettier/prettier */

// Simulamos almacenamiento en memoria con el DTO del back:
let _seq = 100;
const documents = mockState.documents;

function forcedError(req) {
  const url = new URL(req.url);
  return url.searchParams.get("__error") || req.headers.get("x-mock-error");
}

function toStringOrNull(v) {
  return v == null ? null : String(v);
}

// ------------------ LIST ------------------
export const listDocumentsHandler = http.get(`${API}/documents`, async ({ request }) => {
  await delay(200);
  const fe = forcedError(request);
  if (fe) return HttpResponse.json({ message: "Error simulado (list)" }, { status: +fe });

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").toLowerCase();
  const categoryId = url.searchParams.get("category_id") || undefined;
  const subcategoryId = url.searchParams.get("subcategory_id") || undefined;

  let result = documents.slice();
  if (categoryId) {
    result = result.filter((d) => String(d.category_id) === String(categoryId));
  }
  if (subcategoryId) {
    result = result.filter((d) => String(d.subcategory_id) === String(subcategoryId));
  }
  if (q) {
    result = result.filter((d) => (d.doc_name || "").toLowerCase().includes(q));
  }

  if (url.searchParams.get("__mode") === "page") {
    return HttpResponse.json({
      data: result,
      pagination: { page: 1, perPage: result.length, total: result.length },
    });
  }
  return HttpResponse.json(result);
});

// ------------------ DETAIL ------------------
export const detailDocumentHandler = http.get(
  `${API}/documents/:id`,
  async ({ params, request }) => {
    await delay(150);
    const fe = forcedError(request);
    if (fe) return HttpResponse.json({ message: "Error simulado (detail)" }, { status: +fe });

    const item = documents.find((d) => d.doc_id === String(params.id));
    if (!item) return HttpResponse.json({ message: "No encontrado" }, { status: 404 });
    return HttpResponse.json({ status: "success", message: "Document loaded", data: item });
  }
);

// ------------------ CREATE (FormData) ------------------
export const createDocumentHandler = http.post(`${API}/documents`, async ({ request }) => {
  await delay(220);
  const fe = forcedError(request);
  if (fe) return HttpResponse.json({ message: "Error simulado (create)" }, { status: +fe });

  const form = await request.formData();

  // Campos esperados por tu toCreateDocumentDTO:
  const file = form.get("file"); // File | Blob | null
  const category_id = toStringOrNull(form.get("category_id"));
  const subcategory_id = toStringOrNull(form.get("subcategory_id"));
  const category_name = toStringOrNull(form.get("category_name"));
  const subcategory_name = toStringOrNull(form.get("subcategory_name"));

  // Validaciones ejemplo
  if (!file) {
    return HttpResponse.json({ message: "Falta archivo" }, { status: 422 });
  }

  const category = category_id
    ? mockState.categories.find((item) => item.category_id === category_id)
    : null;
  const categoryName = category?.category_name ?? category_name?.trim();
  if (!category && category_id) {
    return HttpResponse.json({ message: "La categoría seleccionada no existe." }, { status: 404 });
  }
  if (!categoryName) {
    return HttpResponse.json({ message: "Selecciona o escribe una categoría." }, { status: 422 });
  }

  if (
    !category &&
    mockState.categories.some(
      (item) => item.category_name.toLowerCase() === categoryName.toLowerCase()
    )
  ) {
    return HttpResponse.json(
      { message: "La categoría ya existe; selecciónala en la lista." },
      { status: 409 }
    );
  }

  const categoryToCreate = category
    ? null
    : {
        category_id: String(
          Math.max(0, ...mockState.categories.map((item) => Number(item.category_id) || 0)) + 1
        ),
        category_name: categoryName,
        subcategory_count: 0,
      };
  const resolvedCategory = category ?? categoryToCreate;

  const subcategory = subcategory_id
    ? mockState.subcategories.find((item) => item.subcategory_id === subcategory_id)
    : null;
  const subcategoryName = subcategory?.subcategory_name ?? subcategory_name?.trim();
  if (subcategory && subcategory.category_id !== resolvedCategory.category_id) {
    return HttpResponse.json(
      { message: "La subcategoría no pertenece a la categoría elegida." },
      { status: 400 }
    );
  }
  if (!subcategory && subcategory_id) {
    return HttpResponse.json(
      { message: "La subcategoría seleccionada no existe." },
      { status: 404 }
    );
  }
  if (!subcategoryName) {
    return HttpResponse.json(
      { message: "Selecciona o escribe una subcategoría." },
      { status: 422 }
    );
  }
  if (
    !subcategory &&
    mockState.subcategories.some(
      (item) =>
        item.category_id === resolvedCategory.category_id &&
        item.subcategory_name.toLowerCase() === subcategoryName.toLowerCase()
    )
  ) {
    return HttpResponse.json(
      { message: "La subcategoría ya existe; selecciónala en la lista." },
      { status: 409 }
    );
  }

  const subcategoryToCreate = subcategory
    ? null
    : {
        subcategory_id: String(
          Math.max(0, ...mockState.subcategories.map((item) => Number(item.subcategory_id) || 0)) +
            1
        ),
        subcategory_name: subcategoryName,
        category_id: resolvedCategory.category_id,
        document_count: 0,
      };
  const resolvedSubcategory = subcategory ?? subcategoryToCreate;

  if (categoryToCreate) mockState.categories.push(categoryToCreate);
  if (subcategoryToCreate) {
    mockState.subcategories.push(subcategoryToCreate);
    resolvedCategory.subcategory_count += 1;
  }

  // Derivamos un nombre si viene archivo
  const doc_name = typeof file === "object" && file?.name ? file.name : `document-${_seq + 1}`;

  const nowIso = new Date().toISOString();
  const newDoc = {
    doc_id: String(++_seq),
    doc_name,
    category_id: resolvedCategory.category_id,
    subcategory_id: resolvedSubcategory.subcategory_id,
    category_name: resolvedCategory.category_name,
    subcategory_name: resolvedSubcategory.subcategory_name,
    upload_date: nowIso,
  };
  documents.unshift(newDoc);
  return HttpResponse.json(
    { status: "success", message: "Document created", data: newDoc },
    { status: 201 }
  );
});

// ------------------ UPDATE / REPLACE (FormData + id en URL) ------------------
// Tu FE usa PUT para update y también para replace; detectamos por presencia de "file"
export const updateOrReplaceDocumentHandler = http.put(
  `${API}/documents/:id`,
  async ({ params, request }) => {
    await delay(220);
    const fe = forcedError(request);
    if (fe) {
      return HttpResponse.json({ message: "Error simulado (update/replace)" }, { status: +fe });
    }

    const idx = documents.findIndex((d) => d.doc_id === String(params.id));
    if (idx === -1) return HttpResponse.json({ message: "No encontrado" }, { status: 404 });

    const form = await request.formData();

    const hasFile = form.has("file");
    const file = form.get("file");

    // Campos de toUpdateDocumentDTO (además de file si es replace)
    const category_id = form.has("category_id")
      ? toStringOrNull(form.get("category_id"))
      : undefined;

    const subcategory_id = form.has("subcategory_id")
      ? toStringOrNull(form.get("subcategory_id"))
      : undefined;

    const category_name = form.has("category_name")
      ? toStringOrNull(form.get("category_name"))
      : undefined;

    const subcategory_name = form.has("subcategory_name")
      ? toStringOrNull(form.get("subcategory_name"))
      : undefined;

    // chunks_update / chunks_delete se ignoran en el mock (pero se aceptan)
    // const chunks_update = form.get("chunks_update");
    // const chunks_delete = form.get("chunks_delete");

    // Validaciones simples
    if (hasFile && !file) {
      return HttpResponse.json({ message: "Archivo inválido" }, { status: 422 });
    }

    let updated = { ...documents[idx] };

    // Si viene archivo, tratamos como REPLACE: cambiamos doc_name y fecha
    if (hasFile) {
      const nextName =
        typeof file === "object" && file?.name ? file.name : `document-${updated.doc_id}`;
      updated = {
        ...updated,
        doc_name: nextName,
        upload_date: new Date().toISOString(),
      };
    }

    // Metadatos de UPDATE
    if (category_id !== undefined) updated.category_id = category_id;
    if (subcategory_id !== undefined) updated.subcategory_id = subcategory_id;
    if (category_name !== undefined) updated.category_name = category_name;
    if (subcategory_name !== undefined) updated.subcategory_name = subcategory_name;

    documents[idx] = updated;
    return HttpResponse.json({ status: "success", message: "Document updated", data: updated });
  }
);

// ------------------ DELETE ------------------
export const deleteDocumentHandler = http.delete(
  `${API}/documents/:id`,
  async ({ params, request }) => {
    await delay(160);
    const fe = forcedError(request);
    if (fe) return HttpResponse.json({ message: "Error simulado (delete)" }, { status: +fe });

    const before = documents.length;
    const index = documents.findIndex((d) => d.doc_id === String(params.id));
    if (index !== -1) documents.splice(index, 1);
    if (documents.length === before) {
      return HttpResponse.json({ message: "No encontrado" }, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }
);

// ------------------ Export group ------------------
export const documentHandlers = [
  listDocumentsHandler,
  detailDocumentHandler,
  createDocumentHandler,
  updateOrReplaceDocumentHandler,
  deleteDocumentHandler,
];
