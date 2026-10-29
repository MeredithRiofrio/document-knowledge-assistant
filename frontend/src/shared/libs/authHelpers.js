export function isLoggedIn() {
  return !!localStorage.getItem("access_token");
}

export function handleLogout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user"); // si lo guardas
}
