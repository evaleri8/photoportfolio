/** Общие интерактивные элементы: мобильное меню и сохранение брифа. */
(() => {
  const menu = document.querySelector(".menu");
  const nav = document.querySelector("nav");

  menu.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", isOpen);
    menu.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
    });
  });

  // Категории каталога и карточки формируются в assets/js/works.js.
  document.querySelector("#brief")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(event.target);
    const text =
      `БРИФ НА СЪЁМКУ / BY.ERZHEE\n\n` +
      `Имя: ${data.get("name")}\n` +
      `Формат: ${data.get("type")}\n\n` +
      `Идея:\n${data.get("idea")}\n`;

    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "by-erzhee-brief.txt";
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    document.querySelector("#form-status").textContent =
      "Бриф сохранён. Его можно отправить фотографу.";
  });
})();
