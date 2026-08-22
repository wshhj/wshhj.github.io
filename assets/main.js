(function () {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme");
  const preferredDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = saved || (preferredDark ? "dark" : "light");

  root.dataset.theme = initial;

  if (btn) {
    btn.addEventListener("click", function () {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("theme", next);
    });
  }
})();
