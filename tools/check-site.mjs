import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, resolve } from "node:path";

const root = process.cwd();
const htmlFiles = readdirSync(root).filter((name) => name.endsWith(".html"));
const verificationFiles = new Set(
  htmlFiles.filter((name) => /^(?:google|naver).+\.html$/i.test(name)),
);
const errors = [];
const warnings = [];

const ignoredSchemes = /^(?:https?:|mailto:|tel:|javascript:|data:|#|\/\/)/i;

function localTarget(raw) {
  const clean = raw.trim().split("#")[0].split("?")[0];
  if (!clean || ignoredSchemes.test(clean)) return null;
  const decoded = decodeURIComponent(clean);
  const candidate = decoded.endsWith("/") ? `${decoded}index.html` : decoded;
  return resolve(root, candidate.replace(/^\//, ""));
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

console.log(`HTML ${htmlFiles.length}개, 사이트맵 ${sitemapSet.size}개 점검`);
if (warnings.length) console.log(`주의 ${warnings.length}건\n${warnings.slice(0, 25).join("\n")}`);
if (errors.length) {
  console.error(`오류 ${errors.length}건\n${errors.join("\n")}`);
  process.exit(1);
}
console.log("오류 0건");
