// src/shared/libs/toFormData.js
// Helper para construir FormData desde un objeto plano (DTO)
export function toFormData(obj = {}) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(obj ?? {})) {
    if (value == null) continue;

    if (Array.isArray(value)) {
      // Convención por defecto: repetir la clave con []
      // Si tu back prefiere JSON, cambia estas dos líneas por:
      // fd.append(key, JSON.stringify(value))
      value.forEach((v) => fd.append(`${key}[]`, serialize(v)));
      continue;
    }

    fd.append(key, serialize(value));
  }
  return fd;
}

function serialize(v) {
  // Files/Blobs van directos (no stringify)
  if (
    typeof Blob !== "undefined" &&
    (v instanceof Blob || (typeof File !== "undefined" && v instanceof File))
  ) {
    return v;
  }
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (v && typeof v === "object") return JSON.stringify(v);
  return v;
}
