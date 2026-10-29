import Icon from "@mui/material/Icon";

const navRoutes = [
  {
    type: "collapse",
    name: "Documentos",
    key: "documents",
    icon: <Icon fontSize="small">description</Icon>,
    route: "/admin/documents",
  },
  {
    type: "collapse",
    name: "Etiquetas",
    key: "tags",
    icon: <Icon fontSize="small">label</Icon>,
    route: "/admin/tags",
  },
];

export default navRoutes;
