(function(){
"use strict";
var data=Array.isArray(window.BENEFITS_DATA)?window.BENEFITS_DATA:[];
var params=new URLSearchParams(location.search),selectedA=null,selectedB=null;
var inputA=document.getElementById("compareA"),inputB=document.getElementById("compareB"),suggestA=document.getElementById("suggestA"),suggestB=document.getElementById("suggestB"),tableBody=document.getElementById("compareTableBody"),commonList=document.getElementById("compareCommonList"),differenceList=document.getElementById("compareDifferenceList"),situationList=document.getElementById("compareSituationList"),similarList=document.getElementById("compareSimilarList"),live=document.getElementById("compareLive"),empty=document.getElementById("compareEmpty"),content=document.getElementById("compareContent");
function normalize(v){return String(v||"").toLocaleLowerCase("ko-KR").replace(/\s+/g,"").trim()}
function searchable(b){return normalize([b.title,b.category,b.region,b.district,(b.targetGroups||[]).join(" "),(b.keywords||[]).join(" ")].join(" "))}
function resolve(value){var q=normalize(value);if(!q)return null;return data.find(function(b){return normalize(b.title)===q})||data.find(function(b){return(b.keywords||[]).some(function(k){return normalize(k)===q})})||null}
function escapeHtml(v){return String(v||"").replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function missingText(value,fallback){return value===null||value===undefined||value===""?fallback:value}
function ageText(b){var min=b.ageMin===""||b.ageMin==null?null:Number(b.ageMin),max=b.ageMax===""||b.ageMax==null?null:Number(b.ageMax);if(min===null&&max===null)return"정보 없음";if(min!==null&&max!==null)return"만 "+min+"~"+max+"세";if(min!==null)return"만 "+min+"세 이상";return"만 "+max+"세 이하"}
function periodText(b){if(b.applicationStart&&b.applicationEnd)return b.applicationStart+" ~ "+b.applicationEnd;if(b.applicationStart)return b.applicationStart+"부터";if(b.applicationEnd)return b.applicationEnd+"까지";return"공식 공고 확인"}
function targetText(b){return b.targetGroups&&b.targetGroups.length?b.targetGroups.join(" · "):"정보 없음"}
function employmentText(b){return b.employment&&b.employment.length?b.employment.join(" · "):"정보 없음"}
function cell(value,missing){return{text:String(value),html:escapeHtml(value),missing:Boolean(missing)}}
function linkCell(b){return b.url?{text:b.url,html:'<a href="'+encodeURI(b.url)+'">상세페이지 열기</a>',missing:false}:cell("정보 없음",true)}
function row(label,a,b){var same=normalize(a.text)===normalize(b.text),classA=a.missing?"compare-missing":same?"compare-same":"compare-different",classB=b.missing?"compare-missing":same?"compare-same":"compare-different";return'<tr><th scope="row">'+escapeHtml(label)+'</th><td class="'+classA+'" data-label="지원금 A">'+a.html+'</td><td class="'+classB+'" data-label="지원금 B">'+b.html+'</td></tr>'}
function intersection(a,b){return a.filter(function(value){return b.indexOf(value)!==-1}).filter(function(value,index,array){return array.indexOf(value)===index})}
function buildComparison(a,b){
 var rows=[
  ["지원금명",cell(a.title),cell(b.title)],["분야",cell(a.category),cell(b.category)],["지역",cell(a.district||a.region),cell(b.district||b.region)],
  ["대상",cell(targetText(a),targetText(a)==="정보 없음"),cell(targetText(b),targetText(b)==="정보 없음")],["연령",cell(ageText(a),ageText(a)==="정보 없음"),cell(ageText(b),ageText(b)==="정보 없음")],
  ["고용상태",cell(employmentText(a),employmentText(a)==="정보 없음"),cell(employmentText(b),employmentText(b)==="정보 없음")],["신청상태",cell(missingText(a.applicationStatus,"공식 공고 확인"),!a.applicationStatus),cell(missingText(b.applicationStatus,"공식 공고 확인"),!b.applicationStatus)],
  ["신청기간",cell(periodText(a),!a.applicationStart&&!a.applicationEnd),cell(periodText(b),!b.applicationStart&&!b.applicationEnd)],["지원내용 요약",cell(missingText(a.summary,"정보 없음"),!a.summary),cell(missingText(b.summary,"정보 없음"),!b.summary)],
  ["공식확인",cell(missingText(a.officialSource,"공식 공고 확인"),!a.officialSource),cell(missingText(b.officialSource,"공식 공고 확인"),!b.officialSource)],["상세페이지",linkCell(a),linkCell(b)]
 ];
 var common=[],differences=[],targets=intersection(a.targetGroups||[],b.targetGroups||[]);
 if(a.category===b.category)common.push("두 제도 모두 "+a.category+" 분야입니다.");
 if(a.region===b.region)common.push("두 제도 모두 "+a.region+" 지역 기준입니다.");
 targets.forEach(function(t){common.push("두 제도 모두 "+t+" 대상과 관련됩니다.")});
 if(!a.applicationStart&&!a.applicationEnd&&!b.applicationStart&&!b.applicationEnd)common.push("두 제도 모두 신청기간 공식 확인이 필요합니다.");
 if(a.category!==b.category)differences.push("분야가 다릅니다: A는 "+a.category+", B는 "+b.category+"입니다.");
 if((a.district||a.region)!==(b.district||b.region))differences.push("지역 기준이 다릅니다: A는 "+(a.district||a.region)+", B는 "+(b.district||b.region)+"입니다.");
 if(normalize(targetText(a))!==normalize(targetText(b)))differences.push("표시된 대상 구성이 서로 다릅니다.");
 if(a.applicationStatus!==b.applicationStatus)differences.push("현재 데이터의 신청 상태가 서로 다릅니다.");
 if(!differences.length)differences.push("현재 데이터에서 주요 비교 값이 같거나 유사합니다.");
 var situations=[];intersection(a.targetGroups||[],b.targetGroups||[]).slice(0,2).forEach(function(t){situations.push(t+" 대상 지원을 찾는 경우 함께 확인해볼 만합니다.")});
 if(a.category===b.category)situations.push(a.category+" 분야의 여러 선택지를 비교할 때 참고할 만합니다.");else situations.push(a.category+"와 "+b.category+" 분야를 함께 살펴볼 때 참고할 만합니다.");
 situations.push("두 사업의 대상과 신청요건은 다를 수 있으므로 공식 공고를 확인하세요.");
 return{rows:rows,common:common.length?common:["현재 데이터에서 명확한 공통점을 찾지 못했습니다."],differences:differences,situations:situations}
}
function keywordSignals(b){var signals=[],stop=["지원","지원금","안내","가이드","혜택","제도"];(b.keywords||[]).forEach(function(keyword){var whole=normalize(keyword);if(stop.indexOf(whole)===-1)signals.push(whole);String(keyword).split(/\s+/).forEach(function(token){token=normalize(token);if(token.length>=2&&stop.indexOf(token)===-1)signals.push(token)})});return signals.filter(function(value,index,array){return value&&array.indexOf(value)===index})}
function similarBenefits(a,b){var baseSignals=keywordSignals(a).concat(keywordSignals(b)),baseTargets=(a.targetGroups||[]).concat(b.targetGroups||[]);return data.filter(function(x){return x.id!==a.id&&x.id!==b.id&&x.category!=="지역 안내"}).map(function(x){var score=(x.category===a.category||x.category===b.category?3:0),shared=intersection(keywordSignals(x),baseSignals),sharedTargets=intersection(x.targetGroups||[],baseTargets);score+=shared.length*2+sharedTargets.length;return{benefit:x,score:score}}).filter(function(x){return x.score>0}).sort(function(a,b){return b.score-a.score||a.benefit.title.localeCompare(b.benefit.title,"ko-KR")}).slice(0,5)}
function listHtml(items){return items.map(function(x){return'<li>'+escapeHtml(x)+'</li>'}).join("")}
function renderSimilar(items){similarList.innerHTML=items.map(function(item){var b=item.benefit;return'<article><span>'+escapeHtml(b.category)+' · '+escapeHtml(b.district||b.region)+'</span><h3>'+escapeHtml(b.title)+'</h3><p>'+escapeHtml(b.summary)+'</p><a href="'+encodeURI(b.url)+'">자세히 보기</a></article>'}).join("")||'<p>관련 지원정보가 없습니다.</p>'}
function updateUrl(){var p=new URLSearchParams();if(selectedA)p.set("a",selectedA.title);if(selectedB)p.set("b",selectedB.title);history.replaceState(null,"",location.pathname+(p.toString()?"?"+p.toString():""))}
function render(){if(!selectedA||!selectedB){content.hidden=true;empty.hidden=false;live.textContent="두 지원금을 선택해 주세요.";updateUrl();return}var result=buildComparison(selectedA,selectedB);tableBody.innerHTML=result.rows.map(function(r){return row(r[0],r[1],r[2])}).join("");commonList.innerHTML=listHtml(result.common);differenceList.innerHTML=listHtml(result.differences);situationList.innerHTML=listHtml(result.situations);renderSimilar(similarBenefits(selectedA,selectedB));content.hidden=false;empty.hidden=true;live.textContent=selectedA.title+"과 "+selectedB.title+" 비교 결과를 표시합니다.";updateUrl()}
function suggestions(input,target,side){var q=normalize(input.value);if(!q){target.innerHTML="";return}var matches=data.filter(function(b){return searchable(b).indexOf(q)!==-1}).slice(0,8);target.innerHTML=matches.map(function(b){return'<li><button type="button" data-id="'+escapeHtml(b.id)+'"><strong>'+escapeHtml(b.title)+'</strong><span>'+escapeHtml(b.category)+' · '+escapeHtml(b.district||b.region)+'</span></button></li>'}).join("");Array.from(target.querySelectorAll("button")).forEach(function(button){button.addEventListener("click",function(){var b=data.find(function(x){return x.id===button.dataset.id});if(side==="A"){selectedA=b;inputA.value=b.title}else{selectedB=b;inputB.value=b.title}target.innerHTML="";render()})})}
function bind(input,target,side){var timer;input.addEventListener("input",function(){clearTimeout(timer);timer=setTimeout(function(){suggestions(input,target,side);var exact=resolve(input.value);if(side==="A")selectedA=exact;else selectedB=exact;render()},200)});input.addEventListener("keydown",function(e){if(e.key==="Escape")target.innerHTML=""})}
bind(inputA,suggestA,"A");bind(inputB,suggestB,"B");document.getElementById("compareSwap").addEventListener("click",function(){var temp=selectedA;selectedA=selectedB;selectedB=temp;inputA.value=selectedA?selectedA.title:"";inputB.value=selectedB?selectedB.title:"";render();inputA.focus()});
document.getElementById("popularPairs").addEventListener("click",function(e){var button=e.target.closest("button[data-a]");if(!button)return;selectedA=resolve(button.dataset.a);selectedB=resolve(button.dataset.b);inputA.value=selectedA?selectedA.title:"";inputB.value=selectedB?selectedB.title:"";render();document.getElementById("compareHeading").focus()});
selectedA=resolve(params.get("a"))||resolve("청년월세 지원");selectedB=resolve(params.get("b"))||resolve("주거급여");inputA.value=selectedA.title;inputB.value=selectedB.title;
window.BenefitCompare={resolve:resolve,ageText:ageText,periodText:periodText,buildComparison:buildComparison,similarBenefits:similarBenefits};render()
}());
