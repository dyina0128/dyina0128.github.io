import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, resolve } from "node:path";

const root = process.cwd();
const htmlFiles = readdirSync(root).filter((name) => name.endsWith(".html"));
const verificationFiles = new Set(
  htmlFiles.filter((name) => /^(?:google|naver).+\.html$/i.test(name)),
);
const errors = [];
const warnings = [];
const baseUrl = "https://dyina0128.github.io/";
const utilityPages = new Set(["about.html", "contact.html", "index.html", "privacy.html"]);

const ignoredSchemes = /^(?:https?:|mailto:|tel:|javascript:|data:|#|\/\/)/i;

function localTarget(raw) {
  const clean = raw.trim().split("#")[0].split("?")[0];
  if (!clean || ignoredSchemes.test(clean)) return null;
  const decoded = decodeURIComponent(clean);
  const candidate = decoded.endsWith("/") ? `${decoded}index.html` : decoded;
  return resolve(root, candidate.replace(/^\//, ""));
}

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|amp|lt|gt|quot|#39);/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

for (const file of htmlFiles) {
  const html = readFileSync(resolve(root, file), "utf8");
  if (verificationFiles.has(file)) continue;
  const titleCount = (html.match(/<title\b/gi) || []).length;
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const noindex = /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  const canonicalMatches = [...html.matchAll(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/gi)];

  if (titleCount !== 1) errors.push(`${file}: title ${titleCount}개`);
  if (h1Count !== 1) warnings.push(`${file}: h1 ${h1Count}개`);
  if (!noindex && canonicalMatches.length !== 1) {
    errors.push(`${file}: canonical ${canonicalMatches.length}개`);
  }
  if (!noindex && canonicalMatches.length === 1) {
    const expected = file === "index.html" ? baseUrl : `${baseUrl}${file}`;
    if (canonicalMatches[0][1] !== expected) {
      errors.push(`${file}: canonical 불일치 ${canonicalMatches[0][1]}`);
    }
  }

  if (!noindex && !utilityPages.has(file)) {
    if (!/<meta\s+name=["']author["']/i.test(html)) {
      errors.push(`${file}: 작성자 메타 누락`);
    }
    if (!/data-editorial-note/i.test(html)) {
      errors.push(`${file}: 작성·검수 안내 누락`);
    }
    if (visibleText(html).length < 1400) {
      errors.push(`${file}: 색인 문서 본문 부족 (${visibleText(html).length}자)`);
    }
    if (!/(?:최종\s*(?:내용\s*)?(?:확인|업데이트|점검)|최종\s*업데이트)/i.test(html)) {
      errors.push(`${file}: 최종 확인일 누락`);
    }
    const externalLinks = [...html.matchAll(/<a\b[^>]*href=["'](https?:\/\/[^"']+)["']/gi)]
      .map((match) => match[1])
      .filter((url) => !url.startsWith(baseUrl));
    if (!externalLinks.length) errors.push(`${file}: 공식 외부 확인처 누락`);
  }

  for (const match of html.matchAll(/<(?:a|link|script|img)\b[^>]*(?:href|src)=["']([^"']+)["']/gi)) {
    const target = localTarget(match[1]);
    if (!target) continue;
    if (!target.startsWith(root)) {
      errors.push(`${file}: 작업 폴더 밖 링크 ${match[1]}`);
      continue;
    }
    if (!existsSync(target)) errors.push(`${file}: 없는 파일 링크 ${match[1]}`);
  }

  for (const match of html.matchAll(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${file}: JSON-LD 오류 (${error.message})`);
    }
  }
}

const sitemap = readFileSync(resolve(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>https:\/\/dyina0128\.github\.io\/([^<]*)<\/loc>/g)]
  .map((match) => match[1] || "index.html");
const sitemapSet = new Set(sitemapUrls);

if (sitemapUrls.length !== sitemapSet.size) errors.push("sitemap.xml: 중복 URL 존재");
for (const item of sitemapSet) {
  if (!existsSync(resolve(root, item))) errors.push(`sitemap.xml: 없는 페이지 ${item}`);
}

const indexablePages = new Set(
  htmlFiles
    .filter((file) => !verificationFiles.has(file))
    .filter((file) => {
      const html = readFileSync(resolve(root, file), "utf8");
      return !/<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
    }),
);

for (const file of indexablePages) {
  const html = readFileSync(resolve(root, file), "utf8");
  if (/href=["'](?:\.\/)?(?:index\.html|job-support\.html|youth-rent-guide\.html)/i.test(html)) {
    errors.push(`${file}: 이전 또는 비정규 내부 URL 링크 존재`);
  }
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
    const raw = match[1].split("#")[0].split("?")[0].replace(/^\.\//, "");
    if (!raw.endsWith("-benefits.html") || !existsSync(resolve(root, raw))) continue;
    const targetHtml = readFileSync(resolve(root, raw), "utf8");
    if (/<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(targetHtml)) {
      errors.push(`${file}: 검색 제외 지역 상세 링크 ${raw}`);
    }
  }
}
for (const file of indexablePages) {
  if (!sitemapSet.has(file)) errors.push(`sitemap.xml: 검색 허용 페이지 누락 ${file}`);
}
for (const file of sitemapSet) {
  if (!indexablePages.has(file)) errors.push(`sitemap.xml: 검색 제외 페이지 포함 ${file}`);
}

const adsTxt = readFileSync(resolve(root, "ads.txt"), "utf8").trim();
if (!/^google\.com, pub-\d{16}, DIRECT, f08c47fec0942fa0$/m.test(adsTxt)) {
  errors.push("ads.txt: Google 게시자 항목 형식 오류");
}

const retiredExternalLinks = [
  "https://www.chungbuk.go.kr/www/",
  "https://www.chungbuk.go.kr/young/",
  "https://www.work24.go.kr/hr/a/a/3100/selectTracseSearch.do",
];
for (const file of indexablePages) {
  const html = readFileSync(resolve(root, file), "utf8");
  for (const retired of retiredExternalLinks) {
    if (html.includes(`href="${retired}"`) || html.includes(`href='${retired}'`)) {
      errors.push(`${file}: 폐기된 외부 링크 ${retired}`);
    }
  }
}

console.log(`HTML ${htmlFiles.length}개, 사이트맵 ${sitemapSet.size}개 점검`);
if (warnings.length) console.log(`주의 ${warnings.length}건\n${warnings.slice(0, 25).join("\n")}`);
if (errors.length) {
  console.error(`오류 ${errors.length}건\n${errors.join("\n")}`);
  process.exit(1);
}
console.log("오류 0건");
