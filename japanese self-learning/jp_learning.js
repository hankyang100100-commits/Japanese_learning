const allWords = [
    // 第 6 課
    { j: "たべます", c: "吃" }, { j: "のみます", c: "喝" }, { j: "すいます", c: "吸(菸)" },
    { j: "みます", c: "看" }, { j: "ききます", c: "聽" }, { j: "よみます", c: "讀" },
    { j: "かきます", c: "寫、畫" }, { j: "かいます", c: "買" }, { j: "とります", c: "拍(照)" },
    { j: "しゃしん", c: "照片" }, { j: "いつも", c: "經常" }, { j: "ときどき", c: "有時" },
    // 第 7 課
    { j: "きります", c: "切、剪" }, { j: "あげます", c: "給" }, { j: "もらいます", c: "得到" },
    { j: "かします", c: "借出" }, { j: "かります", c: "借入" }, { j: "おしえます", c: "教" },
    { j: "ならいます", c: "學習" }, { j: "はさみ", c: "剪刀" }, { j: "パソコン", c: "電腦" },
    { j: "ケータイ", c: "手機" }, { j: "プレゼント", c: "禮物" },
    // 第 8 課 (新增單字)
    { j: "ハンサム[な]", c: "英俊的" }, { j: "きれい[な]", c: "漂亮的、乾淨的" },
    { j: "しずか[具]", c: "安靜的" }, { j: "にぎやか[な]", c: "熱鬧的" },
    { j: "ゆうめい[な]", c: "著名的" }, { j: "しんせつ[な]", c: "親切的" },
    { j: "げんき[な]", c: "健康的、有精神的" }, { j: "ひま[な]", c: "空閒的" },
    { j: "べんり[な]", c: "便利的" }, { j: "すてき[な]", c: "極好的、很棒的" },
    { j: "おおきい", c: "大的" }, { j: "ちいさい", c: "小的" },
    { j: "あたらしい", c: "新的" }, { j: "ふるい", c: "舊的" },
    { j: "いい", c: "好的" }, { j: "わるい", c: "壞的" },
    { j: "あつい", c: "熱的" }, { j: "さむい", c: "寒冷的(天氣)" },
    { j: "つめたい", c: "冰的、涼的" }, { j: "むずかしい", c: "困難的" },
    { j: "やさしい", c: "容易的、親切的" }, { j: "たかい", c: "貴的、高的" },
    { j: "やすい", c: "便宜的" }, { j: "ひくい", c: "矮的、低的" },
    { j: "おもしろい", c: "有趣的" }, { j: "おいしい", c: "好吃的" },
    { j: "いそがしい", c: "忙碌的" }, { j: "たのしい", c: "快樂的" },
    { j: "しろい", c: "白色的" }, { j: "くろい", c: "黑色的" },
    { j: "あかい", c: "紅色的" }, { j: "あおい", c: "藍色的" },
    { j: "さくら", c: "櫻花" }, { j: "やま", c: "山" },
    { j: "まち", c: "城鎮、街道" }, { j: "たべもの", c: "食物" },
    { j: "くるま", c: "汽車" }, { j: "ところ", c: "地方" },
    { j: "りょう", c: "宿舍" }, { j: "べんきょう", c: "學習、讀書" },
    { j: "せいかつ", c: "生活" }, { j: "おしごと", c: "工作" },
    { j: "どう", c: "如何" }, { j: "どんな", c: "什麼樣的" },
    { j: "とても", c: "很、非常" }, { j: "あまり", c: "不太(接否定)" },
    { j: "そして", c: "而且、然後" }, { j: "～が、～", c: "～但是～" },
    { j: "おげんきですか", c: "你好嗎？" }
];

let stats = JSON.parse(localStorage.getItem('jp_stats')) || {};
let currentSessionWords = [];
let currentIdx = 0;
let score = 0;

function hideAllCards() { ['home-card', 'quiz-card', 'notebook-card', 'result-card'].forEach(id => document.getElementById(id).style.display = 'none'); }
function goHome() { hideAllCards(); document.getElementById('home-card').style.display = 'block'; }
function startQuiz() { hideAllCards(); document.getElementById('quiz-card').style.display = 'block'; score = 0; currentIdx = 0; document.getElementById('score').innerText = '0'; prepareQuestions(); loadQuestion(); }
function showNotebook() { hideAllCards(); const listEl = document.getElementById('notebook-list'); document.getElementById('notebook-card').style.display = 'block'; listEl.innerHTML = ''; const wrongWords = allWords.filter(w => stats[w.j] && stats[w.j].wrong > 0); if (wrongWords.length === 0) { listEl.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">沒有錯題紀錄！</p>'; return; } wrongWords.sort((a, b) => stats[b.j].wrong - stats[a.j].wrong).forEach(w => { const item = document.createElement('div'); item.className = 'word-item'; item.innerHTML = `<div><span class="jp">${w.j}</span> <small>(${w.c})</small></div><div class="count">錯誤: ${stats[w.j].wrong}次</div>`; listEl.appendChild(item); }); }
function clearWrongHistory() { if(confirm('確定清空？')) { stats = {}; localStorage.setItem('jp_stats', JSON.stringify(stats)); showNotebook(); } }

function prepareQuestions() {
    let weightedWords = allWords.map(word => {
        const wordStats = stats[word.j] || { wrong: 0, count: 0 };
        const weight = (wordStats.wrong * 5) + (10 / (wordStats.count + 1));
        return { ...word, weight };
    });
    weightedWords.sort((a, b) => b.weight - a.weight);
    currentSessionWords = weightedWords.slice(0, 10).sort(() => Math.random() - 0.5);
}

function loadQuestion() {
    const word = currentSessionWords[currentIdx];
    document.getElementById('progress').innerText = `第 ${currentIdx + 1} / 10 題`;
    document.getElementById('question').innerText = word.c;
    document.getElementById('feedback').innerText = '';
    document.getElementById('next-btn').style.display = 'none';

    let options = [word.j];
    while(options.length < 4) {
        let randomWord = allWords[Math.floor(Math.random() * allWords.length)].j;
        if(!options.includes(randomWord)) options.push(randomWord);
    }
    options.sort(() => Math.random() - 0.5);

    const optionsEl = document.getElementById('options');
    optionsEl.innerHTML = '';
    const labels = ['A', 'B', 'C', 'D'];
    options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.innerHTML = `<strong>${labels[i]}.</strong> ${opt}`;
        btn.onclick = () => checkAnswer(btn, opt, word.j);
        optionsEl.appendChild(btn);
    });
}

function checkAnswer(selectedBtn, selectedJap, correctJap) {
    const allBtns = document.querySelectorAll('.option');
    allBtns.forEach(b => b.disabled = true);
    if(!stats[correctJap]) stats[correctJap] = { wrong: 0, count: 0 };
    stats[correctJap].count++;

    if (selectedJap === correctJap) {
        score++;
        selectedBtn.classList.add('correct-choice');
        document.getElementById('score').innerText = score;
        document.getElementById('feedback').innerText = "正解！🎯";
    } else {
        stats[correctJap].wrong++; 
        selectedBtn.classList.add('wrong-choice');
        allBtns.forEach(b => { if(b.innerHTML.includes(correctJap)) b.classList.add('correct-choice'); });
        document.getElementById('feedback').innerText = "記下來喔！";
    }
    localStorage.setItem('jp_stats', JSON.stringify(stats));
    document.getElementById('next-btn').style.display = 'inline-block';
}

document.getElementById('next-btn').onclick = () => {
    currentIdx++;
    if(currentIdx < 10) loadQuestion();
    else showFinalResult();
};

function showFinalResult() { hideAllCards(); document.getElementById('result-card').style.display = 'block'; document.getElementById('final-score').innerText = `本次得分：${score} / 10`; }
