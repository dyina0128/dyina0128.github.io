// ======================================================
// 대한민국 혜택 생활 가이드 - 메인페이지 카드/검색/지역 필터
// ======================================================

const benefitData = {
  전국: [
    {
      title: "🎓 청년정책",
      description: "청년월세지원, 청년도약계좌, 청년버팀목 전세대출",
      url: "youth-policy-list.html"
    },
    {
      title: "🏠 주거지원",
      description: "주거급여, 청년월세, 공공임대주택 지원",
      url: "housing-benefit.html"
    },
    {
      title: "👶 출산·육아",
      description: "첫만남이용권, 부모급여, 아동수당과 육아휴직",
      url: "birth-child.html"
    },
    {
      title: "💼 국민취업지원제도",
      description: "취업지원서비스, 구직촉진수당과 취업성공수당",
      url: "job-support.html"
    },
    {
      title: "👵 노인복지",
      description: "기초연금, 노인일자리, 장기요양과 돌봄서비스",
      url: "elder-benefit.html"
    },
    {
      title: "🌾 농어촌지원",
      description: "공익직불금, 귀농귀촌, 농업경영체와 농어업인 지원",
      url: "farm-support.html"
    },
    {
      title: "🚗 자동차지원",
      description: "전기차 보조금, 조기폐차 지원과 자동차세 감면",
      url: "ev-subsidy.html"
    },
    {
      title: "💰 근로장려금",
      description: "가구유형별 소득·재산 조건과 신청방법",
      url: "work-incentive-guide.html"
    },
    {
      title: "👨‍👩‍👧 자녀장려금",
      description: "부양자녀 조건, 소득기준과 자녀별 지급액",
      url: "child-tax-credit.html"
    },
    {
      title: "🎭 문화누리카드",
      description: "문화·관광·체육활동을 위한 카드 지원",
      url: "culture-card-guide.html"
    },
    {
      title: "🎓 국민내일배움카드",
      description: "직업훈련비, 자격증 교육과 훈련장려금 지원",
      url: "training-card-guide.html"
    },
    {
      title: "⚡ 에너지바우처",
      description: "전기·가스·지역난방·등유·LPG 비용 지원",
      url: "energy-voucher-guide.html"
    },
    {
      title: "👨‍👧 한부모가족 지원",
      description: "아동양육비, 교육비, 주거와 양육비 이행지원",
      url: "single-parent-support.html"
    },
    {
      title: "♿ 장애인복지",
      description: "장애인연금, 활동지원, 보조기기와 요금감면",
      url: "disability-benefit.html"
    },
    {
      title: "🎓 국가장학금",
      description: "대학생 등록금 지원과 소득구간별 장학금",
      url: "national-scholarship.html"
    },
    {
      title: "👴 기초연금",
      description: "만 65세 이상 어르신의 노후소득 지원",
      url: "basic-pension-guide.html"
    }
  ],

  서울: [
    {
      title: "🎓 서울 청년정책",
      description: "서울 청년수당과 청년 주거지원 정보를 확인하세요.",
      url: "youth-policy-list.html"
    },
    {
      title: "🏠 서울 주거지원",
      description: "신혼부부 임차보증금과 공공주택 지원 정보를 확인하세요.",
      url: "housing-benefit.html"
    }
  ],

  인천: [
    {
      title: "🎓 인천 청년정책",
      description: "청년월세와 지역 청년지원 제도를 확인하세요.",
      url: "youth-policy-list.html"
    },
    {
      title: "🏠 인천 주거지원",
      description: "주거급여와 전세·월세 지원 정보를 확인하세요.",
      url: "housing-benefit.html"
    }
  ],

  경기: [
    {
      title: "🎓 경기 청년정책",
      description: "청년기본소득과 청년 취업·주거지원을 확인하세요.",
      url: "youth-policy-list.html"
    },
    {
      title: "🏠 경기 주거지원",
      description: "청년 전월세와 공공임대 지원 정보를 확인하세요.",
      url: "housing-benefit.html"
    }
  ],

  부산: [
    {
      title: "🎓 부산 청년정책",
      description: "부산 청년 취업·자산형성 지원 정보를 확인하세요.",
      url: "youth-policy-list.html"
    },
    {
      title: "🏠 부산 주거지원",
      description: "부산 지역 전세·월세 지원 정보를 확인하세요.",
      url: "housing-benefit.html"
    }
  ],

  대구: [
    {
      title: "🎓 대구 청년정책",
      description: "대구 청년 자산형성과 생활지원 정보를 확인하세요.",
      url: "youth-policy-list.html"
    },
    {
      title: "💼 대구 취업지원",
      description: "청년 구직활동과 직업훈련 지원을 확인하세요.",
      url: "job-support.html"
    }
  ],

  광주: [
    {
      title: "🎓 광주 청년정책",
      description: "광주 청년 구직·생활지원 정보를 확인하세요.",
      url: "youth-policy-list.html"
    },
    {
      title: "🏠 광주 주거지원",
      description: "청년월세와 주거급여 지원을 확인하세요.",
      url: "housing-benefit.html"
    }
  ],

  대전: [
    {
      title: "🎓 대전 청년정책",
      description: "대전 청년 주거·취업 지원 정보를 확인하세요.",
      url: "youth-policy-list.html"
    },
    {
      title: "🏠 대전 주거지원",
      description: "신혼부부와 청년 전세자금 지원을 확인하세요.",
      url: "housing-benefit.html"
    }
  ],

  울산: [
    {
      title: "💼 울산 취업지원",
      description: "청년 취업지원과 직업훈련 정보를 확인하세요.",
      url: "job-support.html"
    },
    {
      title: "🏠 울산 주거지원",
      description: "주거급여와 지역 주거지원 정보를 확인하세요.",
      url: "housing-benefit.html"
    }
  ],

  세종: [
    {
      title: "🎓 세종 청년정책",
      description: "세종 청년 주거·취업·생활지원 정보를 확인하세요.",
      url: "youth-policy-list.html"
    },
    {
      title: "🏠 세종 주거지원",
      description: "주거급여와 공공임대 지원 정보를 확인하세요.",
      url: "housing-benefit.html"
    }
  ],

  강원: [
    {
      title: "🌾 강원 농어촌지원",
      description: "귀농귀촌과 농업인 지원제도를 확인하세요.",
      url: "farm-support.html"
    },
    {
      title: "🏠 강원 주거지원",
      description: "주거급여와 지역 주거지원 정보를 확인하세요.",
      url: "housing-benefit.html"
    }
  ],

  충북: [
    {
      title: "💼 충북 취업지원",
      description: "청년 취업지원과 직업훈련 정보를 확인하세요.",
      url: "job-support.html"
    },
    {
      title: "🌾 충북 농어촌지원",
      description: "농업인과 귀농귀촌 지원제도를 확인하세요.",
      url: "farm-support.html"
    }
  ],

  충남: [
    {
      title: "🏠 충남 주거지원",
      description: "청년월세와 주거급여 지원 정보를 확인하세요.",
      url: "housing-benefit.html"
    },
    {
      title: "🌾 충남 농어촌지원",
      description: "농업인과 귀농귀촌 지원제도를 확인하세요.",
      url: "farm-support.html"
    }
  ],

  전북: [
    {
      title: "🎓 전북 청년정책",
      description: "청년 생활·취업·자산형성 지원을 확인하세요.",
      url: "youth-policy-list.html"
    },
    {
      title: "🌾 전북 농어촌지원",
      description: "귀농귀촌과 농업인 지원사업을 확인하세요.",
      url: "farm-support.html"
    }
  ],

  전남: [
    {
      title: "🌾 전남 농어촌지원",
      description: "귀농어·귀촌 정착과 농어업 지원을 확인하세요.",
      url: "farm-support.html"
    },
    {
      title: "🏠 전남 주거지원",
      description: "주거급여와 지역 주거지원 정보를 확인하세요.",
      url: "housing-benefit.html"
    }
  ],

  경북: [
    {
      title: "💼 경북 취업지원",
      description: "청년 일자리와 취업지원 정보를 확인하세요.",
      url: "job-support.html"
    },
    {
      title: "🌾 경북 농어촌지원",
      description: "농업인과 귀농귀촌 지원사업을 확인하세요.",
      url: "farm-support.html"
    }
  ],

  경남: [
    {
      title: "🏠 경남 주거지원",
      description: "신혼부부·청년 주거지원 정보를 확인하세요.",
      url: "housing-benefit.html"
    },
    {
      title: "🌾 경남 농어촌지원",
      description: "농어업인과 귀농귀촌 지원을 확인하세요.",
      url: "farm-support.html"
    }
  ],

  제주: [
    {
      title: "✈️ 제주 청년정책",
      description: "제주 청년 정착·취업·주거 지원을 확인하세요.",
      url: "youth-policy-list.html"
    },
    {
      title: "🏠 제주 주거지원",
      description: "주거급여와 제주 지역 주거지원을 확인하세요.",
      url: "housing-benefit.html"
    }
  ]
};

// ------------------------------------------------------
// HTML 요소 가져오기
// ------------------------------------------------------

const regionSelect = document.getElementById("region");
const cardsContainer = document.getElementById("cards");
const searchInput = document.getElementById("searchInput");

// ------------------------------------------------------
// 특수문자를 안전하게 화면에 출력
// ------------------------------------------------------

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ------------------------------------------------------
// 카드 하나 생성
// ------------------------------------------------------

function createBenefitCard(item) {
  const card = document.createElement("article");
  card.className = "card";

  card.innerHTML = `
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.description)}</p>

    <div class="btn-group">
      <a href="${escapeHtml(item.url)}" class="detailBtn">
        자세히 보기
      </a>
    </div>
  `;

  return card;
}

// ------------------------------------------------------
// 선택한 지역과 검색어에 맞게 카드 표시
// ------------------------------------------------------

function renderCards() {
  if (!cardsContainer) {
    return;
  }

  const selectedRegion = regionSelect ? regionSelect.value : "전국";
  const keyword = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  const regionalData =
    benefitData[selectedRegion] || benefitData["전국"];

  const filteredData = regionalData.filter((item) => {
    if (!keyword) {
      return true;
    }

    const searchableText =
      `${item.title} ${item.description}`.toLowerCase();

    return searchableText.includes(keyword);
  });

  cardsContainer.innerHTML = "";

  if (filteredData.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-message";

    emptyMessage.innerHTML = `
      <strong>검색 결과가 없습니다.</strong>
      <p>
        다른 검색어를 입력하거나 지역을
        ‘전국 공통 혜택’으로 변경해 보세요.
      </p>
    `;

    cardsContainer.appendChild(emptyMessage);
    return;
  }

  filteredData.forEach((item) => {
    cardsContainer.appendChild(createBenefitCard(item));
  });
}

// ------------------------------------------------------
// 지역 변경
// ------------------------------------------------------

if (regionSelect) {
  regionSelect.addEventListener("change", () => {
    if (searchInput) {
      searchInput.value = "";
    }

    renderCards();
  });
}

// ------------------------------------------------------
// 검색 입력
// ------------------------------------------------------

if (searchInput) {
  searchInput.addEventListener("input", renderCards);

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      searchInput.value = "";
      renderCards();
      searchInput.blur();
    }
  });
}

// ------------------------------------------------------
// 첫 화면 표시
// ------------------------------------------------------

renderCards();