const sidebarLogout = document.querySelector(".sidebar-logout");

function logOut() {
  Cookies.remove("JWT");
  location.assign("/");
}

sidebarLogout.addEventListener("click", () => {
  logOut();
});
