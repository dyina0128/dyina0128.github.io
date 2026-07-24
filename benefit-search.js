(function () {
    "use strict";

    var data = Array.isArray(window.BENEFITS_DATA) ? window.BENEFITS_DATA : [];
    var searchInput = document.getElementById("benefitQuery");
    var regionFilter = document.getElementById("regionFilter");
    var categoryFilter = document.getElementById("categoryFilter");
    var targetFilter = document.getElementById("targetFilter");
    var statusFilter = document.getElementById("statusFilter");
    var resetButton = document.getElementById("resetFilters");
    var resultCount = document.getElementById("resultCount");
    var results = document.getElementById("searchResults");
    var emptyState = document.getElementById("emptyState");
    var debounceTimer;

    function normalize(value) {
        return String(value || "").toLocaleLowerCase("ko-KR").replace(/\s+/g, "").trim();
    }

    function searchableText(item) {
        return normalize([
            item.title, item.category, item.region, item.district,
            (item.targetGroups || []).join(" "), item.summary,
            (item.keywords || []).join(" ")
        ].join(" "));
    }

    function getState() {
        return {
            q: searchInput.value.trim(), region: regionFilter.value,
            category: categoryFilter.value, target: targetFilter.value,
            status: statusFilter.value
        };
    }

    function updateUrl(state) {
        var params = new URLSearchParams();
        Object.keys(state).forEach(function (key) {
            if (state[key]) params.set(key, state[key]);
        });
        var query = params.toString();
        history.replaceState(null, "", location.pathname + (query ? "?" + query : ""));
    }

    function compareItems(a, b, query) {
        var exactA = query && normalize(a.title) === query ? 1 : 0;
        var exactB = query && normalize(b.title) === query ? 1 : 0;
        if (exactA !== exactB) return exactB - exactA;
        if (Boolean(a.featured) !== Boolean(b.featured)) return Number(b.featured) - Number(a.featured);
        if ((a.region === "전국") !== (b.region === "전국")) return a.region === "전국" ? -1 : 1;
        if ((a.category !== "지역 안내") !== (b.category !== "지역 안내")) return a.category !== "지역 안내" ? -1 : 1;
        return a.title.localeCompare(b.title, "ko-KR");
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, function (character) {
            return {"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[character];
        });
    }

    function renderCard(item) {
        var targets = item.targetGroups && item.targetGroups.length ? item.targetGroups.join(" · ") : "대상은 공식 공고에서 확인";
        var action = item.url
            ? '<a class="benefit-search-link" href="' + encodeURI(item.url) + '">자세히 보기</a>'
            : '<span class="benefit-search-unavailable">공식 페이지 준비 중</span>';
        return '<article class="benefit-search-card">' +
            '<div class="benefit-search-badges"><span>' + escapeHtml(item.category) + '</span><span>' + escapeHtml(item.district || item.region) + '</span></div>' +
            '<h2>' + escapeHtml(item.title) + '</h2>' +
            '<p class="benefit-search-target"><strong>대상</strong> ' + escapeHtml(targets) + '</p>' +
            '<p>' + escapeHtml(item.summary) + '</p>' +
            '<p class="benefit-search-status"><strong>신청 상태</strong> ' + escapeHtml(item.applicationStatus || "공고 확인") + '</p>' +
            '<p class="benefit-search-source">지원 조건과 일정은 ' + escapeHtml(item.officialSource || "공식 공고") + '에서 다시 확인하세요.</p>' +
            action + '</article>';
    }

    function render() {
        var state = getState();
        var query = normalize(state.q);
        var filtered = data.filter(function (item) {
            return (!query || searchableText(item).indexOf(query) !== -1) &&
                (!state.region || item.region === state.region) &&
                (!state.category || item.category === state.category) &&
                (!state.target || (item.targetGroups || []).indexOf(state.target) !== -1) &&
                (!state.status || item.applicationStatus === state.status);
        }).sort(function (a, b) { return compareItems(a, b, query); });

        resultCount.textContent = "총 " + filtered.length + "개의 지원정보를 찾았습니다.";
        results.innerHTML = filtered.map(renderCard).join("");
        emptyState.hidden = filtered.length !== 0;
        updateUrl(state);
    }

    function debouncedRender() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(render, 200);
    }

    function applyUrlState() {
        var params = new URLSearchParams(location.search);
        searchInput.value = params.get("q") || "";
        [regionFilter, categoryFilter, targetFilter, statusFilter].forEach(function (field) {
            var value = params.get(field.name) || "";
            field.value = Array.from(field.options).some(function (option) { return option.value === value; }) ? value : "";
        });
    }

    searchInput.addEventListener("input", debouncedRender);
    [regionFilter, categoryFilter, targetFilter, statusFilter].forEach(function (field) {
        field.addEventListener("change", render);
    });
    resetButton.addEventListener("click", function () {
        searchInput.value = "";
        regionFilter.value = "";
        categoryFilter.value = "";
        targetFilter.value = "";
        statusFilter.value = "";
        render();
        searchInput.focus();
    });

    applyUrlState();
    render();
}());
