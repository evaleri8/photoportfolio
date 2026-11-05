/**
 * Общая шапка сайта.
 * Изменяйте логотип, ссылки и текст кнопки только здесь —
 * изменения автоматически появятся на каждой HTML-странице.
 *
 * Подключается сразу после <header id="site-header"></header>,
 * поэтому работает без сервера (в том числе через file://).
 */
(() => {
  const header = document.getElementById("site-header");
  if (!header) return;

  // Страницы проектов относятся к разделу «Работы».
  const page = window.location.pathname.split("/").pop().toLowerCase() || "index.html";
  const activePage = (page.startsWith("project-") || page === "project.html") ? "works.html" : page;

  const links = [
    { href: "works.html", label: "РАБОТЫ" },
    { href: "about.html", label: "ОБО МНЕ" },
    { href: "contact.html", label: "КОНТАКТЫ" },
  ];

  const navLinks = links
    .map(
      ({ href, label }) =>
        `<a href="${href}"${activePage === href ? ' aria-current="page"' : ""}>${label}</a>`,
    )
    .join("");

  header.innerHTML = `
    <a aria-label="by.erzhee — на главную" class="brand" href="index.html">
      <span>by</span><i aria-hidden="true" class="brand-dot">•</i><b>ERZHEE</b>
    </a>
    <nav aria-label="Основная навигация" id="site-nav">${navLinks}</nav>
    <a class="button header-cta" href="contact.html">ОБСУДИТЬ СЪЁМКУ <span>↗</span></a>
    <button aria-controls="site-nav" aria-expanded="false" aria-label="Открыть меню"
      class="menu" type="button">☰</button>
  `;
})();
