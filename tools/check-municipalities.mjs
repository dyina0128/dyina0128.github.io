import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const groups = {
  "서울특별시": [
    "gangnam", "gangdong", "gangbuk", "gangseo", "gwanak", "gwangjin", "guro",
    "geumcheon", "nowon", "dobong", "dongdaemun", "dongjak", "mapo", "seodaemun",
    "seocho", "seongdong", "seongbuk", "songpa", "yangcheon", "yeongdeungpo",
    "yongsan", "eunpyeong", "jongno", "junggu", "jungnang",
  ].map((slug) => `${slug}-benefits.html`),
  "부산광역시": [
    "buk-gu", "busanjin-gu", "dong-gu", "dongnae-gu", "gangseo-gu", "geumjeong-gu",
    "gijang-gun", "haeundae-gu", "jung-gu", "nam-gu", "saha-gu", "sasang-gu",
    "seo-gu", "suyeong-gu", "yeongdo-gu", "yeonje-gu",
  ].map((slug) => `busan-${slug}-benefits.html`),
  "대구광역시": [
    "buk-gu", "dalseo-gu", "dalseong-gun", "dong-gu", "gunwi-gun", "jung-gu",
    "nam-gu", "seo-gu", "suseong-gu",
  ].map((slug) => `daegu-${slug}-benefits.html`),
  "인천광역시": [
    "incheon-jemulpo-benefits.html", "incheon-yeongjong-benefits.html",
    "michuhol-benefits.html", "yeonsu-benefits.html", "incheon-namdonggu-benefits.html",
    "bupyeong-benefits.html", "gyeyang-benefits.html", "incheon-seohae-benefits.html",
    "incheon-geomdan-benefits.html", "ganghwa-benefits.html", "ongjin-benefits.html",
  ],
  "전남광주통합특별시 광주권": [
    "bukgu", "donggu", "gwangsangu", "namgu", "seogu",
  ].map((slug) => `gwangju-${slug}-benefits.html`),
  "대전광역시": [
    "daedeokgu", "donggu", "junggu", "seogu", "yuseonggu",
  ].map((slug) => `daejeon-${slug}-benefits.html`),
  "울산광역시": [
    "bukgu", "donggu", "junggu", "namgu", "uljugun",
  ].map((slug) => `ulsan-${slug}-benefits.html`),
  "경기도": [
    "ansan", "anseong", "anyang", "bucheon", "dongducheon", "gapyeong", "gimpo",
    "goyang", "gunpo", "guri", "gwacheon", "gwangmyeong", "gyeonggi-gwangju",
    "hanam", "hwaseong", "icheon", "namyangju", "osan", "paju", "pocheon",
    "pyeongtaek", "seongnam", "siheung", "suwon", "uijeongbu", "uiwang", "yangju",
    "yangpyeong", "yeoju", "yeoncheon", "yongin",
  ].map((slug) => `${slug}-benefits.html`),
  "강원특별자치도": [
    "cheorwon", "chuncheon", "donghae", "gangneung", "goseong", "hoengseong",
    "hongcheon", "hwacheon", "inje", "jeongseon", "pyeongchang", "samcheok",
    "sokcho", "taebaek", "wonju", "yanggu", "yangyang", "yeongwol",
  ].map((slug) => `gangwon-${slug}-benefits.html`),
  "충청북도": [
    "boeun", "cheongju", "chungju", "danyang", "eumseong", "goesan", "jecheon",
    "jeungpyeong", "jincheon", "okcheon", "yeongdong",
  ].map((slug) => `chungbuk-${slug}-benefits.html`),
  "충청남도": [
    "asan", "boryeong", "buyeo", "cheonan", "cheongyang", "dangjin", "geumsan",
    "gongju", "gyeryong", "hongseong", "nonsan", "seocheon", "seosan", "taean", "yesan",
  ].map((slug) => `chungnam-${slug}-benefits.html`),
  "전북특별자치도": [
    "buan", "gimje", "gochang", "gunsan", "iksan", "imsil", "jangsu", "jeongeup",
    "jeonju", "jinan", "muju", "namwon", "sunchang", "wanju",
  ].map((slug) => `jeonbuk-${slug}-benefits.html`),
  "전남광주통합특별시 전남권": [
    "boseong", "damyang", "gangjin", "goheung", "gokseong", "gurye", "gwangyang",
    "haenam", "hampyeong", "hwasun", "jangheung", "jangseong", "jindo", "mokpo",
    "muan", "naju", "sinan", "suncheon", "wando", "yeongam", "yeonggwang", "yeosu",
  ].map((slug) => `jeonnam-${slug}-benefits.html`),
  "경상북도": [
    "andong", "bonghwa", "cheongdo", "cheongsong", "chilgok", "gimcheon", "goryeong",
    "gumi", "gyeongju", "gyeongsan", "mungyeong", "pohang", "sangju", "seongju",
    "uiseong", "uljin", "ulleung", "yecheon", "yeongcheon", "yeongdeok", "yeongju", "yeongyang",
  ].map((slug) => `gyeongbuk-${slug}-benefits.html`),
  "경상남도": [
    "changnyeong", "changwon", "geochang", "geoje", "gimhae", "goseong", "hadong",
    "haman", "hamyang", "hapcheon", "jinju", "miryang", "namhae", "sacheon",
    "sancheong", "tongyeong", "uiryeong", "yangsan",
  ].map((slug) => `gyeongnam-${slug}-benefits.html`),
};

// Keep a compact baseline for group sizes and uniqueness so dropped groups,
// count drift, or accidental duplicate entries cannot pass on the total alone.
const expectedGroupCounts = new Map([
  ["서울특별시", 25], ["부산광역시", 16], ["대구광역시", 9], ["인천광역시", 11],
  ["전남광주통합특별시 광주권", 5], ["대전광역시", 5], ["울산광역시", 5],
  ["경기도", 31], ["강원특별자치도", 18], ["충청북도", 11], ["충청남도", 15],
  ["전북특별자치도", 14], ["전남광주통합특별시 전남권", 22],
  ["경상북도", 22], ["경상남도", 18],
]);

let total = 0;
let missing = 0;
let policyMismatches = 0;
const inventoryErrors = [];
const inventoryFiles = Object.values(groups).flat();
if (Object.keys(groups).length !== expectedGroupCounts.size) {
  inventoryErrors.push(`광역 그룹 수가 예상과 다릅니다 (${Object.keys(groups).length}/${expectedGroupCounts.size})`);
}
for (const [region, expected] of expectedGroupCounts) {
  const actual = groups[region]?.length ?? 0;
  if (actual !== expected) inventoryErrors.push(`${region}: 기준 목록 수 오류 (${actual}/${expected})`);
}
const duplicateInventoryFiles = [...new Set(inventoryFiles.filter((file, index) => inventoryFiles.indexOf(file) !== index))];
if (duplicateInventoryFiles.length) inventoryErrors.push(`중복 상세 페이지 기준값: ${duplicateInventoryFiles.join(", ")}`);
const sitemap = readFileSync(resolve(process.cwd(), "sitemap.xml"), "utf8");
const sitemapFiles = new Set(
  [...sitemap.matchAll(/<loc>https:\/\/dyina0128\.github\.io\/([^<]+)<\/loc>/g)]
    .map((match) => match[1]),
);

for (const [region, files] of Object.entries(groups)) {
  const absent = files.filter((file) => !existsSync(resolve(process.cwd(), file)));
  const policyErrors = [];
  for (const file of files.filter((item) => !absent.includes(item))) {
    const html = readFileSync(resolve(process.cwd(), file), "utf8");
    const noindex = /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
    if (!noindex) policyErrors.push(`${file}: noindex 누락`);
    if (sitemapFiles.has(file)) policyErrors.push(`${file}: noindex 페이지가 사이트맵에 포함됨`);
  }
  total += files.length;
  missing += absent.length;
  policyMismatches += policyErrors.length;
  console.log(`${region}: ${files.length - absent.length}/${files.length} · 색인정책 오류 ${policyErrors.length}건`);
  if (absent.length) console.log(`  누락: ${absent.join(", ")}`);
  if (policyErrors.length) console.log(`  ${policyErrors.join("\n  ")}`);
}

console.log(`합계: ${total - missing}/${total}`);
if (inventoryErrors.length) {
  console.error(`기준 목록 오류 ${inventoryErrors.length}건\n${inventoryErrors.join("\n")}`);
  process.exitCode = 1;
}
if (total !== 227) {
  console.error(`검사 기준 오류: 시군구 합계가 227이 아니라 ${total}입니다.`);
  process.exit(1);
}
if (missing) process.exit(1);
if (policyMismatches) process.exit(1);
console.log("누락 0곳 · 227개 상세 페이지 noindex/사이트맵 제외 정책 일치");
