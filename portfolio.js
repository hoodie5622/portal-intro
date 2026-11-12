// Pages CMS의 JSON 작품 목록만 표시합니다. 개인 포털 저장소에는 접근하지 않습니다.
(async () => {
  "use strict";

  const grid = document.getElementById("portfolioGrid");
  const search = document.getElementById("portfolioSearch");
  const count = document.getElementById("portfolioCount");
  const notice = document.getElementById("portfolioNotice");

  if (!grid || !search || !count || !notice || grid.dataset.ready) return;
  grid.dataset.ready = "true";

  // 작품의 기준 원본은 portfolio.json입니다. 이전 JS 목록을 읽지 않습니다.
  let source;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(new URL("./portfolio.json", document.baseURI), {
      cache: "no-cache",
      credentials: "same-origin",
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`목록 응답 오류: ${response.status}`);
    const data = await response.json();
    if (!data || !Array.isArray(data.projects)) {
      throw new Error("portfolio.json에 projects 배열이 없습니다.");
    }
    source = data.projects;
  } catch (error) {
    console.error("포트폴리오 목록 읽기 실패", error);
    count.textContent = "작품 목록을 불러오지 못했습니다.";
    notice.hidden = false;
    notice.textContent = location.protocol === "file:"
      ? "파일 더블 클릭 대신 기존 Live Server 또는 공개 사이트 주소로 열어 주세요."
      : "잠시 후 새로고침해 주세요. 계속 실패하면 GitHub의 portfolio.json과 Pages 배포 결과를 확인하세요.";
    return;
  } finally {
    clearTimeout(timeout);
  }

  // CMS의 이미지 선택 결과를 같은 사이트의 assets 경로로 제한합니다.
  // 상대 경로, /assets/..., /portal-intro/assets/... 및 같은 출처의 절대 URL을 처리합니다.
  function imageUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const base = new URL("./", document.baseURI);
      let path = value.trim();
      if (/^https?:\/\//i.test(path)) {
        const url = new URL(path);
        if (url.origin !== base.origin || url.username || url.password || url.search || url.hash) return "";
        path = url.pathname;
      }
      path = decodeURIComponent(path);
      if (path.startsWith("/portal-intro/assets/")) path = path.slice("/portal-intro/".length);
      else if (base.pathname !== "/" && path.startsWith(base.pathname + "assets/")) path = path.slice(base.pathname.length);
      else if (path.startsWith("/assets/")) path = path.slice(1);
      else if (path.startsWith("./assets/")) path = path.slice(2);
      if (!path.startsWith("assets/") || /[\\?#%\u0000-\u001f\u007f]/.test(path)) return "";
      const parts = path.split("/");
      if (parts.some(part => !part || part === "." || part === "..")) return "";
      if (!/\.(png|jpe?g|webp|avif)$/i.test(parts.at(-1))) return "";
      const url = new URL(parts.map(encodeURIComponent).join("/"), base);
      return url.origin === base.origin ? url.href : "";
    } catch {
      return "";
    }
  }

  // 공개용 링크 형식만 검사합니다.
  // 연결 대상의 접속·안전성 검사는 아닙니다.
  function webUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";

    try {
      const url = new URL(value.trim());
      const host = url.hostname.toLowerCase();

      if (
        !["https:", "http:"].includes(url.protocol) ||
        url.username ||
        url.password ||
        ["localhost", "127.0.0.1", "[::1]", "0.0.0.0"].includes(host) ||
        host.endsWith(".localhost")
      ) {
        return "";
      }

      return url.href;
    } catch {
      return "";
    }
  }

  function element(tag, text, className = "") {
    const item = document.createElement(tag);

    if (text !== undefined) item.textContent = text;
    if (className) item.className = className;

    return item;
  }

  function makeLink(url, label, title) {
    const link = element("a", `${label} ↗`, "portfolio-link");

    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    link.setAttribute(
      "aria-label",
      `${title} ${label} (새 탭)`
    );

    return link;
  }

  const projects = source.filter(item =>
    item &&
    typeof item.title === "string" &&
    item.title.trim() &&
    typeof item.description === "string"
  );

  if (projects.length !== source.length) {
    notice.hidden = false;
    notice.textContent =
      "제목 또는 설명 형식이 잘못된 작품은 표시하지 않았습니다.";
  }

  function card(project, index) {
    const article = element("article", undefined, "portfolio-card");

    const preview = element(
      "div",
      "WEB PROJECT",
      "portfolio-preview"
    );

    preview.append(
      element("span", String(index + 1).padStart(2, "0"))
    );

    preview.setAttribute("aria-hidden", "true");

    const previewUrl = imageUrl(project.image);
    if (previewUrl) {
      const image = document.createElement("img");

      image.alt = `${project.title} 화면 미리보기`;
      image.loading = "lazy";
      image.decoding = "async";

      image.addEventListener("error", () => {
        preview.classList.remove("has-image");
        preview.textContent = "미리보기 이미지 준비 중";
      }, { once: true });

      image.src = previewUrl;

      preview.removeAttribute("aria-hidden");
      preview.classList.add("has-image");
      preview.replaceChildren(image);
    }

    const body = element("div", undefined, "portfolio-body");

    body.append(
      element("h2", project.title),
      element("p", project.description, "portfolio-description")
    );

    const tags = element("ul", undefined, "portfolio-tags");

    (Array.isArray(project.tags) ? project.tags : [])
      .filter(tag => typeof tag === "string" && tag.trim())
      .forEach(tag => tags.append(element("li", tag)));

    body.append(tags);

    const links = element("div", undefined, "portfolio-links");
    const site = webUrl(project.siteUrl);
    const code = webUrl(project.codeUrl);

    if (site) {
      links.append(
        makeLink(site, "사이트 열기", project.title)
      );
    } else {
      body.append(
        element(
          "p",
          project.siteUrl
            ? "사이트 주소 형식을 확인해 주세요."
            : "사이트 공개 주소 준비 중",
          "portfolio-unavailable"
        )
      );
    }

    if (code) {
      links.append(
        makeLink(code, "코드 보기", project.title)
      );
    } else if (project.codeUrl) {
      body.append(
        element(
          "p",
          "코드 주소 형식을 확인해 주세요.",
          "portfolio-unavailable"
        )
      );
    }

    body.append(links);
    article.append(preview, body);

    return article;
  }

  const normalize = text =>
    text.normalize("NFC").toLocaleLowerCase("ko-KR");

  function render() {
    const query = normalize(search.value.trim());

    const selected = projects.filter(item =>
      normalize([
        item.title,
        item.description,
        ...(
          Array.isArray(item.tags)
            ? item.tags.filter(tag => typeof tag === "string")
            : []
        )
      ].join(" ")).includes(query)
    );

    grid.replaceChildren(
      ...selected.map(item =>
        card(item, projects.indexOf(item))
      )
    );

    count.textContent =
      `전체 ${projects.length}개 · 표시 ${selected.length}개`;

    if (!selected.length) {
      grid.append(
        element(
          "p",
          projects.length
            ? "검색 결과가 없습니다. 검색어를 바꿔 보세요."
            : "아직 등록된 작품이 없습니다."
        )
      );
    }
  }

  search.disabled = false;
  search.addEventListener("input", render);
  render();
})();