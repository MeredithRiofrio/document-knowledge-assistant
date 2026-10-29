// features/documents/hooks/useEditChunks.js
const toKey = (id) => (id == null ? null : String(id));
const norm = (s) => (s ?? "").replace(/\r\n/g, "\n"); // si quieres: .trimEnd()

/**
 * arrayHandler para "chunks" por ID.
 * - Devuelve:
 *   - undefined si NO hay cambios.
 *   - { updates: [...] } si solo hay ediciones
 *   - { deletes: [...] } si solo hay eliminaciones
 *   - { updates: [...], deletes: [...] } si hay ambos
 *
 * Firma compatible con buildPrePayloadStrict: (node, curArr, origArr, walk, path)
 */
export function arrayHandler(node, curArr = [], origArr = []) {
  // Index original por id, guardando solo el texto normalizado para comparar
  const origById = new Map(
    (origArr || []).filter((c) => c?.id != null).map((c) => [toKey(c.id), { text: norm(c.text) }])
  );

  const seen = new Set();
  const updates = [];
  const deletes = [];

  // Recorre los actuales: detecta EDITADOS
  (curArr || []).forEach((c) => {
    const key = toKey(c?.id);
    if (key == null) return; // sin id → ignorar (no hacemos creates)
    const prev = origById.get(key);
    if (!prev) return; // id nuevo (alta) → ignorar aquí (o manéjalo si quieres "added")

    seen.add(key);

    const text = norm(c?.text);
    if (prev.text !== text) {
      // Manda SOLO lo necesario (id + text). Si quieres todo el objeto: { ...c, text }
      updates.push({ id: c.id, text });
    }
  });

  // Recorre los originales: detecta DELETED
  (origArr || []).forEach((c) => {
    const key = toKey(c?.id);
    if (key != null && !seen.has(key)) {
      deletes.push({ id: c.id });
    }
  });

  // Decide qué devolver
  if (updates.length === 0 && deletes.length === 0) return undefined;

  if (updates.length > 0 && deletes.length > 0) {
    return { updates, deletes };
  }
  if (updates.length > 0) {
    return { updates };
  }
  return { deletes };
}
