"use strict";

/* 모든 자료는 이 배열 한 곳에서 관리합니다. */
const resources = [
  {
    id: "youth-rent",
    categories: ["youth", "housing"],
    title: "청년월세지원",
    description: "월세 지원 신청에 필요한 서류와 신청 절차를 확인하세요.",
    featured: true,
    recent: false,
    officialUrl: "https://www.bokjiro.go.kr/",
    checklist: ["거주지와 연령 요건 확인", "임대차계약서와 월세 납부 증빙 준비", "소득·재산 및 중복지원 기준 확인"],
    steps: ["복지로 또는 관할 행정복지센터에서 최신 공고 확인", "자격요건 확인 후 제출서류 준비", "온라인 또는 방문 신청 후 처리상태 확인"]
  },
  {
    id: "employment-support",
    categories: ["youth", "jobs"],
    title: "국민취업지원제도",
    description: "취업지원 서비스와 구직촉진수당 신청 준비사항을 확인하세요.",
    featured: true,
    recent: false,
    officialUrl: "https://www.kua.go.kr/",
    checklist: ["가구원과 소득·재산 정보 확인", "취업경험과 현재 구직상태 정리", "본인인증 수단과 제출서류 준비"],
    steps: ["공식 사이트에서 참여요건 확인", "취업지원 신청서와 개인정보 동의 제출", "상담 후 취업활동계획 수립"]
  },
  {
    id: "national-scholarship",
    categories: ["youth", "life"],
    title: "국가장학금",
    description: "국가장학금 신청 기간, 준비사항과 신청순서를 확인하세요.",
    featured: false,
    recent: true,
    officialUrl: "https://www.kosaf.go.kr/",
    checklist: ["본인 명의 전자서명 수단 준비", "학적과 가족관계 정보 확인", "가구원 정보제공 동의 여부 확인"],
    steps: ["한국장학재단에서 현재 신청기간 확인", "온라인 신청서 작성", "가구원 동의와 요청된 추가서류 제출"]
  },
  {
    id: "housing-benefit",
    categories: ["housing", "life"],
    title: "주거급여",
    description: "소득과 주거 형태에 따른 주거급여 신청 정보를 확인하세요.",
    featured: true,
    recent: false,
    officialUrl: "https://www.bokjiro.go.kr/",
    checklist: ["가구원과 소득인정액 기준 확인", "임대차계약서 또는 주택 정보 준비", "신분증과 지급계좌 정보 준비"],
    steps: ["복지로에서 지원 가능성 확인", "온라인 또는 행정복지센터에서 신청", "소득·재산 및 주택조사 결과 확인"]
  },
  {
    id: "basic-pension",
    categories: ["senior", "life"],
    title: "기초연금",
    description: "기초연금 대상 확인과 신청 준비사항을 확인하세요.",
    featured: false,
    recent: false,
    officialUrl: "https://basicpension.mohw.go.kr/",
    checklist: ["만 65세 도달 시점과 주소지 확인", "본인과 배우자의 금융정보 확인", "신분증과 지급계좌 준비"],
    steps: ["기초연금 공식 사이트에서 대상 기준 확인", "주민센터·국민연금공단 또는 복지로에서 신청", "소득·재산 조사 결과 확인"]
  },
  {
    id: "energy-voucher",
    categories: ["life"],
    title: "에너지바우처",
    description: "냉난방비 지원 대상과 신청 방법을 확인하세요.",
    featured: false,
    recent: true,
    officialUrl: "https://www.energyv.or.kr/",
    checklist: ["세대원 특성과 수급자격 확인", "에너지요금 고지서 준비", "사용할 에너지원과 지원 방식 확인"],
    steps: ["공식 사이트에서 현재 신청기간 확인", "행정복지센터 또는 복지로에서 신청", "카드 발급 또는 요금차감 등록 확인"]
  },
  {
    id: "earned-income-credit",
    categories: ["life", "jobs"],
    title: "근로장려금",
    description: "근로장려금 신청 대상과 준비사항을 확인하세요.",
    featured: false,
    recent: false,
    officialUrl: "https://www.hometax.go.kr/",
    checklist: ["가구 유형과 소득 귀속연도 확인", "가구원 재산 합계 확인", "국세청 안내문과 본인 명의 계좌 준비"],
    steps: ["홈택스에서 신청 가능 여부 확인", "정기 또는 반기 신청 구분 확인", "연락처와 계좌를 확인한 뒤 제출"]
  },
  {
    id: "child-credit",
    categories: ["birth", "life"],
    title: "자녀장려금",
    description: "자녀장려금 신청 조건과 신청 절차를 확인하세요.",
    featured: false,
    recent: true,
    officialUrl: "https://www.hometax.go.kr/",
    checklist: ["부양자녀와 주민등록 정보 확인", "부부합산 소득 및 재산 기준 확인", "본인 명의 지급계좌 준비"],
    steps: ["홈택스에서 신청 가능 여부 확인", "가구원과 소득정보 검토", "신청 후 심사 진행상태와 결과 확인"]
  }
];

const categoryNames = {
  all: "전체",
  youth: "청년",
  housing: "주거",
  senior: "노인",
  birth: "출산",
  life: "생활",
  jobs: "일자리"
};

const categoryIcons = {
  youth: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>',
  housing: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></svg>',
  senior: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22v-8M9 18h6"/><path d="M7.5 13.5C4.3 12.4 3 9.6 4 7c2.6.1 4.7 1 6 3.5"/><path d="M16.5 13.5c3.2-1.1 4.5-3.9 3.5-6.5-2.6.1-4.7 1-6 3.5"/></svg>',
  birth: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21a8 8 0 1 0-8-8"/><path d="M4 4v6h6M9 13h.01M15 13h.01"/><path d="M9.5 17c1.5 1 3.5 1 5 0"/></svg>',
  life: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4.5 13h7L11 22l8.5-12h-7L13 2Z"/></svg>',
  jobs: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></svg>'
};

const state = { category: "all", query: "" };
const grid = document.querySelector("#resource-grid");
const featuredGrid = document.querySelector("#featured-grid");
const recentList = document.querySelector("#recent-list");
const searchInput = document.querySelector("#resource-search");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const dialog = document.querySelector("#preview-dialog");

function normalize(value) {
  return value.toLocaleLowerCase("ko-KR").replace(/\s+/g, "");
}

function primaryCategory(resource) {
  return resource.categories[0];
}

function categoryLabels(resource) {
  return resource.categories.map((category) => categoryNames[category]).join(" · ");
}

function resourceCard(resource) {
  const category = primaryCategory(resource);
  return `
    <article class="resource-card" data-id="${resource.id}">
      <div class="card-head">
        <span class="resource-icon" aria-hidden="true">${categoryIcons[category]}</span>
        <span class="status-badge${resource.recent f " new" : ""}">${resource.recent ? "최근 등록" : "신청 자료"}</span>
      </div>
      <h3>${resource.title}</h3>
      <p class="resource-description">${resource.description}</p>
      <div class="card-meta"><span class="category-label">${categoryLabels(resource)}</span></div>
      <div class="actions" aria-label="${resource.title} 자료">
        <button class="action-button is-disabled" type="button" disabled aria-label="${resource.title} PDF 준비 중">PDF 준비 중</button>
        <button class="action-button" type="button" data-action="checklist">체크리스트</button>
        <button class="action-button" type="button" data-action="steps">신청순서</button>
        <button class="action-button primary" type="button" data-action="preview">미리보기</button>
      </div>
    </article>`;
}

function visibleResources() {
  const query = normalize(state.query);
  return resources.filter((resource) => {
    const matchesCategory = state.category === "all" || resource.categories.includes(state.category);
    const haystack = normalize(`${resource.title} ${resource.description} ${categoryLabels(resource)}`);
    return matchesCategory && (!query || haystack.includes(query));
  });
}

function renderResources() {
  const visible = visibleResources();
  grid.innerHTML = visible.map(resourceCard).join("");
  resultCount.textContent = `총 ${visible.length}개 자료`;
  grid.hidden = visible.length === 0;
  emptyState.hidden = visible.length !== 0;
}

function renderFeatured() {
  const featured = resources.filter((resource) => resource.featured);
  featuredGrid.innerHTML = featured.map((resource) => {
    const category = primaryCategory(resource);
    return `
      <button class="featured-card" type="button" data-resource="${resource.id}" aria-label="${resource.title} 미리보기">
        <span class="feature-badge">추천 자료</span>
        <span class="featured-icon" aria-hidden="true">${categoryIcons[category]}</span>
        <h3>${resource.title}</h3>
        <p>${resource.description}</p>
      </button>`;
  }).join("");
}

function renderRecent() {
  const recent = resources.filter((resource) => resource.recent);
  recentList.innerHTML = recent.map((resource) => {
    const category = primaryCategory(resource);
    return `
      <li>
        <span class="mini-icon" aria-hidden="true">${categoryIcons[category]}</span>
        <strong>${resource.title}</strong>
        <span class="recent-label">최근 등록</span>
      </li>`;
  }).join("");
}

function openPreview(resource, section) {
  const category = primaryCategory(resource);
  document.querySelector("#preview-icon").innerHTML = categoryIcons[category];
  document.querySelector("#preview-category").textContent = categoryLabels(resource);
  document.querySelector("#preview-title").textContent = resource.title;
  document.querySelector("#preview-description").textContent = resource.description;
  document.querySelector("#preview-checklist").innerHTML = resource.checklist.map((item) => `<li>${item}</li>`).join("");
  document.querySelector("#preview-steps").innerHTML = resource.steps.map((item) => `<li>${item}</li>`).join("");
  document.querySelector("#preview-official").href = resource.officialUrl;
  dialog.showModal();

  if (section === "checklist") document.querySelector("#checklist-title").scrollIntoView({ block: "start" });
  if (section === "steps") document.querySelector("#steps-title").scrollIntoView({ block: "start" });
}

function selectCategory(tab) {
  document.querySelectorAll("[role='tab']").forEach((item) => {
    item.setAttribute("aria-selected", String(item === tab));
    item.tabIndex = item === tab ? 0 : -1;
  });
  state.category = tab.dataset.category;
  renderResources();
}

function resetFilters() {
  const allTab = document.querySelector("[role='tab'][data-category='all']");
  state.query = "";
  searchInput.value = "";
  selectCategory(allTab);
  searchInput.focus();
}

document.querySelector("#search-form").addEventListener("submit", (event) => event.preventDefault());
searchInput.addEventListener("input", () => {
  state.query = searchInput.value.trim();
  renderResources();
});

document.querySelector(".tabs").addEventListener("click", (event) => {
  const tab = event.target.closest("[role='tab']");
  if (tab) selectCategory(tab);
});

document.querySelector(".tabs").addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const tabs = [...document.querySelectorAll("[role='tab']")];
  let index = tabs.indexOf(document.activeElement);
  if (event.key === "ArrowRight") index = (index + 1) % tabs.length;
  if (event.key === "ArrowLeft") index = (index - 1 + tabs.length) % tabs.length;
  if (event.key === "Home") index = 0;
  if (event.key === "End") index = tabs.length - 1;
  tabs[index].focus();
  selectCategory(tabs[index]);
});

grid.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]");
  if (!action) return;
  const card = action.closest(".resource-card");
  const resource = resources.find((item) => item.id === card.dataset.id);
  openPreview(resource, action.dataset.action);
});

featuredGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-resource]");
  if (!card) return;
  openPreview(resources.find((resource) => resource.id === card.dataset.resource), "preview");
});

document.querySelector("#reset-search").addEventListener("click", resetFilters);
document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => dialog.close());
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.addEventListener("keydown", (event) => {
  const isTyping = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
  if (event.key === "/" && !isTyping && !dialog.open) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput && searchInput.value) {
    state.query = "";
    searchInput.value = "";
    renderResources();
  }
});

renderFeatured();
renderResources();
renderRecent();