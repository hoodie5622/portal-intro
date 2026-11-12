// 공개 작품 목록만 표시합니다. 개인 포털 저장소에는 접근하지 않습니다.
(() => {
  "use strict";

  const grid = document.getElementById("portfolioGrid");
  const search = document.getElementById("portfolioSearch");
  const count = document.getElementById("portfolioCount");
  const notice = document.getElementById("portfolioNotice");

  if (!grid || !search || !count || !notice || grid.dataset.ready) return;
  grid.dataset.ready = "true";

  const source = window.PORTFOLIO_PROJECTS;

  if (!Array.isArray(source)) {
    count.textContent = "목록을 불러오지 못했습니다.";
    notice.hidden = false;
    notice.textContent =
      "portfolio-data.js의 파일명, 문법, 연결 순서를 확인하세요.";
    return;
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

    // 이미지: 같은 공개 폴더 아래 assets/파일명만 허용합니다.
    if (
      typeof project.image === "string" &&
      /^assets\/[a-zA-Z0-9_-]+\.(png|jpe?g|webp|avif)$/i.test(project.image)
    ) {
      const image = document.createElement("img");

      image.alt = `${project.title} 화면 미리보기`;
      image.loading = "lazy";
      image.decoding = "async";

      image.addEventListener("error", () => {
        preview.classList.remove("has-image");
        preview.textContent = "미리보기 이미지 준비 중";
      }, { once: true });

      image.src = new URL(project.image, document.baseURI).href;

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