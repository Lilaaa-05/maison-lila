// Questions use everyday facts from the six chapters of Lila's handbook.
const quizQuestions = [
    ['Lila 是什么犬种？', ['约克夏', '博美', '马尔济斯', '吉娃娃'], 0, 'Lila 是一只约克夏。'],
    ['Lila 的生日是哪一天？', ['2022 年 5 月 25 日', '2022 年 6 月 25 日', '2023 年 5 月 25 日', '2022 年 5 月 5 日'], 0, 'Lila 出生于 2022 年 5 月 25 日。'],
    ['Lila 的星座是？', ['双子座', '金牛座', '狮子座', '白羊座'], 0, '5 月 25 日出生的 Lila 是双子座。'],
    ['Lila 的 MBTI 是？', ['ISFP-A', 'ENTJ-A', 'INTP-T', 'ESFJ-T'], 0, '她的小狗身份卡上写着 ISFP-A。'],
    ['Lila 出生在哪里？', ['神奈川県茅ヶ崎市', '东京都目黑区', '大阪府大阪市', '京都府京都市'], 0, 'Lila 在湘南的神奈川県茅ヶ崎市出生。'],
    ['家族里获得犬舍比赛冠军的是谁？', ['曾外祖父 Keisuke', 'Lila 自己', 'Lila 的姐姐', 'Lila 的妈妈'], 0, '曾外祖父 Keisuke 曾获得犬舍比赛冠军。'],
    ['和 Lila 沟通，主要使用哪种语言的口令？', ['英语', '日语', '法语', '西班牙语'], 0, '她主要听英语口令，例如 Sit、Down、Wait 和 Shake。'],
    ['下面哪组中文最容易让 Lila 有反应？', ['“喂”和“1，2，3”', '“坐下”和“趴下”', '“回来”和“出发”', '“吃饭”和“睡觉”'], 0, '她习惯听中文，但对“喂”和“1，2，3”以外的中文口令通常没有反应。'],
    ['听到哪句日语，Lila 会猜到终于有人有空陪她了？', ['ありがとうございます', 'おはようございます', 'おやすみなさい', 'いただきます'], 0, '主人常在会议结束时说「ありがとうございます」，她就把这句话和互动时间联系起来。'],
    ['对 Lila 来说，House 现在指哪里？', ['放饭碗的地方', '玄关门口', '沙发靠垫上', '外出背包里'], 0, '以前她在笼子里吃饭，所以现在放碗的地方就是 house。'],
    ['哪一项符合 Lila 的性格？', ['喜欢人类，不喜欢狗狗', '喜欢狗狗，不喜欢人类', '喜欢所有狗狗', '完全不喜欢和人互动'], 0, '她喜欢人类，但胆小，也不喜欢狗狗。'],
    ['下面哪一项是 Lila 的优点？', ['不乱叫、不抢东西吃', '最爱和陌生狗社交', '总是主动要求出门', '玩游戏从来不着急'], 0, '指南里的优点包括长得漂亮、喜欢人类、不乱叫、不抢东西吃。'],
    ['Lila 最喜欢哪种游戏组合？', ['扔玩具和拔河', '接飞盘和游泳', '钻隧道和跳高', '捉迷藏和滑板'], 0, '她最爱把玩具捡回来让人继续扔，也喜欢拔河。'],
    ['游戏时间怎么安排更容易让 Lila 理解？', ['尽量固定时间', '每次她盯着人就马上玩', '每天完全随机', '一直玩到深夜'], 0, '尽量固定玩耍时间，玩完放饭或给小零食，让她知道游戏结束。'],
    ['游戏之后，什么安排能帮助 Lila 知道“这轮结束啦”？', ['放饭或给小零食', '马上再开启一轮游戏', '一直拿玩具逗她', '把所有玩具都扔出去'], 0, '固定玩耍时间，结束后放饭或给小零食，是指南中的相处小秘诀。'],
    ['典型的一天里，Lila 大约几点醒来？', ['早上 7 点', '上午 11 点', '下午 2 点', '晚上 9 点'], 0, '大约早上 7 点醒来，她会先安静地观察还在睡觉的主人。'],
    ['早上 8 点左右，她会怎样试着叫主人起床？', ['盯着主人，试图用意念唤醒', '自己出门散步', '把饭碗藏起来', '一直在门口等快递'], 0, '她会盯着主人，偶尔觉得意念不成功还会叹气。'],
    ['早上 8:30 的闹钟响起时，Lila 通常会做什么？', ['冲到主人旁边催起床', '立刻进入深度睡眠', '安静躲进背包', '去窗边看风景'], 0, '闹钟响起后，她会冲到主人身边，催主人快点起床。'],
    ['早餐前，典型的玩耍时间有多久？', ['约 20 分钟', '约 2 分钟', '约 2 小时', '约 5 分钟'], 0, '早上 8:30–8:50 通常先玩 20 分钟，然后吃饭。'],
    ['中午第二次玩耍大约安排在哪个时间段？', ['12:00–12:20', '10:00–10:20', '14:00–14:20', '16:00–16:20'], 0, '中午 12:00–12:20 玩扔玩具、拔河，之后给零食。'],
    ['下午大约几点之后，Lila 会开始大睡特睡？', ['14 点后', '12 点整', '16 点后', '18 点后'], 0, '典型日程里，14 点前浅睡，14 点后进入大睡特睡模式。'],
    ['晚上的第三次玩耍通常持续多久？', ['约 30 分钟', '约 5 分钟', '约 90 分钟', '约 2 小时'], 0, '21:00–21:30 通常玩 30 分钟扔玩具、拔河，之后放饭。'],
    ['Lila 一天通常吃几顿正餐？', ['两顿', '一顿', '三顿', '四顿'], 0, '指南的一日两餐分为早餐和晚餐。'],
    ['指南里，正餐通常安排在什么时间？', ['早上 9 点和晚上 9 点', '早上 7 点和中午 12 点', '中午 12 点和下午 3 点', '下午 3 点和晚上 6 点'], 0, '通常早上 9 点和晚上 9 点放饭，也会根据照护者的时间调整。'],
    ['给零食的日常规则是什么？', ['尽量定时、定量', '只要盯着人就给', '每次路过都给', '完全不需要规律'], 0, '指南强调零食尽量定时定量，例如中午玩完后给。'],
    ['哪一组食物都在 Lila 的三星喜好名单里？', ['煮熟鸡肉和鸡蛋黄', '苹果和蓝莓', '草莓和红薯', '西兰花和苹果'], 0, '煮熟鸡胸肉、鸡腿肉和少量鸡蛋黄都标注为三星喜好。'],
    ['在 Lila 的食物喜好名单里，苹果是几星？', ['一星', '两星', '三星', '没有出现在名单里'], 0, '苹果和蓝莓标为一星，草莓等标为两星。'],
    ['走近熟悉的家附近，Lila 通常会有什么反应？', ['加速往家走', '立刻原地睡觉', '躲进咖啡厅', '一直往相反方向走'], 0, '接近住处时，她会加速拽着人回家，想快点结束散步。'],
    ['Lila 在外面很害怕哪类声音和物体？', ['没熄火的汽车和摩托车', '安静的公园长椅', '没有声音的路牌', '地上的落叶'], 0, '她很怕没熄火的汽车、摩托车，尤其是搬货时的动静。'],
    ['指南提到，Lila 经常去的宠物酒店叫什么？', ['POOCHIES', 'HAPPY PAWS', 'LITTLE HOUSE', 'DOG GARDEN'], 0, '照护备忘里提到她常去的酒店是 POOCHIES。']
].map(([question, options, answer, explanation], id) => ({id, question, options, answer, explanation}));

function shuffleQuizItems(items, random = Math.random) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function drawQuizQuestions(random = Math.random) {
    return shuffleQuizItems(quizQuestions, random).slice(0, 10).map(question => {
        const options = shuffleQuizItems(question.options.map((text, index) => ({text, index})), random);
        return {...question, options: options.map(option => option.text), answer: options.findIndex(option => option.index === question.answer)};
    });
}

function gradeQuiz(questions, answers) {
    const score = questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0);
    return {score, passed: score >= 8};
}

const quizRoot = document.querySelector('#quiz-stage');
let examQuestions = [];
let examAnswers = [];
let examIndex = 0;
let examSubmitted = false;

function startQuiz() {
    examQuestions = drawQuizQuestions();
    examAnswers = Array(10).fill(null);
    examIndex = 0;
    examSubmitted = false;
    renderQuizQuestion();
}

function focusQuizHeading() {
    quizRoot.scrollIntoView({block: 'start', behavior: 'instant'});
    quizRoot.querySelector('[tabindex="-1"]').focus({preventScroll: true});
}

function renderQuizQuestion(message = '') {
    const question = examQuestions[examIndex];
    const answered = examAnswers.filter(answer => answer !== null).length;
    quizRoot.innerHTML = `
        <div class="exam-progress"><span>QUESTION ${String(examIndex + 1).padStart(2, '0')} / 10</span><span>已答 ${answered} / 10</span></div>
        <progress value="${answered}" max="10" aria-label="答题进度">${answered} / 10</progress>
        <nav class="question-jumps" aria-label="选择题目">${examQuestions.map((_, index) => `<button type="button" data-question="${index}" class="${index === examIndex ? 'current' : ''} ${examAnswers[index] !== null ? 'answered' : ''}" ${index === examIndex ? 'aria-current="step"' : ''} aria-label="第 ${index + 1} 题，${examAnswers[index] === null ? '未答' : '已答'}">${index + 1}</button>`).join('')}</nav>
        <form id="exam-form" novalidate>
            <fieldset><legend tabindex="-1">${question.question}</legend>
                <div class="exam-options">${question.options.map((option, index) => `<label class="exam-option"><input type="radio" name="exam-answer" value="${index}" ${examAnswers[examIndex] === index ? 'checked' : ''}><span class="option-letter">${'ABCD'[index]}</span><span>${option}</span></label>`).join('')}</div>
            </fieldset>
            <p class="exam-message" role="status">${message}</p>
            <div class="exam-controls"><button type="button" class="exam-secondary" id="exam-prev" ${examIndex === 0 ? 'disabled' : ''}>← 上一题</button><span>每题 1 分 · 8 分合格</span>${examIndex === 9 ? '<button type="submit" class="primary-btn">交卷，看看成绩 ↗</button>' : '<button type="button" class="primary-btn" id="exam-next">下一题 →</button>'}</div>
        </form>`;
    quizRoot.querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => {
        examIndex = Number(button.dataset.question);
        renderQuizQuestion();
    }));
    quizRoot.querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
        examAnswers[examIndex] = Number(input.value);
        // Update only progress so keyboard focus stays on the chosen radio.
        const answered = examAnswers.filter(answer => answer !== null).length;
        quizRoot.querySelector('progress').value = answered;
        quizRoot.querySelector('.exam-progress span:last-child').textContent = `已答 ${answered} / 10`;
        const jump = quizRoot.querySelector(`[data-question="${examIndex}"]`);
        jump.classList.add('answered');
        jump.setAttribute('aria-label', `第 ${examIndex + 1} 题，已答`);
        quizRoot.querySelector('.exam-message').textContent = '';
    }));
    quizRoot.querySelector('#exam-prev').addEventListener('click', () => { if (examIndex > 0) { examIndex--; renderQuizQuestion(); } });
    quizRoot.querySelector('#exam-next')?.addEventListener('click', () => { examIndex++; renderQuizQuestion(); });
    quizRoot.querySelector('form').addEventListener('submit', event => {
        event.preventDefault();
        if (examSubmitted) return;
        const unanswered = examAnswers.filter(answer => answer === null).length;
        if (unanswered) {
            examIndex = examAnswers.indexOf(null);
            renderQuizQuestion(`还有 ${unanswered} 题未作答，已跳转到第一道未答题。`);
            return;
        }
        examSubmitted = true;
        renderQuizResult();
    });
    focusQuizHeading();
}

function renderQuizResult() {
    const {score, passed} = gradeQuiz(examQuestions, examAnswers);
    quizRoot.innerHTML = `
        <div class="exam-result ${passed ? 'passed' : 'try-again'}">
            <span class="card-label">LILA CERTIFICATION · RESULT</span><span class="result-sticker" aria-hidden="true">${passed ? '✿' : '♡'}</span>
            <h3 tabindex="-1">${passed ? '合格！Lila 认证亲友。' : '差一点点，再认识我一些。'}</h3>
            <div class="exam-score">${score}<span> / 10 分</span></div>
            <p>${passed ? '恭喜通过认定考试！你已经很懂这位小朋友啦。' : '8 分即可合格。看看下面的解析，下次一定更了解 Lila。'}</p>
            <button type="button" class="primary-btn" id="exam-retry">重新随机抽 10 题 ↻</button>
        </div>
        <div class="review-heading"><h3>答案与小解析</h3><span>答对 ${score} 题 · 答错 ${10 - score} 题</span></div>
        <div class="exam-review">${examQuestions.map((question, index) => {
            const correct = examAnswers[index] === question.answer;
            return `<details class="review-item ${correct ? 'correct' : 'incorrect'}" ${correct ? '' : 'open'}><summary><span class="review-mark">${correct ? '✓' : '×'}</span><span>${index + 1}. ${question.question}</span><small>${correct ? '答对啦' : '再记一下'}</small></summary><div class="review-answer"><p>你的答案：${question.options[examAnswers[index]]}</p><p><strong>正确答案：${question.options[question.answer]}</strong></p><p>${question.explanation}</p></div></details>`;
        }).join('')}</div>`;
    quizRoot.querySelector('#exam-retry').addEventListener('click', startQuiz);
    focusQuizHeading();
}

document.querySelector('#exam-start').addEventListener('click', startQuiz);
