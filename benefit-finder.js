(function () {
    "use strict";

    var benefits = Array.isArray(window.BENEFITS_DATA) ? window.BENEFITS_DATA : [];
    var currentStep = 0;
    var visibleCount = 12;
    var matches = [];
    var steps = Array.from(document.querySelectorAll(".finder-step"));
    var form = document.getElementById("finderForm");
    var formArea = document.getElementById("finderFormArea");
    var resultsArea = document.getElementById("finderResultsArea");
    var previousButton = document.getElementById("finderPrevious");
    var nextButton = document.getElementById("finderNext");
    var submitButton = document.getElementById("finderSubmit");
    var restartButtons = Array.from(document.querySelectorAll("[data-finder-restart]"));
    var moreButton = document.getElementById("finderMore");
    var resultList = document.getElementById("finderResultList");
    var resultCount = document.getElementById("finderResultCount");
    var resultSummary = document.getElementById("finderResultSummary");
    var emptyState = document.getElementById("finderEmpty");
    var districtWrap = document.getElementById("finderDistrictWrap");
    var progressText = document.getElementById("finderProgressText");
    var progressBar = document.getElementById("finderProgressBar");

    var lifeMap = {
        homeless: ["무주택", "청년주거", "주거"], rent: ["월세", "청년월세", "주거"],
        jeonse: ["전세", "임차보증금", "전세대출", "주거"], pregnant: ["임산부", "임신", "출산"],
        newborn: ["출산가정", "출산", "산모", "신생아"], infant: ["영유아", "육아", "보육", "출산가정"],
        schoolchild: ["자녀", "교육", "학생", "양육"], university: ["대학생", "학생", "국가장학금", "교육"],
        singleparent: ["한부모", "한부모가정"], disability: ["장애인", "장애인복지"],
        senior: ["어르신", "노인", "기초연금"], lowincome: ["저소득", "취약계층", "기초생활", "주거급여", "에너지바우처"],
        smallbusiness: ["소상공인", "자영업", "중소기업"], farmer: ["농어업인", "농어촌", "농업", "어업"],
        ev: ["전기차", "자동차", "보조금"]
    };
    var lifeLabels = {
        homeless:"무주택", rent:"월세 거주", jeonse:"전세 거주", pregnant:"임신 중", newborn:"최근 출산",
        infant:"영유아 자녀", schoolchild:"초·중·고 자녀", university:"대학생", singleparent:"한부모가정",
        disability:"장애인 지원 확인", senior:"어르신", lowincome:"저소득 가구 지원 확인", smallbusiness:"소상공인",
        farmer:"농어업인", ev:"전기차 구매 예정", none:"해당 없음"
    };
    var statusMap = {
        student:["학생","무관"], jobseeker:["미취업","구직자","무관"], employed:["취업","근로자","무관"],
        business:["사업자","소상공인","무관"], farmer:["농어업인","무관"], other:["무관"]
    };
    var statusLabels = {student:"학생",jobseeker:"취업 준비 중",employed:"직장인",business:"자영업·소상공인",farmer:"농어업 종사",other:"무직 또는 기타"};
    var ageLabels = {"under18":"만 18세 이하","19-24":"만 19~24세","25-34":"만 25~34세","35-39":"만 35~39세","40-49":"만 40~49세","50-64":"만 50~64세","65plus":"만 65세 이상"};
    var ageValues = {"under18":17,"19-24":22,"25-34":30,"35-39":37,"40-49":45,"50-64":57,"65plus":70};

    function normalize(value) {
        return String(value || "").toLocaleLowerCase("ko-KR").replace(/\s+/g, "").trim();
    }
    function haystack(benefit) {
        return normalize([benefit.title, benefit.category, benefit.region, benefit.district,
            (benefit.targetGroups || []).join(" "), (benefit.employment || []).join(" "),
            benefit.summary, (benefit.keywords || []).join(" ")].join(" "));
    }
    function containsAny(text, words) {
        return words.some(function (word) { return text.indexOf(normalize(word)) !== -1; });
    }
    function uniqueReasons(reasons) {
        return reasons.filter(function (reason, index) { return reasons.indexOf(reason) === index; }).slice(0, 3);
    }

    function calculateMatchScore(benefit, answers) {
        var score = 0;
        var reasons = [];
        var text = haystack(benefit);
        var isOtherDistrict = answers.region === "서울" && answers.district && benefit.district && benefit.district !== answers.district;
        if (isOtherDistrict) return { score: -999, reasons: [], excluded: true };

        if (answers.interests.length && answers.interests.indexOf("all") === -1 && answers.interests.indexOf(benefit.category) !== -1) {
            score += 3; reasons.push(benefit.category + " 분야 선택과 일치");
        }

        var directConditionMatch = false;
        answers.life.forEach(function (condition) {
            var words = lifeMap[condition] || [];
            if (containsAny(text, words)) {
                score += 2; directConditionMatch = true;
                reasons.push(lifeLabels[condition] + " 조건과 관련");
            }
        });
        if (directConditionMatch) score += 3;

        var min = benefit.ageMin === "" || benefit.ageMin == null ? null : Number(benefit.ageMin);
        var max = benefit.ageMax === "" || benefit.ageMax == null ? null : Number(benefit.ageMax);
        if (min !== null || max !== null) {
            var ageMatches = (min === null || answers.age >= min) && (max === null || answers.age <= max);
            if (ageMatches) { score += 3; reasons.push("선택한 나이대와 관련"); }
            else score -= 3;
        }

        var employment = benefit.employment || [];
        var selectedEmployment = statusMap[answers.status] || ["무관"];
        if (employment.length && employment.indexOf("무관") === -1 && employment.some(function (value) { return selectedEmployment.indexOf(value) !== -1; })) {
            score += 2; reasons.push(statusLabels[answers.status] + " 상태와 관련");
        }

        if (benefit.region === "전국") { score += 1; reasons.push("전국 공통 지원정보"); }
        else if (answers.region && benefit.region === answers.region) { score += 3; reasons.push(answers.region + " 거주 조건과 관련"); }
        else if (answers.region && benefit.region) score -= 6;
        if (answers.district && benefit.district === answers.district) { score += 4; reasons.unshift(answers.district + " 지역 정보"); }
        else if (!answers.district && benefit.district) score -= 3;
        if (benefit.featured) score += 1;
        if (["신청 가능","상시 신청"].indexOf(benefit.applicationStatus) !== -1) score += 1;

        var profileWords = [];
        profileWords = profileWords.concat(statusMap[answers.status] || []);
        profileWords = profileWords.concat(answers.interests.filter(function (value) { return value !== "all"; }));
        answers.life.forEach(function (condition) { profileWords = profileWords.concat(lifeMap[condition] || []); });
        if (containsAny(text, profileWords)) score += 3;
        if (benefit.category === "지역 안내") score -= 4;
        return { score: score, reasons: uniqueReasons(reasons), excluded: false };
    }

    function findMatches(answers) {
        return benefits.map(function (benefit) {
            var match = calculateMatchScore(benefit, answers);
            return { benefit: benefit, score: match.score, reasons: match.reasons, excluded: match.excluded };
        }).filter(function (item) { return !item.excluded && item.score > 0; })
          .sort(function (a, b) {
              if (a.score !== b.score) return b.score - a.score;
              if ((a.benefit.category === "지역 안내") !== (b.benefit.category === "지역 안내")) return a.benefit.category === "지역 안내" ? 1 : -1;
              return a.benefit.title.localeCompare(b.benefit.title, "ko-KR");
          });
    }

    function getChecked(name) {
        return Array.from(form.querySelectorAll('input[name="' + name + '"]:checked')).map(function (input) { return input.value; });
    }
    function getAnswers() {
        var ageKey = (form.querySelector('input[name="age"]:checked') || {}).value || "";
        var region = (form.querySelector('input[name="region"]:checked') || {}).value || "";
        var status = (form.querySelector('input[name="status"]:checked') || {}).value || "";
        return { ageKey:ageKey, age:ageValues[ageKey], region:region, district:region === "서울" ? document.getElementById("finderDistrict").value : "",
            status:status, life:getChecked("life").filter(function (x) { return x !== "none"; }), interests:getChecked("interest") };
    }
    function validateStep() {
        var requiredName = ["age","region","status"][currentStep];
        var error = steps[currentStep].querySelector(".finder-error");
        if (requiredName && !form.querySelector('input[name="' + requiredName + '"]:checked')) {
            error.textContent = "이 항목을 선택한 뒤 다음 단계로 이동해 주세요.";
            return false;
        }
        error.textContent = ""; return true;
    }
    function showStep(index) {
        currentStep = index;
        steps.forEach(function (step, i) { step.hidden = i !== currentStep; });
        progressText.textContent = (currentStep + 1) + " / " + steps.length;
        progressBar.style.width = ((currentStep + 1) / steps.length * 100) + "%";
        previousButton.hidden = currentStep === 0;
        nextButton.hidden = currentStep === steps.length - 1;
        submitButton.hidden = currentStep !== steps.length - 1;
        steps[currentStep].querySelector("legend").focus();
        updateSafeUrl();
    }
    function updateSafeUrl() {
        var answers = getAnswers();
        var params = new URLSearchParams();
        if (answers.ageKey) params.set("age", answers.ageKey);
        if (answers.region) params.set("region", answers.region);
        if (answers.status) params.set("status", answers.status);
        history.replaceState(null, "", location.pathname + (params.toString() ? "?" + params.toString() : ""));
    }
    function relationLabel(score) {
        if (score >= 10) return "우선 확인 추천";
        if (score >= 6) return "함께 확인 추천";
        return "추가 확인";
    }
    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; });
    }
    function renderCard(item) {
        var b = item.benefit;
        var reasons = item.reasons.length ? item.reasons : ["선택 조건과 함께 공식 공고 확인 필요"];
        return '<article class="finder-result-card"><div class="finder-badges"><span>' + escapeHtml(relationLabel(item.score)) + '</span><span>' + escapeHtml(b.category) + '</span><span>' + escapeHtml(b.district || b.region) + '</span><span>' + escapeHtml(b.applicationStatus || "공고 확인") + '</span></div>' +
            '<h3>' + escapeHtml(b.title) + '</h3><p>' + escapeHtml(b.summary) + '</p><div class="finder-reasons"><strong>추천 이유</strong><ul>' + reasons.map(function (r) { return '<li>' + escapeHtml(r) + '</li>'; }).join("") + '</ul></div>' +
            '<p class="finder-official">공식 공고 확인 필요 · 실제 지원 여부는 해당 기관의 심사를 통해 결정됩니다.</p>' +
            (b.url ? '<a class="finder-detail-link" href="' + encodeURI(b.url) + '">자세히 보기</a>' : '') + '</article>';
    }
    function renderResults() {
        var shown = matches.slice(0, visibleCount);
        resultList.innerHTML = shown.map(renderCard).join("");
        moreButton.hidden = visibleCount >= matches.length;
    }
    function showResults() {
        var answers = getAnswers();
        matches = findMatches(answers); visibleCount = 12;
        formArea.hidden = true; resultsArea.hidden = false;
        resultCount.textContent = "총 " + matches.length + "개의 확인 후보를 찾았습니다.";
        var life = answers.life.map(function (x) { return lifeLabels[x]; }).join(" · ") || "생활 조건 선택 없음";
        var interests = answers.interests.indexOf("all") !== -1 || !answers.interests.length ? "전체 분야" : answers.interests.join(" · ");
        resultSummary.textContent = ageLabels[answers.ageKey] + " · " + answers.region + (answers.district ? " " + answers.district : "") + " · " + statusLabels[answers.status] + " · " + life + " · " + interests;
        emptyState.hidden = matches.length !== 0;
        resultList.hidden = matches.length === 0;
        renderResults();
        document.getElementById("finderResultsHeading").focus();
    }
    function restart() {
        form.reset(); document.getElementById("finderDistrict").value = ""; districtWrap.hidden = true;
        resultsArea.hidden = true; formArea.hidden = false; matches = []; visibleCount = 12; history.replaceState(null, "", location.pathname); showStep(0);
    }
    function applySafeUrl() {
        var params = new URLSearchParams(location.search);
        [["age",params.get("age")],["region",params.get("region")],["status",params.get("status")]].forEach(function (pair) {
            if (!pair[1]) return;
            var input = form.querySelector('input[name="' + pair[0] + '"][value="' + CSS.escape(pair[1]) + '"]');
            if (input) input.checked = true;
        });
        var region = form.querySelector('input[name="region"]:checked'); districtWrap.hidden = !region || region.value !== "서울";
    }

    previousButton.addEventListener("click", function () { if (currentStep > 0) showStep(currentStep - 1); });
    nextButton.addEventListener("click", function () { if (validateStep()) showStep(currentStep + 1); });
    form.addEventListener("submit", function (event) { event.preventDefault(); if (validateStep()) showResults(); });
    moreButton.addEventListener("click", function () { visibleCount += 12; renderResults(); });
    restartButtons.forEach(function (button) { button.addEventListener("click", restart); });
    form.addEventListener("change", function (event) {
        if (event.target.name === "region") { districtWrap.hidden = event.target.value !== "서울"; if (event.target.value !== "서울") document.getElementById("finderDistrict").value = ""; }
        if (event.target.name === "life") {
            var none = form.querySelector('input[name="life"][value="none"]');
            if (event.target.value === "none" && event.target.checked) getChecked("life").filter(function (x) { return x !== "none"; }).forEach(function (value) { form.querySelector('input[name="life"][value="' + value + '"]').checked = false; });
            else if (event.target.checked) none.checked = false;
        }
        if (event.target.name === "interest" && event.target.value === "all" && event.target.checked) getChecked("interest").filter(function (x) { return x !== "all"; }).forEach(function (value) { form.querySelector('input[name="interest"][value="' + value + '"]').checked = false; });
        else if (event.target.name === "interest" && event.target.checked) form.querySelector('input[name="interest"][value="all"]').checked = false;
        updateSafeUrl();
    });

    window.BenefitFinder = { calculateMatchScore: calculateMatchScore, findMatches: findMatches, lifeMap: lifeMap, ageValues: ageValues };
    applySafeUrl(); showStep(0);
}());
