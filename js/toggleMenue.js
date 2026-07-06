const toggleSidebarBtn = document.querySelector(".toggle-sidebar");
const sidebarElem = document.querySelector(".sidebar");

function toggleMenue() {
  sidebarElem.classList.toggle("open");
}

toggleSidebarBtn.addEventListener("click", toggleMenue);