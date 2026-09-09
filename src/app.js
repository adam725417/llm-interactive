import { worlds, missions } from './content.js'

const app = document.querySelector('#app')
const TOTAL_PAGES = 8
const state = {
  completed: new Set(JSON.parse(localStorage.getItem('llm-rich-completed') || '[]')),
  answers: JSON.parse(localStorage.getItem('llm-rich-answers') || '{}')
}

const stageClass = {1:'green',2:'blue',3:'sand',4:'lavender'}
const icons = ['🧩','🎚️','🧠','🎓','⚖️','👁️','✍️','🧭','🗂️','🤖','🧰','🛡️']
const save = () => {
  localStorage.setItem('llm-rich-completed', JSON.stringify([...state.completed]))
  localStorage.setItem('llm-rich-answers', JSON.stringify(state.answers))
}
const clamp = (n,a,b)=>Math.max(a,Math.min(b,n))

function route(){
  const h = location.hash || '#/'
  const parts = h.replace(/^#\//,'').split('/').filter(Boolean)
  if(parts[0] === 'mission'){
    const id = Number(parts[1]) || 1
    const page = clamp(Number(parts[2]) || 1, 1, TOTAL_PAGES)
    renderMission(id,page)
    return
  }
  if(parts[0] === 'about') return renderAbout()
  renderHome(parts[0] === 'courses')
}
window.addEventListener('hashchange', route)

function nav(active='home'){
  return `<header class="topbar"><div class="shell nav">
    <a class="brand" href="#/"><span class="leafmark">☘</span><span><b>LLM 學習站</b><small>用白話，陪你學 AI</small></span></a>
    <nav class="navlinks">
      <a class="${active==='home'?'active':''}" href="#/">首頁</a>
      <a class="${active==='courses'?'active':''}" href="#/courses">課程</a>
      <a class="${active==='about'?'active':''}" href="#/about">關於</a>
    </nav>
  </div></header>`
}

function renderHome(scrollCourses=false){
  const done = missions.filter(m=>state.completed.has(m.id)).length
  const next = missions.find(m=>!state.completed.has(m.id)) || missions[0]
  app.innerHTML = `${nav(scrollCourses?'courses':'home')}
  <main>
    <section class="home-hero">
      <div class="shell hero-grid">
        <div class="hero-copy">
          <span class="scribble">不只聽懂，還要真的懂原理。</span>
          <h1>用白話學懂 <em>LLM</em></h1>
          <p>畫面保持簡單，<br>內容慢慢往深處走。</p>
          <div class="hero-actions">
            <a class="button primary" href="#/mission/${next.id}/1">${done ? '繼續學習' : '開始學習'} <span>→</span></a>
            <a class="button secondary" href="#/courses">看看課程</a>
          </div>
          <div class="tiny-progress"><span>${done}/12 已完成</span><i><b style="width:${done/12*100}%"></b></i></div>
        </div>
        <div class="hero-art-wrap">
          <div class="sticky sticky-a">白話</div><div class="sticky sticky-b">原理</div><div class="sticky sticky-c">實作</div>
          <img class="hero-art" src="./assets/hero-desk.webp" alt="可愛機器人與筆電的學習桌插畫">
        </div>
      </div>
    </section>

    <section class="stage-section"><div class="shell">
      <div class="stage-grid">
        ${worlds.map(w=>`<article class="stage-card ${stageClass[w.id]}">
          <span class="stage-icon">${w.icon}</span><div><b>${w.id}. ${w.title}</b><small>${w.subtitle}</small></div>
        </article>`).join('')}
      </div>
    </div></section>

    <section class="courses-section" id="courses"><div class="shell course-layout">
      <div class="courses-main">
        <div class="section-title"><div><span>🌱</span><h2>12 堂課，從大觀念一路走到系統設計</h2></div><p>每課 8 個短畫面，不把資訊塞在同一頁。</p></div>
        <div class="course-grid">${missions.map(m=>courseCard(m)).join('')}</div>
      </div>
      <aside class="cat-note">
        <p>內容變深了，<br><strong>畫面還是要留白。</strong></p>
        <img src="./assets/cat-study.webp" alt="趴在書上的貓插畫">
        <small>白話 → 原理 → 動手試 → 工作案例 → 小測驗。</small>
      </aside>
    </div></section>
  </main>${footer()}`
  if(scrollCourses) requestAnimationFrame(()=>document.querySelector('#courses')?.scrollIntoView({behavior:'smooth',block:'start'}))
}

function courseCard(m){
  return `<a class="course-card ${stageClass[m.world]}" href="#/mission/${m.id}/1">
    <span class="course-num">${String(m.id).padStart(2,'0')}</span>
    <span class="course-symbol">${icons[m.id-1]}</span>
    <b>${m.shortTitle}</b><span class="chev">›</span>
    ${state.completed.has(m.id)?'<i class="done-dot">✓</i>':''}
  </a>`
}

function renderMission(id,page){
  const m = missions.find(x=>x.id===id) || missions[0]
  const w = worlds.find(x=>x.id===m.world)
  const prevMission = missions.find(x=>x.id===m.id-1)
  const nextMission = missions.find(x=>x.id===m.id+1)
  const lessonPct = (m.id-1 + (page-1)/TOTAL_PAGES) / missions.length * 100

  app.innerHTML = `${nav('courses')}
  <main class="lesson-page"><div class="shell lesson-shell">
    <div class="lesson-meta">
      <a href="#/">首頁</a><span>›</span><a href="#/courses">課程</a><span>›</span><b>第 ${m.id} 課</b>
      <div class="lesson-progress"><strong>${m.id} / 12</strong><i><b style="width:${lessonPct}%"></b></i></div>
    </div>
    ${lessonSlide(m,w,page)}
    <div class="slide-nav">
      <div class="page-dots">${Array.from({length:TOTAL_PAGES},(_,i)=>i+1).map(n=>`<a class="${n===page?'active':''}" href="#/mission/${m.id}/${n}" aria-label="第 ${n} 頁"></a>`).join('')}<span>${page} / ${TOTAL_PAGES}</span></div>
      <div class="slide-buttons">
        ${page>1 ? `<a class="button secondary" href="#/mission/${m.id}/${page-1}">← 上一頁</a>` : prevMission ? `<a class="button secondary" href="#/mission/${prevMission.id}/${TOTAL_PAGES}">← 上一課</a>` : `<a class="button secondary" href="#/">← 首頁</a>`}
        ${page<TOTAL_PAGES ? `<a class="button primary" href="#/mission/${m.id}/${page+1}">下一頁 →</a>` : nextMission ? `<a class="button primary" href="#/mission/${nextMission.id}/1">下一課 →</a>` : `<a class="button primary" href="#/">完成課程 →</a>`}
      </div>
    </div>
  </div></main>`

  if(page===5) bindLab(m)
  if(page===7 || page===8) bindQuiz(m,page===7?0:1)
  bindKeyboard(m.id,page,prevMission,nextMission)
  window.scrollTo({top:0,behavior:'instant'})
}

function lessonSlide(m,w,page){
  const badge = `<span class="lesson-badge ${stageClass[m.world]}">${w.icon} ${w.title}</span>`
  if(page===1) return `<section class="lesson-slide intro-slide">
    <div class="intro-copy">${badge}<span class="lesson-no">LESSON ${String(m.id).padStart(2,'0')}</span><h1>${m.title}</h1><p>${m.subtitle}</p>
      <div class="big-idea"><small>先用一句話懂</small><strong>${m.idea}</strong></div>
    </div>
    <div class="intro-art"><div class="robot-bubble">先懂大方向。<br>名詞等一下再補。</div><img src="./assets/lesson-robot.webp" alt="機器人坐在筆電前的插畫"></div>
  </section>`

  if(page===2) return `<section class="lesson-slide story-slide">
    <div class="slide-kicker">02 · 生活裡的例子</div>
    <div class="story-grid"><div><h1>${m.storyTitle}</h1><p>${m.story}</p></div><div class="story-visual ${stageClass[m.world]}">${storyVisual(m.id)}</div></div>
    <div class="talk-note">「先有生活直覺，再回頭看技術，就不會只剩名詞。」</div>
  </section>`

  if(page===3) return `<section class="lesson-slide process-slide">
    <div class="slide-kicker">03 · 先把流程看懂</div><h1>事情其實就這幾步</h1>
    <div class="flow-grid">${m.flow.map((x,i)=>`<div class="flow-card ${stageClass[m.world]}"><span>${i+1}</span><b>${x}</b></div>${i<3?'<i>→</i>':''}`).join('')}</div>
    <div class="remember-box"><span>這頁只記 2 件事</span><div><p><b>1</b>${m.remember[0]}</p><p><b>2</b>${m.remember[1]}</p></div></div>
  </section>`

  if(page===4) return `<section class="lesson-slide deep-slide">
    <div class="slide-kicker">04 · 再多懂一點</div><h1>${m.deep.title}</h1><p class="deep-lead">${m.deep.lead}</p>
    <div class="term-grid">${m.deep.terms.map((t,i)=>`<article class="term-card ${stageClass[m.world]}"><span>0${i+1}</span><b>${t.term}</b><p>${t.say}</p></article>`).join('')}</div>
    <div class="caution-note"><b>容易搞混：</b>${m.deep.note}</div>
  </section>`

  if(page===5) return `<section class="lesson-slide lab-slide">
    <div class="slide-kicker">05 · 動手試試</div><h1>${m.lab.title}</h1><p class="lab-intro">${m.lab.instruction}</p>
    <div class="lab-stage ${stageClass[m.world]}" id="labStage">${labVisual(m)}</div>
  </section>`

  if(page===6) return `<section class="lesson-slide business-slide">
    <div class="slide-kicker">06 · 放到工作現場</div>
    <div class="business-grid"><div><h1>${m.business.title}</h1><p>${m.business.scenario}</p><div class="takeaway"><span>帶走這句</span><b>${m.business.takeaway}</b></div></div>
    <div class="business-board"><span>WORK<br>CASE</span><div>${businessVisual(m.id)}</div></div></div>
  </section>`

  const qi = page===7?0:1
  const q = m.quiz[qi]
  const key = `${m.id}-${qi}`
  const answered = state.answers[key]
  return `<section class="lesson-slide quiz-slide">
    <div class="slide-kicker">${page===7?'07':'08'} · 小測驗</div>
    <div class="quiz-card"><span class="quiz-count">Q${qi+1} / 2</span><h1>${q.q}</h1>
      <div class="quiz-options">${q.options.map((o,i)=>`<button class="quiz-option ${answered!==undefined ? (i===q.answer?'correct':i===answered?'wrong':'') : ''}" data-answer="${i}" ${answered!==undefined?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${o}${answered!==undefined && i===q.answer?'<i>✓</i>':''}</button>`).join('')}</div>
      <div class="quiz-feedback ${answered!==undefined?'show':''}" id="quizFeedback">${answered!==undefined ? (answered===q.answer?'答對了！ ':'再想一下也沒關係。 ') + q.explain : ''}</div></div>
    ${page===8?`<div class="lesson-complete ${state.completed.has(m.id)?'show':''}" id="lessonComplete"><span>🌿</span><div><b>這一課完成了</b><p>你已經從白話一路走到原理和實作。</p></div></div>`:''}
  </section>`
}

function storyVisual(id){
  const visuals = {
    1:`<div class="phone-demo"><small>手機選字</small><div class="input-line">會議延到下午三點，請大家 <b>__</b></div><div class="chips"><span>準時</span><span>注意</span><span>確認</span></div></div>`,
    2:`<div class="choice-demo"><small>今天喝什麼？</small><div><span>珍奶 70%</span><b style="width:70%"></b></div><div><span>紅茶 20%</span><b style="width:20%"></b></div><div><span>檸檬汁 10%</span><b style="width:10%"></b></div></div>`,
    3:`<div class="attention-story"><div class="sentence-chip">伺服器連不上資料庫，所以工程師重啟了 <b>它</b></div><div class="attention-lines"><span>Query：它在找誰？</span><i>⇢</i><strong>伺服器</strong></div></div>`,
    4:`<div class="learn-demo"><span>📚 大量閱讀</span><i>→</i><span>👩‍🏫 看示範</span><i>→</i><span>👍 學偏好</span></div>`,
    5:`<div class="model-demo"><span>小模型<br><b>快 / 省</b></span><i>↔</i><span>大模型<br><b>強 / 貴</b></span></div>`,
    6:`<div class="multi-demo"><span>📝 文字</span><span>🖼️ 圖片</span><span>🎧 聲音</span><span>🎬 影片</span><b>同一個任務的不同線索</b></div>`,
    7:`<div class="brief-demo"><span>目標</span><span>背景</span><span>資料</span><span>格式</span><b>交代清楚，比「神奇 Prompt」重要</b></div>`,
    8:`<div class="semantic-demo"><span>機器少故障</span><i>≈</i><span>預防性維護</span><small>字不同，但語意很近</small></div>`,
    9:`<div class="rag-demo"><span>❓ 問題</span><i>→</i><span>🔎 檢索</span><i>→</i><span>📄 片段</span><i>→</i><span>💬 回答</span><small>先查，再答</small></div>`,
    10:`<div class="split-demo"><div><b>Workflow</b><span>固定：1 → 2 → 3 → 4</span></div><div><b>Agent</b><span>看結果，再決定下一步</span></div></div>`,
    11:`<div class="agent-demo"><span>🔌 MCP / Tool</span><span>📋 Skill / SOP</span><span>🧠 Memory</span><b>把能力、做法、狀態組起來</b></div>`,
    12:`<div class="safety-demo"><span>✅ 品質</span><span>🔒 權限</span><span>🧪 Evals</span><span>📝 Audit</span></div>`
  }
  return visuals[id] || ''
}

function labVisual(m){
  switch(m.lab.type){
    case 'token': return `<div class="lab-token"><label>輸入一句話</label><input id="tokenInput" value="生成式 AI 很有趣！"><div class="token-output" id="tokenOutput"></div><p id="tokenCount"></p><small>※ 這是教學用簡化切法，不是任何特定模型的真實 tokenizer。</small></div>`
    case 'temperature': return `<div class="lab-temp"><div class="lab-control"><label>Temperature <b id="tempValue">0.7</b></label><input id="tempSlider" type="range" min="0.2" max="1.6" step="0.1" value="0.7"></div><div><div id="tempBars" class="prob-bars drink-bars"></div><p class="temp-hint" id="tempHint"></p></div><div class="drink-action"><button class="mini-button" id="sampleBtn">抽一次下一杯飲料</button><p class="sample-result" id="sampleResult">調整溫度後，多抽幾次看看。</p><div class="sample-history" id="sampleHistory"></div></div></div>`
    case 'embedding': return `<div class="embedding-lab"><div class="query-tabs"><button data-query="0" class="active">機器一直故障</button><button data-query="1">怎麼減少庫存差異</button></div><div class="similarity-list" id="similarityList"></div></div>`
    case 'attention': return `<div class="attention-lab qkv-lab">
      <div class="qkv-query"><span>Q · Query</span><b>「它」現在想找：我指的是誰？</b></div>
      <p>點一個候選 Token，看 K 怎麼跟 Q 配對：</p>
      <div class="word-row" id="wordRow">${['伺服器','資料庫','工程師'].map((x,i)=>`<button data-word="${i}">${x}</button>`).join('')}</div>
      <div class="attention-result" id="attentionResult">先點「伺服器」看看 Q / K / V 的關係。</div>
      <small>教學示意：真實 Q、K、V 都是向量，不是自然語言標籤；這裡用白話幫你先建立角色概念。</small>
    </div>`
    case 'training': return `<div class="training-lab"><div class="training-tabs">${['Pretraining','SFT','Preference','Safety'].map((x,i)=>`<button data-stage="${i}" class="${i===0?'active':''}">${x}</button>`).join('')}</div><div class="training-detail" id="trainingDetail"></div></div>`
    case 'cost': return `<div class="cost-lab"><div class="cost-controls"><label>輸入量 <input id="tokenSlider" type="range" min="1" max="10" value="4"><b id="tokenLabel">中</b></label><label>任務難度 <input id="difficultySlider" type="range" min="1" max="10" value="5"><b id="difficultyLabel">中</b></label></div><div class="route-card" id="routeCard"></div></div>`
    case 'multimodal': return `<div class="multi-lab"><p>這次設備異常，你要給 AI 哪些線索？</p><div class="check-grid">${[['photo','📷 瑕疵照片'],['sensor','📈 製程數據'],['audio','🎧 異音錄音'],['manual','📘 維修手冊']].map(([v,t])=>`<label><input type="checkbox" value="${v}"> ${t}</label>`).join('')}</div><div class="evidence-score" id="evidenceScore"></div></div>`
    case 'prompt': return `<div class="prompt-lab"><p>任務：「幫我做月報」——還缺什麼？</p><div class="check-grid">${[['goal','🎯 給誰看 / 目標'],['context','🗓️ 期間與背景'],['data','📊 要用哪些資料'],['rule','🚧 限制與規則'],['format','🧱 輸出格式']].map(([v,t])=>`<label><input type="checkbox" value="${v}"> ${t}</label>`).join('')}</div><div class="prompt-score" id="promptScore"></div></div>`
    case 'rag': return `<div class="rag-lab"><div class="rag-controls"><button data-mode="keyword" class="active">Keyword</button><button data-mode="vector">Vector</button><button data-mode="hybrid">Hybrid</button><label><input id="rerankToggle" type="checkbox"> Rerank</label></div><div class="rag-results" id="ragResults"></div></div>`
    case 'agent': return `<div class="agent-lab"><div class="scenario-tabs"><button data-scenario="0" class="active">每天 8 點月報</button><button data-scenario="1">未知設備異常</button><button data-scenario="2">固定審核流程</button></div><div class="agent-choice" id="agentChoice"></div></div>`
    case 'mcp': return `<div class="mcp-lab"><p>任務：找出 MES / SAP 月結差異，整理成報告。</p><div class="capability-grid">${[['sap','🔌 SAP Tool'],['mes','🔌 MES Tool'],['skill','📋 對帳 Skill'],['memory','🧠 任務 Memory'],['mail','✉️ Email Tool']].map(([v,t])=>`<label><input type="checkbox" value="${v}"> ${t}</label>`).join('')}</div><div class="mcp-status" id="mcpStatus"></div></div>`
    case 'eval': return `<div class="eval-lab"><div class="eval-meters"><label>回答準確率 <input data-eval="accuracy" type="range" min="50" max="100" value="88"><b>88%</b></label><label>引用可核對 <input data-eval="citation" type="range" min="50" max="100" value="92"><b>92%</b></label><label>工具成功率 <input data-eval="tool" type="range" min="50" max="100" value="95"><b>95%</b></label></div><label class="risk-check"><input id="highRiskToggle" type="checkbox"> 高風險動作沒有人工確認</label><div class="release-card" id="releaseCard"></div></div>`
    default: return ''
  }
}

function businessVisual(id){
  const text = {
    1:'200 頁文件\n≠ 全部都要塞進去', 2:'創意文案\nvs\n財務摘要', 3:'Transformer\nQ → K → V', 4:'改行為？\n還是補知識？',
    5:'Small → Large\n按任務升級', 6:'照片 + 數據\n+ 聲音', 7:'自由文字\n→ Schema', 8:'OC715\nKeyword + Vector',
    9:'文件知識用 RAG\n即時數據用 Tool', 10:'先 Workflow\n需要再 Agent', 11:'IAM + Audit\n+ Version', 12:'錯了怎麼攔？\n怎麼查？怎麼復原？'
  }
  return `<pre>${text[id]||''}</pre>`
}

function bindLab(m){
  const type = m.lab.type
  if(type==='token'){
    const input=document.querySelector('#tokenInput'), out=document.querySelector('#tokenOutput'), count=document.querySelector('#tokenCount')
    const render=()=>{const s=input.value.trim(); const tokens=[]; let buf=''; for(const ch of s){if(/[A-Za-z0-9]/.test(ch)){buf+=ch}else{if(buf){tokens.push(buf);buf=''} if(ch.trim()) tokens.push(ch)}} if(buf)tokens.push(buf); out.innerHTML=tokens.map((t,i)=>`<span class="token-chip c${i%4}">${t}</span>`).join(''); count.textContent=`簡化示意：這句被切成 ${tokens.length} 個小塊。`}
    input.addEventListener('input',render); render()
  }
  if(type==='temperature'){
    const slider=document.querySelector('#tempSlider'), val=document.querySelector('#tempValue'), bars=document.querySelector('#tempBars'), result=document.querySelector('#sampleResult'), hint=document.querySelector('#tempHint'), historyBox=document.querySelector('#sampleHistory')
    const drinks=[
      {name:'紅茶',icon:'🫖',base:.48},
      {name:'奶茶',icon:'🥛',base:.20},
      {name:'綠茶',icon:'🍵',base:.12},
      {name:'咖啡',icon:'☕',base:.08},
      {name:'果汁',icon:'🧃',base:.07},
      {name:'珍珠奶茶',icon:'🧋',base:.05}
    ]
    let history=[]
    const probs=t=>{const raw=drinks.map(d=>Math.pow(d.base,1/t)); const sum=raw.reduce((a,b)=>a+b,0); return raw.map(x=>x/sum)}
    const render=()=>{
      const t=+slider.value,p=probs(t); val.textContent=t.toFixed(1)
      const visible=p.map((x,i)=>({x,i})).filter(o=>o.x>=.04)
      bars.innerHTML=visible.map(({x,i})=>`<div><span><span class="drink-name"><em>${drinks[i].icon}</em>${drinks[i].name}</span><b>${Math.round(x*100)}%</b></span><i><b style="width:${x*100}%"></b></i></div>`).join('')
      const level=t<=.5?'很固定':t<=.9?'偏穩定':t<=1.2?'比較多變':'很多變'
      hint.innerHTML=`<b>目前明顯可能出現：${visible.length} 種</b><span>低溫會把機率集中；高溫會讓原本低機率的飲料更容易被選到。</span><strong>現在：${level}</strong>`
    }
    const resetHistory=()=>{history=[];historyBox.innerHTML='<small>最近抽到：還沒有，試著連抽 6～8 次。</small>'; result.textContent='調整溫度後，多抽幾次看看。'}
    slider.addEventListener('input',()=>{render();resetHistory()})
    document.querySelector('#sampleBtn').onclick=()=>{
      const p=probs(+slider.value); let r=Math.random(),acc=0,idx=0
      p.some((x,i)=>{acc+=x;if(r<=acc){idx=i;return true}})
      const pick=drinks[idx]; result.innerHTML=`這次抽到：<b>${pick.icon} ${pick.name}</b>`
      history.push(`${pick.icon} ${pick.name}`); if(history.length>8)history.shift()
      historyBox.innerHTML=`<small>最近抽到</small><div>${history.map(x=>`<span>${x}</span>`).join('')}</div>`
    }
    render(); resetHistory()
  }
  if(type==='embedding'){
    const data=[
      [['預防性維護',92],['設備保養週期',84],['庫存盤點',23],['員工旅遊',7]],
      [['SAP / MES 對帳',94],['庫存盤點差異',88],['機台震動分析',28],['年度教育訓練',9]]
    ]
    const list=document.querySelector('#similarityList'); const render=i=>{list.innerHTML=data[i].map(([t,s])=>`<div><span>${t}<b>${s}%</b></span><i><b style="width:${s}%"></b></i></div>`).join('')}
    document.querySelectorAll('.query-tabs button').forEach((b,i)=>b.onclick=()=>{document.querySelectorAll('.query-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(i)}); render(0)
  }
  if(type==='attention'){
    const candidates=[
      {name:'伺服器',score:86,key:'設備、可以被重啟、前文主角',value:'把「伺服器」這個概念帶回「它」的位置'},
      {name:'資料庫',score:58,key:'也是系統元件，但句子裡是被連線的對象',value:'把「資料庫」相關資訊帶回來'},
      {name:'工程師',score:9,key:'是執行重啟的人，不太像「它」指的東西',value:'把「工程師」相關資訊帶回來'}
    ]
    const result=document.querySelector('#attentionResult')
    document.querySelectorAll('#wordRow button').forEach((b,i)=>b.onclick=()=>{
      document.querySelectorAll('#wordRow button').forEach(x=>x.classList.remove('active')); b.classList.add('active')
      const c=candidates[i]
      result.innerHTML=`<div class="qkv-result"><span><b>K · Key</b>${c.key}</span><span><b>Q × K 匹配</b><strong>${c.score}%</strong></span><span><b>V · Value</b>${c.value}</span></div>`
    })
  }
  if(type==='training'){
    const d=[['Pretraining','先大量讀資料，學語言、知識與一般模式。'],['SFT','看高品質示範，學會「這種任務應該怎麼答」。'],['Preference','比較多個回答，學人偏好的風格與行為。'],['Safety','加入政策、拒答與風險邊界，降低不安全行為。']]; const box=document.querySelector('#trainingDetail'); const render=i=>box.innerHTML=`<b>${d[i][0]}</b><p>${d[i][1]}</p>`; document.querySelectorAll('.training-tabs button').forEach((b,i)=>b.onclick=()=>{document.querySelectorAll('.training-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(i)});render(0)
  }
  if(type==='cost'){
    const a=document.querySelector('#tokenSlider'),b=document.querySelector('#difficultySlider'),card=document.querySelector('#routeCard'); const render=()=>{const x=+a.value,y=+b.value; document.querySelector('#tokenLabel').textContent=x<4?'少':x<8?'中':'多'; document.querySelector('#difficultyLabel').textContent=y<4?'低':y<8?'中':'高'; const score=x+y; let rec=score<8?'先用小模型：快、便宜，通常就夠。':score<15?'用中階模型，並控制 Context。':'複雜任務可升級強模型，但先縮小不必要的輸入。'; card.innerHTML=`<span>建議策略</span><b>${rec}</b>`}; [a,b].forEach(x=>x.addEventListener('input',render));render()
  }
  if(type==='multimodal'){
    const box=document.querySelector('#evidenceScore'); const render=()=>{const n=document.querySelectorAll('.check-grid input:checked').length; box.innerHTML=`目前有 <b>${n}</b> 種線索。${n<2?'資訊還有點單薄。':n<4?'已經能交叉比對一些訊號。':'線索完整多了，但仍要檢查每份資料的品質。'}`}; document.querySelectorAll('.check-grid input').forEach(x=>x.onchange=render);render()
  }
  if(type==='prompt'){
    const box=document.querySelector('#promptScore'); const render=()=>{const n=document.querySelectorAll('.check-grid input:checked').length; box.innerHTML=`交代完整度 <b>${n}/5</b><i><b style="width:${n*20}%"></b></i><span>${n<3?'AI 還要猜很多東西。':n<5?'已經比一句「幫我做月報」清楚很多。':'目標、背景、資料、限制、格式都到位。'}</span>`}; document.querySelectorAll('.check-grid input').forEach(x=>x.onchange=render);render()
  }
  if(type==='rag'){
    const sets={keyword:[['OC715 對帳操作手冊',96],['OC715 版本紀錄',88],['MES 庫存說明',45]],vector:[['MES 與 SAP 庫存差異處理',93],['月結平帳作業',86],['OC715 操作手冊',72]],hybrid:[['OC715 對帳操作手冊',98],['MES 與 SAP 庫存差異處理',95],['月結平帳作業',82]]}; let mode='keyword'; const box=document.querySelector('#ragResults'); const render=()=>{let arr=[...sets[mode]]; if(document.querySelector('#rerankToggle').checked) arr=arr.map((x,i)=>[x[0],Math.min(99,x[1]+(i===0?2:i===1?4:-3))]).sort((a,b)=>b[1]-a[1]); box.innerHTML=arr.map(([t,s],i)=>`<div><span>#${i+1} ${t}<b>${s}</b></span></div>`).join('')}; document.querySelectorAll('.rag-controls button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.rag-controls button').forEach(x=>x.classList.remove('active'));b.classList.add('active');mode=b.dataset.mode;render()});document.querySelector('#rerankToggle').onchange=render;render()
  }
  if(type==='agent'){
    const d=[['Workflow','固定時間、固定資料、固定格式，路徑清楚。'],['Agent','原因未知，需要看每一步結果再決定下一步。'],['Workflow','審核規則固定，最好先把可預測路徑寫清楚。']]; const box=document.querySelector('#agentChoice'); const render=i=>box.innerHTML=`<span>比較適合</span><b>${d[i][0]}</b><p>${d[i][1]}</p>`; document.querySelectorAll('.scenario-tabs button').forEach((b,i)=>b.onclick=()=>{document.querySelectorAll('.scenario-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(i)});render(0)
  }
  if(type==='mcp'){
    const box=document.querySelector('#mcpStatus'); const render=()=>{const vals=[...document.querySelectorAll('.capability-grid input:checked')].map(x=>x.value); const core=['sap','mes','skill']; const missing=core.filter(x=>!vals.includes(x)); box.innerHTML=missing.length?`還缺核心能力：<b>${missing.map(x=>({sap:'SAP Tool',mes:'MES Tool',skill:'對帳 Skill'}[x])).join('、')}</b>`:`基本能力齊了。${vals.includes('memory')?' Memory 可以幫忙保留跨步驟進度。':' 如果任務很長，再考慮加 Memory。'}`}; document.querySelectorAll('.capability-grid input').forEach(x=>x.onchange=render);render()
  }
  if(type==='eval'){
    const box=document.querySelector('#releaseCard'), risk=document.querySelector('#highRiskToggle'); const render=()=>{const vals=[...document.querySelectorAll('[data-eval]')].map(x=>+x.value); document.querySelectorAll('[data-eval]').forEach(x=>x.nextElementSibling.textContent=x.value+'%'); const avg=vals.reduce((a,b)=>a+b,0)/vals.length; const bad=risk.checked; let status=bad?'先不要上線':avg>=90?'可以進入受控上線':'先補測試'; box.className='release-card '+(bad?'danger':avg>=90?'good':'warn'); box.innerHTML=`<span>判斷</span><b>${status}</b><p>${bad?'高風險動作沒有人工確認，是阻擋項。':`目前綜合指標約 ${Math.round(avg)}%。`}</p>`}; document.querySelectorAll('[data-eval]').forEach(x=>x.oninput=render);risk.onchange=render;render()
  }
}

function bindQuiz(m, qi){
  const key = `${m.id}-${qi}`
  if(state.answers[key] !== undefined) return
  document.querySelectorAll('.quiz-option').forEach(btn=>btn.addEventListener('click',()=>{
    const selected = Number(btn.dataset.answer)
    state.answers[key] = selected
    if(qi===1) state.completed.add(m.id)
    save(); renderMission(m.id, qi===0?7:8)
  }))
}

function bindKeyboard(id,page,prevMission,nextMission){
  window.onkeydown = e => {
    if(['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement?.tagName)) return
    if(e.key==='ArrowRight'){
      if(page<TOTAL_PAGES) location.hash = `#/mission/${id}/${page+1}`
      else if(nextMission) location.hash = `#/mission/${nextMission.id}/1`
    }
    if(e.key==='ArrowLeft'){
      if(page>1) location.hash = `#/mission/${id}/${page-1}`
      else if(prevMission) location.hash = `#/mission/${prevMission.id}/${TOTAL_PAGES}`
    }
  }
}

function renderAbout(){
  app.innerHTML = `${nav('about')}<main class="about-page"><div class="shell"><section class="about-card"><span>🌿</span><h1>這版刻意做兩件事</h1><p>畫面要像投影片一樣乾淨，內容卻不能只剩一句話。<br>所以每個概念都拆成 8 個短畫面：白話、案例、流程、原理、互動、工作現場、兩題測驗。</p><a class="button primary" href="#/mission/1/1">從第一課開始 →</a></section></div></main>${footer()}`
}
function footer(){return `<footer class="footer"><div class="shell"><div><b>☘ LLM 學習站</b><span>用白話，陪你學 AI</span></div><p>先懂，再深入。♡</p></div></footer>`}
route()
