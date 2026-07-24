"use strict";

const STORAGE_KEY = "youthRentSupportKitChecklistV2";

const checkboxes = Array.from(
  document.querySelectorAll(
    '#application-checklist input[type="checkbox"], ' +
    'section[aria-labelledby="documents-title"] input[type="checkbox"]'
  )
);

const progressRing = document.querySelector("#progress-ring");
const progressPercent = document.querySelector("#progress-percent");
const progressText = document.querySelector("#progress-text");

const summaryTotal = document.querySelector("#summary-total");
const summaryCompleted = document.querySelector("#summary-completed");
const summaryRemaining = document.querySelector("#summary-remaining");

const liveMessage = document.querySelector("#checklist-live");
const resetButton = document.querySelector("#reset-checklist");

const printButtons = [
  document.querySelector("#print-kit"),
  document.querySelector("#print-kit-side")
].filter(Boolean);

/**
 * 저장된 체크리스트 항목을 불러옵니다.
 *
 * @returns {string[]}
 */
function readSavedChecklist() {
  try {
    const savedValue = localStorage.getItem(STORAGE_KEY);

    if (!savedValue) {
      return [];
    }

    const parsedValue = JSON.parse(savedValue);

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.warn("저장된 체크리스트를 읽지 못했습니다.", error);
    return [];
  }
}

/**
 * 현재 선택 상태를 브라우저에 저장합니다.
 */
function saveChecklist() {
  const completedIds = checkboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.dataset.checkId);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds));
  } catch (error) {
    console.warn("체크리스트를 저장하지 못했습니다.", error);
  }
}

/**
 * 체크리스트 진행률과 요약 정보를 갱신합니다.
 */
function updateProgress() {
  const total = checkboxes.length;
  const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
  const remaining = Math.max(total - completed, 0);

  const percent = total === 0
    ? 0
    : Math.round((completed / total) * 100);

  const progressDegrees = Math.round((percent / 100) * 360);

  progressRing.style.setProperty(
    "--progress",
    `${progressDegrees}deg`
  );

  progressRing.setAttribute(
    "aria-label",
    `체크리스트 진행률 ${percent}퍼센트`
  );

  progressPercent.textContent = `${percent}%`;

  summaryTotal.textContent = `${total}개`;
  summaryCompleted.textContent = `${completed}개`;
  summaryRemaining.textContent = `${remaining}개`;

  if (completed === 0) {
    progressText.textContent = "아직 체크한 항목이 없습니다.";
  } else if (completed === total) {
    progressText.textContent = "모든 신청 준비 항목을 확인했습니다.";
  } else {
    progressText.textContent =
      `${completed}개 완료 · ${remaining}개 남음`;
  }
}

/**
 * 저장된 값을 체크박스에 적용합니다.
 */
function restoreChecklist() {
  const completedIds = new Set(readSavedChecklist());

  checkboxes.forEach((checkbox) => {
    checkbox.checked = completedIds.has(checkbox.dataset.checkId);
  });

  updateProgress();
}

/**
 * 체크박스 변경을 처리합니다.
 *
 * @param {Event} event
 */
function handleChecklistChange(event) {
  const checkbox = event.currentTarget;

  saveChecklist();
  updateProgress();

  const label = checkbox
    .closest(".check-item")
    ?.querySelector("strong")
    ?.textContent
    ?.trim();

  if (!label) {
    return;
  }

  liveMessage.textContent = checkbox.checked
    ? `${label} 항목을 완료했습니다.`
    : `${label} 항목의 완료 표시를 해제했습니다.`;
}

/**
 * 체크리스트를 초기 상태로 되돌립니다.
 */
function resetChecklist() {
  const shouldReset = window.confirm(
    "체크한 모든 항목을 초기화할까요?"
  );

  if (!shouldReset) {
    return;
  }

  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("저장된 체크리스트를 삭제하지 못했습니다.", error);
  }

  updateProgress();

  liveMessage.textContent = "체크리스트를 초기화했습니다.";

  const firstCheckbox = checkboxes[0];

  if (firstCheckbox) {
    firstCheckbox.focus();
  }
}

/**
 * 브라우저 인쇄 창을 엽니다.
 * 사용자는 인쇄 창에서 PDF로 저장할 수 있습니다.
 */
function printKit() {
  window.print();
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", handleChecklistChange);
});

printButtons.forEach((button) => {
  button.addEventListener("click", printKit);
});

resetButton?.addEventListener("click", resetChecklist);

restoreChecklist();