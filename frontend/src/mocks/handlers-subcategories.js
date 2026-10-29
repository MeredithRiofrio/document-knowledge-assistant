// src/mocks/handlers-subcategories.js
import { http, HttpResponse, delay } from "msw";
import { mockState } from "./data/state";

/* eslint-disable prettier/prettier */

// Ajusta si tu axios usa baseURL absoluto en dev
const API = ""; // ej. "http://localhost:8000/api"

const subcategories = mockState.subcategories;
const nextSubcategoryId = () =>
  String(Math.max(0, ...subcategories.map((item) => Number(item.subcategory_id) || 0)) + 1);

function forcedError(req) {
  const url = new URL(req.url);
  return url.searchParams.get("__error") || req.headers.get("x-mock-error");
}

// ------------------ LIST ------------------
export const listSubcategoriesHandler = http.get(`${API}/subcategories`, async ({ request }) => {
  await delay(200);
  const fe = forcedError(request);
  if (fe) return HttpResponse.json({ message: "Error simulado (list)" }, { status: +fe });

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").toLowerCase();
  const categoryId = url.searchParams.get("category_id") || undefined;

  let result = subcategories;
  if (categoryId) result = result.filter((s) => s.category_id === String(categoryId));
  if (q) result = result.filter((s) => s.subcategory_name.toLowerCase().includes(q));

  // Si quieres probar paginado, activa ?__mode=page
  if (url.searchParams.get("__mode") === "page") {
    return HttpResponse.json({
      data: result,
      pagination: { page: 1, perPage: result.length, total: result.length },
    });
  }
  return HttpResponse.json(result);
});

// ------------------ DETAIL ------------------
export const detailSubcategoryHandler = http.get(
  `${API}/subcategories/:id`,
  async ({ params, request }) => {
    await delay(150);
    const fe = forcedError(request);
    if (fe) return HttpResponse.json({ message: "Error simulado (detail)" }, { status: +fe });

    const item = subcategories.find((s) => s.subcategory_id === String(params.id));
    if (!item) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json({ status: "success", message: "Subcategory loaded", data: item });
  }
);

export const createSubcategoryHandler = http.post(`${API}/subcategories`, async ({ request }) => {
  await delay(180);
  const form = await request.formData();
  const name = String(form.get("subcategory_name") || "").trim();
  const categoryId = String(form.get("category_id") || "");
  if (name.length < 3 || !categoryId) {
    return HttpResponse.json(
      { message: "A category and a name of at least 3 characters are required." },
      { status: 422 }
    );
  }
  if (
    subcategories.some(
      (item) =>
        item.category_id === categoryId &&
        item.subcategory_name.toLowerCase() === name.toLowerCase()
    )
  ) {
    return HttpResponse.json(
      { message: "A subcategory with this name already exists in the selected category." },
      { status: 409 }
    );
  }
  const created = {
    subcategory_id: nextSubcategoryId(),
    subcategory_name: name,
    category_id: categoryId,
    document_count: 0,
  };
  subcategories.push(created);
  const category = mockState.categories.find((item) => item.category_id === categoryId);
  if (category) category.subcategory_count += 1;
  return HttpResponse.json(
    { status: "success", message: "Subcategory created", data: created },
    { status: 201 }
  );
});

// ------------------ UPDATE ------------------
export const updateSubcategoryHandler = http.put(
  `${API}/subcategories/:id`,
  async ({ params, request }) => {
    await delay(200);
    const fe = forcedError(request);
    if (fe) return HttpResponse.json({ message: "Error simulado (update)" }, { status: +fe });

    const idx = subcategories.findIndex((s) => s.subcategory_id === String(params.id));
    if (idx === -1) return HttpResponse.json({ message: "No encontrado" }, { status: 404 });

    const form = await request.formData();
    const nextName = form.get("subcategory_name") ?? form.get("name");
    const nextCategoryId = form.get("category_id");

    // Validación ejemplo (422)
    if (nextName != null && String(nextName).trim().length < 3) {
      return HttpResponse.json({ message: "Nombre demasiado corto" }, { status: 422 });
    }

    const updated = {
      ...subcategories[idx],
      ...(nextName != null ? { subcategory_name: String(nextName) } : {}),
      ...(nextCategoryId != null ? { category_id: String(nextCategoryId) } : {}),
      // document_count lo dejamos como esté (lo maneja el back real)
    };
    subcategories[idx] = updated;
    return HttpResponse.json({ status: "success", message: "Subcategory updated", data: updated });
  }
);

// ------------------ DELETE ------------------
export const deleteSubcategoryHandler = http.delete(
  `${API}/subcategories/:id`,
  async ({ params, request }) => {
    await delay(150);
    const fe = forcedError(request);
    if (fe) return HttpResponse.json({ message: "Error simulado (delete)" }, { status: +fe });

    const before = subcategories.length;
    const index = subcategories.findIndex((s) => s.subcategory_id === String(params.id));
    if (index !== -1) {
      const [deleted] = subcategories.splice(index, 1);
      const category = mockState.categories.find(
        (item) => item.category_id === deleted.category_id
      );
      if (category) category.subcategory_count = Math.max(0, category.subcategory_count - 1);
    }
    if (subcategories.length === before) {
      return HttpResponse.json({ message: "No encontrado" }, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }
);

// ------------------ Mapper opcional ------------------
export const fromSubcategoryDTO = (d) => ({
  id: String(d.subcategory_id),
  name: d.subcategory_name,
  categoryId: String(d.category_id),
  categoryName: String(d.category_id) ?? null,
  documentCount: d.document_count == null ? 0 : Number(d.document_count),
});

// ------------------ Export group ------------------
export const subcategoryHandlers = [
  listSubcategoriesHandler,
  detailSubcategoryHandler,
  createSubcategoryHandler,
  updateSubcategoryHandler,
  deleteSubcategoryHandler,
];
