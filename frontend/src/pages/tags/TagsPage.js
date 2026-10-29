// src/layouts/tagsLists/index.js
import React from "react";

// Componentes
import MDBox from "shared/ui/MDBox";

// Vistas
import CategorySection from "./categories";
import SubcategorySection from "./subcategories";

function TagsPage() {
  return (
    <MDBox>
      <MDBox>
        <CategorySection />
      </MDBox>
      <MDBox pt={6} pb={3}>
        <SubcategorySection />
      </MDBox>
    </MDBox>
  );
}

export default TagsPage;
