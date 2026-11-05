(() => {
const menu = document.querySelector(".menu"),
  nav = document.querySelector("nav");
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", open);
  menu.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  menu.textContent = open ? "×" : "☰";
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.textContent = "☰";
  }),
);
// Категории каталога и карточки теперь в assets/js/works.js.
document.querySelector("#brief")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(e.target),
    text = `БРИФ НА СЪЁМКУ / BY.ERZHEE\n\nИмя: ${d.get("name")}\nФормат: ${d.get("type")}\n\nИдея:\n${d.get("idea")}\n`;
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "by-erzhee-brief.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector("#form-status").textContent =
    "Бриф сохранён. Его можно отправить фотографу.";
});
})();
