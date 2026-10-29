// Fictional seed data used only by the development MSW worker.
export const initialCategories = [
  { category_id: "1", category_name: "Product Guides", subcategory_count: 2 },
  { category_id: "2", category_name: "Workspace Resources", subcategory_count: 1 },
];

export const initialSubcategories = [
  {
    subcategory_id: "10",
    subcategory_name: "Getting Started",
    category_id: "1",
    document_count: 2,
  },
  { subcategory_id: "11", subcategory_name: "Account Setup", category_id: "1", document_count: 1 },
  { subcategory_id: "20", subcategory_name: "Team Workflows", category_id: "2", document_count: 1 },
];

export const initialDocuments = [
  {
    doc_id: "1",
    doc_name: "getting-started-guide.pdf",
    category_id: "1",
    subcategory_id: "10",
    category_name: "Product Guides",
    subcategory_name: "Getting Started",
    upload_date: "2025-01-12T10:00:00.000Z",
  },
  {
    doc_id: "2",
    doc_name: "account-setup-checklist.pdf",
    category_id: "1",
    subcategory_id: "11",
    category_name: "Product Guides",
    subcategory_name: "Account Setup",
    upload_date: "2025-02-08T08:30:00.000Z",
  },
  {
    doc_id: "3",
    doc_name: "team-workflow-overview.pdf",
    category_id: "2",
    subcategory_id: "20",
    category_name: "Workspace Resources",
    subcategory_name: "Team Workflows",
    upload_date: "2025-03-14T14:15:00.000Z",
  },
];

export const initialChunksByDocument = {
  1: [
    {
      chunk_id: "1",
      chunk_text: "A fictional guide explains how to create a workspace and invite teammates.",
    },
    {
      chunk_id: "2",
      chunk_text:
        "Sample content: choose a workspace name, set access preferences, and save your changes.",
    },
  ],
};
