// Normaliza texto para búsquedas: minúsculas + sin tildes
export default function normalize(s = "") {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
