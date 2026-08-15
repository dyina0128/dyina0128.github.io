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

let total = 0;
let missing = 0;
let omittedFromSitemap = 0;
const sitemap = readFileSync(resolve(process.cwd(), "sitemap.xml"), "utf8");

for (const [region, files] of Object.entries(groups)) {
  const absent = files.filter((file) => !existsSync(resolve(process.cwd(), file)));
  const omitted = files.filter(
    (file) => !sitemap.includes(`<loc>https://dyina0128.github.io/${file}</loc>`),
  );
  total += files.length;
  missing += absent.length;
  omittedFromSitemap += omitted.length;
  console.log(`${region}: ${files.length - absent.length}/${files.length}`);
  if (absent.length) console.log(`  누락: ${absent.join(", ")}`);
  if (omitted.length) console.log(`  사이트맵 누락: ${omitted.join(", ")}`);
}

console.log(`합계: ${total - missing}/${total}`);
if (total !== 227) {
  console.error(`검사 기준 오류: 시군구 합계가 227이 아니라 ${total}입니다.`);
  process.exit(1);
}
if (missing) process.exit(1);
if (omittedFromSitemap) process.exit(1);
console.log("누락 0곳");
