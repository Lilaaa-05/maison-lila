        const lilaFacts = [
            '🎂 我在湘南出生，那里有海。',
            '🧍‍♀️ 我有一个姐姐好像被一个住横滨的家庭用奔驰接走了',
            '🐶 我只见过我爸爸一面，他见到我竟然发抖（遗传？）',
            '🏆 我的曾外祖父获过犬舍比赛冠军',
            '🎾 我最爱玩扔玩具和拔河',
            '🐔 我最爱吃鸡肉和鸡蛋黄',
            '🏠 没人在家时候我就睡觉，只要好好睡醒觉就会有人陪我玩',
            '🔔 门铃响是不是有人来跟我玩！',
            '😴 到底电脑有什么好看一天到晚看电脑',
            '⏰ 每天我都是最早醒！',
            '😨 不喜欢狗，感觉他们会咬我',
            '🥗 我爱吃生青菜和包菜',
            '🚫 不能给我吃巧克力、葡萄、牛油果',
            '🛀 我不喜欢洗澡',
            '🗻 我看过富士山，你们爬过吗？',
            '🌸 我家附近樱花可好看了',
            '🌲 有些狗竟然有花粉症！反正我没有。',
            '☕️ 目黑川附近的咖啡厅我基本都去过了',
            '🚶 我在外面不敢吃东西，有毒！',
            '🎾 我最喜欢玩玩玩玩',
            '🐶 外面的狗老闻我，怕！',
            '👃 我的嗅觉很灵敏',
            '⚓️ 谢谢你们带我看东京湾！',
            '🧍‍♂️ 据说小民叔叔住附近，不知道能不能遇见他！'
        ];


const buttons = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
function selectSection(id, focus = false) {
    if (!panels.some(panel => panel.id === id)) return;
    buttons.forEach(button => {
        const selected = button.dataset.module === id;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
        if (selected && focus) button.focus();
    });
    panels.forEach(panel => {
        panel.hidden = panel.id !== id;
        panel.classList.toggle('active', panel.id === id);
    });
    history.replaceState(null, '', '#' + id);
    if (focus) showSecret();
}
buttons.forEach((button, index) => {
    button.addEventListener('click', () => selectSection(button.dataset.module));
    button.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = buttons.length - 1;
        if (next !== undefined) { event.preventDefault(); selectSection(buttons[next].dataset.module, true); buttons[next].scrollIntoView({block: 'nearest', inline: 'nearest'}); }
    });
});
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => {
    selectSection(button.dataset.go);
    document.querySelector('.nav-container').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
}));
window.addEventListener('hashchange', () => selectSection(location.hash.slice(1)));
selectSection(location.hash.slice(1) || 'intro');
// Reuse one toast: each click refreshes the secret and its lifetime.
let factIndex = -1;
let secretTimer;
const secretToast = document.querySelector('#secret-toast');
function showSecret() {
    let next = Math.floor(Math.random() * lilaFacts.length);
    if (next === factIndex) next = (next + 1) % lilaFacts.length;
    factIndex = next;
    document.querySelector('#lila-fact').textContent = lilaFacts[next];
    clearTimeout(secretTimer);
    secretToast.hidden = false;
    secretTimer = setTimeout(() => { secretToast.hidden = true; }, 4000);
}
document.addEventListener('click', showSecret);
window.addEventListener('hashchange', showSecret);
showSecret();
const now = new Date();
const today = new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(now);
const value = type => Number(today.find(part => part.type === type).value);
let months = (value('year') - 2022) * 12 + value('month') - 5 - (value('day') < 25 ? 1 : 0);
document.querySelector('#age').textContent = months >= 0 ? `· ${Math.floor(months / 12)}岁${months % 12 ? months % 12 + '个月' : ''}` : '';
document.querySelectorAll('.module img').forEach(img => {img.loading = 'lazy'; img.decoding = 'async';});
document.querySelectorAll('#schedule tbody td:last-child').forEach(cell => {
    if (cell.textContent.trim() === '-') cell.classList.add('empty-note');
});
