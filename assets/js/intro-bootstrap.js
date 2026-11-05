// Проверка приветствия до первого отображения страницы.
try {
  if (
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !sessionStorage.getItem("by-erzhee-shutter-v3")
  ) {
    document.documentElement.classList.add("intro-active");
    setTimeout(() => {
      if (!document.querySelector(".shutter-intro"))
        document.documentElement.classList.remove("intro-active");
    }, 4000);
  }
} catch (e) {}
