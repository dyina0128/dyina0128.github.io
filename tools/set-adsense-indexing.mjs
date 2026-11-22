import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

// 승인 심사 동안에는 내용과 공식 출처가 충분한 광역자치단체 대표 페이지만
// 검색에 노출한다. 아래 목록에 있더라도 별도 품질 점검에서 제외된 페이지는
// duplicateOrThinPages에 넣어 noindex 처리한다.
const flagshipRegionPages = new Set([
  "seoul-benefits.html",
  "busan-benefits.html",
  "daegu-benefits.html",
  "incheon-benefits.html",
  "gwangju-benefits.html",
  "daejeon-benefits.html",
  "ulsan-benefits.html",
  "sejong-benefits.html",
  "gyeonggi-benefits.html",
  "gangwon-benefits.html",
  "chungbuk-benefits.html",
  "chungnam-benefits.html",
  "jeonbuk-benefits.html",
  "jeonnam-benefits.html",
  "gyeongbuk-benefits.html",
  "gyeongnam-benefits.html",
  "jeju-benefits.html",
]);

// 내용이 더 충실한 새 가이드와 주제가 겹치거나, 검색용 독립 문서로는 얇은 페이지.
const duplicateOrThinPages = new Set([
  "daegu-junggu.html",
  "job-support.html",
  "terms.html",
  "work-incentive.html",
  "youth-account.html",
  "youth-jeonse-loan.html",
  "youth-policy-list.html",
]);

// tools/indexing-policy.json에 등록된 시군구 페이지는 별도 품질 점검을 통과해
// 검색 허용으로 연 페이지이므로 noindex로 되돌리지 않는다.
const indexingPolicy = JSON.parse(
  await readFile(path.join(root, "tools/indexing-policy.json"), "utf8"),
);
const indexableExceptions = new Set(
  (indexingPolicy.indexableExceptions ?? []).map(({ file }) => file),
);

function setNoindex(html) {
  const metaPattern = /<meta\s+name=["'](?:robots|googlebot)["']\s+content=["'][^"']*["']\s*\/?\s*>/gi;
  let sawRobots = false;
  let sawGooglebot = false;
  const updated = html.replace(metaPattern, (tag) => {
    if (/name=["']robots["']/i.test(tag)) sawRobots = true;
    if (/name=["']googlebot["']/i.test(tag)) sawGooglebot = true;
    const name = /name=["']googlebot["']/i.test(tag) ? "googlebot" : "robots";
    return `<meta name="${name}" content="noindex, follow">`;
  });

  const tags = [];
  if (!sawRobots) tags.push('<meta name="robots" content="noindex, follow">');
  if (!sawGooglebot) tags.push('<meta name="googlebot" content="noindex, follow">');
  if (!tags.length) return updated;
  return updated.replace(/<head>/i, `<head>\n${tags.join("\n")}`);
}

const entries = await readdir(root, { withFileTypes: true });
let changed = 0;
for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
  if (indexableExceptions.has(entry.name)) continue;

  const isLocalRegion = entry.name.endsWith("-benefits.html") && !flagshipRegionPages.has(entry.name);
  if (!isLocalRegion && !duplicateOrThinPages.has(entry.name)) continue;

  const file = path.join(root, entry.name);
  const original = await readFile(file, "utf8");
  const updated = setNoindex(original);
  if (updated !== original) {
    await writeFile(file, updated, "utf8");
    changed += 1;
  }
}

console.log(`Updated ${changed} pages for approval-first indexing.`);
