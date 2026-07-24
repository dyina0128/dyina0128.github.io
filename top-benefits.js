(function(){
"use strict";
var data=Array.isArray(window.BENEFITS_DATA)?window.BENEFITS_DATA:[];
var categoryWeights={"청년":10,"주거":10,"교육":8,"출산·육아":8,"어르신":8,"자동차":6,"문화":6,"에너지":6};
var categoryAliases={"출산":"출산·육아","노인":"어르신","지역 안내":"지역 안내"};
var query=document.getElementById("topQuery"),category=document.getElementById("topCategory"),region=document.getElementById("topRegion"),hero=document.getElementById("topHero"),list=document.getElementById("topList"),count=document.getElementById("topCount"),empty=document.getElementById("topEmpty");

/* Future extension point: replace this neutral result with verified clickCount,
   viewCount or gaPopularity signals. No analytics statistics are used today. */
function getPopularitySignals(){return{score:0,reasons:[]}}
function calculateTopScore(benefit){
 var score=0,reasons=[];
 if(benefit.featured){score+=40;reasons.push("대표 지원사업")}
 if(benefit.region==="전국"){score+=20;reasons.push("전국 공통")}
 if(benefit.applicationType==="상시"||benefit.applicationStatus==="상시 신청"){score+=15;reasons.push("상시 신청 정보")}
 if(benefit.applicationStatus==="신청 가능"){score+=15;reasons.push("신청 가능 상태")}
 var weight=categoryWeights[benefit.category]||0;if(weight){score+=weight;reasons.push(benefit.category+" 분야")}
 if(benefit.category==="지역 안내"){score-=20}
 else if(benefit.url){score+=10;reasons.push("상세 안내 페이지 제공")}
 var signals=getPopularitySignals(benefit);score+=signals.score;reasons=reasons.concat(signals.reasons);
 return{score:score,reasons:reasons.slice(0,4)}
}
function normalize(v){return String(v||"").toLocaleLowerCase("ko-KR").replace(/\s+/g,"").trim()}
function text(b){return normalize([b.title,b.region,b.district,b.category,(b.targetGroups||[]).join(" "),(b.keywords||[]).join(" ")].join(" "))}
function filteredData(){var q=normalize(query.value),cat=categoryAliases[category.value]||category.value,reg=region.value;return data.filter(function(b){return(!q||text(b).indexOf(q)!==-1)&&(!cat||b.category===cat)&&(!reg||b.region===reg)})}
function ranked(items){return items.map(function(b){var result=calculateTopScore(b);return{benefit:b,score:result.score,reasons:result.reasons}}).sort(function(a,b){return b.score-a.score||a.benefit.title.localeCompare(b.benefit.title,"ko-KR")})}
function escapeHtml(v){return String(v||"").replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function recommendationLabel(b){if(b.applicationStatus==="신청 가능")return"이번 달 추천";if(b.applicationType==="상시"||b.applicationStatus==="상시 신청")return"상시 추천";return"공고 확인 필요"}
function card(item,rank,compact){var b=item.benefit,reasons=item.reasons.length?item.reasons:["공식 공고 확인이 필요한 지원정보"];return'<article class="top-card'+(compact?' compact':'')+'"><div class="top-rank"><strong>'+rank+'위</strong><span>TOP'+rank+'</span></div><div class="top-badges"><span>'+escapeHtml(b.category)+'</span><span>'+escapeHtml(b.district||b.region)+'</span><span>'+escapeHtml(b.applicationStatus||"공고 확인")+'</span><span>'+escapeHtml(recommendationLabel(b))+'</span></div><h3>'+escapeHtml(b.title)+'</h3><p>'+escapeHtml(b.summary)+'</p><div class="top-reasons"><strong>추천 이유</strong><ul>'+reasons.map(function(r){return'<li>'+escapeHtml(r)+'</li>'}).join("")+'</ul></div>'+(b.url?'<a href="'+encodeURI(b.url)+'">자세히 보기</a>':'')+'</article>'}
function renderCategoryTops(){var configs=[{id:"youthTop",words:["청년"]},{id:"housingTop",words:["주거","월세","전세"]},{id:"birthTop",words:["출산","육아","임신"]},{id:"elderTop",words:["어르신","노인","기초연금"]},{id:"autoTop",words:["자동차","전기차"]}];configs.forEach(function(config){var related=data.filter(function(b){var hay=text(b);return config.words.some(function(w){return hay.indexOf(normalize(w))!==-1})&&b.category!=="지역 안내"});var top=ranked(related).slice(0,3);document.getElementById(config.id).innerHTML=top.map(function(item,i){return card(item,i+1,true)}).join("")||'<p class="top-no-data">관련 상세 지원정보가 아직 없습니다.</p>'})}
function render(){var top=ranked(filteredData()).slice(0,10);count.textContent="총 "+top.length+"개의 추천 지원정보를 표시합니다.";empty.hidden=top.length!==0;hero.innerHTML=top.length?'<div class="top-hero-label">🥇 오늘의 추천</div>'+card(top[0],1,false):"";list.innerHTML=top.slice(1).map(function(item,i){return card(item,i+2,false)}).join("");renderCategoryTops()}
[category,region].forEach(function(x){x.addEventListener("change",render)});var timer;query.addEventListener("input",function(){clearTimeout(timer);timer=setTimeout(render,200)});
window.TopBenefits={calculateTopScore:calculateTopScore,ranked:ranked,recommendationLabel:recommendationLabel,getPopularitySignals:getPopularitySignals};render()
}());
