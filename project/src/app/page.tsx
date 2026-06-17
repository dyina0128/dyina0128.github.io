import fs from "fs/promises";
import path from "path";
import Link from "next/link";

// 혜택 정보의 구조를 정의합니다 (어떤 정보들이 들어있는지 정의)
interface BenefitInfo {
  id: number;
  category: string;
  title: string;
  description: string;
  amount: string;
  target: string;
  link: string;
}

export default async function Home() {
  let benefits: BenefitInfo[] = [];
  let errorMessage = "";

  try {
    // 1. 정보가 저장된 JSON 파일의 경로를 잡습니다.
    const filePath = path.join(process.cwd(), "public", "data", "local-info.json");
    
    // 2. 파일을 컴퓨터 메모리로 읽어옵니다.
    const fileData = await fs.readFile(filePath, "utf-8");
    
    // 3. 읽어온 글자 데이터를 진짜 다룰 수 있는 컴퓨터 데이터(배열)로 변환합니다.
    benefits = JSON.parse(fileData);
  } catch (error) {
    console.error("데이터 파일 로딩 실패:", error);
    errorMessage = "지원금 정보 창고(local-info.json)를 열어보는 도중 에러가 발생했습니다. public/data/local-info.json 파일이 올바르게 존재하는지, 혹은 파일 안에 적힌 텍스트의 따옴표나 괄호가 깨지지 않았는지 확인해 주세요!";
  }

  return (
    <div className="main-wrapper">
      {/* 상단 파란색 헤더 영역 */}
      <header className="main-header">
        <div className="container">
          <span className="badge-gov">GOVERNMENT 24</span>
          <h1 className="header-title">💰 정부24 숨은 지원금·혜택 찾기</h1>
          <p className="header-subtitle">
            전국에서 제공하는 든든한 맞춤형 복지 서비스 5가지를 한눈에 확인하고 지금 바로 신청해 보세요!
          </p>
        </div>
      </header>

      {/* 본문 콘텐츠 영역 */}
      <main className="content-container container">
        {errorMessage ? (
          /* 에러가 발생했을 때 초보자에게 알기 쉽게 보여주는 에러 안내 상자 */
          <div className="error-box">
            <h2>⚠️ 앗! 정보를 불러오지 못했어요</h2>
            <p className="error-description">{errorMessage}</p>
            <div className="error-guide">
              <strong>🛠️ 수석 개발자의 긴급 해결 팁:</strong>
              <ol>
                <li><code>public/data/local-info.json</code> 파일 경로가 맞는지 확인합니다.</li>
                <li>JSON 파일 내부 구조가 올바른 형식(대괄호 <code>[]</code>와 중괄호 <code>{}</code> 쌍이 잘 맞는지)인지 점검해 주세요.</li>
              </ol>
            </div>
          </div>
        ) : (
          /* 에러 없이 정상적으로 정보를 읽어왔을 때 보여줄 카드 그리드 */
          <div className="benefits-grid">
            {benefits.map((item) => {
              // 카테고리별로 알록달록한 배경색 클래스를 적용합니다.
              let categoryClass = "badge-neutral";
              if (item.category === "청년") categoryClass = "badge-youth";
              else if (item.category === "중장년") categoryClass = "badge-middle";
              else if (item.category === "가족") categoryClass = "badge-family";
              else if (item.category === "생활") categoryClass = "badge-life";
              else if (item.category === "주거") categoryClass = "badge-housing";

              return (
                <div key={item.id} className="benefit-card">
                  {/* 카테고리 뱃지 */}
                  <div className="card-top">
                    <span className={`category-badge ${categoryClass}`}>
                      {item.category}
                    </span>
                    <span className="card-id">No. 0{item.id}</span>
                  </div>

                  {/* 혜택 제목 */}
                  <h3 className="card-title">{item.title}</h3>

                  {/* 혜택 상세 설명 */}
                  <p className="card-description">{item.description}</p>

                  {/* 핵심 혜택 금액/내용 박스 (노란색 강조) */}
                  <div className="amount-highlight">
                    <span className="amount-label">지원 혜택</span>
                    <span className="amount-value">{item.amount}</span>
                  </div>

                  {/* 대상자 안내 */}
                  <div className="target-info">
                    <span className="target-icon">🙋‍♂️ 대상</span>
                    <p className="target-text">{item.target}</p>
                  </div>

                  {/* 상세 페이지 이동 버튼 */}
                  <Link
                    href={`/detail/${item.id}`}
                    className="card-action-btn"
                  >
                    자세히 보기 & 신청하기 &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        )}
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
