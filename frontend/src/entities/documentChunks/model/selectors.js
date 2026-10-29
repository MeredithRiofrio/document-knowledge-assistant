// entities/documentChunks/selectors.js
export const selectChunkTexts = (res) => (res?.chunks ?? []).map((c) => c.text).join("\n");
