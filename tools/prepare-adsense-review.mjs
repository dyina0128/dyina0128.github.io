import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const entries = await readdir(root, { withFileTypes: true });
const htmlFiles = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
  .map((entry) => entry.name);

const htmlByFile = new Map();
for (const file of htmlFiles) {
  htmlByFile.set(file, await readFile(path.join(root, file), "utf8"));
}

const noindexPages = new Set(
  htmlFiles.filter((file) =>
    /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(
      htmlByFile.get(file),
    ),
  ),
);

const localNoindexPages = new Set(
  [...noindexPages].filter((file) => file.endsWith("-benefits.html")),
);

const utilityPages = new Set([
  "about.html",
  "contact.html",
  "index.html",
  "privacy.html",
]);

const aliases = new Map([
  ["job-support.html", "job-support-guide.html"],
  ["jeonnam-gwangju-benefits.html", "jeonnam-benefits.html"],
  ["youth-rent-guide.html", "youth-rent.html"],
]);

const editorialNote = `
<aside class="editorial-note" data-editorial-note aria-label="콘텐츠 작성 및 검수 정보">
    <p><strong>작성·검수:</strong> 대한민국 혜택 생활 가이드 편집자 · <a href="about.html">작성·검증 원칙</a></p>
    <p>정부·공공기관의 공개 자료를 기준으로 정리한 안내입니다. 실제 신청 전에는 연결된 공식 공고에서 최신 조건과 접수 여부를 다시 확인하세요.</p>
</aside>`;

const regionNote = `
<section class="approval-region-note" id="regions">
    <h2>시·군·구별 추가 지원 확인</h2>
    <p>기초자치단체 사업은 모집기간과 자격조건이 자주 달라, 정확성이 확인되지 않은 일반 목록은 현재 제공하지 않습니다.</p>
    <p>주소지 시·군·구 공식 홈페이지의 고시·공고를 확인해 주세요. 공식 원문과 현재 접수 여부가 확인된 사업은 이 광역 가이드에 반영합니다.</p>
</section>`;

function normalizeInternalLinks(html) {
  let updated = html.replace(
    /href=(["'])(?:\.\/)?index\.html(?:#[^"']*)?\1/gi,
    'href="/"',
  );

  for (const [from, to] of aliases) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    updated = updated.replace(
      new RegExp(`href=(["'])(?:\\./)?${escaped}([?#][^"']*)?\\1`, "gi"),
      (_match, _quote, suffix = "") => `href="${to}${suffix}"`,
    );
  }
  updated = updated.replace(
    /href=(["'])(?:\.\/)?youth-jeonse-loan\.html([?#][^"']*)?\1/gi,
    'href="https://nhuf.molit.go.kr/"',
  );
  return updated;
}

function replaceLocalDirectorySection(html) {
  return html.replace(/<section\b[^>]*>[\s\S]*?<\/section>/gi, (section) => {
    const localLinks = [...section.matchAll(/href=["'](?:\.\/)?([^"'#?]+\.html)/gi)]
      .map((match) => match[1])
      .filter((target) => localNoindexPages.has(target));
    return new Set(localLinks).size >= 2 ? regionNote : section;
  });
}

function addEditorialSignals(html) {
  let updated = html;
  if (!/<meta\s+name=["']author["']/i.test(updated)) {
    updated = updated.replace(
      /<\/head>/i,
      '<meta name="author" content="대한민국 혜택 생활 가이드 편집자">\n</head>',
    );
  }
  if (!/data-editorial-note/i.test(updated)) {
    updated = updated.replace(/<main\b([^>]*)>/i, `<main$1>${editorialNote}`);
  }
  return updated;
}

let changed = 0;
let directorySectionsRemoved = 0;
for (const file of htmlFiles) {
  const original = htmlByFile.get(file);
  let updated = noindexPages.has(file) ? original : normalizeInternalLinks(original);

  if (!noindexPages.has(file) && !utilityPages.has(file)) {
    const withoutDirectories = replaceLocalDirectorySection(updated);
    if (withoutDirectories !== updated) directorySectionsRemoved += 1;
    updated = addEditorialSignals(withoutDirectories);
  }

  if (updated !== original) {
    await writeFile(path.join(root, file), updated, "utf8");
    changed += 1;
  }
}

console.log(
  `Prepared ${changed} pages; replaced ${directorySectionsRemoved} local directory sections.`,
);
