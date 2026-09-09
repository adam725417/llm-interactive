export const worlds = [
  { id: 1, title: 'AI 怎麼生成', subtitle: 'Token、機率與生成', icon: '💬' },
  { id: 2, title: '模型怎麼理解與學習', subtitle: 'Transformer、訓練、模型與多模態', icon: '🧠' },
  { id: 3, title: 'AI 怎麼接資料', subtitle: 'Prompt、Embedding 與 RAG', icon: '🗂️' },
  { id: 4, title: 'AI 怎麼開始做事', subtitle: '工具、Agent、MCP 與安全', icon: '⚙️' },
]

export const missions = [
  {
    id: 1, world: 1, shortTitle: 'Token 與猜下一個',
    title: 'LLM 其實是在猜下一個',
    subtitle: '先別把它想得太神。它最核心的工作，就是文字接龍。',
    idea: 'LLM 先把文字切成 Token，再根據前面的 Token，預測下一個最可能出現什麼。',
    storyTitle: '手機自動選字，就是很好的入口',
    story: '你打「會議延到下午三點，請大家……」，手機會猜後面可能接「準時、注意、確認」。LLM 也是同一種精神，只是它看過的文字更多，能一路接很長。',
    flow: ['文字先切成 Token', '看前面的 Token', '算下一個的可能性', '選一個，再繼續'],
    remember: ['Token 不等於「一個中文字」或「一個英文單字」，實際切法依 tokenizer 而定。', '模型不是先把完整答案想好，而是一小步一小步往下生成。'],
    deep: {
      title: '再多懂一點：Token 是模型真正看到的單位',
      lead: '你看到的是一句話；模型先把它切成一串編號，再拿這串編號做運算。',
      terms: [
        {term:'Token', say:'模型處理文字時的基本小單位。可能是一個字、半個詞、標點，甚至更細。'},
        {term:'Tokenizer', say:'負責把文字切成 Token，也負責把 Token 轉回文字。'},
        {term:'Vocabulary', say:'模型「認得」的 Token 清單。每個 Token 都有自己的編號。'}
      ],
      note: '所以「100 個字 = 100 Tokens」不能直接畫等號。'
    },
    business: {
      title: '工作現場：為什麼 Token 會影響成本？',
      scenario: '你把 200 頁報告全部丟給 AI，它不是在「看 200 頁」這個抽象概念，而是在處理大量 Token。Token 越多，通常代表運算越多、等待越久，也可能增加 API 成本。',
      takeaway: '真正要優化的不是「字數看起來很多」，而是：哪些內容真的需要進 Context？'
    },
    lab: {type:'token', title:'動手試：看看一句話怎麼被切開', instruction:'輸入一句話。這裡用簡化版 tokenizer 示意，重點是看懂「文字會先被切小塊」。'},
    quiz: [
      { q: 'LLM 產生回答時，最接近哪個過程？', options: ['先想完整篇，再一次輸出', '一個 Token 一個 Token 往下接', '先上網找固定答案'], answer: 1, explain: '對。生成是逐步發生的，每一步都在預測下一個 Token。' },
      { q: '「一個中文字一定等於一個 Token」這句話？', options: ['永遠正確', '不一定，要看 tokenizer', '只有英文才有 Token'], answer: 1, explain: '沒錯。Token 怎麼切，是 tokenizer 的設計結果。' }
    ]
  },
  {
    id: 2, world: 1, shortTitle: '機率、Temperature',
    title: '為什麼同一題，答案會不太一樣？',
    subtitle: '因為每一步通常都有不只一個合理選項。',
    idea: '模型先算出一堆候選的分數，再把它們變成機率。Temperature 會改變這些機率「有多集中」。',
    storyTitle: '像點飲料：最常喝珍奶，但不代表每次都喝珍奶',
    story: '如果你平常 70% 點珍奶、20% 點紅茶、10% 點檸檬汁，今天還是有可能選到別的。LLM 每一步也有類似的候選分布。',
    flow: ['先算候選分數', 'Softmax 變成機率', 'Temperature 調整分布', 'Sampling 選下一個'],
    remember: ['Logits 是 Softmax 前的分數；Softmax 後才是機率。', 'Temperature 越高通常越有變化，但「有創意」不等於「更正確」。'],
    deep: {
      title: '再多懂一點：Logits → Softmax → Sampling',
      lead: '這三個詞常被混在一起，其實它們是三個不同步驟。',
      terms: [
        {term:'Logits', say:'模型對每個候選 Token 算出的原始分數，還不是機率。'},
        {term:'Softmax', say:'把一堆分數轉成加總為 100% 的機率分布。'},
        {term:'Temperature', say:'調整機率分布的尖銳程度。低溫偏穩，高溫偏發散。'}
      ],
      note: '真正「固定挑最高分」叫 greedy decoding；低 Temperature 只是更偏向高機率選項。'
    },
    business: {
      title: '工作現場：創作文案跟財務摘要，設定不該一樣',
      scenario: '品牌腦力激盪可以接受多一點變化；但財務差異說明、法規摘要、SOP 回覆，通常更希望穩定、可重現。',
      takeaway: '先問「這個任務要穩，還是要多樣？」再決定生成策略。'
    },
    lab: {type:'temperature', title:'動手試：把 Temperature 拉高、拉低', instruction:'拖動滑桿，看看飲料選項怎麼變；再連抽幾次，感受低溫比較一致、高溫比較多變。'},
    quiz: [
      { q: 'Softmax 的主要作用是？', options: ['把分數轉成機率分布', '把文字切成 Token', '把資料存進資料庫'], answer: 0, explain: '對。Logits 經 Softmax 後，才比較像我們熟悉的機率。' },
      { q: 'Temperature 拉高，通常代表？', options: ['回答一定更正確', '候選分布更平均、變化更多', '模型會自動上網'], answer: 1, explain: '沒錯。變化通常增加，但正確性要另外評估。' }
    ]
  },
  {
    id: 3, world: 2, shortTitle: 'Transformer 與 QKV',
    title: 'Transformer 怎麼抓住前後文？',
    subtitle: '核心不是「記住一句話」，而是讓每個 Token 都能找到現在最值得看的線索。',
    idea: 'Transformer 是 LLM 的核心架構之一。它會重複使用 Self-Attention，讓每個 Token 根據上下文，動態決定「現在該參考誰」。',
    storyTitle: '開會時，你不會每句話都同樣重視',
    story: '主管問「剛剛那台機器為什麼停了？」你會特別回想「那台機器」「停了」「剛剛發生什麼」，而不是把整場會議每個字都平均看待。Self-Attention 做的事情很像：根據現在的問題，重新分配注意力。',
    flow: ['Token 加上位置資訊', '每個位置產生 Q / K / V', 'Q 跟 K 算「該看誰」', '用權重整合 V，再往下傳'],
    remember: ['Transformer 不等於 Attention；一個 Transformer Block 還會搭配 Feed-Forward、Residual、Normalization 等結構。', 'Q / K 決定「關注誰」；V 才是被加權帶回來的資訊。'],
    deep: {
      title: 'Q、K、V 不用先背公式，先記住三個角色',
      lead: '它們都是由 Token 的表示轉換出來的向量。白話可以先這樣理解：Q 在問、K 在配對、V 在提供內容。',
      terms: [
        {term:'Query (Q)', say:'「我現在想找什麼？」目前這個 Token 拿 Q 去和其他位置做配對。'},
        {term:'Key (K)', say:'「我身上有哪些線索？」每個 Token 用 K 告訴別人：我值不值得被你注意。'},
        {term:'Value (V)', say:'「如果你注意我，我真正提供什麼？」Attention 權重最後會拿來加權 V。'},
        {term:'Multi-Head Attention', say:'同一句話可以同時從不同角度看關係，例如代名詞、語法、主題或時間線索。'}
      ],
      note: '簡化流程是：Q · K → 分數 → Softmax → Attention 權重 → 加權 V。Attention weight 能看出計算關聯，但不能直接當成完整的「模型為什麼這樣想」。'
    },
    business: {
      title: '工作現場：Context 很大，不代表模型一定抓得準',
      scenario: '把一年份 email、會議紀錄、SOP 全塞進同一次請求，雖然「裝得下」，但關鍵線索可能被雜訊淹沒。Transformer 能建立關聯，卻不代表所有內容都同樣值得放進 Context。',
      takeaway: 'Context Engineering 的重點不是塞最多，而是把真正相關的資訊放在模型容易用的位置。'
    },
    lab: {type:'attention', title:'動手試：用 Q / K / V 看懂「它」在找誰', instruction:'先看 Query，再點不同候選 Token。這是白話示意，目的是看懂 Q、K、V 各自扮演什麼角色。'},
    quiz: [
      { q: '在 Attention 裡，Q 跟 K 主要用來做什麼？', options: ['算哪些位置值得關注', '永久保存記憶', '直接輸出最後答案'], answer: 0, explain: '對。Q 和 K 先算匹配程度，再把得到的權重用來整合 V。' },
      { q: 'Transformer 就只是一層 Attention 嗎？', options: ['是，完全一樣', '不是，還有 Feed-Forward、Residual、Norm 等結構', 'Transformer 只是資料庫'], answer: 1, explain: '沒錯。Attention 是核心元件之一，但 Transformer Block 還有其他重要結構。' }
    ]
  },
  {
    id: 4, world: 2, shortTitle: '訓練與 Alignment',
    title: 'LLM 是怎麼「學會」的？',
    subtitle: '先大量學語言，再教它更會照人的需求做事。',
    idea: 'Pretraining 先學一般語言與知識模式；Post-training 再用示範、偏好與回饋，把模型調成比較好用的助手。',
    storyTitle: '像新人先讀很多資料，再跟前輩學工作方式',
    story: '新人看很多文件後，可能知道公司在做什麼；但怎麼回客訴、什麼事情要升級主管，還需要實際示範與規範。',
    flow: ['Pretraining 大量學習', 'SFT 看示範', 'Preference 學偏好', 'Safety / Policy 加邊界'],
    remember: ['「比較會聽話」不等於「每個事實都正確」。', 'Alignment 解決的是行為與偏好；Grounding 才是在回答時補上可靠依據。'],
    deep: {
      title: '再多懂一點：Pretraining、SFT、Preference Optimization',
      lead: '你不用記住所有訓練演算法，但要知道不同階段在解不同問題。',
      terms: [
        {term:'Pretraining', say:'從大量資料學語言、知識模式與一般能力。'},
        {term:'SFT', say:'用高品質「題目 → 好答案」示範，教模型怎麼完成特定任務。'},
        {term:'Preference', say:'讓模型學到人偏好哪種回答，例如更有幫助、更安全。'}
      ],
      note: '訓練資料與方法會影響模型行為，但也不會把模型變成完美資料庫。'
    },
    business: {
      title: '工作現場：不是每個企業問題都要 Fine-tune',
      scenario: '公司規章每週都可能更新，如果用 Fine-tune 把規章「灌進模型」，維護會很痛苦。很多情況先用 RAG 或工具存取最新資料更合理。',
      takeaway: '先問：我要改「模型行為」，還是只是要補「最新知識」？'
    },
    lab: {type:'training', title:'動手試：不同訓練階段，解決不同問題', instruction:'點不同階段，看看它主要在教模型什麼。'},
    quiz: [
      { q: '如果公司規章常更新，通常更適合先考慮？', options: ['RAG / 查最新資料', '每週重訓一個大模型', '把規章藏在 Prompt 裡永不更新'], answer: 0, explain: '對。動態知識通常更適合外部化管理。' },
      { q: 'Alignment 做得好，就代表完全不會幻覺嗎？', options: ['是', '不是', '只在中文會'], answer: 1, explain: '沒錯。行為對齊和事實 grounding 是不同問題。' }
    ]
  },
  {
    id: 5, world: 2, shortTitle: '模型大小與成本',
    title: '70B、MoE、快模型、慢模型，到底差在哪？',
    subtitle: '模型不是越大越好，要看能力、速度、成本和任務。',
    idea: '參數量是模型容量的一種指標，但真正使用時還要看訓練品質、架構、上下文、推論速度與每次請求成本。',
    storyTitle: '像交通工具：搬家不會騎腳踏車，買早餐也不用開貨櫃車',
    story: '簡單分類任務可能用小模型就夠；複雜推理、長文件分析才值得用更強模型。選模型其實是在做工程取捨。',
    flow: ['先看任務難度', '再看模型能力', '估 Token 與延遲', '選最划算的組合'],
    remember: ['7B = 70 億參數，不是 7 億。', 'API 成本通常跟輸入 / 輸出 Token 有關；價格會變，設計時不要把單一價格寫死。'],
    deep: {
      title: '再多懂一點：Parameters、Dense、MoE、Latency',
      lead: '看到模型規格時，至少要知道這些字在說什麼。',
      terms: [
        {term:'Parameters', say:'模型內部學到的數值權重。數量大通常容量更高，但不是品質唯一指標。'},
        {term:'Dense vs MoE', say:'Dense 每次都動用大部分網路；MoE 會只啟用部分專家，換取不同的效率取捨。'},
        {term:'Latency', say:'從送出請求到拿到結果要等多久。企業流程常比排行榜更在意它。'}
      ],
      note: '模型選型沒有「永遠最強」，只有「對這個任務最合適」。'
    },
    business: {
      title: '工作現場：分層路由，比所有事情都用最大模型更合理',
      scenario: '客服分類、格式轉換先交給小模型；遇到高價值客訴或複雜合約，再升級到更強模型。',
      takeaway: '企業常把模型當成不同等級的運算資源，而不是只有一顆「AI 大腦」。'
    },
    lab: {type:'cost', title:'動手試：任務、Token、模型大小怎麼影響取捨', instruction:'調整輸入量與任務難度，看建議策略怎麼變。'},
    quiz: [
      { q: '70B 的 B 是 billion，約等於？', options: ['700 億參數', '70 億參數', '7 億參數'], answer: 0, explain: '對。1 billion = 10 億，所以 70B = 700 億。順便記：7B = 70 億。' },
      { q: '所有任務都用最大模型最好嗎？', options: ['一定最好', '不一定，要看成本與任務', '小模型完全沒用'], answer: 1, explain: '沒錯。很多企業場景會做模型路由或分層。' }
    ]
  },
  {
    id: 6, world: 2, shortTitle: 'Multimodal',
    title: 'AI 現在不只會看文字',
    subtitle: '圖片、聲音、影片，都能成為同一個任務的線索。',
    idea: 'Multimodal 的重點不是「會畫圖」，而是模型可以接收或產生多種資料形式，並把不同線索放在一起理解。',
    storyTitle: '設備異常時，你也不會只看一個數字',
    story: '維修人員可能同時看設備照片、聽異音、讀警報碼、查歷史紀錄。多模態 AI 的價值，就是讓這些線索可以一起被處理。',
    flow: ['收文字 / 圖片 / 聲音', '各自轉成模型表示', '融合線索', '輸出判斷或內容'],
    remember: ['不同模型的多模態架構不一定相同，不要把單一架構當成唯一做法。', '資料品質仍然是瓶頸：照片模糊、音訊太吵，AI 一樣可能判錯。'],
    deep: {
      title: '再多懂一點：Input modality 跟 Output modality 是兩件事',
      lead: '有的模型能看圖但只輸出文字；有的模型能直接產生聲音或影像。',
      terms: [
        {term:'Vision', say:'讓模型從圖片或影格取得資訊。'},
        {term:'Audio', say:'讓模型理解或產生語音、聲音等訊號。'},
        {term:'Fusion', say:'把不同形式的資訊整合成同一個任務可用的表示。'}
      ],
      note: '「多模態」描述的是資料形式，不等於模型一定更聰明。'
    },
    business: {
      title: '工作現場：製造與醫療常特別適合多模態',
      scenario: '品質檢查可以把瑕疵照片 + 製程參數 + 檢驗文字一起分析；醫療則可能同時結合影像、病歷與語音紀錄。',
      takeaway: '真正有價值的是把不同訊號串成同一個決策脈絡。'
    },
    lab: {type:'multimodal', title:'動手試：多一個線索，判斷會怎麼變', instruction:'勾選不同資料來源，看看資訊是否更完整。'},
    quiz: [
      { q: 'Multimodal 最核心的意思是？', options: ['能處理多種資料形式', '模型一定有很多參數', '只能生成圖片'], answer: 0, explain: '對。重點是文字、影像、聲音等不同 modality。' },
      { q: '多模態模型看到模糊照片，就一定能判對嗎？', options: ['一定', '不一定，輸入品質仍重要', '只要模型大就行'], answer: 1, explain: '沒錯。模型能力再強，也無法保證補回所有遺失資訊。' }
    ]
  },
  {
    id: 7, world: 3, shortTitle: 'Prompt 與 Context',
    title: '提示詞不用寫得像咒語',
    subtitle: '真正重要的是：把工作、資料、限制和輸出交代清楚。',
    idea: 'Prompt 是你下的指令；Context 是模型這一次工作時看得到的全部資訊。好的系統會把兩者一起設計。',
    storyTitle: '交代同事做月報，不會只說「幫我做漂亮一點」',
    story: '你會說給誰看、用哪個期間、哪些數字一定要比、哪些欄位不能省、最後輸出成表格還是簡報。AI 也是一樣。',
    flow: ['說清楚目標', '補必要背景與資料', '給限制與規則', '指定可驗證的輸出格式'],
    remember: ['Prompt 不是越長越好；Context 也不是塞滿越好。', 'Structured Output 能把結果約束成 JSON / Schema，比「請用 JSON」更可靠。'],
    deep: {
      title: '再多懂一點：Prompt、System、Context、Structured Output',
      lead: '在真正的 AI 系統裡，使用者看到的那句話只是其中一部分。',
      terms: [
        {term:'System Instruction', say:'應用程式放進去的高階規則，例如角色、限制與回應原則。'},
        {term:'Context', say:'這次模型能看到的資料、歷史、工具結果與規則集合。'},
        {term:'Structured Output', say:'讓模型輸出符合固定欄位或 Schema，方便後續程式可靠處理。'}
      ],
      note: '從「Prompt Engineering」走向「Context Engineering」，代表焦點從一句話變成整個資訊環境。'
    },
    business: {
      title: '工作現場：可被系統使用的回答，比「寫得漂亮」更重要',
      scenario: '如果下一步要把 AI 結果寫進 MES，最好輸出 {工單號, 異常類型, 建議動作} 這種結構，而不是一大段自由文字。',
      takeaway: '讓 AI 跟系統合作，通常要把「輸出契約」一起設計。'
    },
    lab: {type:'prompt', title:'動手試：把模糊任務補完整', instruction:'勾選目標、背景、資料、限制、格式，看「交代完整度」怎麼改變。'},
    quiz: [
      { q: 'Prompt 與 Context 的差別，哪個比較對？', options: ['Prompt 是指令；Context 是這次可見的工作資訊', '兩個完全一樣', 'Context 只代表網路'], answer: 0, explain: '對。Prompt 是其中一部分，Context 的範圍更大。' },
      { q: '要把 AI 輸出交給下一個程式處理，最好優先考慮？', options: ['Structured Output / Schema', '更多形容詞', '更高 Temperature'], answer: 0, explain: '沒錯。結構化輸出可以大幅降低後續解析不穩定。' }
    ]
  },
  {
    id: 8, world: 3, shortTitle: 'Embedding 與語意',
    title: 'AI 怎麼知道兩句話「意思很像」？',
    subtitle: '把語意變成位置，就能算「距離」。',
    idea: 'Embedding 可以先想成語意座標。意思相近的內容，在向量空間裡通常也比較靠近。',
    storyTitle: '你找「機器少故障」，它也能找到「預防性維護」',
    story: '兩句話沒有很多相同字，但意思很接近。語意搜尋的價值，就是不只看字面，而是把「意思像不像」也算進去。',
    flow: ['文字轉成向量', '放進語意空間', '算相似度', '找出最接近的內容'],
    remember: ['Embedding 是數字向量，不是模型「腦中真的有一張 2D 地圖」。', '精準料號、姓名、代碼常要搭配關鍵字或欄位搜尋。'],
    deep: {
      title: '再多懂一點：Vector、Similarity、Semantic Search',
      lead: '向量本身只是一串數字，真正有用的是「可以拿來比較」。',
      terms: [
        {term:'Embedding', say:'把文字、圖片等內容轉成能表達特徵的向量。'},
        {term:'Cosine Similarity', say:'常見的相似度算法，會看兩個向量方向有多接近。'},
        {term:'Semantic Search', say:'用語意相似度找內容，不要求每個關鍵字都一樣。'}
      ],
      note: '向量搜尋很適合「意思接近」，但不是所有查詢都該只用向量。'
    },
    business: {
      title: '工作現場：企業搜尋常需要 Hybrid Search',
      scenario: '員工問「OC715 對帳異常」時，OC715 是精準代碼；「對帳異常」又有語意。只做向量搜尋可能漏掉代碼，只做關鍵字又可能漏掉同義說法。',
      takeaway: '實務常把 Keyword + Vector 合在一起，這就是 Hybrid Search 的精神。'
    },
    lab: {type:'embedding', title:'動手試：看看哪些句子最接近', instruction:'點不同問題，觀察相似度排名怎麼改變。'},
    quiz: [
      { q: 'Embedding 最適合先怎麼理解？', options: ['語意座標', '資料庫密碼', '模型版本號'], answer: 0, explain: '對。先把它想成能拿來比較語意距離的座標。' },
      { q: '找精準料號時，只靠向量搜尋一定最好嗎？', options: ['一定', '不一定，常要搭配關鍵字', '向量完全不能用'], answer: 1, explain: '沒錯。企業搜尋通常要把精準字串與語意搜尋搭配起來。' }
    ]
  },
  {
    id: 9, world: 3, shortTitle: 'RAG',
    title: 'RAG：先查資料，再回答',
    subtitle: '企業 AI 很多時候不是缺模型，而是缺「找到對資料」的能力。',
    idea: 'RAG 會先把問題拿去檢索相關內容，再把最有用的片段放進 Context，讓 LLM 根據資料回答。',
    storyTitle: '像客服先翻最新版規定，再回答客戶',
    story: '客戶問「這個產品現在保固多久？」真正可靠的做法不是靠三年前記憶，而是先找到最新版規範，再整理成容易懂的答案。',
    flow: ['文件切 Chunk', 'Embedding / Index', 'Retrieve + Filter', 'Rerank 後交給 LLM'],
    remember: ['RAG 不只是一個 Vector DB；Chunk、Metadata、Hybrid、Rerank、Citation 都很重要。', 'RAG 要分開評估「有沒有找對」和「找到後有沒有答對」。'],
    deep: {
      title: '再多懂一點：一個完整 RAG Pipeline 至少有這幾段',
      lead: '很多 RAG 問題其實不是模型生成壞掉，而是前面的 Retrieval 就找錯了。',
      terms: [
        {term:'Chunking', say:'把長文件切成可檢索的小段。切太小失去上下文，太大又容易帶進雜訊。'},
        {term:'Hybrid Search', say:'把 Keyword 與 Vector 搜尋結合，兼顧精準字串與語意。'},
        {term:'Reranker', say:'先粗找一批候選，再用更精準的方法重新排序。'}
      ],
      note: '好的 RAG 回答通常還要附來源或 Citation，讓人能回頭核對。'
    },
    business: {
      title: '工作現場：RAG 最適合「知識常更新，但來源可以管理」的場景',
      scenario: 'SOP、法規、產品手冊、內部 FAQ、製程知識都很適合。但如果問題要的是即時庫存、今天產量，通常該直接查資料庫或 API。',
      takeaway: 'RAG 是「查文件知識」的強項；即時結構化資料則常用 Tool / API。'
    },
    lab: {type:'rag', title:'動手試：Keyword、Vector、Hybrid 有什麼差', instruction:'切換檢索方式，再開關 Rerank，看 Top results 怎麼變。'},
    quiz: [
      { q: 'RAG 答錯時，第一個也該檢查什麼？', options: ['有沒有找對資料', '頁面顏色', '模型 Logo'], answer: 0, explain: '對。Retrieval 找錯，生成再漂亮也沒用。' },
      { q: '要查「今天倉庫剩幾捲」，最可靠通常是？', options: ['RAG 查舊文件', 'Tool / API 查即時系統', '靠模型記憶'], answer: 1, explain: '沒錯。即時結構化資料應直接查真實系統。' }
    ]
  },
  {
    id: 10, world: 4, shortTitle: 'Tool、Workflow、Agent',
    title: '從「會回答」到「真的會做事」',
    subtitle: 'LLM 接上工具後，才有機會真正查系統、算東西、完成任務。',
    idea: 'Tool Calling 讓模型選工具；Workflow 把路徑先寫好；Agent 則會根據目前結果，動態決定下一步。',
    storyTitle: '固定月報用 Workflow，查不明故障才比較像 Agent',
    story: '每天 8 點抓數據、產報表、寄主管，流程很固定；但設備異常原因未知，可能要查 log、比歷史、看手冊，再決定下一步，這時 Agent 才真的有價值。',
    flow: ['收到目標', '選工具 / 步驟', '執行並觀察結果', '決定繼續或完成'],
    remember: ['不是所有自動化都需要 Agent；固定流程用 Workflow 往往更便宜、更穩。', 'Tool 成功執行與模型「說它做完了」是兩回事，要看系統回傳。'],
    deep: {
      title: '再多懂一點：Plan → Act → Observe → Decide',
      lead: 'Agent 的核心不是「回答比較長」，而是能在多步任務中根據結果調整行動。',
      terms: [
        {term:'Tool Calling', say:'模型輸出「要呼叫哪個工具、帶哪些參數」，由系統真正執行。'},
        {term:'Workflow', say:'程式先決定好路徑，模型只在某些節點處理內容。'},
        {term:'Agent', say:'模型有更多自主權，會根據狀態與工具結果決定下一步。'}
      ],
      note: '自主性越高，越需要 timeout、budget、approval、logging 等邊界。'
    },
    business: {
      title: '工作現場：先 Workflow，真的需要再升級 Agent',
      scenario: '如果 80% 情況都照固定 SOP，先把 80% 做成可靠 Workflow；剩下 20% 不確定情況，才交給 Agent 處理。',
      takeaway: '「Agent 化」不是目的；完成任務、風險可控才是目的。'
    },
    lab: {type:'agent', title:'動手試：這些任務該 Workflow 還是 Agent？', instruction:'選一個情境，再看比較適合固定流程還是動態決策。'},
    quiz: [
      { q: '每天固定時間產同一份報表，比較適合？', options: ['Workflow', '高度自主 Agent', '隨機抽籤'], answer: 0, explain: '對。路徑固定，就不必增加不必要的自主性。' },
      { q: 'Agent 最重要的差異是？', options: ['會看目前結果再決定下一步', '一定不用工具', '永遠不會犯錯'], answer: 0, explain: '沒錯。這就是動態決策的核心。' }
    ]
  },
  {
    id: 11, world: 4, shortTitle: 'MCP、Skill、Memory',
    title: 'Agent 要怎麼接工具、照 SOP、記進度？',
    subtitle: '把三個難名詞拆成「怎麼連、怎麼做、記什麼」。',
    idea: 'MCP 可以先想成共通連接方式；Skill 像可重用 SOP；Memory 則保存真正需要跨步驟或跨任務延續的狀態。',
    storyTitle: '把 Agent 想成一位剛到公司的數位同事',
    story: '他要做月結差異分析，就得接得到 SAP / MES、知道公司對帳 SOP，也要記得「哪些工單查過、哪些還有疑點」。',
    flow: ['MCP / Connector 接能力', 'Skill 提供做法', 'Memory 保存狀態', 'Agent 按任務組合使用'],
    remember: ['Tool = 能做什麼；Skill = 這件事通常怎麼做；Agent = 現在該做什麼。', 'Memory 不是「全部聊天永久保存」，應只留下對任務真正有用的狀態。'],
    deep: {
      title: '再多懂一點：把 AI 系統拆成「能力」與「程序知識」',
      lead: '這樣拆開後，工具可以重用，SOP 可以版本管理，Agent 也不必把所有規則硬塞在一段 Prompt。',
      terms: [
        {term:'MCP', say:'一種讓 AI 應用與外部工具、資源互動的標準化方式。'},
        {term:'Skill', say:'把某類工作的 instructions、resources、scripts 等打包成可重用能力。'},
        {term:'Memory', say:'保存未來步驟真的會用到的狀態，例如任務進度、偏好或關鍵事實。'}
      ],
      note: '標準化的價值在於：減少每個 Agent 都重新寫一套連接與 SOP。'
    },
    business: {
      title: '工作現場：企業 Agent 最大挑戰常不是模型，而是「權限與治理」',
      scenario: '同一個 SAP 工具，財務 Agent 可以查成本，但一般客服 Agent 不該有相同權限。Skill 也要有版本，Memory 也要有保留與刪除規則。',
      takeaway: 'Agent 架構一旦接入真實系統，IAM、Audit、版本管理就會變成核心設計。'
    },
    lab: {type:'mcp', title:'動手試：替數位同事組一套工作能力', instruction:'選 Tool、Skill、Memory，看看是否足夠完成任務。'},
    quiz: [
      { q: '「月結差異分析的標準步驟」最像？', options: ['Skill / SOP', 'Token', 'Temperature'], answer: 0, explain: '對。它描述的是「這件工作應該怎麼做」。' },
      { q: 'Memory 最適合保存？', options: ['所有內容無限保存', '真正需要延續的任務狀態', '每個網頁顏色'], answer: 1, explain: '沒錯。記有用的，不是記全部。' }
    ]
  },
  {
    id: 12, world: 4, shortTitle: 'Evals、安全、治理',
    title: 'AI 能不能上線，看的是「可靠」',
    subtitle: 'Demo 很會答只是起點；真實世界還要測錯誤、風險、成本與權限。',
    idea: 'Evals 讓你用固定案例反覆測品質；安全設計則要處理 Prompt Injection、資料洩漏、過度權限、錯誤工具操作等風險。',
    storyTitle: '像新車上路前，不只看外型漂亮',
    story: '正常路況能開不代表安全。還要測急煞、失效、碰撞與異常。AI 也一樣：正常問題會答不夠，還要故意拿難題、壞資料、惡意指令來測。',
    flow: ['先定義成功標準', '建立固定 Eval Set', '測安全與失敗情境', '上線後持續監控'],
    remember: ['Hallucination 是生成了看似合理但缺乏可靠依據的內容；Grounding、Citation、Tool/RAG 都能降低部分風險，但不能保證零錯誤。', 'Agent 越能「做事」，Excessive Agency、權限與 Audit Log 就越重要。'],
    deep: {
      title: '再多懂一點：品質、安全、成本，三條線都要看',
      lead: '一個答案很準，但慢 30 秒、每次很貴，或能越權刪資料，一樣不能算好系統。',
      terms: [
        {term:'Evals', say:'用固定任務與評分方式，重複衡量系統表現。'},
        {term:'Prompt Injection', say:'惡意內容企圖改寫系統原本的規則或誘導模型做不該做的事。'},
        {term:'Guardrails', say:'用權限、規則、驗證、人工確認等方式限制高風險行為。'}
      ],
      note: '真正成熟的 AI 系統會留下 log，知道「誰要求什麼、模型決定什麼、工具真的做了什麼」。'
    },
    business: {
      title: '工作現場：把「出錯」當成一定會發生來設計',
      scenario: '不要問「AI 會不會錯」，而要問「錯的時候會造成什麼？能不能被攔住？能不能追查？能不能復原？」',
      takeaway: '高風險動作要最小權限、必要時人工確認，而且所有工具操作都應可稽核。'
    },
    lab: {type:'eval', title:'動手試：一個 AI 系統到底能不能上線？', instruction:'調整準確率、引用率、工具成功率與高風險權限，看上線判斷怎麼變。'},
    quiz: [
      { q: '哪一種比較像可靠的 Evals？', options: ['Demo 成功一次就算過', '用固定案例反覆測並比較', '只看模型品牌'], answer: 1, explain: '對。能重複、能比較，才知道改版是真的變好。' },
      { q: 'AI 可以刪資料、下單後，最該補什麼？', options: ['更漂亮動畫', '權限、確認、紀錄與復原機制', '更長的回答'], answer: 1, explain: '沒錯。能做事越多，治理就越重要。' }
    ]
  }
]
