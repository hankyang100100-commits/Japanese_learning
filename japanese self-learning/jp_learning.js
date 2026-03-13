// 完整題庫：從圖片中提取的所有單字
const allWords = [
    // 第 6 課
    { j: "たべます", c: "吃" }, { j: "のみます", c: "喝" }, { j: "すいます", c: "吸(菸)" },
    { j: "みます", c: "看" }, { j: "ききます", c: "聽" }, { j: "よみます", c: "讀" },
    { j: "かきます", c: "寫、畫" }, { j: "かいます", c: "買" }, { j: "とります", c: "拍(照)" },
    { j: "します", c: "做" }, { j: "あいます", c: "見面" }, { j: "ごはん", c: "飯、用餐" },
    { j: "あさごはん", c: "早餐" }, { j: "ひるごはん", c: "午餐" }, { j: "ばんごはん", c: "晚餐" },
    { j: "パン", c: "麵包" }, { j: "たまご", c: "雞蛋" }, { j: "にく", c: "肉" },
    { j: "さかな", c: "魚" }, { j: "やさい", c: "蔬菜" }, { j: "くだもの", c: "水果" },
    { j: "みず", c: "水" }, { j: "おちゃ", c: "茶" }, { j: "こうちゃ", c: "紅茶" },
    { j: "ぎゅうにゅう", c: "牛奶" }, { j: "ジュース", c: "果汁" }, { j: "ビール", c: "啤酒" },
    { j: "おさけ", c: "酒" }, { j: "ビデオ", c: "錄影帶" }, { j: "えいが", c: "電影" },
    { j: "てがみ", c: "信" }, { j: "レポート", c: "報告" }, { j: "しゃしん", c: "照片" },
    { j: "みせ", c: "商店" }, { j: "レストラン", c: "餐廳" }, { j: "にわ", c: "院子" },
    { j: "しゅくだい", c: "作業" }, { j: "テニス", c: "網球" }, { j: "サッカー", c: "足球" },
    { j: "おはなみ", c: "賞花" }, { j: "ときどき", c: "有時" }, { j: "いつも", c: "經常" },
    // 第 7 課
    { j: "きります", c: "切、剪" }, { j: "おくります", c: "寄、送" }, { j: "あげます", c: "給" },
    { j: "もらいます", c: "得到" }, { j: "かします", c: "借出" }, { j: "かります", c: "借入" },
    { j: "おしえます", c: "教" }, { j: "ならいます", c: "學習" }, { j: "かけます", c: "打(電話)" },
    { j: "て", c: "手" }, { j: "はし", c: "筷子" }, { j: "スプーン", c: "湯匙" },
    { j: "ナイフ", c: "刀子" }, { j: "フォーク", c: "叉子" }, { j: "はさみ", c: "剪刀" },
    { j: "パソコン", c: "電腦" }, { j: "ケータイ", c: "手機" }, { j: "メール", c: "電子郵件" },
    { j: "ねんがじょう", c: "賀年卡" }, { j: "パンチ", c: "打孔機" }, { j: "ホッチキス", c: "釘書機" },
    { j: "セロテープ", c: "膠帶" }, { j: "けしゴム", c: "橡皮擦" }, { j: "かみ", c: "紙" },
    { j: "はな", c: "花" }, { j: "シャツ", c: "襯衫" }, { j: "プレゼント", c: "禮物" },
    { j: "にもつ", c: "行李" }, { j: "おかね", c: "錢" }, { j: "きっぷ", c: "車票" },
    { j: "クリスマス", c: "聖誕節" }, { j: "もう", c: "已經" }, { j: "まだ", c: "尚未" }
];

const TOTAL_QUESTIONS = 10;
let currentSessionWords = [];
let currentIdx = 0;
let score = 0;

// 初始化學習數據 (LocalStorage)
let stats = JSON.parse(localStorage.getItem('jp_stats')) || {};

function prepareQuestions() {
    // 評分算法：錯越多、沒考過的權重越高
    let weightedWords = allWords.map(word => {
        const wordStats = stats[word.j] || { wrong: 0, count: 0 };
        // 權重 = 錯題數 * 5 + (10 / (考過次數 + 1))
        const weight = (wordStats.wrong * 5) + (10 / (wordStats.count + 1));
        return { ...word, weight };
    });

    // 依權重排序並取前 10 名，再隨機打亂
    weightedWords.sort((a, b) => b.weight - a.weight);
    currentSessionWords = weightedWords.slice(0, TOTAL_QUESTIONS).sort(() => Math.random() - 0.5);
}

function loadQuestion() {
    const word = currentSessionWords[currentIdx];
    document.getElementById('progress').innerText = `第 ${currentIdx + 1} / ${TOTAL_QUESTIONS} 題`;
    document.getElementById('question').innerText = word.c;
    document.getElementById('feedback').innerText = '';
    document.getElementById('next-btn').style.display = 'none';

    // 生成選項：1個正確 + 3個隨機不同的日文單字
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

    // 更新統計數據
    if(!stats[correctJap]) stats[correctJap] = { wrong: 0, count: 0 };
    stats[correctJap].count++;

    if (selectedJap === correctJap) {
        score++;
        selectedBtn.classList.add('correct-choice');
        document.getElementById('score').innerText = score;
        document.getElementById('feedback').innerText = "正解！🎯";
    } else {
        stats[correctJap].wrong++; // 答錯增加權重
        selectedBtn.classList.add('wrong-choice');
        allBtns.forEach(b => {
            if(b.innerText.includes(correctJap)) b.classList.add('correct-choice');
        });
        document.getElementById('feedback').innerText = "遺憾！下次加油。";
    }

    localStorage.setItem('jp_stats', JSON.stringify(stats));
    document.getElementById('next-btn').style.display = 'inline-block';
}

document.getElementById('next-btn').onclick = () => {
    currentIdx++;
    if(currentIdx < TOTAL_QUESTIONS) {
        loadQuestion();
    } else {
        showResult();
    }
};

function showResult() {
    document.getElementById('quiz-card').style.display = 'none';
    document.getElementById('result-card').style.display = 'block';
    document.getElementById('final-score').innerText = `本次測驗得分：${score} / ${TOTAL_QUESTIONS}`;
}

// 啟動
prepareQuestions();
loadQuestion();