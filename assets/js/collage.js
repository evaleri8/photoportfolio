(() => {
  const projects = window.RAW_PROJECTS || [];
  const root = document.querySelector(".hero-collages");
  if (!root || !projects.length) return;
  const viable = projects.filter((p) => p.photos.length);
  if (!viable.length) return;
  const phone = matchMedia("(max-width: 600px)");
  const slides = viable.map((project, i) => {
    const slide = document.createElement("div");
    slide.className = "collage-slide";
    slide.dataset.project = project.id;
    slide.setAttribute("aria-hidden", i ? "true" : "false");
    const selected = window.pickCollagePhotos(project.photos);
    function renderPhotos() {
      const photos = selected.slice(0, phone.matches ? 2 : 3);
      slide.dataset.count = photos.length;
      slide.replaceChildren();
      const backdrop = document.createElement("img");
      backdrop.className = "collage-backdrop";
      backdrop.src = photos[0].src;
      backdrop.alt = "";
      backdrop.setAttribute("aria-hidden", "true");
      const frame = document.createElement("div");
      frame.className = "collage-frame";
      slide.append(backdrop, frame);
      photos.forEach((photo, j) => {
        const pane = document.createElement("div");
        pane.className = `collage-pane pane-${j + 1}`;
        const img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.alt;
        img.style.objectPosition = photo.position || "center";
        img.decoding = "async";
        if (!i) img.fetchPriority = "high";
        pane.append(img);
        frame.append(pane);
      });
    }
    renderPhotos();
    phone.addEventListener("change", renderPhotos);
    if (!i) slide.classList.add("is-active");
    root.append(slide);
    return slide;
  });
  const link = document.querySelector("[data-current-project]");
  const label = document.querySelector("[data-current-title]");
  const counter = document.querySelector("[data-collage-count]");
  const dots = document.querySelector(".collage-dots");
  const pause = document.querySelector("[data-collage-pause]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let current = 0;
  let timer;
  let paused = reduced.matches;
  let hovered = false;
  function sync() {
    const p = viable[current];
    link.href = p.url;
    label.textContent = p.title;
    counter.textContent =
      `${String(current + 1).padStart(2, "0")} / ` +
      `${String(viable.length).padStart(2, "0")}`;
    dots.querySelectorAll("button").forEach((b, i) => {
      b.setAttribute("aria-pressed", String(i === current));
      b.classList.toggle("active", i === current);
    });
  }
  function schedule() {
    clearTimeout(timer);
    if (paused || hovered || document.hidden || reduced.matches) return;
    timer = setTimeout(() => {
      if (document.documentElement.classList.contains("intro-active")) {
        schedule();
        return;
      }
      show(current + 1);
    }, 6500);
  }
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => {
      s.classList.toggle("is-active", i === current);
      s.setAttribute("aria-hidden", String(i !== current));
    });
    sync();
    schedule();
  }
  viable.forEach((p, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Показать проект ${p.title}`);
    b.addEventListener("click", () => show(i));
    dots.append(b);
  });
  document.querySelector("[data-collage-prev]").addEventListener("click", () => show(current - 1));
  document.querySelector("[data-collage-next]").addEventListener("click", () => show(current + 1));
  function pauseUI() {
    pause.dataset.state = paused ? "paused" : "playing";
    pause.setAttribute(
      "aria-label",
      paused ? "Продолжить смену коллажей" : "Приостановить смену коллажей",
    );
    pause.setAttribute("aria-pressed", String(paused));
  }
  pause.addEventListener("click", () => {
    paused = !paused;
    pauseUI();
    schedule();
  });
  const controls = document.querySelector(".collage-controls");
  controls.addEventListener("mouseenter", () => {
    hovered = true;
    schedule();
  });
  controls.addEventListener("mouseleave", () => {
    hovered = false;
    schedule();
  });
  controls.addEventListener("focusin", () => {
    hovered = true;
    schedule();
  });
  controls.addEventListener("focusout", (e) => {
    if (!controls.contains(e.relatedTarget)) {
      hovered = false;
      schedule();
    }
  });
  document.addEventListener("visibilitychange", schedule);
  reduced.addEventListener("change", () => {
    paused = reduced.matches;
    pauseUI();
    schedule();
  });
  sync();
  pauseUI();
  schedule();
})();
