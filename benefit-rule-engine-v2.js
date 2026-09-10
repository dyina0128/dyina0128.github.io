(function(){
'use strict';
var rules=Array.isArray(window.BENEFIT_RULES_V2)?window.BENEFIT_RULES_V2:[];
var form=document.getElementById('personalBenefitForm'),results=document.getElementById('matchResults'),summary=document.getElementById('profileSummary'),count=document.getElementById('matchCount'),resetBtn=document.getElementById('resetMatcher');
var REGION_DISTRICTS={'서울':['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'],'인천':['강화군','계양구','남동구','동구','미추홀구','부평구','서구','연수구','옹진군','중구'],'부산':['강서구','금정구','기장군','남구','동구','동래구','부산진구','북구','사상구','사하구','서구','수영구','연제구','영도구','중구','해운대구'],'대구':['군위군','남구','달서구','달성군','동구','북구','서구','수성구','중구']};
function esc(v){return String(v||'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function ageFromBirthYear(y){var n=Number(y),now=new Date().getFullYear();if(!Number.isFinite(n)||n<1900||n>now)return null;return now-n;}
function profile(){var fd=new FormData(form);return{birthYear:Number(fd.get('birthYear')),age:ageFromBirthYear(fd.get('birthYear')),region:fd.get('region')||'',district:fd.get('district')||'',household:Number(fd.get('household')||1),spouse:fd.get('spouse')==='yes',children:fd.get('children')==='yes',status:fd.get('status')||'',earners:fd.get('earners')||'',incomeBand:fd.get('incomeBand')||'unknown',housing:fd.get('housing')||''};}
function addMissing(target,text,severity,type){target.push({text:text,severity:severity||'verification',type:type||'eligibility'});}
function evaluate(item,p){var r=item.rules||{},matched=[],failed=[],missing=[];
if(item.region&&item.region!=='전국'){if(p.region===item.region)matched.push(item.region+' 거주');else failed.push('거주지역 불일치');}
if(item.district){if(!p.district)addMissing(missing,'시·군·구 확인','decisive','eligibility');else if(p.district===item.district)matched.push(item.district+' 거주');else failed.push('시·군·구 불일치');}
if(r.ageMin!=null){if(p.age>=r.ageMin)matched.push('최소 연령 충족');else failed.push('연령 기준 미충족');}
if(r.ageMax!=null){if(p.age<=r.ageMax)matched.push('최대 연령 충족');else failed.push('연령 기준 초과');}
if(r.birthYearMin!=null&&p.birthYear<r.birthYearMin)failed.push('출생연도 기준 미충족');
if(r.birthYearMax!=null&&p.birthYear>r.birthYearMax)failed.push('출생연도 기준 미충족');
if((r.birthYearMin!=null||r.birthYearMax!=null)&&failed.indexOf('출생연도 기준 미충족')===-1)matched.push('출생연도 기준 충족');
if(Array.isArray(r.employmentAllowed)&&r.employmentAllowed.indexOf(p.status)===-1)failed.push('현재 경제활동 상태가 대상과 다름');else if(Array.isArray(r.employmentAllowed))matched.push('경제활동 상태 조건 일치');
if(r.unemploymentRequired&&p.status!=='jobseeker'&&p.status!=='other')failed.push('미취업·전직 준비 대상');
if(r.requiresIncomeAssetsCheck)addMissing(missing,'소득·재산 기준 확인','decisive','eligibility');
if(r.exclusionsNeedCheck)addMissing(missing,'세부 제외대상 확인','verification','eligibility');
if(r.needsPublicTransitUse)addMissing(missing,'대중교통 이용 여부 확인','verification','relevance');
if(r.needsEmployerParticipation)addMissing(missing,'회사 참여 여부·기업 유형 확인','decisive','eligibility');
if(r.needsFerryUse)addMissing(missing,'지원 대상 섬 여객선 이용 여부 확인','verification','relevance');
if(r.needsServiceInterest)addMissing(missing,'해당 상담·교육 필요 여부 확인','verification','relevance');
var hasDecisiveMissing=missing.some(function(m){return m.severity==='decisive';});
var hasEligibilityVerification=missing.some(function(m){return m.severity==='verification'&&m.type==='eligibility';});
var hasRelevanceCheck=missing.some(function(m){return m.type==='relevance';});
var status;
if(failed.length)status='ineligible';
else if(item.applicationStatus==='closed')status='closed';
else if(item.automaticEnrollment&&!hasDecisiveMissing&&!hasEligibilityVerification&&!hasRelevanceCheck)status='automatic';
else if(hasDecisiveMissing)status='needs_info';
else if(hasRelevanceCheck)status='conditional_use';
else if(hasEligibilityVerification)status='likely';
else status='likely';
return{item:item,status:status,matched:matched,failed:failed,missing:missing};}
var labels={automatic:'자동 적용 가능',likely:'받을 가능성이 높아요',conditional_use:'이용할 계획이 있다면 확인',needs_info:'추가 정보가 있어야 판단 가능',ineligible:'현재 조건상 제외',closed:'2026 신청 종료·다음 공고 확인'};
var classMap={automatic:'high',likely:'high',conditional_use:'medium',needs_info:'medium',ineligible:'low',closed:'low'};
function card(x){var i=x.item,detail='';if(x.matched.length)detail+='<div class="match-reasons"><strong>맞는 조건</strong><ul>'+x.matched.map(function(v){return'<li>✓ '+esc(v)+'</li>';}).join('')+'</ul></div>';if(x.missing.length)detail+='<div class="match-warning">⚠ '+x.missing.map(function(m){return esc(m.text);}).join(' · ')+'</div>';if(x.failed.length)detail+='<div class="match-warning">✕ '+x.failed.map(esc).join(' · ')+'</div>';return '<article class="match-card match-'+classMap[x.status]+'"><div class="match-top"><span class="match-level">'+labels[x.status]+'</span><span class="match-score">공식기준 기반</span></div><h3>'+esc(i.title)+'</h3><p class="match-meta">'+esc(i.category)+' · '+esc(i.agency)+'</p><p>'+esc(i.summary)+'</p>'+detail+'<p class="match-disclaimer">최종 신청 가능 여부는 공식기관의 최신 공고와 심사에서 결정됩니다.</p>'+(i.officialUrl?'<a class="match-link" href="'+esc(i.officialUrl)+'" target="_blank" rel="noopener">공식정보 확인 →</a>':'')+'</article>';}
function section(title,items){if(!items.length)return'';return '<section class="result-group" style="grid-column:1/-1"><h3 style="margin:8px 0 14px">'+title+'</h3><div class="match-grid">'+items.map(card).join('')+'</div></section>';}
function updateDistricts(){var region=form.elements.region.value,select=form.elements.district,list=REGION_DISTRICTS[region]||[];select.innerHTML='<option value="">시·군·구 선택 안 함</option>'+list.map(function(d){return'<option value="'+esc(d)+'">'+esc(d)+'</option>';}).join('');select.disabled=list.length===0;document.getElementById('districtHelp').textContent=list.length?'선택하면 지역 혜택을 더 정확히 걸러냅니다.':'MVP에서는 일부 광역시만 시·군·구 선택을 지원합니다.';}
function run(e){if(e)e.preventDefault();var p=profile();if(p.age==null||!p.region||!p.status||!p.housing){document.getElementById('formError').textContent='거주지역, 출생연도, 경제활동 상태, 주거형태를 입력해 주세요.';return;}document.getElementById('formError').textContent='';var all=rules.map(function(r){return evaluate(r,p);});var automatic=all.filter(function(x){return x.status==='automatic';});var likely=all.filter(function(x){return x.status==='likely';});var conditionalUse=all.filter(function(x){return x.status==='conditional_use';});var needsInfo=all.filter(function(x){return x.status==='needs_info';});var excluded=all.filter(function(x){return x.status==='ineligible';});var closed=all.filter(function(x){return x.status==='closed';});var shown=automatic.concat(likely,conditionalUse,needsInfo);summary.textContent=p.region+(p.district?' '+p.district:'')+' · '+p.birthYear+'년생 · '+p.household+'인 가구 · '+({employed:'직장인',jobseeker:'구직 중',business:'자영업·소상공인',student:'학생',farmer:'농어업',other:'기타'}[p.status]||p.status)+' · '+({jeonse:'전세',rent:'월세',owner:'자가',other:'기타'}[p.housing]||p.housing);count.innerHTML='<strong>'+shown.length+'개</strong> 확인할 혜택 · 제외 '+excluded.length+'개';results.innerHTML=section('🎁 지금 꼭 확인하세요',automatic)+section('👍 받을 가능성이 높아요',likely)+section('🤔 이용할 계획이 있다면 확인하세요',conditionalUse)+section('📋 추가 정보가 있어야 판단할 수 있어요',needsInfo)+(closed.length?'<details style="grid-column:1/-1"><summary><strong>신청 종료·다음 공고 확인 '+closed.length+'개</strong></summary><div class="match-grid" style="margin-top:14px">'+closed.map(card).join('')+'</div></details>':'')+(excluded.length?'<details style="grid-column:1/-1"><summary><strong>현재 조건상 제외된 혜택 '+excluded.length+'개 보기</strong></summary><div class="match-grid" style="margin-top:14px">'+excluded.map(card).join('')+'</div></details>':'');document.getElementById('resultsSection').hidden=false;document.getElementById('resultsSection').scrollIntoView({behavior:'smooth',block:'start'});window.__LAST_MATCH_V2={profile:p,shown:shown,automatic:automatic,likely:likely,conditionalUse:conditionalUse,needsInfo:needsInfo,closed:closed,excluded:excluded};}
form.addEventListener('submit',run);form.elements.region.addEventListener('change',updateDistricts);resetBtn.addEventListener('click',function(){form.reset();updateDistricts();document.getElementById('resultsSection').hidden=true;results.innerHTML='';});updateDistricts();window.BenefitRuleEngineV2={evaluate:evaluate,ageFromBirthYear:ageFromBirthYear};
}());