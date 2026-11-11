// 소개 페이지 전용: 개인 포털의 저장소는 읽거나 수정하지 않습니다.
(() => {
  "use strict";

  const button = document.getElementById("publicTheme");
  if (!button) return;

  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  let manuallySelected = false;

  function applyTheme(isDark) {
    root.dataset.theme = isDark ? "dark" : "light";
    button.textContent = isDark ? "라이트로 전환" : "다크로 전환";
  }

  applyTheme(systemTheme.matches);
  button.hidden = false;

  button.addEventListener("click", () => {
    manuallySelected = true;
    applyTheme(root.dataset.theme !== "dark");
  });

  systemTheme.addEventListener("change", event => {
    if (!manuallySelected) {
      applyTheme(event.matches);
    }
  });
})();