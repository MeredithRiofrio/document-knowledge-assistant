// ----- utils base -----
function isPlainObj(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a && typeof a === "object") {
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false;
      }
      return true;
    }
    const ak = Object.keys(a),
      bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    for (const k of ak) {
      if (!deepEqual(a[k], b[k])) return false;
    }
    return true;
  }
  return false;
}

// ----- motor principal -----
// Se le puede pasar un objeto con { arrayHandler }
export function buildPrePayloadStrict(dirtyFields, current, original, { arrayHandler } = {}) {
  function walk(node, cur, orig, path = "") {
    // Hoja sucia → comparar con deepEqual
    if (node === true) {
      return deepEqual(cur, orig) ? undefined : cur;
    }

    // Arrays
    if (Array.isArray(cur)) {
      if (typeof arrayHandler === "function") {
        // usa handler custom si lo pasaron
        return arrayHandler(node, cur, orig, walk, path);
      }
      // default: array paralelo con undefined donde no hubo cambios
      const res = cur.map((item, i) => {
        const branch = node?.[i];
        if (!branch) return undefined;
        return walk(branch, item, orig?.[i], `${path}[${i}]`);
      });
      return res.some((v) => v !== undefined) ? res : undefined;
    }

    // Objetos
    if (node && typeof node === "object" && cur && typeof cur === "object") {
      const out = {};
      for (const key of Object.keys(node)) {
        const child = walk(node[key], cur[key], orig?.[key], path ? `${path}.${key}` : key);
        if (child !== undefined && !(isPlainObj(child) && Object.keys(child).length === 0)) {
          out[key] = child;
        }
      }
      return Object.keys(out).length ? out : undefined;
    }

    return undefined;
  }

  return walk(dirtyFields, current, original) ?? {};
}
