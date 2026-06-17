import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";

// 혜택 정보의 타입 구조를 선언합니다 (어떤 정보가 들어있는지 정의)
interface BenefitInfo {
  id: number;
  category: string;
  title: string;
  description: string;
  amount: string;
  target: string;
  link: string;
  period?: string;
  method?: string;
  detail?: string;
}

// Next.js 15+ 규격에 맞춰 params의 타입 구조를 정의합니다 (비동기 처리 필수)
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: PageProps) {
  // 1. Next.js의 약속에 따라 주소창에 들어온 id 값을 안전하게 받아옵니다.
  const { id } = await params;
  
  let benefit: BenefitInfo | undefined;
  let errorMessage = "";

  try {
    // 2. 정보가 저장된 JSON 파일의 경로를 잡습니다.
    const filePath = path.join(process.cwd(), "public", "data", "local-info.json");
    
    // 3. 파일 데이터를 읽어오고 파싱합니다.
    const fileData = await fs.readFile(filePath, "utf-8");
    const benefits: BenefitInfo[] = JSON.parse(fileData);
    
    // 4. 주소창의 id와 일치하는 지원금 정보를 찾습니다.
    benefit = benefits.find((item) => item.id === Number(id));
  } catch (error) {
    console.error("데이터 파일 로딩 실패:", error);
    errorMessage = "지원금 상세 정보를 불러오는 도중 문제가 발생했습니다. 데이터 파일이 깨지지 않았는지 확인해 주세요!";
  }

  // 데이터베이스/파일 에러가 발생한 경우 보여줄 에러 안내 상자
  if (errorMessage) {
    return (
      <div className="main-wrapper">
        <header className="main-header">
          <div className="container">
            <span className="badge-gov">GOVERNMENT 24</span>
            <h1 className="header-title">⚠️ 데이터 로딩 오류</h1>
          </div>
        </header>
        <main className="content-container container">
          <div className="error-box">
            <h2>⚠️ 정보를 불러오지 못했어요</h2>
            <p className="error-description">{errorMessage}</p>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <Link href="/" className="back-list-btn">
                ◀ 목록으로 돌아가기
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 만약 1번부터 5번 이외에 없는 번호를 강제로 치고 들어왔을 때 404 안내
  if (!benefit) {
    notFound();
  }

  // 카테고리별로 알록달록한 배경색 클래스를 적용합니다 (메인 페이지 테마 연동)
  let categoryClass = "badge-neutral";
  if (benefit.category === "청년") categoryClass = "badge-youth";
  else if (benefit.category === "중장년") categoryClass = "badge-middle";
  else if (benefit.category === "가족") categoryClass = "badge-family";
  else if (benefit.category === "생활") categoryClass = "badge-life";
  else if (benefit.category === "주거") categoryClass = "badge-housing";

  return (
    <div className="main-wrapper">
      {/* 상단 파란색 헤더 영역 */}
      <header className="main-header">
        <div className="container">
          <span className="badge-gov">GOVERNMENT 24</span>
          <h1 className="header-title">📋 맞춤형 혜택 상세 정보</h1>
          <p className="header-subtitle">
            정부와 지자체에서 제공하는 든든한 맞춤 혜택의 자격 요건과 신청 방법을 꼼꼼히 확인해 보세요!
          </p>
        </div>
      </header>

      {/* 본문 콘텐츠 영역 (중앙으로 정렬하고 깔끔하게 여백을 조절) */}
      <main className="content-container container" style={{ maxWidth: "800px" }}>
        <div className="detail-card">
          
          {/* 뱃지와 혜택 번호 */}
          <div className="detail-top">
            <span className={`category-badge ${categoryClass}`}>
              {benefit.category}
            </span>
            <span className="detail-id">Benefit No. 0{benefit.id}</span>
          </div>

          {/* 1. 지원금/혜택 이름 (크게 타이틀로) */}
          <h2 className="detail-title">{benefit.title}</h2>
          
          {/* 한 줄 소개 요약 */}
          <p className="detail-summary">{benefit.description}</p>

          <hr className="divider" />

          {/* 2. 지원 금액, 지원 대상, 신청 기간, 장소/방법 핵심 정보 그리드 */}
          <div className="detail-info-grid">
            
            {/* 지원 혜택 금액 (노란색 강조 테마) */}
            <div className="info-item highlight-yellow">
              <span className="info-label">💰 지원 혜택 / 금액</span>
              <span className="info-value">{benefit.amount}</span>
            </div>

            {/* 지원 대상 */}
            <div className="info-item">
              <span className="info-label">🙋‍♂️ 지원 대상</span>
              <span className="info-value-normal">{benefit.target}</span>
            </div>

            {/* 신청 기간 */}
            <div className="info-item">
              <span className="info-label">📅 신청 기간</span>
              <span className="info-value-normal">{benefit.period || "상시 신청 가능"}</span>
            </div>

            {/* 신청 장소/방법 */}
            <div className="info-item">
              <span className="info-label">📍 신청 장소 / 방법</span>
              <span className="info-value-normal">{benefit.method || "온라인 신청 혹은 관할 주민센터 방문"}</span>
            </div>

          </div>

          <hr className="divider" />

          {/* 3. 상세 설명 전문 */}
          <div className="detail-description-section">
            <h3 className="section-title">🔍 상세 설명 안내</h3>
            <p className="detail-text">{benefit.detail || "상세 설명 내용이 아직 등록되지 않았습니다."}</p>
          </div>

          {/* 4. 버튼 영역 */}
          <div className="detail-actions">
            
            {/* 원래 주소로 이동하는 버튼 ("자세히 보기 ➔" 역할을 외부 공식 사이트 이동으로 연결) */}
            <a
              href={benefit.link}
              target="_blank"
              rel="noopener noreferrer"
              className="external-action-btn"
            >
              공식 홈페이지에서 자세히 보기 & 신청하기 &rarr;
            </a>

            {/* 메인 화면으로 돌아오는 목록 버튼 */}
            <Link href="/" className="back-list-btn">
              ◀ 목록으로 돌아가기
            </Link>

          </div>

        </div>
      </main>

      {/* 하단 푸터 영역 */}
      <footer className="main-footer">
        <div className="container">
          <p>© 2026 정부24 숨은 지원금 및 혜택 안내소. All rights reserved.</p>
          <p className="footer-warning">본 페이지는 맞춤형 정보를 알기 쉽게 제공하는 가이드 웹사이트입니다.</p>
        </div>
      </footer>
    </div>
  );
}
