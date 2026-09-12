import { existsSync, readFileSync, readdirSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = process.cwd();
const htmlFiles = readdirSync(root).filter((name) => name.endsWith(".html"));
const htmlByFile = new Map(
  htmlFiles.map((file) => [file, readFileSync(resolve(root, file), "utf8")]),
);
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

function fragmentReference(raw, sourceFile) {
  if (/^(?:https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(raw)) return null;
  const hashIndex = raw.indexOf("#");
  if (hashIndex < 0) return null;

  let fragment;
  try {
    fragment = decodeURIComponent(raw.slice(hashIndex + 1));
  } catch {
    return { error: `잘못 인코딩된 fragment ${raw}` };
  }
  if (!fragment) return null;

  const pathPart = raw.slice(0, hashIndex).split("?")[0];
  const targetPath = pathPart ? localTarget(pathPart) : resolve(root, sourceFile);
  if (!targetPath) return null;
  const targetFile = relative(root, targetPath).replaceAll("\\", "/");
  if (!htmlByFile.has(targetFile)) return null;
  return { fragment, targetFile };
}

function hasId(html, id) {
  const escaped = id.replace(/[.*+?^{}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\bid\\s*=\\s*["']${escaped}["']`, "i").test(html);
}

for (const file of htmlFiles) {
  const html = htmlByFile.get(file);
  if (verificationFiles.has(file)) continue;
  const titleCount = (html.match(/<title\b/gi) || []).length;
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const noindex = /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  const canonicalMatches = [...html.matchAll(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/gi)];
  const sectionOpenCount = (html.match(/<section\b/gi) || []).length;
  const sectionCloseCount = (html.match(/<\/section>/gi) || []).length;

  if (titleCount !== 1) errors.push(`${file}: title ${titleCount}개`);
  if (h1Count !== 1) warnings.push(`${file}: h1 ${h1Count}개`);
  if (sectionOpenCount !== sectionCloseCount) {
    errors.push(
      `${file}: section 태그 불균형 (열기 ${sectionOpenCount}, 닫기 ${sectionCloseCount})`,
    );
  }
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

  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
    const reference = fragmentReference(match[1], file);
    if (!reference) continue;
    if (reference.error) {
      errors.push(`${file}: ${reference.error}`);
      continue;
    }
    if (!hasId(htmlByFile.get(reference.targetFile), reference.fragment)) {
      errors.push(
        `${file}: 없는 fragment 링크 ${match[1]} (대상 ${reference.targetFile})`,
      );
    }
  }

  const refreshTag = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((tag) => /http-equiv=["']refresh["']/i.test(tag));
  if (refreshTag) {
    const content = refreshTag.match(/content=["']([^"']+)["']/i)?.[1] || "";
    const redirect = content.match(/url\s*=\s*([^;\s]+)/i)?.[1];
    const target = redirect ? localTarget(redirect) : null;
    if (target && canonicalMatches.length === 1) {
      const targetFile = relative(root, target).replaceAll("\\", "/");
      const expected = targetFile === "index.html" ? baseUrl : `${baseUrl}${targetFile}`;
      if (canonicalMatches[0][1] !== expected) {
        errors.push(
          `${file}: meta refresh 대상과 canonical 불일치 (${redirect})`,
        );
      }
    }
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
      const html = htmlByFile.get(file);
      return !/<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
    }),
);

for (const file of indexablePages) {
  const html = htmlByFile.get(file);
  if (/href=["'](?:\.\/)?(?:index\.html|job-support\.html|youth-rent-guide\.html)/i.test(html)) {
    errors.push(`${file}: 이전 또는 비정규 내부 URL 링크 존재`);
  }
}
for (const file of indexablePages) {
  if (!sitemapSet.has(file)) errors.push(`sitemap.xml: 검색 허용 페이지 누락 ${file}`);
}
for (const file of sitemapSet) {
  if (!indexablePages.has(file)) errors.push(`sitemap.xml: 검색 제외 페이지 포함 ${file}`);
}

const requiredDirectoryLinks = new Map([
  ["seoul-benefits.html", 25],
  ["incheon-benefits.html", 11],
  ["gyeonggi-benefits.html", 31],
  ["busan-benefits.html", 16],
  ["daegu-benefits.html", 9],
  ["gwangju-benefits.html", 5],
  ["daejeon-benefits.html", 5],
  ["ulsan-benefits.html", 5],
  ["gangwon-benefits.html", 18],
  ["chungbuk-benefits.html", 11],
  ["chungnam-benefits.html", 15],
  ["jeonbuk-benefits.html", 14],
  ["jeonnam-benefits.html", 22],
  ["gyeongbuk-benefits.html", 22],
  ["gyeongnam-benefits.html", 18],
  ["jeju-benefits.html", 2],
  ["jeonnam-gwangju-benefits.html", 27],
]);
for (const [file, minimum] of requiredDirectoryLinks) {
  const links = new Set(
    [...htmlByFile.get(file).matchAll(/<a\b[^>]*href=["']([^"']+-benefits\.html)(?:[?#][^"']*)?["']/gi)]
      .map((match) => match[1].replace(/^\.\//, ""))
      .filter((target) => target !== file && htmlByFile.has(target)),
  );
  if (links.size < minimum) {
    errors.push(`${file}: 지역 상세 링크 부족 (${links.size}/최소 ${minimum})`);
  }
}

const requiredHomepageLinks = [
  "download-center.html",
  "benefit-search.html",
  "benefit-finder.html",
  "calendar.html",
  "top-benefits.html",
  "region-ranking.html",
  "benefit-compare.html",
  "bookmarks.html",
  "gyeonggi-benefits.html",
  "daegu-benefits.html",
  "jeonnam-gwangju-benefits.html",
];
const homepageLinks = new Set(
  [...htmlByFile.get("index.html").matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)]
    .map((match) => match[1].split("#")[0].split("?")[0].replace(/^\.\//, "")),
);
for (const required of requiredHomepageLinks) {
  if (!homepageLinks.has(required)) {
    errors.push(`index.html: 필수 탐색 링크 누락 ${required}`);
  }
}

const scriptSource = readFileSync(resolve(root, "script.js"), "utf8");
const benefitDataBody = scriptSource.match(
  /const\s+benefitData\s*=\s*{([\s\S]*?)\n};/,
)?.[1];
const scriptUrls = [];
const urlsByRegion = new Map();
if (!benefitDataBody) {
  errors.push("script.js: benefitData 객체를 찾을 수 없음");
} else {
  for (const match of benefitDataBody.matchAll(
    /^ {2}([^:\n]+):\s*\[([\s\S]*?)^ {2}\],?/gm,
  )) {
    const region = match[1].trim();
    const urls = [...match[2].matchAll(/\burl:\s*["']([^"']+)["']/g)]
      .map((urlMatch) => urlMatch[1]);
    urlsByRegion.set(region, urls);
    scriptUrls.push(...urls);
    const duplicates = [...new Set(urls.filter((url, index) => urls.indexOf(url) !== index))];
    if (duplicates.length) {
      errors.push(`script.js: ${region} 카드 URL 중복 ${duplicates.join(", ")}`);
    }
    for (const url of urls) {
      const target = localTarget(url);
      if (target && !existsSync(target)) {
        errors.push(`script.js: ${region} 카드의 없는 파일 링크 ${url}`);
      }
    }
  }
}

const requiredScriptRoutes = new Map([
  ["경기", "gyeonggi-benefits.html"],
  ["대구", "daegu-benefits.html"],
  ["전남광주", "jeonnam-gwangju-benefits.html"],
]);
for (const [region, required] of requiredScriptRoutes) {
  if (!urlsByRegion.get(region)?.includes(required)) {
    errors.push(`script.js: ${region} 카드의 필수 경로 누락 ${required}`);
  }
}

const graph = new Map(htmlFiles.map((file) => [file, new Set()]));
for (const [file, html] of htmlByFile) {
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
    const target = localTarget(match[1]);
    if (!target) continue;
    const targetFile = relative(root, target).replaceAll("\\", "/");
    if (htmlByFile.has(targetFile)) graph.get(file).add(targetFile);
  }
  for (const match of html.matchAll(/<script\b[^>]*src=["']([^"']+)["']/gi)) {
    const scriptPath = localTarget(match[1]);
    if (!scriptPath || !existsSync(scriptPath)) continue;
    const localScript = readFileSync(scriptPath, "utf8");
    for (const urlMatch of localScript.matchAll(
      /["'`]([^"'`]+\.html(?:[?#][^"'`]*)?)["'`]/g,
    )) {
      const target = localTarget(urlMatch[1]);
      if (!target) continue;
      const targetFile = relative(root, target).replaceAll("\\", "/");
      if (htmlByFile.has(targetFile)) graph.get(file).add(targetFile);
    }
  }
}
for (const url of scriptUrls) {
  const target = localTarget(url);
  if (!target) continue;
  const targetFile = relative(root, target).replaceAll("\\", "/");
  if (htmlByFile.has(targetFile)) graph.get("index.html").add(targetFile);
}
const reachable = new Set(["index.html"]);
const queue = ["index.html"];
while (queue.length) {
  const file = queue.shift();
  for (const target of graph.get(file) || []) {
    if (reachable.has(target)) continue;
    reachable.add(target);
    queue.push(target);
  }
}
const unreachable = [...indexablePages].filter((file) => !reachable.has(file));
if (unreachable.length) {
  warnings.push(
    `홈에서 도달할 수 없는 HTML ${unreachable.length}개: ${unreachable.slice(0, 20).join(", ")}`,
  );
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
  const html = htmlByFile.get(file);
  for (const retired of retiredExternalLinks) {
    if (html.includes(`href="${retired}"`) || html.includes(`href='${retired}'`)) {
      errors.push(`${file}: 폐기된 외부 링크 ${retired}`);
    }
  }
}

console.log(
  `HTML ${htmlFiles.length}개, 사이트맵 ${sitemapSet.size}개, 홈 도달 가능 색인 페이지 ${[...indexablePages].filter((file) => reachable.has(file)).length}개 점검`,
);
if (warnings.length) console.log(`주의 ${warnings.length}건\n${warnings.slice(0, 25).join("\n")}`);
if (errors.length) {
  console.error(`오류 ${errors.length}건\n${errors.join("\n")}`);
  process.exit(1);
}
console.log("오류 0건");
