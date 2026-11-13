/**
 * ОДИН ШАБЛОН ДЛЯ ВСЕХ ПРОЕКТОВ.
 * project.html?id=some-project — новая страница по данным projects.js.
 * Старые project-faces/live/night.html используют тот же код для совместимости.
 */
(() => {
  const root = document.querySelector('[data-project-detail]');
  if (!root) return;

  const projectId = root.dataset.projectId || new URLSearchParams(location.search).get('id');
  const all = window.RAW_PROJECTS || [];
  const project = all.find((item) => item.id === projectId);
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  if (!project) {
    document.title = 'Проект не найден — by.erzhee';
    const message = el('section', 'project-not-found');
    message.append(el('h1', '', 'ПРОЕКТ НЕ НАЙДЕН.'));
    const link = el('a', 'button', 'ВЕРНУТЬСЯ КО ВСЕМ РАБОТАМ');
    link.href = 'works.html';
    message.append(link);
    root.replaceChildren(message);
    return;
  }

  const ordinal = String(all.indexOf(project) + 1).padStart(2, '0');
  document.title = `${project.title} — by.erzhee`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = project.summary || `${project.title} — фотопроект by.erzhee`;

  const intro = el('section', 'project-intro');
  const top = el('div', 'project-top');
  const back = el('a', '', 'ВСЕ РАБОТЫ');
  back.href = 'works.html';
  const category = el('a', 'project-category-link', `${project.categoryTitle} / ${ordinal}`);
  category.href = `works.html?category=${encodeURIComponent(project.categoryId)}`;
  top.append(back, category);

  const title = el('div', 'project-title');
  const heading = el('h1');
  (project.heading?.length ? project.heading : [project.title]).forEach((line, index) => {
    if (index) heading.append(document.createElement('br'));
    heading.append(document.createTextNode(line));
  });
  title.append(heading, el('p', '', project.subtitle || ''));
  intro.append(top, title);

  const cover = el('figure', `project-cover${project.grayscale ? ' mono-photo' : ''}`);
  const allPhotos = project.photos || [];
  const viewer = el('dialog', 'photo-viewer');
  viewer.setAttribute('aria-label', 'Просмотр фотографий проекта');
  const viewerImage = el('img', 'photo-viewer-image');
  const viewerCount = el('span', 'photo-viewer-count');
  viewerCount.setAttribute('aria-live', 'polite');
  const close = el('button', 'photo-viewer-close', 'ЗАКРЫТЬ');
  const prev = el('button', 'photo-viewer-prev', 'НАЗАД');
  const nextPhoto = el('button', 'photo-viewer-next', 'ДАЛЕЕ');
  [close, prev, nextPhoto].forEach((button) => { button.type = 'button'; });
  close.setAttribute('aria-label', 'Закрыть просмотр');
  const controls = el('div', 'photo-viewer-controls');
  controls.append(prev, viewerCount, nextPhoto);
  viewer.append(close, viewerImage, controls);
  let currentPhoto = 0;
  function showPhoto(index) {
    currentPhoto = (index + allPhotos.length) % allPhotos.length;
    const photo = allPhotos[currentPhoto];
    viewerImage.src = photo.src;
    viewerImage.alt = photo.alt || `${project.title} — фото ${currentPhoto + 1}`;
    viewerCount.textContent = `${currentPhoto + 1} / ${allPhotos.length}`;
    prev.hidden = nextPhoto.hidden = allPhotos.length < 2;
  }
  close.addEventListener('click', () => viewer.close());
  prev.addEventListener('click', () => showPhoto(currentPhoto - 1));
  nextPhoto.addEventListener('click', () => showPhoto(currentPhoto + 1));
  viewer.addEventListener('click', (event) => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(currentPhoto - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(currentPhoto + 1); }
  });
  function photoButton(photo, index) {
    const button = el('button', `project-photo-open${photo.orientation === 'portrait' ? ' is-portrait' : ''}`);
    button.type = 'button';
    button.setAttribute('aria-label', `Открыть фото ${index + 1} из ${allPhotos.length}: ${photo.alt || project.title}`);
    const img = el('img');
    img.addEventListener('load', () => {
      if (img.naturalHeight > img.naturalWidth) button.classList.add('is-portrait');
    });
    img.src = photo.src;
    img.alt = photo.alt || `${project.title} — фото ${index + 1}`;
    if (index) img.loading = 'lazy';
    img.style.objectPosition = photo.position || 'center';
    button.append(img);
    button.addEventListener('click', () => { showPhoto(index); viewer.showModal(); close.focus(); });
    return button;
  }
  const coverPhoto = project.photos?.[0];
  if (coverPhoto) {
    cover.append(photoButton(coverPhoto, 0));
  }
  const caption = el('figcaption');
  caption.append(el('span', '', `by.erzhee / ${ordinal}`), el('span', '', project.categoryTitle));
  cover.append(caption);

  const photos = el('section', 'project-photo-series');
  photos.setAttribute('aria-label', `Фотографии проекта «${project.title}»`);
  (project.photos || []).slice(1).forEach((photo, index) => {
    const figure = el('figure');
    figure.append(photoButton(photo, index + 1), el('figcaption', '', `${String(index + 2).padStart(2, '0')} / ${project.title}`));
    photos.append(figure);
  });

  const story = el('section', 'project-story-text');
  story.append(el('span', 'eyebrow orange', `ЗА КАДРОМ / ${ordinal}`));
  story.append(el('p', '', project.story || project.summary || ''));
  const contact = el('a', 'text-link', 'ОБСУДИТЬ ПОХОЖУЮ СЪЁМКУ');
  contact.href = 'contact.html';
  story.append(contact);

  const next = all[(all.indexOf(project) + 1) % all.length];
  const nextLink = el('a', 'next-project');
  nextLink.href = next.url;
  nextLink.append(el('span', '', 'СЛЕДУЮЩИЙ ПРОЕКТ'));
  nextLink.append(el('strong', '', next.title));

  const parts = [intro, cover];
  if (photos.children.length) parts.push(photos);
  parts.push(story, nextLink, viewer);
  root.replaceChildren(...parts);
})();
