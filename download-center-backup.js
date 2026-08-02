"use strict";

/* =========================================================
   다운로드 센터 자료
   pageUrl이 있는 자료는 검색 시 해당 상세 페이지로 이동합니다.
   pageUrl이 비어 있으면 미리보기 창을 엽니다.
========================================================= */

const RESOURCE_DATA = [
  {
    id: "youth-rent",
    categories: ["youth", "housing"],
    title: "청년월세지원",
    description: "월세 지원 신청에 필요한 서류와 신청 절차를 확인하세요.",
    featured: true,
    recent: false,
    pageUrl: "youth-rent-support-kit.html",
    officialUrl: "https://www.bokjiro.go.kr/",
    pdf: "pdf/youth-rent-support-checklist.pdf",
    pdfSize: "PDF",
    pdfPages: "체크리스트",
    checklist: [
      "거주지와 연령 요건 확인",
      "임대차계약서와 월세 납부 증빙 준비",
      "소득·재산 및 중복지원 기준 확인"
    ],
    steps: [
      "복지로 또는 관할 행정복지센터에서 최신 공고 확인",
      "자격요건 확인 후 제출서류 준비",
      "온라인 또는 방문 신청 후 처리상태 확인"
    ]
  },
  {
    id: "employment-support",
    categories: ["youth", "jobs"],
    title: "국민취업지원제도",
    description: "취업지원 서비스와 구직촉진수당 신청 준비사항을 확인하세요.",
    featured: true,
    recent: false,
    pageUrl: "job-support-guide.html",
    officialUrl: "https://www.kua.go.kr/",
    pdf: "pdf/employment-support-checklist.pdf",
    pdfSize: "PDF",
    pdfPages: "체크리스트",
    checklist: [
      "가구원과 소득·재산 정보 확인",
      "취업경험과 현재 구직상태 정리",
      "본인인증 수단과 제출서류 준비"
    ],
    steps: [
      "공식 사이트에서 참여요건 확인",
      "취업지원 신청서와 개인정보 동의 제출",
      "상담 후 취업활동계획 수립"
    ]
  },
  {
    id: "national-scholarship",
    categories: ["youth", "life"],
    title: "국가장학금",
    description: "국가장학금 신청 기간, 준비사항과 신청순서를 확인하세요.",
    featured: false,
    recent: true,
    pageUrl: "national-scholarship.html",
    officialUrl: "https://www.kosaf.go.kr/",
    pdf: "pdf/national-scholarship-checklist.pdf",
    pdfSize: "PDF",
    pdfPages: "체크리스트",
    checklist: [
      "본인 명의 전자서명 수단 준비",
      "학적과 가족관계 정보 확인",
      "가구원 정보제공 동의 여부 확인"
    ],
    steps: [
      "한국장학재단에서 현재 신청기간 확인",
      "온라인 신청서 작성",
      "가구원 동의와 필요한 추가서류 제출"
    ]
  },
  {
    id: "housing-benefit",
    categories: ["housing", "life"],
    title: "주거급여",
    description: "소득과 주거 형태에 따른 주거급여 신청 정보를 확인하세요.",
    featured: true,
    recent: false,
    pageUrl: "housing-benefit.html",
    officialUrl: "https://www.bokjiro.go.kr/",
    pdf: "pdf/housing-benefit-checklist.pdf",
    pdfSize: "PDF",
    pdfPages: "체크리스트",
    checklist: [
      "가구원과 소득인정액 기준 확인",
      "임대차계약서 또는 주택 정보 준비",
      "신분증과 지급계좌 정보 준비"
    ],
    steps: [
      "복지로에서 지원 가능성 확인",
      "온라인 또는 행정복지센터에서 신청",
      "소득·재산 및 주택조사 결과 확인"
    ]
  },
  {
    id: "basic-pension",
    categories: ["senior", "life"],
    title: "기초연금",
    description: "기초연금 대상 확인과 신청 준비사항을 확인하세요.",
    featured: false,
    recent: false,
    pageUrl: "basic-pension-guide.html",
    officialUrl: "https://basicpension.mohw.go.kr/",
    pdf: "pdf/basic-pension-checklist.pdf",
    pdfSize: "PDF",
    pdfPages: "체크리스트",
    checklist: [
      "만 65세 도달 시점과 주소지 확인",
      "본인과 배우자의 금융정보 확인",
      "신분증과 지급계좌 준비"
    ],
    steps: [
      "기초연금 공식 사이트에서 대상 기준 확인",
      "주민센터·국민연금공단 또는 복지로에서 신청",
      "소득·재산 조사 결과 확인"
    ]
  },
  {
    id: "energy-voucher",
    categories: ["life"],
    title: "에너지바우처",
    description: "냉난방비 지원 대상과 신청 방법을 확인하세요.",
    featured: false,
    recent: true,
    pageUrl: "energy-voucher-guide.html",
    officialUrl: "https://www.energyv.or.kr/",
    pdf: "pdf/energy-voucher-checklist.pdf",
    pdfSize: "PDF",
    pdfPages: "체크리스트",
    checklist: [
      "세대원 특성과 수급자격 확인",
      "에너지요금 고지서 준비",
      "사용할 에너지원과 지원 방식 확인"
    ],
    steps: [
      "공식 사이트에서 현재 신청기간 확인",
      "행정복지센터 또는 복지로에서 신청",
      "카드 발급 또는 요금차감 등록 확인"
    ]
  },
  {
    id: "earned-income-credit",
    categories: ["life", "jobs"],
    title: "근로장려금",
    description: "근로장려금 신청 대상과 준비사항을 확인하세요.",
    featured: false,
    recent: false,
    pageUrl: "work-incentive-guide.html",
    officialUrl: "https://www.hometax.go.kr/",
    pdf: "pdf/work-incentive-checklist.pdf",
    pdfSize: "PDF",
    pdfPages: "체크리스트",
    checklist: [
      "가구 유형과 소득 귀속연도 확인",
      "가구원 재산 합계 확인",
      "국세청 안내문과 본인 명의 계좌 준비"
    ],
    steps: [
      "홈택스에서 신청 가능 여부 확인",
      "정기 또는 반기 신청 구분 확인",
      "연락처와 계좌를 확인하고 제출"
    ]
  },
  {
    id: "child-credit",
    categories: ["birth", "life"],
    title: "자녀장려금",
    description: "자녀장려금 신청 조건과 신청 절차를 확인하세요.",
    featured: false,
    recent: true,
    pageUrl: "child-tax-credit.html",
    officialUrl: "https://www.hometax.go.kr/",
    pdf: "pdf/child-tax-credit-checklist.pdf",
    pdfSize: "PDF",
    pdfPages: "체크리스트",
    checklist: [
      "부양자녀와 주민등록 정보 확인",
      "부부합산 소득 및 재산 기준 확인",
      "본인 명의 지급계좌 준비"
    ],
    steps: [
      "홈택스에서 신청 가능 여부 확인",
      "가구원과 소득정보 검토",
      "신청 후 심사 진행상태와 결과 확인"
    ]
  }
];

/* =========================================================
   카테고리 이름과 아이콘
========================================================= */

const CATEGORY_NAMES = {
  all: "전체",
  youth: "청년",
  housing: "주거",
  senior: "노인",
  birth: "출산",
  life: "생활",
  jobs: "일자리"
};

const CATEGORY_ICONS = {
  youth: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M19 8v6M22 11h-6"/>
    </svg>
  `,
  housing: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 11 9-8 9 8"/>
      <path d="M5 10v10h14V10M9 20v-6h6v6"/>
    </svg>
  `,
  senior: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 22v-8M9 18h6"/>
      <path d="M7.5 13.5C4.3 12.4 3 9.6 4 7c2.6.1 4.7 1 6 3.5"/>
      <path d="M16.5 13.5c3.2-1.1 4.5-3.9 3.5-6.5-2.6.1-4.7 1-6 3.5"/>
    </svg>
  `,
  birth: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21a8 8 0 1 0-8-8"/>
      <path d="M4 4v6h6M9 13h.01M15 13h.01"/>
      <path d="M9.5 17c1.5 1 3.5 1 5 0"/>
    </svg>
  `,
  life: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2 4.5 13h7L11 22l8.5-12h-7L13 2Z"/>
    </svg>
  `,
  jobs: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2"/>
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/>
    </svg>
  `
};

/* =========================================================
   상수와 상태
========================================================= */

const SELECTORS = {
  grid: "#resource-grid",
  featuredGrid: "#featured-grid",
  recentList: "#recent-list",
  searchForm: "#search-form",
  searchInput: "#resource-search",
  resultCount: "#result-count",
  suggestions: "#search-suggestions",
  emptyState: "#empty-state",
  dialog: "#preview-dialog",
  previewIcon: "#preview-icon",
  previewCategory: "#preview-category",
  previewTitle: "#preview-title",
  previewDescription: "#preview-description",
  previewChecklist: "#preview-checklist",
  previewSteps: "#preview-steps",
  previewOfficial: "#preview-official",
  checklistTitle: "#checklist-title",
  stepsTitle: "#steps-title",
  resourcesSection: "#resources",
  resetSearch: "#reset-search",
  tabs: ".tabs",
  tab: "[role='tab']",
  closeDialog: "[data-close-dialog]",
  resourceCard: ".resource-card",
  suggestion: ".search-suggestion",
  action: "[data-action]",
  resourceTarget: "[data-resource]"
};

const ACTIONS = {
  open: "open",
  preview: "preview",
  checklist: "checklist",
  steps: "steps"
};

const KEYBOARD_KEYS = {
  arrowDown: "ArrowDown",
  arrowLeft: "ArrowLeft",
  arrowRight: "ArrowRight",
  arrowUp: "ArrowUp",
  end: "End",
  enter: "Enter",
  escape: "Escape",
  home: "Home",
  searchFocus: "/",
  space: " "
};

const MAX_SUGGESTIONS = 5;
const EMPTY_RESOURCE_COUNT_TEXT = "총 0개 자료";

const state = {
  category: "all",
  query: "",
  suggestionIndex: -1
};

/* =========================================================
   DOM 캐시
========================================================= */

const dom = {
  grid: document.querySelector(SELECTORS.grid),
  featuredGrid: document.querySelector(SELECTORS.featuredGrid),
  recentList: document.querySelector(SELECTORS.recentList),
  searchForm: document.querySelector(SELECTORS.searchForm),
  searchInput: document.querySelector(SELECTORS.searchInput),
  resultCount: document.querySelector(SELECTORS.resultCount),
  suggestions: document.querySelector(SELECTORS.suggestions),
  emptyState: document.querySelector(SELECTORS.emptyState),
  dialog: document.querySelector(SELECTORS.dialog),
  tabs: document.querySelector(SELECTORS.tabs),
  resetSearch: document.querySelector(SELECTORS.resetSearch),
  resourcesSection: document.querySelector(SELECTORS.resourcesSection)
};

dom.searchButton = dom.searchForm?.querySelector("kbd") ?? null;
dom.preview = {
  icon: document.querySelector(SELECTORS.previewIcon),
  category: document.querySelector(SELECTORS.previewCategory),
  title: document.querySelector(SELECTORS.previewTitle),
  description: document.querySelector(SELECTORS.previewDescription),
  checklist: document.querySelector(SELECTORS.previewChecklist),
  steps: document.querySelector(SELECTORS.previewSteps),
  official: document.querySelector(SELECTORS.previewOfficial),
  checklistTitle: document.querySelector(SELECTORS.checklistTitle),
  stepsTitle: document.querySelector(SELECTORS.stepsTitle)
};

/* =========================================================
   자료 인덱스
   나중에 resources.json으로 옮겨도 이 준비 함수만 유지하면 됩니다.
========================================================= */

const resources = prepareResources(RESOURCE_DATA);
const resourceById = new Map(resources.map((resource) => [resource.id, resource]));

function prepareResources(rawResources) {
  return rawResources.map((resource) => {
    const categories = Array.isArray(resource.categories)
      ? resource.categories
      : [];
    const categoryLabelText = getCategoryLabels(categories);
    const searchableText = normalizeText([
      resource.title,
      resource.description,
      categoryLabelText
    ].join(" "));

    return {
      ...resource,
      categories,
      categoryLabelText,
      searchableText
    };
  });
}

/* =========================================================
   공통 유틸리티
========================================================= */

function normalizeText(value = "") {
  return String(value).toLocaleLowerCase("ko-KR").replace(/\s+/g, "");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value = "") {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function getPrimaryCategory(resource) {
  return resource?.categories?.[0] ?? "life";
}

function getCategoryLabels(categories = []) {
  return categories
    .map((category) => CATEGORY_NAMES[category])
    .filter(Boolean)
    .join(" · ");
}

function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] ?? CATEGORY_ICONS.life ?? "";
}

function getResourceFromElement(element, datasetKey = "resource") {
  const resourceId = element?.dataset?.[datasetKey];
  return resourceId ? resourceById.get(resourceId) : null;
}

function getSearchQuery() {
  return dom.searchInput?.value.trim() ?? "";
}

function setElementHidden(element, isHidden) {
  if (element) {
    element.hidden = isHidden;
  }
}

function setHtml(element, html) {
  if (element) {
    element.innerHTML = html;
  }
}

function setText(element, text) {
  if (element) {
    element.textContent = text;
  }
}

function scrollToElement(element, options = { block: "start" }) {
  element?.scrollIntoView(options);
}

function highlightMatch(text, queryValue) {
  const safeText = escapeHtml(text);
  const query = queryValue.trim();

  if (!query) {
    return safeText;
  }

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return safeText.replace(new RegExp(`(${escapedQuery})`, "gi"), "<mark>$1</mark>");
}

/* =========================================================
   검색과 필터링
========================================================= */

function findMatchingResources(queryValue) {
  const query = normalizeText(queryValue);

  if (!query) {
    return [];
  }

  return resources.filter((resource) => resource.searchableText.includes(query));
}

function getVisibleResources() {
  const query = normalizeText(state.query);

  return resources.filter((resource) => {
    const matchesCategory =
      state.category === "all" || resource.categories.includes(state.category);
    const matchesQuery = !query || resource.searchableText.includes(query);

    return matchesCategory && matchesQuery;
  });
}

function runSearch() {
  const query = getSearchQuery();

  state.query = query;
  renderResources();

  if (!query) {
    closeSuggestions();
    dom.searchInput?.focus();
    return;
  }

  const matches = findMatchingResources(query);

  if (matches.length === 0) {
    scrollToElement(dom.resourcesSection, {
      behavior: "smooth",
      block: "start"
    });
    return;
  }

  const normalizedQuery = normalizeText(query);
  const exactMatch = matches.find(
    (resource) => normalizeText(resource.title) === normalizedQuery
  );
  const selectedResource = exactMatch ?? matches[0];

  closeSuggestions();
  openResource(selectedResource, selectedResource.pageUrl ? ACTIONS.open : ACTIONS.preview);
}

/* =========================================================
   검색 제안
========================================================= */

function closeSuggestions() {
  if (!dom.suggestions) {
    return;
  }

  dom.suggestions.innerHTML = "";
  dom.suggestions.hidden = true;
  dom.suggestions.scrollTop = 0;
  state.suggestionIndex = -1;
  dom.searchInput?.removeAttribute("aria-activedescendant");
}

function renderSuggestions(queryValue) {
  if (!dom.suggestions) {
    return;
  }

  const query = queryValue.trim();
  const matches = findMatchingResources(query).slice(0, MAX_SUGGESTIONS);

  state.suggestionIndex = -1;

  if (!query || matches.length === 0) {
    closeSuggestions();
    return;
  }

  dom.suggestions.innerHTML = matches.map(renderSuggestionButton).join("");
  dom.suggestions.hidden = false;
}

function renderSuggestionButton(resource, index) {
  const category = getPrimaryCategory(resource);

  return `
    <button
      class="search-suggestion"
      id="search-suggestion-${index}"
      type="button"
      role="option"
      aria-selected="false"
      data-resource="${escapeAttribute(resource.id)}"
    >
      <span class="suggestion-icon" aria-hidden="true">
        ${getCategoryIcon(category)}
      </span>

      <span class="suggestion-content">
        <strong>
          ${highlightMatch(resource.title, getSearchQuery())}
        </strong>

        <small>
          ${highlightMatch(resource.categoryLabelText, getSearchQuery())}
        </small>
      </span>
    </button>
  `;
}

function getSuggestionItems() {
  return [...(dom.suggestions?.querySelectorAll(SELECTORS.suggestion) ?? [])];
}

function updateSuggestionSelection(index) {
  const items = getSuggestionItems();

  if (items.length === 0) {
    state.suggestionIndex = -1;
    return;
  }

  state.suggestionIndex = (index + items.length) % items.length;

  items.forEach((item, itemIndex) => {
    const isSelected = itemIndex === state.suggestionIndex;
    item.setAttribute("aria-selected", String(isSelected));
  });

  const selectedItem = items[state.suggestionIndex];
  dom.searchInput?.setAttribute("aria-activedescendant", selectedItem.id);
  scrollToElement(selectedItem, { block: "nearest" });
}

function selectSuggestion(item) {
  const resource = getResourceFromElement(item);

  if (!resource) {
    return;
  }

  if (dom.searchInput) {
    dom.searchInput.value = resource.title;
  }

  state.query = resource.title;
  closeSuggestions();
  openResource(resource, resource.pageUrl ? ACTIONS.open : ACTIONS.preview);
}

/* =========================================================
   렌더링
========================================================= */

function renderResources() {
  const visible = getVisibleResources();

  setHtml(dom.grid, visible.map(renderResourceCard).join(""));
  setText(dom.resultCount, `총 ${visible.length}개 자료`);

  setElementHidden(dom.grid, visible.length === 0);
  setElementHidden(dom.emptyState, visible.length !== 0);
}

function renderFeatured() {
  const featuredResources = resources.filter((resource) => resource.featured);
  setHtml(dom.featuredGrid, featuredResources.map(renderFeaturedCard).join(""));
}

function renderRecent() {
  const recentResources = resources.filter((resource) => resource.recent);
  setHtml(dom.recentList, recentResources.map(renderRecentItem).join(""));
}

function renderResourceCard(resource) {
  const category = getPrimaryCategory(resource);
  const hasPdf = Boolean(resource.pdf);
  const downloadAttributes = hasPdf
    ? `href="${escapeAttribute(resource.pdf)}" download`
    : `href="#" aria-disabled="true" data-missing-pdf="true"`;

  return `
    <article class="resource-card pdf-product-card" data-id="${escapeAttribute(resource.id)}">

      <div class="pdf-product-top">
        <span class="resource-icon" aria-hidden="true">
          ${getCategoryIcon(category)}
        </span>

        <span class="status-badge${resource.recent ? " new" : ""}">
          ${resource.recent ? "최근 등록" : "무료 PDF"}
        </span>
      </div>

      <div class="pdf-preview">
        <div class="pdf-preview-paper">
          <span class="pdf-preview-label">PDF</span>

          <div class="pdf-preview-icon" aria-hidden="true">
            📄
          </div>

          <strong class="pdf-preview-title">
            ${escapeHtml(resource.title)}
          </strong>

          <span class="pdf-preview-subtitle">
            준비서류 체크리스트
          </span>

          <div class="pdf-preview-lines" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div class="pdf-product-content">
        <span class="pdf-category">
          ${escapeHtml(resource.categoryLabelText)}
        </span>

        <h3>${escapeHtml(resource.title)}</h3>

        <p class="resource-description">
          ${escapeHtml(resource.description)}
        </p>

        <ul class="pdf-feature-list">
          <li>신청 전 준비서류 확인</li>
          <li>단계별 신청순서 안내</li>
          <li>회원가입 없이 즉시 다운로드</li>
        </ul>

        <div class="pdf-file-info">
          <span>
            📄 ${escapeHtml(resource.pdfSize || "PDF")}
          </span>

          <span>
            📋 ${escapeHtml(resource.pdfPages || "체크리스트")}
          </span>
        </div>

        <a
          class="pdf-main-download"
          ${downloadAttributes}
          aria-label="${escapeAttribute(resource.title)} PDF 무료 다운로드"
        >
          <span aria-hidden="true">⬇</span>
          무료 다운로드
        </a>

        <div class="pdf-secondary-actions">
          <button
            class="pdf-secondary-button"
            type="button"
            data-action="checklist"
          >
            체크리스트
          </button>

          <button
            class="pdf-secondary-button"
            type="button"
            data-action="steps"
          >
            신청순서
          </button>

          <button
            class="pdf-secondary-button primary"
            type="button"
            data-action="open"
          >
            ${resource.pageUrl ? "상세보기" : "미리보기"}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderFeaturedCard(resource) {
  const category = getPrimaryCategory(resource);

  return `
    <button
      class="featured-card"
      type="button"
      data-resource="${escapeAttribute(resource.id)}"
      aria-label="${escapeAttribute(resource.title)} 열기"
    >
      <span class="feature-badge">추천 자료</span>

      <span class="featured-icon" aria-hidden="true">
        ${getCategoryIcon(category)}
      </span>

      <h3>${escapeHtml(resource.title)}</h3>
      <p>${escapeHtml(resource.description)}</p>
    </button>
  `;
}

function renderRecentItem(resource) {
  const category = getPrimaryCategory(resource);

  return `
    <li data-resource="${escapeAttribute(resource.id)}">
      <span class="mini-icon" aria-hidden="true">
        ${getCategoryIcon(category)}
      </span>

      <strong>${escapeHtml(resource.title)}</strong>
      <span class="recent-label">최근 등록</span>
    </li>
  `;
}

/* =========================================================
   상세 페이지 이동 또는 미리보기
========================================================= */

function openResource(resource, section = ACTIONS.preview) {
  if (!resource) {
    return;
  }

  if (section === ACTIONS.open && resource.pageUrl) {
    window.location.href = resource.pageUrl;
    return;
  }

  openPreview(resource, section);
}

function openPreview(resource, section = ACTIONS.preview) {
  if (!resource || !dom.dialog) {
    return;
  }

  const category = getPrimaryCategory(resource);

  setHtml(dom.preview.icon, getCategoryIcon(category));
  setText(dom.preview.category, resource.categoryLabelText);
  setText(dom.preview.title, resource.title);
  setText(dom.preview.description, resource.description);
  setHtml(dom.preview.checklist, renderListItems(resource.checklist));
  setHtml(dom.preview.steps, renderListItems(resource.steps));

  if (dom.preview.official) {
    dom.preview.official.href = resource.officialUrl || "#";
    dom.preview.official.toggleAttribute("aria-disabled", !resource.officialUrl);
  }

  dom.dialog.showModal();
  scrollPreviewSection(section);
}

function renderListItems(items = []) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function scrollPreviewSection(section) {
  if (section === ACTIONS.checklist) {
    scrollToElement(dom.preview.checklistTitle, { block: "start" });
  }

  if (section === ACTIONS.steps) {
    scrollToElement(dom.preview.stepsTitle, { block: "start" });
  }
}

/* =========================================================
   카테고리 선택과 초기화
========================================================= */

function getTabs() {
  return [...document.querySelectorAll(SELECTORS.tab)];
}

function selectCategory(tab) {
  if (!tab) {
    return;
  }

  getTabs().forEach((item) => {
    const isSelected = item === tab;
    item.setAttribute("aria-selected", String(isSelected));
    item.tabIndex = isSelected ? 0 : -1;
  });

  state.category = tab.dataset.category || "all";
  renderResources();
}

function resetFilters() {
  const allTab = document.querySelector(`${SELECTORS.tab}[data-category="all"]`);

  state.query = "";

  if (dom.searchInput) {
    dom.searchInput.value = "";
  }

  selectCategory(allTab);
  closeSuggestions();
  dom.searchInput?.focus();
}

/* =========================================================
   검색창 오른쪽 kbd를 검색 버튼처럼 동작하게 설정
========================================================= */

function setupSearchButton() {
  if (!dom.searchButton) {
    return;
  }

  dom.searchButton.textContent = "검색";
  dom.searchButton.setAttribute("role", "button");
  dom.searchButton.setAttribute("tabindex", "0");
  dom.searchButton.setAttribute("aria-label", "지원제도 검색");
  dom.searchButton.style.cursor = "pointer";
  dom.searchButton.style.userSelect = "none";

  dom.searchButton.addEventListener("click", runSearch);
  dom.searchButton.addEventListener("keydown", handleSearchButtonKeydown);
}

function handleSearchButtonKeydown(event) {
  if (event.key !== KEYBOARD_KEYS.enter && event.key !== KEYBOARD_KEYS.space) {
    return;
  }

  event.preventDefault();
  runSearch();
}

/* =========================================================
   이벤트 핸들러
========================================================= */

function bindEvents() {
  dom.searchForm?.addEventListener("submit", handleSearchSubmit);
  dom.searchInput?.addEventListener("input", handleSearchInput);
  dom.searchInput?.addEventListener("keydown", handleSearchInputKeydown);
  dom.suggestions?.addEventListener("click", handleSuggestionClick);
  dom.tabs?.addEventListener("click", handleTabClick);
  dom.tabs?.addEventListener("keydown", handleTabKeydown);
  dom.grid?.addEventListener("click", handleResourceGridClick);
  dom.featuredGrid?.addEventListener("click", handleFeaturedClick);
  dom.recentList?.addEventListener("click", handleRecentClick);
  dom.resetSearch?.addEventListener("click", resetFilters);
  dom.dialog?.addEventListener("click", handleDialogBackdropClick);
  document.addEventListener("keydown", handleDocumentKeydown);

  document.querySelectorAll(SELECTORS.closeDialog).forEach((button) => {
    button.addEventListener("click", closeDialog);
  });
}

function handleSearchSubmit(event) {
  event.preventDefault();
  runSearch();
}

function handleSearchInput() {
  const query = getSearchQuery();

  state.query = query;
  renderResources();
  renderSuggestions(query);
}

function handleSearchInputKeydown(event) {
  const items = getSuggestionItems();

  if (dom.suggestions?.hidden || items.length === 0) {
    return;
  }

  if (event.key === KEYBOARD_KEYS.arrowDown) {
    event.preventDefault();
    updateSuggestionSelection(state.suggestionIndex + 1);
    return;
  }

  if (event.key === KEYBOARD_KEYS.arrowUp) {
    event.preventDefault();
    updateSuggestionSelection(state.suggestionIndex - 1);
    return;
  }

  if (event.key === KEYBOARD_KEYS.enter && state.suggestionIndex >= 0) {
    event.preventDefault();
    selectSuggestion(items[state.suggestionIndex]);
    return;
  }

  if (event.key === KEYBOARD_KEYS.escape) {
    event.preventDefault();
    closeSuggestions();
  }
}

function handleSuggestionClick(event) {
  selectSuggestion(event.target.closest(SELECTORS.suggestion));
}

function handleTabClick(event) {
  const tab = event.target.closest(SELECTORS.tab);

  if (tab) {
    selectCategory(tab);
  }
}

function handleTabKeydown(event) {
  const allowedKeys = [
    KEYBOARD_KEYS.arrowLeft,
    KEYBOARD_KEYS.arrowRight,
    KEYBOARD_KEYS.home,
    KEYBOARD_KEYS.end
  ];

  if (!allowedKeys.includes(event.key)) {
    return;
  }

  event.preventDefault();

  const tabs = getTabs();
  if (tabs.length === 0) {
    return;
  }

  let index = tabs.indexOf(document.activeElement);

  if (index < 0) {
    index = 0;
  }

  if (event.key === KEYBOARD_KEYS.arrowRight) {
    index = (index + 1) % tabs.length;
  }

  if (event.key === KEYBOARD_KEYS.arrowLeft) {
    index = (index - 1 + tabs.length) % tabs.length;
  }

  if (event.key === KEYBOARD_KEYS.home) {
    index = 0;
  }

  if (event.key === KEYBOARD_KEYS.end) {
    index = tabs.length - 1;
  }

  tabs[index].focus();
  selectCategory(tabs[index]);
}

function handleResourceGridClick(event) {
  const actionButton = event.target.closest(SELECTORS.action);

  if (!actionButton) {
    if (event.target.closest("[data-missing-pdf]")) {
      event.preventDefault();
    }
    return;
  }

  const card = actionButton.closest(SELECTORS.resourceCard);
  const resourceId = card?.dataset?.id;
  const resource = resourceId ? resourceById.get(resourceId) : null;

  openResource(resource, actionButton.dataset.action);
}

function handleFeaturedClick(event) {
  const card = event.target.closest(SELECTORS.resourceTarget);
  const resource = getResourceFromElement(card);

  openResource(resource, resource?.pageUrl ? ACTIONS.open : ACTIONS.preview);
}

function handleRecentClick(event) {
  const item = event.target.closest(SELECTORS.resourceTarget);
  const resource = getResourceFromElement(item);

  openResource(resource, resource?.pageUrl ? ACTIONS.open : ACTIONS.preview);
}

function closeDialog() {
  if (dom.dialog?.open) {
    dom.dialog.close();
  }
}

function handleDialogBackdropClick(event) {
  if (event.target === dom.dialog) {
    closeDialog();
  }
}

function handleDocumentKeydown(event) {
  const activeTag = document.activeElement?.tagName || "";
  const isTyping = /^(INPUT|TEXTAREA|SELECT)$/.test(activeTag);

  if (event.key === KEYBOARD_KEYS.searchFocus && !isTyping && !dom.dialog?.open) {
    event.preventDefault();
    dom.searchInput?.focus();
    return;
  }

  if (
    event.key === KEYBOARD_KEYS.escape &&
    document.activeElement === dom.searchInput &&
    dom.searchInput?.value
  ) {
    state.query = "";
    dom.searchInput.value = "";
    renderResources();
    closeSuggestions();
  }
}

/* =========================================================
   초기 실행
========================================================= */

function init() {
  setupSearchButton();
  bindEvents();
  renderFeatured();
  renderResources();
  renderRecent();

  if (!dom.resultCount) {
    return;
  }

  if (!resources.length) {
    dom.resultCount.textContent = EMPTY_RESOURCE_COUNT_TEXT;
  }
}

init();