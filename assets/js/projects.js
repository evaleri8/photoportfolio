/**
 * ЕДИНЫЙ КАТАЛОГ ФОТОГРАФИЙ
 *
 * 1. Чтобы добавить категорию, добавьте ещё один объект в PORTFOLIO_CATEGORIES.
 * 2. Чтобы добавить проект, добавьте объект в projects: [] нужной категории.
 * 3. Чтобы добавить фотографии, укажите их в photos: [].
 *
 * «Все проекты», фильтры, карточки, отдельные страницы и коллажи на главной
 * формируются автоматически. Другие HTML-файлы менять не нужно.
 *
 * Новые проекты открываются через project.html?id=УНИКАЛЬНЫЙ_ID.
 * Для трёх старых проектов сохранены прежние ссылки (поле url).
 */
window.PORTFOLIO_CATEGORIES = [
  {
    id: "studio", // Только латиница, без пробелов. Не повторять между категориями.
    title: "СТУДИЙНАЯ СЪЁМКА",
    description: "Портреты, характер и внимание к деталям.",
    projects: [
      {
        id: "faces", // Уникальный ID проекта на всём сайте.
        order: 2, // Порядок в «Все проекты» и на главной.
        title: "ЛИЦА",
        heading: ["ПОРТРЕТЫ."], // Заголовок на странице проекта. Можно несколько строк.
        subtitle: "Люди и их характер.",
        summary: "Портреты при естественном и городском свете.",
        story:
          "В портретной съёмке я оставляю место движению и разговору. " +
          "Мне хочется, чтобы в кадре человек узнавал себя — " +
          "в привычном жесте, выражении лица или взгляде.",
        url: "project-faces.html", // Старая ссылка продолжает работать; новым проектам не нужна.
        grayscale: true, // Чёрно-белая обложка в каталоге и на странице проекта.
        photos: [
          {
            src: "assets/images/hero.png",
            alt: "Портрет девушки в ночном свете",
            position: "72% center",
          },
          {
            src: "assets/images/portrait-2.jpg",
            alt: "Мужской портрет на открытом воздухе",
            position: "center",
          },
        ],
      },
    ],
  },
  {
    id: "outdoor",
    title: "ВЫЕЗДНАЯ СЪЁМКА",
    description: "За пределами студии: город, пространство и живые моменты.",
    projects: [
      {
        id: "night",
        order: 3,
        title: "ПОСЛЕ ПОЛУНОЧИ",
        heading: ["ПОСЛЕ", "ПОЛУНОЧИ"],
        subtitle: "Наблюдения за ночным городом.",
        summary: "Наблюдения за ночным городом.",
        story:
          "Эта серия — о городе после наступления темноты. " +
          "Я замечаю отражения, случайных прохожих и свет в окнах: " +
          "небольшие детали, которые днём легко пропустить.",
        url: "project-night.html",
        photos: [
          {
            src: "assets/images/night.jpg",
            alt: "Ночная городская история",
            position: "center",
          },
        ],
      },
      {
        id: "midnight",
        order: 4,
        title: "ТЕСТ",
        heading: ["тестовый", "проект"],
        subtitle: "тест",
        summary: "тест",
        story:
          "Эта серия — о городе после наступления темноты. " +
          "Я замечаю отражения, случайных прохожих и свет в окнах: " +
          "небольшие детали, которые днём легко пропустить.",
        photos: [
          {
            src: "assets/images/night.jpg",
            alt: "текст",
            position: "center",
          },
        ],
      },
    ],
  },
  {
    id: "concerts",
    title: "КОНЦЕРТЫ",
    description: "Музыка, свет сцены и эмоции зрителей.",
    projects: [
      {
        id: "live",
        order: 1,
        title: "LIVE ENERGY",
        heading: ["LIVE", "ENERGY"],
        subtitle: "Концертная фотография.",
        summary: "Свет сцены и люди в зале.",
        story:
          "На концертах я снимаю не только сцену. " +
          "Мне важны реакции людей, движение света и моменты между песнями — " +
          "всё, из чего складывается ощущение вечера.",
        url: "project-live.html",
        photos: [
          { src: "assets/images/live.jpg", alt: "Толпа и огни концертной сцены", position: "center" },
          { src: "assets/images/live-2.jpg", alt: "Зрители на музыкальном фестивале", position: "center" },
          { src: "assets/images/live-3.jpg", alt: "Сценический свет на концерте", position: "center" },
        ],
      },
    ],
  },
  {
    id: "events",
    title: "МЕРОПРИЯТИЯ",
    description: "Репортажи с событий и важные моменты встреч.",
    projects: [], // Категория уже видна в каталоге. Проекты можно добавить позднее.
  },
  
];

// Вспомогательный плоский список для всех страниц и коллажей.
// Не редактируйте его вручную — он собирается из категорий выше.
window.RAW_PROJECTS = window.PORTFOLIO_CATEGORIES.flatMap((category) =>
  category.projects.map((project) => ({
    ...project,
    categoryId: category.id,
    categoryTitle: category.title,
    url: project.url || `project.html?id=${encodeURIComponent(project.id)}`,
  })),
).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

window.pickCollagePhotos = function (photos, random = Math.random) {
  const unique = photos.filter(
    (photo, i, all) => all.findIndex((item) => item.src === photo.src) === i,
  );
  if (unique.length <= 3) return unique.slice();
  const shuffled = unique.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 3);
};
