// src/mocks/handlers.js (MSW v2)
import { http, HttpResponse, delay } from "msw";
import { mockState } from "./data/state";

// Si tu axios tiene baseURL absoluto (ej. http://localhost:8000/api)
// pon esa URL en API. Si no, déjalo en "".
const API = "";

const categories = mockState.categories;
const nextCategoryId = () =>
  String(Math.max(0, ...categories.map((item) => Number(item.category_id) || 0)) + 1);

export const handlers = [
  // LIST
  http.get(`${API}/categories`, async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").toLowerCase();
    const filtered = q
      ? categories.filter((c) => c.category_name.toLowerCase().includes(q))
      : categories;

    // Devuelvo **array** tal cual tu listCategories soporta.
    return HttpResponse.json(filtered);
  }),

  // DETAIL
  http.get(`${API}/categories/:id`, async ({ params }) => {
    await delay(150);
    const item = categories.find((c) => c.category_id === String(params.id));
    if (!item) {
      return HttpResponse.json({ message: "No encontrado" }, { status: 404 });
    }
    return HttpResponse.json({ status: "success", message: "Category loaded", data: item });
  }),

  http.post(`${API}/categories`, async ({ request }) => {
    await delay(180);
    const form = await request.formData();
    const name = String(form.get("category_name") || "").trim();
    if (name.length < 3)
      return HttpResponse.json(
        { message: "Name must contain at least 3 characters." },
        { status: 422 }
      );
    if (categories.some((item) => item.category_name.toLowerCase() === name.toLowerCase())) {
      return HttpResponse.json(
        { message: "A category with this name already exists." },
        { status: 409 }
      );
    }
    const created = {
      category_id: nextCategoryId(),
      category_name: name,
      subcategory_count: 0,
    };
    categories.push(created);
    return HttpResponse.json(
      { status: "success", message: "Category created", data: created },
      { status: 201 }
    );
  }),

  // UPDATE (FormData + id en URL) → responde CategoryDTO del back
  http.put(`${API}/categories/:id`, async ({ params, request }) => {
    await delay(200);
    const idx = categories.findIndex((c) => c.category_id === String(params.id));
    if (idx === -1) {
      return HttpResponse.json({ message: "No encontrado" }, { status: 404 });
    }

    const form = await request.formData();
    const nextName =
      form.get("category_name") ?? // si ya envías con este nombre
      form.get("name"); // si tu toFormData usa "name"

    if (nextName != null && String(nextName).trim().length < 3) {
      return HttpResponse.json({ message: "Nombre demasiado corto" }, { status: 422 });
    }

    const updated = {
      ...categories[idx],
      ...(nextName != null ? { category_name: String(nextName) } : {}),
      // subcategory_count lo dejo como esté (lo maneja el back)
    };
    categories[idx] = updated;
    return HttpResponse.json({ status: "success", message: "Category updated", data: updated });
  }),

  // DELETE
  http.delete(`${API}/categories/:id`, async ({ params }) => {
    await delay(150);
    const before = categories.length;
    const index = categories.findIndex((c) => c.category_id === String(params.id));
    if (index !== -1) {
      const [deleted] = categories.splice(index, 1);
      const subcategoryIds = new Set(
        mockState.subcategories
          .filter((item) => item.category_id === deleted.category_id)
          .map((item) => item.subcategory_id)
      );
      for (let i = mockState.subcategories.length - 1; i >= 0; i -= 1) {
        if (subcategoryIds.has(mockState.subcategories[i].subcategory_id))
          mockState.subcategories.splice(i, 1);
      }
      for (let i = mockState.documents.length - 1; i >= 0; i -= 1) {
        if (subcategoryIds.has(mockState.documents[i].subcategory_id))
          mockState.documents.splice(i, 1);
      }
    }
    if (categories.length === before) {
      return HttpResponse.json({ message: "No encontrado" }, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
