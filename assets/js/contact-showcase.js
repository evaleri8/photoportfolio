/**
 * Интерактивная подборка на странице «Обсудить съёмку».
 * Категории и фотографии всегда берутся из assets/js/projects.js.
 * Hover/focus = временный предпросмотр; click/tap = закрепить выбранную категорию.
 * Новые направления появятся здесь и в форме автоматически.
 */
(() => {
  const categories = window.PORTFOLIO_CATEGORIES || [];
  const projects = window.RAW_PROJECTS || [];
  const stage = document.querySelector('[data-shoot-explorer]');
  const select = document.querySelector('[data-brief-categories]');

  // Формат съёмки тоже не нужно редактировать в HTML при добавлении категории.
  if (select && categories.length) {
    const previous = select.value;
    select.replaceChildren();
    for (const category of categories) {
      const label = category.title.toLocaleLowerCase('ru-RU').replace(/^./, (letter) =>
        letter.toLocaleUpperCase('ru-RU'),
      );
      const option = new Option(label, category.title);
      select.append(option);
    }
    select.append(new Option('Пока не знаю / другое', 'Пока не знаю / другое'));
    if ([...select.options].some((option) => option.value === previous)) {
      select.value = previous;
    }
  }

  if (!stage) return;
  const wordField = stage.querySelector('[data-explorer-words]');
  const photoField = stage.querySelector('[data-explorer-photos]');
  const caption = stage.parentElement.querySelector('[data-explorer-caption]');
  const counter = stage.parentElement.querySelector('[data-explorer-count]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const buttons = new Map();
  let selected = 'all';
  let showing = null;
  let fadeTimer = null;

  function distinctPhotos(categoryId) {
    const pool = categoryId === 'all'
      ? projects.flatMap(project => project.photos || [])
      : projects.filter(project => project.categoryId === categoryId)
          .flatMap(project => project.photos || []);
    return pool.filter((photo, index) => pool.findIndex(other => other.src === photo.src) === index);
  }

  // Каждый заход выбирает новые кадры; не перемешиваем фотографии при каждом наведении.
  function shuffle(photos) {
    const output = [...photos];
    for (let index = output.length - 1; index > 0; index--) {
      const swap = Math.floor(Math.random() * (index + 1));
      [output[index], output[swap]] = [output[swap], output[index]];
    }
    return output;
  }

  const sets = new Map([['all', shuffle(distinctPhotos('all')).slice(0, 4)]]);
  for (const category of categories) {
    sets.set(category.id, shuffle(distinctPhotos(category.id)).slice(0, 4));
  }

  function makeButton(id, label, index) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `explorer-word explorer-word-${index}`;
    button.textContent = label;
    button.dataset.category = id;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') render(id);
    });
    button.addEventListener('focus', () => render(id));
    button.addEventListener('click', () => {
      selected = id;
      render(id);
    });
    buttons.set(id, button);
    wordField.append(button);
  }

  if (categories.length > 4) wordField.classList.add('explorer-words-expanded');

  makeButton('all', 'by.erzhee', 0);
  categories.forEach((category, i) => {
    makeButton(category.id, category.title.toLocaleLowerCase('ru-RU'), i + 1);
  });

  wordField.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'touch') render(selected);
  });
  wordField.addEventListener('focusout', event => {
    if (!wordField.contains(event.relatedTarget)) render(selected);
  });

  function makePhoto(photo, index, eager) {
    const figure = document.createElement('figure');
    figure.className = `explorer-photo explorer-photo-${index + 1}`;
    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt || 'Фотография из портфолио';
    img.decoding = 'async';
    img.loading = eager ? 'eager' : 'lazy';
    img.style.objectPosition = photo.position || 'center';
    figure.append(img);
    return figure;
  }

  function render(id) {
    if (showing === id) return;
    showing = id;
    clearTimeout(fadeTimer);
    buttons.forEach((button, categoryId) => {
      const active = categoryId === id;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const category = categories.find(item => item.id === id);
    const photos = sets.get(id) || [];
    const paint = () => {
      photoField.replaceChildren();
      photoField.dataset.count = String(photos.length);
      if (photos.length) {
        photos.forEach((photo, index) => {
          photoField.append(makePhoto(photo, index, id === 'all'));
        });
      } else {
        const empty = document.createElement('p');
        empty.className = 'explorer-empty';
        empty.innerHTML = 'СКОРО ЗДЕСЬ ПОЯВЯТСЯ<br />НОВЫЕ ИСТОРИИ.';
        photoField.append(empty);
      }
      caption.textContent = category ? category.title : 'ИЗБРАННЫЕ КАДРЫ / BY.ERZHEE';
      counter.textContent = photos.length ? `${String(photos.length).padStart(2, '0')} КАДРА` : 'ПОКА НЕТ СНИМКОВ';
      photoField.classList.remove('is-changing');
    };
    if (reducedMotion.matches || photoField.childElementCount === 0) paint();
    else {
      photoField.classList.add('is-changing');
      fadeTimer = setTimeout(paint, 150);
    }
  }

  render('all');
})();
