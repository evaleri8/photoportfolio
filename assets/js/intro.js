(() => {
  const key = "by-erzhee-shutter-v3";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let running = false;
  function playIntro() {
    if (running || reduced.matches) {
      document.documentElement.classList.remove("intro-active");
      return;
    }
    running = true;
    document.documentElement.classList.add("intro-active");
    const previousFocus = document.activeElement;
    const surfaces = [...document.querySelectorAll("body > header, body > main, body > footer")];
    const inertBefore = surfaces.map((el) => el.inert);
    surfaces.forEach((el) => (el.inert = true));
    const overlay = document.createElement("div");
    overlay.className = "shutter-intro";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Добро пожаловать в by.erzhee");
    // Лепестки соприкасаются и образуют общее вращающееся отверстие.
    const blades = Array.from(
      { length: 6 },
      (_, i) =>
        `<path class="iris-leaf" fill="${i % 2 ? "#1c211f" : "#242a26"}" stroke="#64705d" stroke-width="0.2" stroke-linejoin="round"/>`,
    ).join("");
    overlay.innerHTML = `<svg class="shutter-mechanism" viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${blades}</svg><div class="shutter-hud" aria-hidden="true"><span>BY.ERZHEE / OPTICAL SYSTEM</span><span>FRAME 001 — f/1.8</span></div><div class="shutter-welcome"><span class="shutter-kicker">ПОРТФОЛИО ФОТОГРАФА</span><strong>by<span>•</span>ERZHEE</strong><span class="shutter-caption">ЛЮДИ / МУЗЫКА / ИСТОРИИ</span><i class="shutter-track" aria-hidden="true"></i></div>`;
    overlay.tabIndex = -1;
    document.body.appendChild(overlay);
    overlay.focus({ preventScroll: true });
    let timer;
    let frame;
    const started = performance.now();
    const paths = [...overlay.querySelectorAll(".iris-leaf")];
    function draw(now) {
      const progress = Math.min(1, Math.max(0, (now - started - 1100) / 1500));
      const eased = progress * progress * (3 - 2 * progress);
      const radius = 245 * eased;
      const twist = ((30 - 50 * eased) * Math.PI) / 180;
      const point = (r, a) => `${(r * Math.cos(a)).toFixed(4)},${(r * Math.sin(a)).toFixed(4)}`;
      paths.forEach((path, i) => {
        const a = (i * Math.PI) / 3;
        const b = ((i + 1) * Math.PI) / 3;
        path.setAttribute(
          "d",
          `M ${point(radius, a + twist)} L ${point(radius, b + twist)} L ${point(600, b)} L ${point(600, a)} Z`,
        );
      });
      if (progress < 1) frame = requestAnimationFrame(draw);
    }
    draw(started);
    function finish() {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      overlay.remove();
      document.documentElement.classList.remove("intro-active");
      surfaces.forEach((el, i) => (el.inert = inertBefore[i]));
      document.removeEventListener("keydown", onKey);
      reduced.removeEventListener("change", finish);
      running = false;
      if (previousFocus && previousFocus !== document.body && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
    }
    function onKey(e) {
      if (e.key === "Escape") finish();
      if (e.key === "Tab") {
        e.preventDefault();
        overlay.focus({ preventScroll: true });
      }
    }
    document.addEventListener("keydown", onKey);
    reduced.addEventListener("change", finish);
    try {
      sessionStorage.setItem(key, "seen");
    } catch (_) {}
    timer = setTimeout(finish, 2800);
  }
  if (document.documentElement.classList.contains("intro-active")) playIntro();
  document.querySelector("[data-replay-intro]")?.addEventListener("click", playIntro);
})();
