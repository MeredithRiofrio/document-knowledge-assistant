import { setupWorker } from "msw/browser";
import { handlers as categoryHandlers } from "./handlers";
import { subcategoryHandlers } from "./handlers-subcategories";
import { documentHandlers } from "./handlers-documents";
import { chunkHandlers } from "./handlers-chunks";
import { authHandlers } from "./handlers-auth";

export const worker = setupWorker(
  ...categoryHandlers,
  ...authHandlers,
  ...subcategoryHandlers,
  ...documentHandlers,
  ...chunkHandlers
);
