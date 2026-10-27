import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const policyPath = resolve(root, "tools/indexing-policy.json");
const policy = JSON.parse(readFileSync(policyPath, "utf8"));
const errors = [];
const exceptions = policy.indexableExceptions ?? [];
const files = new Set(exceptions.map(({ file }) => file));
const sitemap = readFileSync(resolve(root, "sitemap.xml"), "utf8");

if (!Array.isArray(exceptions)) {
  console.error("tools/indexing-policy.json: indexableExceptions 배열이 없습니다.");
  process.exit(1);
}
if (files.size !== exceptions.length) {
  errors.push("tools/indexing-policy.json: 중복 예외 페이지가 있습니다.");
}

function getMetaTags(html, expectedName) {
  return [...html.matchAll(/<meta\\b[^>]*>/gi)]
    .map(([tag]) => ({
      name: tag.match(/\\bname\\s*=\\s*(["'])(.*?)\\1/i)?.[2]?.toLowerCase(),
      content: tag.match(/\\bcontent\\s*=\\s*(["'])(.*?)\\1/i)?.[2] ?? "",
    }))
    .filter((tag) => tag.name === expectedName);
}

function getAttribute(tag, name) {
  return tag.match(new RegExp(`\\\\b${name}\\\\s*=\\\\s*(["'])(.*?)\\\\1`, "i"))?.[2] ?? null;
}

for (const page of exceptions) {
  const { file, canonical, linkedFrom } = page;
  if (!file || !canonical || !Array.isArray(linkedFrom) || linkedFrom.length === 0) {
    errors.push(`정책 항목에 file, canonical, linkedFrom이 필요합니다: ${JSON.stringify(page)}`);
    continue;
  }
  const pagePath = resolve(root, file);
  if (!existsSync(pagePath)) {
    errors.push(`색인 예외 파일이 없습니다: ${file}`);
    continue;
  }
  const html = readFileSync(pagePath, "utf8");
  const canonicalTags = [...html.matchAll(/<link\\b[^>]*>/gi)]
    .map(([tag]) => tag)
    .filter((tag) => (getAttribute(tag, "rel") ?? "").toLowerCase().split(/\\s+/).includes("canonical"));
  if (canonicalTags.length !== 1 || getAttribute(canonicalTags[0] ?? "", "href") !== canonical) {
    errors.push(`${file}: canonical이 정책의 정규 URL과 일치하지 않습니다.`);
  }

  for (const name of ["robots", "googlebot"]) {
    const tags = getMetaTags(html, name);
    if (tags.length !== 1 || !/(?:^|[,\\s])index(?:[,\\s]|$)/i.test(tags[0]?.content ?? "")
      || !/(?:^|[,\\s])follow(?:[,\\s]|$)/i.test(tags[0]?.content ?? "")
      || /(?:^|[,\\s])noindex(?:[,\\s]|$)/i.test(tags[0]?.content ?? "")) {
      errors.push(`${file}: meta name="${name}"은 index, follow여야 합니다.`);
    }
  }

  const escapedCanonical = canonical.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&");
  if (!new RegExp(`<loc>\\\\s*${escapedCanonical}\\\\s*</loc>`).test(sitemap)) {
    errors.push(`sitemap.xml: 색인 예외 URL 누락 ${file}`);
  }

  for (const parent of new Set(linkedFrom)) {
    const parentPath = resolve(root, parent);
    if (!existsSync(parentPath)) {
      errors.push(`${file}: 상위 링크 페이지가 없습니다: ${parent}`);
      continue;
    }
    const parentHtml = readFileSync(parentPath, "utf8");
    const links = [...parentHtml.matchAll(/<a\\b[^>]*>/gi)]
      .map(([tag]) => getAttribute(tag, "href"))
      .filter(Boolean)
      .map((href) => href.split(/[?#]/, 1)[0].replace(/^\\.\\//, ""));
    if (!links.includes(file)) {
      errors.push(`${file}: 필수 상위 링크가 없습니다 (${parent})`);
    }
  }
}

if (errors.length) {
  console.error(`색인 예외 검사 오류 ${errors.length}건\\n${errors.join("\\n")}`);
  process.exit(1);
}
console.log(`색인 예외 ${exceptions.length}개: canonical, robots, googlebot, 사이트맵, 상위 링크 확인 완료`);
