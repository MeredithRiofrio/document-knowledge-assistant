import { initialCategories, initialDocuments, initialSubcategories } from "./index";

// Mutable, page-lifetime state shared by related MSW handlers.
export const mockState = {
  categories: initialCategories.map((item) => ({ ...item })),
  subcategories: initialSubcategories.map((item) => ({ ...item })),
  documents: initialDocuments.map((item) => ({ ...item })),
};
