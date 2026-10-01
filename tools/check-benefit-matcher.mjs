import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = (file) => readFileSync(resolve(root, file), "utf8");

function fakeElement(initial = {}) {
  const listeners = new Map();
  const element = Object.assign({
    value: "",
    innerHTML: "",
    textContent: "",
    hidden: false,
    disabled: false,
    required: false,
    addEventListener(type, callback) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(callback);
    },
    dispatch(type) {
      for (const callback of listeners.get(type) || []) callback({ target: element });
    },
    insertAdjacentHTML() {},
    scrollIntoView() {},
    remove() {},
  }, initial);
  return element;
}

const form = fakeElement({
  elements: {
    region: fakeElement(),
    district: fakeElement(),
    status: fakeElement(),
    housing: fakeElement(),
    businessRegion: fakeElement(),
    businessDistrict: fakeElement(),
  },
  querySelector(selector) {
    if (selector === 'input[name="children"]:checked') return { value: "no" };
    if (selector === 'input[name="smallBusiness"][value="unknown"]') return { checked: true };
    return null;
  },
  querySelectorAll() { return []; },
  reset() {},
});

const elements = new Map([
  ["personalBenefitForm", form],
  ["matchResults", fakeElement()],
  ["profileSummary", fakeElement()],
  ["matchCount", fakeElement()],
  ["resetMatcher", fakeElement()],
  ["childFollowup", fakeElement()],
  ["businessFollowup", fakeElement()],
  ["districtHelp", fakeElement()],
  ["businessDistrictHelp", fakeElement()],
  ["formError", fakeElement()],
  ["resultsSection", fakeElement()],
  ["selectedRegionGuideLink", fakeElement()],
]);

class FakeFormData {
  constructor() { this.values = new Map(); }
  get(name) { return this.values.get(name) ?? null; }
}

const context = vm.createContext({
  console,
  document: { getElementById: (id) => elements.get(id) ?? fakeElement() },
  FormData: FakeFormData,
  setTimeout: (callback) => callback(),
  window: {},
});

for (const file of [
  "benefit-rules-v2.js",
  "benefit-business-rules-v2.js",
  "benefit-veteran-rules-v2.js",
  "benefit-rule-engine-v2.js",
  "benefit-v2-integration.js",
]) {
  vm.runInContext(read(file), context, { filename: file });
}

const personalRules = context.window.BENEFIT_RULES_V2;
const businessRules = context.window.BENEFIT_BUSINESS_RULES_V2;
const veteranRules = context.window.BENEFIT_VETERAN_RULES_V2;
const allRules = personalRules.concat(businessRules, veteranRules);
const evaluate = context.window.BenefitRuleEngineV2.evaluate;

assert.ok(Array.isArray(personalRules), "개인 혜택 규칙 배열을 불러오지 못했습니다.");
assert.ok(Array.isArray(businessRules), "사업자 혜택 규칙 배열을 불러오지 못했습니다.");
assert.ok(Array.isArray(veteranRules), "보훈 혜택 규칙 배열을 불러오지 못했습니다.");
assert.equal(typeof evaluate, "function", "매칭 평가 함수를 불러오지 못했습니다.");

const allowedStatuses = new Set([
  "automatic", "open_or_ongoing", "check_current_program", "first_come",
  "ongoing", "closed", "open", "planned_or_ongoing",
]);
const allowedEmployment = new Set([
  "employed", "jobseeker", "business", "student", "farmer", "other",
]);
const allowedRegions = new Set([
  "전국", "서울", "부산", "인천", "경기", "강원", "대구", "광주", "대전",
  "울산", "세종", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
]);
const ids = new Set();

for (const item of allRules) {
  for (const field of ["id", "title", "agency", "category", "benefitKind", "applicationStatus", "officialUrl", "lastVerifiedAt", "summary"]) {
    assert.ok(item[field], `${item.id || "알 수 없는 규칙"}: ${field} 누락`);
  }
  assert.ok(!ids.has(item.id), `중복 규칙 ID: ${item.id}`);
  ids.add(item.id);
  assert.ok(allowedStatuses.has(item.applicationStatus), `${item.id}: 알 수 없는 신청 상태`);
  assert.match(item.lastVerifiedAt, /^2026-\d{2}-\d{2}$/, `${item.id}: 검증일 형식 오류`);
  assert.ok(item.summary.length >= 35, `${item.id}: 요약이 지나치게 짧습니다.`);

  const url = new URL(item.officialUrl);
  assert.equal(url.protocol, "https:", `${item.id}: 공식 링크는 HTTPS여야 합니다.`);
  assert.ok(/\.(?:go|or)\.kr$/.test(url.hostname), `${item.id}: 공공기관 도메인이 아닙니다 (${url.hostname})`);

  if (item.region) assert.ok(allowedRegions.has(item.region), `${item.id}: 알 수 없는 지역 ${item.region}`);
  if (item.district) assert.notEqual(item.region, "전국", `${item.id}: 전국 규칙에 시·군·구가 지정됨`);
  for (const status of item.rules?.employmentAllowed || []) {
    assert.ok(allowedEmployment.has(status), `${item.id}: 알 수 없는 경제활동 상태 ${status}`);
  }
}

const expectedRegionChoices = [
  "서울", "부산", "인천", "경기", "강원", "대구", "광주", "대전", "울산",
  "세종", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
];
assert.deepEqual(Object.keys(context.window.V2_DISTRICTS), expectedRegionChoices, "지역 선택값과 시·군·구 데이터 키가 다릅니다.");
const expectedDistrictCounts = {
  서울: 25, 부산: 16, 인천: 11, 경기: 31, 강원: 18, 대구: 9, 광주: 5,
  대전: 5, 울산: 5, 세종: 1, 충북: 11, 충남: 15, 전북: 14, 전남: 22,
  경북: 22, 경남: 18, 제주: 2,
};
for (const [region, districts] of Object.entries(context.window.V2_DISTRICTS)) {
  assert.equal(new Set(districts).size, districts.length, `${region}: 시·군·구 중복`);
  assert.equal(districts.length, expectedDistrictCounts[region], `${region}: 시·군·구 기준 수 오류`);
}

function selectValues(id) {
  const block = read("benefit-finder-v2.html").match(new RegExp(`<select id="${id}"[\\s\\S]*?<\\/select>`))?.[0];
  assert.ok(block, `${id} 선택창을 찾을 수 없습니다.`);
  return [...block.matchAll(/<option(?:\s+value="([^"]*)")?>([^<]*)<\/option>/g)]
    .map((match) => match[1] ?? match[2].trim())
    .filter(Boolean);
}
assert.deepEqual(selectValues("region"), expectedRegionChoices, "거주지역 선택값 오류");
assert.deepEqual(selectValues("businessRegion"), expectedRegionChoices, "사업장지역 선택값 오류");
assert.match(read("benefit-finder-v2.html"), /value="광주">전남광주통합특별시 · 광주권/);
assert.match(read("benefit-finder-v2.html"), /value="전남">전남광주통합특별시 · 전남권/);

// Exercise the real cascading-select listeners from benefit-v2-integration.js,
// rather than checking only that its data object exists.
const regionField = form.elements.region;
const districtField = form.elements.district;
const businessRegionField = form.elements.businessRegion;
const businessDistrictField = form.elements.businessDistrict;
for (const region of expectedRegionChoices) {
  regionField.value = region;
  regionField.dispatch("change");
  const residenceOptions = [...districtField.innerHTML.matchAll(/<option value="([^"]*)">([^<]*)<\/option>/g)]
    .map((match) => match[1]).filter(Boolean);
  assert.deepEqual(residenceOptions, Array.from(context.window.V2_DISTRICTS[region]), `${region}: 거주지 선택 후 시·군·구 옵션 불일치`);
  assert.equal(districtField.disabled, false, `${region}: 거주지 시·군·구 선택이 비활성화됨`);

  businessRegionField.value = region;
  businessRegionField.dispatch("change");
  const businessOptions = [...businessDistrictField.innerHTML.matchAll(/<option value="([^"]*)">([^<]*)<\/option>/g)]
    .map((match) => match[1]).filter(Boolean);
  assert.deepEqual(businessOptions, Array.from(context.window.V2_DISTRICTS[region]), `${region}: 사업장 선택 후 시·군·구 옵션 불일치`);
  assert.equal(businessDistrictField.disabled, false, `${region}: 사업장 시·군·구 선택이 비활성화됨`);
}

function rule(id) {
  const item = personalRules.concat(businessRules).find((candidate) => candidate.id === id);
  assert.ok(item, `테스트 대상 규칙 누락: ${id}`);
  return item;
}

function profile(overrides = {}) {
  return {
    birthYear: 1996,
    age: 30,
    region: "서울",
    district: "강남구",
    household: 1,
    spouse: false,
    children: false,
    status: "jobseeker",
    earners: "none",
    incomeBand: "unknown",
    housing: "rent",
    hasChildUnder9: "no",
    hasChild2023to2025: "no",
    isBusiness: false,
    smallBusiness: "no",
    businessRegion: "",
    businessDistrict: "",
    ...overrides,
  };
}

assert.equal(evaluate(rule("incheon-safety-insurance-2026"), profile({ region: "인천" })).status, "automatic");
assert.equal(evaluate(rule("incheon-safety-insurance-2026"), profile({ region: "서울" })).status, "ineligible");
assert.equal(evaluate(rule("seoul-basic-security-2026"), profile()).status, "needs_info");
assert.equal(evaluate(rule("seoul-basic-security-2026"), profile({ region: "경기" })).status, "ineligible");
assert.equal(evaluate(rule("seoul-youth-rent-2026"), profile()).status, "closed");
assert.equal(evaluate(rule("seoul-youth-rent-2026"), profile({ housing: "owner" })).status, "ineligible");
assert.equal(evaluate(rule("seoul-youth-rent-2026"), profile({ age: 40 })).status, "ineligible");
assert.equal(evaluate(rule("gyeonggi-pass-2026"), profile({ region: "경기" })).status, "conditional_use");
assert.equal(evaluate(rule("gyeonggi-pass-2026"), profile({ region: "서울" })).status, "ineligible");
assert.equal(evaluate(rule("gyeonggi-youth-skills-2026"), profile({ region: "경기", status: "student" })).status, "needs_info");
assert.equal(evaluate(rule("gyeonggi-youth-interview-2026"), profile({ region: "경기" })).status, "closed");
assert.notEqual(evaluate(rule("training-card-2026"), profile({ region: "제주" })).status, "ineligible");
assert.equal(evaluate(rule("namdong-youth-challenge-2026"), profile({ region: "인천", district: "부평구", age: 25 })).status, "ineligible");
assert.equal(evaluate(rule("incheon-small-business-guarantee-2026"), profile()).status, "ineligible");
assert.equal(evaluate(rule("incheon-small-business-guarantee-2026"), profile({
  isBusiness: true,
  status: "business",
  smallBusiness: "yes",
  businessRegion: "인천",
})).status, "needs_info");

for (const item of personalRules.filter((candidate) => candidate.region && candidate.region !== "전국")) {
  const wrongRegion = item.region === "서울" ? "경기" : "서울";
  assert.equal(evaluate(item, profile({ region: wrongRegion })).status, "ineligible", `${item.id}: 타지역 사용자에게 노출됨`);
}

const newSeoulRules = personalRules.filter((item) => item.region === "서울" && item.lastVerifiedAt === "2026-09-27");
const newGyeonggiRules = personalRules.filter((item) => item.region === "경기" && item.lastVerifiedAt === "2026-09-27");
assert.equal(newSeoulRules.length, 4, "이번 서울 확장 규칙 수 오류");
assert.equal(newGyeonggiRules.length, 4, "이번 경기 확장 규칙 수 오류");

function formData(values) {
  return { get: (name) => values[name] ?? null };
}
const veteranMatches = context.window.V2VeteranResults(formData({
  veteranStatus: "yes",
  veteranRelation: "spouse",
  veteranType: "war",
  birthYear: "1970",
  region: "서울",
  district: "동작구",
}));
assert.ok(veteranMatches.some((match) => match.item.id === "national-war-veteran-spouse-registration-2026"));
assert.ok(veteranMatches.some((match) => match.item.id === "dongjak-veteran-honor-allowance-2026"));
assert.ok(veteranMatches.every((match) => match.item.region !== "인천"));

console.log(
  `맞춤 규칙 ${allRules.length}개(개인 ${personalRules.length}, 사업자 ${businessRules.length}, 보훈 ${veteranRules.length})와 지역 선택 ${expectedRegionChoices.length}개 회귀 테스트 통과`,
);
