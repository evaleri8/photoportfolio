/** Каталог: фильтры и карточки автоматически из assets/js/projects.js. */
(() => {
  const categories = window.PORTFOLIO_CATEGORIES || [];
  const projects = window.RAW_PROJECTS || [];
  const filters = document.querySelector('[data-category-filters]');
  const gallery = document.querySelector('[data-project-list]');
  const empty = document.querySelector('[data-empty-category]');
  const summary = document.querySelector('[data-category-summary]');
  if (!filters || !gallery) return;

  const formatCount = (n) => String(n).padStart(2, '0');

  function card(project, index) {
    const link = document.createElement('a');
    link.className = `project project-${project.id}${project.grayscale ? ' project-portrait' : ''}`;
    link.href = project.url;
    link.dataset.category = project.categoryId;
    link.setAttribute('aria-label', `Проект «${project.title}», ${project.categoryTitle}`);

    const photo = document.createElement('div');
    photo.className = 'photo';
    const img = document.createElement('img');
    img.src = project.photos?.[0]?.src || '';
    img.alt = project.photos?.[0]?.alt || project.title;
    img.loading = 'lazy';
    img.style.objectPosition = project.photos?.[0]?.position || 'center';
    const number = document.createElement('span');
    number.className = 'index';
    number.textContent = formatCount(index + 1);
    const view = document.createElement('span');
    view.className = 'view';
    view.textContent = 'ОТКРЫТЬ ПРОЕКТ';
    photo.append(img, number, view);

    const caption = document.createElement('div');
    caption.className = 'caption';
    const name = document.createElement('span');
    name.textContent = `${formatCount(index + 1)} / ${project.title}`;
    caption.append(name);

    const type = document.createElement('span');
    type.className = 'project-category-name';
    type.textContent = project.categoryTitle;
    const description = document.createElement('small');
    description.textContent = project.summary || project.subtitle || '';
    link.append(photo, caption, type, description);
    return link;
  }

  const buttons = [
    { id: 'all', title: 'ВСЕ ПРОЕКТЫ', projects },
    ...categories.map(({ id, title, projects: items }) => ({ id, title, projects: items })),
  ].map(({ id, title, projects: items }) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.filter = id;
    button.setAttribute('aria-pressed', 'false');
    button.append(document.createTextNode(title + ' '));
    const count = document.createElement('sup');
    count.textContent = formatCount(items.length);
    button.append(count);
    button.addEventListener('click', () => selectCategory(id, true));
    filters.append(button);
    return button;
  });

  function selectCategory(id, updateUrl) {
    const selectedCategory = categories.find((item) => item.id === id);
    const active = selectedCategory ? id : 'all';
    const visible = active === 'all'
      ? projects
      : projects.filter((project) => project.categoryId === active);

    buttons.forEach((button) => {
      const selected = button.dataset.filter === active;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    gallery.replaceChildren(...visible.map(card));
    gallery.classList.toggle('filtered', active !== 'all');
    empty.hidden = visible.length !== 0;
    if (summary) {
      const noun = (n) => {
        if (n % 10 === 1 && n % 100 !== 11) return 'ПРОЕКТ';
        if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'ПРОЕКТА';
        return 'ПРОЕКТОВ';
      };
      summary.textContent = selectedCategory
        ? `${selectedCategory.description} · ${formatCount(visible.length)} ${noun(visible.length)}`
        : `КАТЕГОРИЙ: ${formatCount(categories.length)} · ПРОЕКТОВ: ${formatCount(projects.length)}`;
    }

    // Ссылка с выбранной категорией: works.html?category=concerts
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (active === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', active);
      // file:// не разрешает менять адрес через History API в некоторых браузерах.
      if (window.location.protocol !== 'file:') {
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
    }
  }

  selectCategory(new URLSearchParams(window.location.search).get('category') || 'all', false);
})();
