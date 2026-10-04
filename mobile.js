const leaf = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="30" viewBox="0 0 26 30" fill="none"><path fill="#D895AA" d="M23.8 2.2C13.2 2.4 5.1 7.1 3.2 14.3c-1.7 6.6 2.7 11.5 8.5 10.2 7.4-1.7 11.3-10.6 12.1-22.3Z"/><path d="M5.1 23.8c4-5.4 8.3-9.6 14.4-15.1M11.9 16.3l.1 5.1M15.7 12.7l4.3.5" stroke="#7A4A34" stroke-linecap="round" stroke-width="1.35"/></svg>';
const iconPaths = {
  today: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-11 5 2 2 4-4"/>',
  students: '<circle cx="9" cy="7" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-12 4h2m3 0h2m-7 3h2"/>',
  parent: '<path d="M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v16h-6a3 3 0 0 0-2 1 3 3 0 0 0-2-1H4zM12 5v16"/>',
  account: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>'
};
const icon = key => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + iconPaths[key] + '</svg>';
const brand = () => '<div class="brand"><span>Tova</span>' + leaf + '</div>';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const btn = (label, action, kind = '') => '<button type="button" class="' + kind + '" data-action="' + action + '">' + esc(label) + '</button>';
const tag = (label, color = '') => '<span class="tag ' + color + '">' + esc(label) + '</span>';
const note = (title, body) => '<div class="note"><h3>' + title + '</h3><p>' + body + '</p></div>';
const heading = (eyebrow, title, action = '') => '<header class="page-header"><p class="mono">' + eyebrow + '</p><h1>' + title + '</h1>' + action + '</header>';
const screenNames = {today:'教師 · 今日',students:'教師 · 學生',student:'教師 · 學生詳情',calendar:'教師 · 月曆',record:'教師 · 課程紀錄',parent:'家長 · 學習紀錄','parent-calendar':'家長 · 課程安排','parent-record':'家長 · 紀錄詳情',login:'帳號登入'};
const colorNames = {rose:'豆沙紅',sage:'鼠尾草綠',blue:'霧藍',gold:'麥金',lilac:'丁香紫'};
let screen = 'today', selectedStudent = 0, recordStudent = 0, sheet = null;
let subjectMenu = false, selectedSubjects = [], searchValue = '', historyIndex = 0, loginRole = 'parent';
let selectedDate = '2026-10-02', shownMonth = '2026-10', calendarView = 'month', createdLesson = null;
let flash = '', shareError = false;
let dayModalScroll = null, dayModalCloseTimer = null;
const addedLessons = [];
const subjects = ['數學','英文','國文','理化'];
const subjectColors = ['rose','sage','blue','gold'];
const students = [
  {name:'陳品安',school:'光華國中',grade:'國二',subjects:['數學'],color:'rose',next:'10/06 16:00',parent:'陳媽媽 · 已連結'},
  {name:'林以晴',school:'育成高中',grade:'高一',subjects:['英文'],color:'sage',next:'10/08 14:00',parent:'林媽媽 · 已連結'},
  {name:'許書妍',school:'明德國中',grade:'國三',subjects:['國文'],color:'blue',next:'10/09 19:00',parent:'許爸爸 · 已連結'},
  {name:'王子謙',school:'大同國中',grade:'國三',subjects:['數學','理化'],color:'gold',next:'10/07 18:30',parent:'王媽媽 · 已連結'},
  {name:'張若希',school:'仁愛國中',grade:'國一',subjects:['數學'],color:'lilac',next:'10/08 17:00',parent:'尚未連結'}
];
const lessonDates = [
  ['2026-10-02','14:00',90,1,'閱讀理解'],['2026-10-02','16:00',90,0,'一元一次方程式'],['2026-10-02','19:00',60,2,'作文練習'],
  ['2026-10-06','16:00',90,0,'一元一次方程式應用'],['2026-10-07','18:30',90,3,'理化複習'],['2026-10-08','14:00',90,1,'閱讀理解'],
  ['2026-10-08','17:00',60,4,'數學複習'],['2026-10-09','19:00',60,2,'作文練習'],['2026-10-13','16:00',90,0,'方程式練習'],
  ['2026-10-15','14:00',90,1,'英文閱讀'],['2026-10-20','16:00',90,0,'應用題'],['2026-10-27','16:00',90,0,'數學複習']
];
const drafts = new Map();
const history = [['09/29（二）','正負數運算'],['09/25（五）','分數與小數'],['09/22（二）','計算順序練習']];
function draft(id = recordStudent) {
  if (!drafts.has(id)) drafts.set(id, {
    raw:'複習移項與去括號。能口頭說明解題步驟，遇到負號時仍需提醒；今天獨立完成 8 題中的 6 題。',
    summary:'本次學習\n一元一次方程式：移項、去括號與驗算。\n\n學習進展\n能獨立完成基本移項，正確率 75%；開始主動寫出驗算。\n\n需要練習\n負號與括號的轉換仍需提醒，建議每題標記符號。\n\n下次計畫\n練習含括號的方程式，再加入生活情境應用題。',
    feedback:students[id].name + '今天能主動說明解題步驟。請完成習作第 22 頁第 1–4 題，留意負號與括號。',
    saved:false, published:null
  });
  return drafts.get(id);
}
function timeRange(time, minutes) {
  const [h,m] = time.split(':').map(Number), end = h * 60 + m + minutes;
  return time + '–' + String(Math.floor(end / 60) % 24).padStart(2,'0') + ':' + String(end % 60).padStart(2,'0');
}
function dateLabel(value) {
  const date = new Date(value + 'T12:00:00+08:00');
  return value.slice(5).replace('-','/') + '（' + '日一二三四五六'[date.getUTCDay()] + '）';
}
function go(next) {
  screen = next === 'mobile' ? 'parent' : next;
  sheet = null; subjectMenu = false; shareError = false; flash = '';
  render(); window.scrollTo(0,0);
}
function nav(parent, active) {
  const items = parent ? [['parent','學習紀錄','parent'],['parent-calendar','課程安排','calendar'],['account','帳號','account']] : [['today','今日','today'],['students','學生','students'],['calendar','課程','calendar']];
  return '<nav class="bottom-nav" aria-label="主要導覽">' + items.map(([target,label,key]) =>
    '<button type="button" data-action="' + target + '" ' + (active === target ? 'aria-current="page"' : '') + '>' + icon(key) + '<span>' + label + '</span></button>'
  ).join('') + '</nav>';
}
function shell(content, active = 'today', parent = false) {
  return '<div class="shell"><header class="app-header">' + brand() + '<div class="role"><button type="button" data-action="account" aria-label="查看帳號">' + (parent?'陳媽媽':'范老師') + '</button>' + tag(parent?'家長端':'教師端','rose') + '</div></header><main class="workspace">' + content + '<small>設計示範 · 範例資料</small></main>' + nav(parent,active) + '</div>';
}
function today() {
  return shell(heading('2026/10/02 · 星期五','今天也準備好了。',btn('＋ 安排課程','schedule','primary')) +
    '<div class="stats"><article class="card stat"><small>今日課程</small><b>3 <small>堂</small></b><small>下一堂 16:00</small></article><article class="card stat"><small>在學學生</small><b>' + students.length + ' <small>位</small></b><small>用顏色辨識學生</small></article></div>' +
    '<div class="between"><h2>今日議程</h2>' + btn('全部課程 →','calendar','quiet') + '</div><section class="card agenda">' +
    lessonDates.filter(l=>l[0]==='2026-10-02').map((l,i) => {
      const s = students[l[3]];
      return '<article class="agenda-row ' + (i===1?'next':'') + '"><div class="between"><span class="mono">' + timeRange(l[1],l[2]) + '</span>' + tag(i===0?'已完成':i===1?'下一堂':'已排定',i===1?'rose':'') + '</div><div class="student-title"><i class="dot ' + s.color + '"></i><div class="stack tight"><h2>' + s.name + '</h2><small>' + s.subjects.join('、') + ' · ' + l[4] + '</small></div></div><button type="button" class="' + (i===1?'primary':'') + '" data-record-student="' + l[3] + '">' + (i===1?'完成並撰寫紀錄':i===0?'檢視紀錄':'課程詳情') + '</button></article>';
    }).join('') + '</section>' + note('還有 1 堂課待整理','林以晴的課程已完成。寫好紀錄，確認後再分享給家長。'));
}
function tagOptions(context = 'filter') {
  const selected = context === 'filter' ? selectedSubjects : students[selectedStudent].subjects;
  return '<div class="search-dropdown"><small>' + (context==='filter'?'選擇科目搜尋，可多選':'選擇這位學生的科目，可多選') + '</small><div class="row wrap">' +
    subjects.map((s,i)=>'<button type="button" class="tag ' + subjectColors[i%4] + '" data-subject="' + esc(s) + '" data-context="' + context + '" aria-pressed="' + selected.includes(s) + '">' + (selected.includes(s)?'✓ ':'') + esc(s) + '</button>').join('') +
    '</div><div class="rule"></div><div class="new-tag"><input id="new-subject" placeholder="新科目名稱" aria-label="新科目名稱"><button type="button" data-action="create-tag">＋ 建立</button></div>' +
    (context==='filter'?btn('完成篩選','close-tags','full primary'):'') + '</div>';
}
function studentList() {
  const matches = students.map((s,id)=>({s,id})).filter(({s}) => (s.name+s.school+s.subjects.join('')).includes(searchValue) && (!selectedSubjects.length||selectedSubjects.some(t=>s.subjects.includes(t))));
  return shell(heading(students.length + ' 位在學學生','學生',btn('＋ 新增學生','new-student','primary')) +
    '<div class="searchbox"><label for="student-search" class="sr-only">搜尋姓名、學校或科目</label><input id="student-search" value="' + esc(searchValue) + '" placeholder="搜尋姓名、學校或科目" aria-expanded="' + subjectMenu + '" autocomplete="off">' + (subjectMenu?tagOptions():'') + '</div>' +
    '<div class="row wrap">' + selectedSubjects.map(s=>'<button type="button" class="tag rose" data-subject="' + esc(s) + '" data-context="filter">' + esc(s) + ' ×</button>').join('') + '<small>' + matches.length + ' 位符合條件</small>' + (selectedSubjects.length?btn('清除','clear-tags','quiet'):'') + '</div>' +
    '<section class="stack" aria-label="學生名單">' + matches.map(({s,id}) => '<article class="card student-row"><div class="between"><div class="student-title"><i class="dot ' + s.color + '"></i><div class="stack tight"><h2>' + esc(s.name) + '</h2><small>' + esc(s.school) + ' · ' + esc(s.grade) + '</small></div></div><button type="button" class="quiet" data-student="' + id + '">查看 →</button></div><div class="row wrap">' + s.subjects.map((subject,i)=>tag(subject,subjectColors[i%4])).join('') + '</div><div class="student-meta student-next"><small>下次課程</small><span class="mono">' + (createdLesson&&createdLesson.student===id?dateLabel(createdLesson.date)+' '+createdLesson.time:s.next) + '</span></div><small>' + esc(s.parent) + '</small></article>').join('') + (!matches.length?'<div class="empty">尚未找到學生，請調整搜尋或標籤。</div>':'') + '</section>','students');
}
function student() {
  const s = students[selectedStudent];
  return shell(heading('學生資料',esc(s.name),btn('＋ 新增上課日期','schedule','primary')) +
    '<div class="row wrap">' + tag(s.grade) + s.subjects.map(subject=>tag(subject,s.color)).join('') + '</div><p class="muted">' + esc(s.school) + ' · 在學學生</p>' +
    '<section class="card stack"><h2>學生顏色</h2><div class="swatches">' + Object.entries(colorNames).map(([c,name])=>'<button type="button" class="swatch ' + c + (s.color===c?' selected':'') + '" data-color="' + c + '" aria-label="' + name + '" aria-pressed="' + (s.color===c) + '"><i></i></button>').join('') + '</div><small>' + colorNames[s.color] + ' · 同步用於所有課程與月曆</small><div class="rule"></div><div class="between"><h3>科目標籤</h3>' + btn('編輯','edit-subject','quiet') + '</div><div class="row wrap">' + s.subjects.map(subject=>tag(subject,s.color)).join('') + '</div><div class="rule"></div><h3>家長帳號</h3><p>' + esc(s.parent) + '</p><small>家長使用自己的帳號，查看教師已分享的紀錄。</small></section>' +
    '<section class="card stack"><h2>課程與紀錄</h2><div class="between wrap"><span class="mono">10/02（五）16:00–17:30</span>' + tag('紀錄草稿','rose') + '</div><p>課程已完成 · 待整理</p><button type="button" data-record-student="' + selectedStudent + '">撰寫紀錄 →</button>' +
    (createdLesson&&createdLesson.student===selectedStudent?'<div class="rule"></div><span class="mono">' + dateLabel(createdLesson.date) + ' ' + timeRange(createdLesson.time,createdLesson.duration) + '</span><p>' + esc(createdLesson.topic) + '</p>' + tag('已排定','sage'):'') + '</section>','students');
}
function allLessons(parent = false) {
  const base = lessonDates.map(([date,time,duration,student,topic])=>({date,time,duration,student,topic}));
  base.push(...addedLessons);
  return base.filter(l=>!parent||l.student===0).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
}
function lessonCard(l, parent) {
  const s = students[l.student];
  return '<article class="lesson-card ' + s.color + '"><div class="between"><strong>' + esc(s.name) + '</strong><span class="mono">' + timeRange(l.time,l.duration) + '</span></div><p>' + esc(l.topic) + '</p><div class="between">' + tag(s.subjects[0]||'未設定科目',s.color) +
    (l.date==='2026-10-02'?'<button type="button" class="quiet" ' + (parent?'data-action="parent-record"':'data-record-student="' + l.student + '"') + '>查看紀錄 →</button>':tag('已排定')) + '</div></article>';
}
function calendar(parent = false) {
  const lessons = allLessons(parent), [year,month] = shownMonth.split('-').map(Number);
  const first = new Date(Date.UTC(year,month-1,1)), offset = (first.getUTCDay()+6)%7;
  const count = new Date(Date.UTC(year,month,0)).getUTCDate();
  const slots = Math.ceil((count+offset)/7)*7;
  const monthLessons = lessons.filter(l=>l.date.startsWith(shownMonth));
  const cells = Array.from({length:slots},(_,i)=>{
    const date = new Date(Date.UTC(year,month-1,1+i-offset));
    const key = date.toISOString().slice(0,10), dayLessons = lessons.filter(l=>l.date===key);
    const names = dayLessons.map(l=>students[l.student].name);
    return '<button type="button" class="calendar-day' + (!key.startsWith(shownMonth)?' outside':'') + (key===selectedDate?' selected':'') + (createdLesson?.date===key?' created':'') + '" data-date="' + key + '" aria-label="' + esc(key + '，' + dayLessons.length + ' 堂課' + (names.length?'，'+names.join('、'):'')) + '" aria-haspopup="dialog" aria-pressed="' + (key===selectedDate) + '"><span class="calendar-date">' + date.getUTCDate() + '</span><span class="calendar-dots" aria-hidden="true">' + dayLessons.map(l=>'<i class="dot ' + students[l.student].color + '"></i>').join('') + '</span></button>';
  }).join('');
  const legendStudents = [...new Set(monthLessons.map(l=>l.student))];
  const pagination = '<div class="calendar-pagination">' + btn('‹ 上個月','previous-month') + btn('下個月 ›','next-month') + '</div>';
  return shell(heading(parent?'陳品安的課程':'LESSON PLANNING','課程',parent?'':btn('＋ 安排課程','schedule','primary')) +
    '<div class="calendar-toolbar"><div class="row"><h2>' + year + ' 年 ' + month + ' 月</h2>' + (shownMonth==='2026-10'?tag('當月'):'') + '</div><div class="view-toggle">' + btn('議程','view-agenda',calendarView==='agenda'?'active':'') + btn('月曆','view-month',calendarView==='month'?'active':'') + '</div></div>' +
    (legendStudents.length?'<div class="calendar-legend" aria-label="學生顏色圖例">' + legendStudents.map(id=>'<span><i class="dot ' + students[id].color + '" aria-hidden="true"></i>' + esc(students[id].name) + '</span>').join('') + '</div>':'') +
    (flash?'<div class="toast" role="status">' + esc(flash) + '</div>':'') +
    (calendarView==='month'?'<section class="card calendar" aria-label="月曆"><div class="calendar-grid">' + ['一','二','三','四','五','六','日'].map(d=>'<div class="weekday">' + d + '</div>').join('') + cells + '</div></section>' + pagination + '<small>每個色點代表一堂課；點選日期查看當天課程。</small>':
      '<div class="stack" aria-label="當月議程">' + monthLessons.map(l=>'<div class="stack tight"><small>' + dateLabel(l.date) + '</small>' + lessonCard(l,parent) + '</div>').join('') + (!monthLessons.length?'<div class="empty">這個月尚未安排課程。</div>':'') + '</div>' + pagination),
    parent?'parent-calendar':'calendar',parent);
}
function record() {
  const s = students[recordStudent], d = draft();
  return shell(heading(esc(s.name) + ' · 2026/10/02','課程紀錄') + (flash?'<div class="toast" role="status">' + esc(flash) + '</div>':'') +
    '<div class="row wrap">' + tag(s.subjects[0]||'課程',s.color) + tag('已完成') + '<span class="mono">16:00–17:30</span></div>' +
    '<section class="card record-section"><div class="between"><h2>01 原始筆記</h2>' + tag('✓ 已自動儲存') + '</div><small>僅教師可見</small><label for="raw-note">課堂觀察</label><textarea id="raw-note">' + esc(d.raw) + '</textarea><small class="saved-message" id="raw-save-status">最後儲存 17:42</small></section>' +
    '<section class="card record-section"><div class="between"><h2>02 課堂摘要</h2><span id="summary-status">' + tag(d.saved?'已儲存':'AI 草稿待確認',d.saved?'sage':'rose') + '</span></div><small>整理課堂重點，確認後再儲存。</small><label for="summary" class="sr-only">課堂摘要</label><textarea id="summary" class="summary">' + esc(d.summary) + '</textarea>' + btn('儲存摘要','save-summary','full primary') + '</section>' +
    '<section class="card record-section"><h2>03 家長可見紀錄</h2><small>用家長能了解的方式說明進展與課後練習。</small><label for="feedback" class="sr-only">家長可見紀錄</label><textarea id="feedback">' + esc(d.feedback) + '</textarea></section>' +
    '<section class="card stack"><div class="between"><h2>分享給家長</h2>' + tag(d.published?'已分享':'尚未分享',d.published?'sage':'rose') + '</div><p>' + esc(s.parent) + '</p>' + note('分享範圍','家長會看到日期、已確認摘要與教師回饋。私人筆記與草稿只在教師端顯示。') +
    (s.parent==='尚未連結'?'<small>請先連結家長帳號，再分享課程紀錄。</small>':btn('預覽分享內容','preview-share','full') + btn('確認並分享','share','full primary')) +
    '<small id="share-help" class="' + (shareError?'validation':'') + '">' + (shareError?'請先儲存摘要，再確認分享內容。':d.saved?'摘要已儲存，可預覽並確認分享。':'請先儲存摘要，再確認分享內容。') + '</small></section>','calendar');
}
function parent() {
  const s = students[0], published = draft(0).published, next = createdLesson?.student===0?createdLesson:{date:'2026-10-06',time:'16:00',duration:90,topic:'一元一次方程式應用'};
  return shell(heading('陳媽媽 · 家長帳號','每一次進步，都看得見。') +
    '<div class="student-title"><i class="dot ' + s.color + '"></i><h2>陳品安 · 國二</h2>' + tag('數學',s.color) + '</div><section class="card stack"><small>下一堂課</small><h2>' + dateLabel(next.date) + '</h2><span class="mono">' + timeRange(next.time,next.duration) + '</span><p>' + esc(next.topic) + '</p>' + btn('查看課程安排 →','parent-calendar','full') + '</section><h2>歷次課程紀錄</h2><section class="stack" aria-label="已分享課程紀錄">' +
    (published?historyButton(-1,'10/02（五）','一元一次方程式'):'') +
    history.map(([date,title],i)=>historyButton(i,date,title)).join('') +
    '</section><small>只顯示已連結孩子的課程與教師已分享的正式紀錄。</small>','parent',true);
}
function historyButton(id,date,title) {
  return '<button type="button" class="history-item" data-history="' + id + '"><div class="between"><span class="mono">' + date + '</span>' + tag('已分享','sage') + '</div><h3>' + title + '</h3><div class="between"><small>數學 · 范老師</small><span>查看紀錄 →</span></div></button>';
}
function parentRecord() {
  const published = draft(0).published, item = published&&historyIndex===-1?['10/02（五）','一元一次方程式']:history[Math.max(historyIndex,0)];
  let body;
  if (published&&historyIndex===-1) body = '<h2>課堂摘要</h2><p style="white-space:pre-wrap">' + esc(published.summary) + '</p><h2>老師回饋與課後練習</h2><p>' + esc(published.feedback) + '</p>';
  else {
    const examples = [
      ['練習正負數加減，透過數線理解符號與方向。','能自行說明解題步驟，基本計算正確率提升；遇到不確定的題目會主動提問。','習作第 18 頁第 1–6 題，每題保留計算步驟。','今天的學習態度很積極。請鼓勵品安慢慢檢查符號，熟悉後再提升速度。'],
      ['複習分數、小數互換與四則運算。','能正確換算常見分數與小數，計算步驟比上次更完整。','完成習作第 15 頁第 1–5 題。','持續練習，品安已能自己檢查計算過程。'],
      ['認識四則運算的先後順序，練習含括號的算式。','能說明先乘除、後加減的規則，並主動標記括號。','完成課堂講義的計算順序練習題。','保留中間步驟，能更快找到需要修正的地方。']
    ];
    body = ['本次學習','孩子的進步','課後練習','老師想說'].map((title,i)=>'<h2>' + title + '</h2><p>' + examples[Math.max(historyIndex,0)][i] + '</p>').join('');
  }
  return shell(btn('‹ 返回學習紀錄','parent','quiet') + heading('陳品安 · 數學',item[1]) + '<div class="row wrap">' + tag('教師已分享','sage') + '<span class="mono">2026/' + item[0] + '</span></div><article class="card parent-record"><small>范老師 · 16:00–17:30</small>' + body + '<div class="rule"></div><small>分享時間 2026/' + item[0].slice(0,5) + ' 18:10</small></article>','parent',true);
}
function login() {
  return '<main class="login">' + brand() + '<section class="card login-card"><h1>今天也準備好了。</h1><p class="muted">登入你的專屬空間。</p><div class="view-toggle"><button type="button" data-login-role="teacher" class="' + (loginRole==='teacher'?'active':'') + '">教師端</button><button type="button" data-login-role="parent" class="' + (loginRole==='parent'?'active':'') + '">家長端</button></div><form id="login-form" class="stack"><label>電子信箱<input type="email" name="email" value="' + (loginRole==='parent'?'parent@example.com':'teacher@example.com') + '" autocomplete="off" required></label><label>密碼<input type="password" name="password" value="mockup-demo" autocomplete="off" required></label><button type="submit" class="primary">登入' + (loginRole==='parent'?'家長':'教師') + '空間</button></form><small>家長帳號由教師邀請連結孩子。這裡使用範例帳號示範流程。</small></section><small>設計示範 · 範例資料</small></main>';
}
function fullSheet(title, body, actions, id) {
  return '<div class="sheet-backdrop"><form class="sheet" id="' + id + '" role="dialog" aria-modal="true" aria-labelledby="sheet-title"><header class="sheet-head between"><h2 id="sheet-title">' + title + '</h2>' + btn('×','close-sheet') + '</header><div class="sheet-body">' + body + '</div><footer class="sheet-actions">' + actions + '</footer></form></div>';
}
function scheduleStudents() {
  return '<div class="stack tight"><span id="schedule-student-label" class="field-label">學生</span><input type="hidden" name="student" value="' + selectedStudent + '"><details class="schedule-picker"><summary id="schedule-student" tabindex="0" aria-labelledby="schedule-student-label schedule-student-name">' + scheduleStudentName(selectedStudent) + '<span class="picker-chevron" aria-hidden="true">⌄</span></summary><div class="schedule-picker-menu"><input id="schedule-student-search" type="search" aria-label="搜尋學生" placeholder="搜尋學生姓名或科目" autocomplete="off"><div class="schedule-picker-options">' + students.map((s,i)=>'<button type="button" data-schedule-student="' + i + '" aria-pressed="' + (i===selectedStudent) + '">' + scheduleStudentName(i,false) + '</button>').join('') + '<small id="schedule-student-empty" hidden>找不到符合的學生。</small></div></div></details></div>';
}
function scheduleStudentName(id, selected = true) {
  const s = students[id];
  return '<span class="schedule-student-name"><i class="dot ' + s.color + '" aria-hidden="true"></i><span' + (selected?' id="schedule-student-name"':'') + '>' + esc(s.name) + ' · ' + esc(s.subjects.join('、')) + '</span></span>';
}
function filterScheduleStudents(value) {
  const query = value.trim().toLocaleLowerCase();
  const options = [...document.querySelectorAll('[data-schedule-student]')];
  options.forEach(option=>{option.hidden=!option.textContent.toLocaleLowerCase().includes(query);});
  document.getElementById('schedule-student-empty').hidden=options.some(option=>!option.hidden);
}
function overlay() {
  const s = students[selectedStudent];
  if (sheet==='day-lessons') {
    const parent = screen==='parent-calendar', lessons = allLessons(parent).filter(l=>l.date===selectedDate);
    return '<div class="day-modal-backdrop"><section class="day-modal" role="dialog" aria-modal="true" aria-labelledby="day-modal-title"><header class="day-modal-head between"><div class="stack tight"><h2 id="day-modal-title">' + dateLabel(selectedDate) + '</h2><small>' + lessons.length + ' 堂課</small></div><button type="button" data-action="close-sheet" aria-label="關閉當天課程">×</button></header><div class="day-modal-body stack">' + lessons.map(l=>lessonCard(l,parent)).join('') + (!lessons.length?'<div class="empty">這一天尚未安排課程。</div>':'') + '</div>' + (parent?'':'<footer class="day-modal-actions">' + btn('＋ 安排課程','schedule','full primary') + '</footer>') + '</section></div>';
  }
  if (sheet==='schedule') return fullSheet('新增上課日期',
    '<p class="muted">從學生安排課程，儲存後同步到月曆。</p>' + scheduleStudents() + '<label>上課日期<input type="date" name="date" value="' + selectedDate + '" required></label><label>開始時間<input type="time" name="time" value="16:00" required></label><label>課程長度<select name="duration"><option value="60">60 分鐘</option><option value="90" selected>90 分鐘</option><option value="120">120 分鐘</option></select></label><label>課程主題（選填）<input name="topic" placeholder="例如：一元一次方程式應用"></label>' + tag('預設：已排定') + '<details><summary>更多詳細資料</summary><div class="stack"><label>地點（選填）<input name="location"></label><label>備註（選填）<textarea name="remark"></textarea></label></div></details>' + note('相同課程，相同顏色','月曆與議程都會顯示這堂課，並沿用學生設定的顏色。'),
    btn('取消','close-sheet') + '<button type="submit" class="primary">儲存課程</button>','schedule-form');
  if (sheet==='subjects') return fullSheet('編輯科目標籤', '<p>' + esc(s.name) + '的科目</p>' + tagOptions('student'), btn('返回','close-sheet') + '<button type="submit" class="primary">完成</button>','subjects-form');
  if (sheet==='new-student') return fullSheet('新增學生','<label>姓名<input name="name" autocomplete="off" required></label><label>學校（選填）<input name="school"></label><label>年級（選填）<input name="grade"></label><label>科目<select name="subject">' + subjects.map(s=>'<option>' + esc(s) + '</option>').join('') + '</select></label>',btn('取消','close-sheet') + '<button type="submit" class="primary">建立學生</button>','student-form');
  if (sheet==='account') {
    const parent = screen.startsWith('parent');
    return fullSheet('我的帳號','<h2>' + (parent?'陳媽媽':'范老師') + '</h2>' + tag(parent?'家長端':'教師端','rose') + '<p>' + (parent?'parent@example.com':'teacher@example.com') + '</p>' + note(parent?'已連結的孩子':'個人教學工作區',parent?'陳品安 · 光華國中 · 國二':'管理學生、課程與教學紀錄。'),btn('返回','close-sheet') + btn('登出','login','primary'),'account-form');
  }
  if (sheet==='preview-share') {
    const d = draft();
    return fullSheet('預覽家長可見內容','<h2>' + esc(students[recordStudent].name) + ' · 課程紀錄</h2><small>確認分享後才會顯示在家長帳號。</small><h3>課堂摘要</h3><p style="white-space:pre-wrap">' + esc(d.summary) + '</p><h3>老師回饋與課後練習</h3><p>' + esc(d.feedback) + '</p>',btn('返回編輯','close-sheet') + btn('確認並分享','share','primary'),'preview-form');
  }
  return '';
}
function render() {
  clearTimeout(dayModalCloseTimer);
  dayModalCloseTimer=null;
  unlockDayModalScroll();
  const select = document.getElementById('preview-screen');
  select.innerHTML = Object.entries(screenNames).map(([key,label])=>'<option value="' + key + '"' + (key===screen?' selected':'') + '>' + label + '</option>').join('');
  const pages = {today,students:studentList,student,calendar,record,parent,login,'parent-calendar':()=>calendar(true),'parent-record':parentRecord};
  document.getElementById('app').innerHTML = (pages[screen]||today)() + overlay();
  document.body.style.overflow = sheet ? 'hidden' : '';
  document.querySelector('.shell')?.toggleAttribute('inert',sheet==='day-lessons');
  document.querySelector('.preview-bar').toggleAttribute('inert',sheet==='day-lessons');
  document.getElementById('schedule-student-search')?.addEventListener('input',e=>filterScheduleStudents(e.target.value));
  document.getElementById('schedule-form')?.addEventListener('submit',e=>{
    e.preventDefault(); const data = new FormData(e.currentTarget);
    createdLesson = {date:data.get('date'),time:data.get('time'),duration:Number(data.get('duration')),student:Number(data.get('student')),topic:data.get('topic').trim()||'課程練習'};
    addedLessons.push(createdLesson);
    selectedDate = createdLesson.date; shownMonth = selectedDate.slice(0,7); calendarView = 'month';
    sheet = null; screen = 'calendar';
    flash = '✓ 已新增' + students[createdLesson.student].name + '的課程，並同步至月曆。';
    render(); window.scrollTo(0,0);
  });
  document.getElementById('student-form')?.addEventListener('submit',e=>{
    e.preventDefault(); const data = new FormData(e.currentTarget), name = data.get('name').trim();
    if (!name) { e.currentTarget.elements.name.setCustomValidity('請輸入學生姓名'); e.currentTarget.elements.name.reportValidity(); return; }
    students.push({name,school:data.get('school').trim()||'未設定學校',grade:data.get('grade').trim()||'未設定年級',subjects:[data.get('subject')],color:'lilac',next:'尚未安排',parent:'尚未連結'});
    selectedStudent = students.length-1; go('student');
  });
  document.querySelector('#student-form [name="name"]')?.addEventListener('input',e=>e.target.setCustomValidity(''));
  document.getElementById('subjects-form')?.addEventListener('submit',e=>{e.preventDefault();sheet=null;render();});
  document.getElementById('login-form')?.addEventListener('submit',e=>{e.preventDefault();go(loginRole==='parent'?'parent':'today');});
  const search = document.getElementById('student-search');
  search?.addEventListener('focus',()=>{
    if (!subjectMenu) { subjectMenu=true; render(); const input=document.getElementById('student-search');input.focus();input.setSelectionRange(input.value.length,input.value.length); }
  });
  search?.addEventListener('input',e=>{
    searchValue=e.target.value;render();const input=document.getElementById('student-search');input.focus();input.setSelectionRange(input.value.length,input.value.length);
  });
  document.getElementById('raw-note')?.addEventListener('input',e=>{draft().raw=e.target.value;document.getElementById('raw-save-status').textContent='✓ 已自動儲存（本機示範）';});
  document.getElementById('summary')?.addEventListener('input',e=>{
    draft().summary=e.target.value;draft().saved=false;
    document.getElementById('summary-status').innerHTML=tag('草稿待儲存','rose');
    document.getElementById('share-help').textContent='摘要已修改，請先儲存再分享。';
  });
  document.getElementById('feedback')?.addEventListener('input',e=>{draft().feedback=e.target.value;});
  if (sheet) document.querySelector('.day-modal-head button, #schedule-student, .sheet input:not([type="hidden"]), .sheet select, .sheet-head button')?.focus();
}
function unlockDayModalScroll() {
  if (!dayModalScroll) return;
  const {x,y,styles,navigation,navigationStyles} = dayModalScroll;
  dayModalScroll=null;
  Object.assign(document.body.style,styles);
  Object.assign(navigation.style,navigationStyles);
  window.scrollTo({left:x,top:y,behavior:'instant'});
}
function openDayLessons(date) {
  if (sheet) return;
  selectedDate=date;
  if (shownMonth!==date.slice(0,7)) { shownMonth=date.slice(0,7);render(); }
  document.querySelectorAll('[data-date]').forEach(button=>{
    const selected = button.dataset.date===date;
    button.classList.toggle('selected',selected);
    button.setAttribute('aria-pressed',selected);
  });
  sheet='day-lessons';
  const styles = Object.fromEntries(['position','top','left','right','overflow'].map(key=>[key,document.body.style[key]]));
  const navigation = document.querySelector('.bottom-nav'), navigationRect = navigation.getBoundingClientRect();
  const navigationStyles = {left:navigation.style.left,width:navigation.style.width};
  dayModalScroll={x:window.scrollX,y:window.scrollY,styles,navigation,navigationStyles};
  Object.assign(navigation.style,{left:navigationRect.left+navigationRect.width/2+'px',width:navigationRect.width+'px'});
  const gutter = window.innerWidth-document.documentElement.clientWidth;
  Object.assign(document.body.style,{position:'fixed',top:-dayModalScroll.y+'px',left:'0',right:Math.max(0,gutter)+'px',overflow:'hidden'});
  document.getElementById('app').insertAdjacentHTML('beforeend',overlay());
  document.querySelector('.shell').setAttribute('inert','');
  document.querySelector('.preview-bar').setAttribute('inert','');
  document.querySelector('.day-modal-head button').focus({preventScroll:true});
}

window.addEventListener('resize',()=>{
  if (!dayModalScroll) return;
  const rect = document.getElementById('app').getBoundingClientRect();
  Object.assign(dayModalScroll.navigation.style,{left:rect.left+rect.width/2+'px',width:rect.width+'px'});
});
function closeOverlay() {
  if (sheet==='day-lessons') {
    const backdrop = document.querySelector('.day-modal-backdrop');
    if (!backdrop||backdrop.classList.contains('is-closing')) return;
    const finish = ()=>{
      if (!backdrop.isConnected||sheet!=='day-lessons') return;
      clearTimeout(dayModalCloseTimer);dayModalCloseTimer=null;
      backdrop.remove();sheet=null;
      document.querySelector('.shell')?.removeAttribute('inert');
      document.querySelector('.preview-bar').removeAttribute('inert');
      unlockDayModalScroll();
      document.querySelector('[data-date="' + selectedDate + '"]')?.focus({preventScroll:true});
    };
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { finish();return; }
    const modal = backdrop.querySelector('.day-modal'), modalStyle = getComputedStyle(modal);
    backdrop.style.setProperty('--close-backdrop-opacity',getComputedStyle(backdrop).opacity);
    modal.style.setProperty('--close-modal-opacity',modalStyle.opacity);
    modal.style.setProperty('--close-modal-transform',modalStyle.transform==='none'?'translateY(0) scale(1)':modalStyle.transform);
    backdrop.classList.add('is-closing');
    backdrop.addEventListener('animationend',e=>{
      if (e.target===backdrop&&e.animationName==='day-backdrop-out') finish();
    });
    dayModalCloseTimer=setTimeout(finish,220);
    return;
  }
  sheet=null;
  render();
}
document.getElementById('preview-screen').addEventListener('change',e=>go(e.target.value));
document.addEventListener('click',e=>{
  if (e.target.closest('.day-modal-backdrop.is-closing')) return;
  if (e.target.classList.contains('day-modal-backdrop')) { closeOverlay();return; }
  const picker = document.querySelector('.schedule-picker');
  if (picker?.open&&!picker.contains(e.target)) picker.open=false;
  const el=e.target.closest('button'); if(!el)return;
  if (el.dataset.scheduleStudent!==undefined) {
    const id = Number(el.dataset.scheduleStudent), summary = document.getElementById('schedule-student');
    document.querySelector('#schedule-form [name="student"]').value=id;
    summary.innerHTML=scheduleStudentName(id)+'<span class="picker-chevron" aria-hidden="true">⌄</span>';
    document.querySelectorAll('[data-schedule-student]').forEach(option=>option.setAttribute('aria-pressed',Number(option.dataset.scheduleStudent)===id));
    document.getElementById('schedule-student-search').value='';filterScheduleStudents('');
    picker.open=false;summary.focus();return;
  }
  if (el.dataset.student!==undefined) { selectedStudent=Number(el.dataset.student);go('student');return; }
  if (el.dataset.recordStudent!==undefined) { recordStudent=Number(el.dataset.recordStudent);go('record');return; }
  if (el.dataset.color) { students[selectedStudent].color=el.dataset.color;render();return; }
  if (el.dataset.subject) {
    const subject=el.dataset.subject, selected=el.dataset.context==='student'?students[selectedStudent].subjects:selectedSubjects;
    const index=selected.indexOf(subject); if(index===-1)selected.push(subject);else selected.splice(index,1);render();return;
  }
  if (el.dataset.history!==undefined) { historyIndex=Number(el.dataset.history);go('parent-record');return; }
  if (el.dataset.date) { openDayLessons(el.dataset.date);return; }
  if (el.dataset.loginRole) { loginRole=el.dataset.loginRole;render();return; }
  const action=el.dataset.action;if(!action)return;
  if (Object.hasOwn(screenNames,action)) { go(action);return; }
  if (action==='schedule') { if(screen!=='student')selectedStudent=0;sheet='schedule'; }
  else if (action==='close-sheet') { closeOverlay();return; }
  else if (action==='new-student') { sheet='new-student'; }
  else if (action==='account') { sheet='account'; }
  else if (action==='edit-subject') { sheet='subjects'; }
  else if (action==='preview-share') { sheet='preview-share'; }
  else if (action==='create-tag') { const input=document.getElementById('new-subject'), name=input.value.trim();if(name&&!subjects.includes(name))subjects.push(name); }
  else if (action==='close-tags') { subjectMenu=false; }
  else if (action==='clear-tags') { selectedSubjects=[];searchValue='';subjectMenu=false; }
  else if (action==='save-summary') { draft().saved=true;shareError=false; }
  else if (action==='share') {
    if (!draft().saved) { sheet=null;shareError=true;render();return; }
    draft().published={summary:draft().summary,feedback:draft().feedback};sheet=null;
    if(recordStudent===0){historyIndex=-1;go('parent');return;}
    flash='✓ 已分享給這位學生已連結的家長。';
  }
  else if (action==='view-month'||action==='view-agenda') { calendarView=action==='view-month'?'month':'agenda'; }
  else if (action==='previous-month'||action==='next-month') {
    const [year,month]=shownMonth.split('-').map(Number), date=new Date(Date.UTC(year,month-1+(action==='next-month'?1:-1),1));
    shownMonth=date.toISOString().slice(0,7);selectedDate=shownMonth+'-01';flash='';
  } else return;
  render();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&document.querySelector('.schedule-picker')?.open){e.preventDefault();document.querySelector('.schedule-picker').open=false;document.getElementById('schedule-student').focus();return;}
  if(e.key==='Enter'&&e.target.id==='schedule-student-search'){e.preventDefault();return;}
  if(e.key==='Escape'){subjectMenu=false;closeOverlay();}
  if(e.key==='Tab'&&sheet==='day-lessons') {
    const buttons = document.querySelectorAll('.day-modal button'), first = buttons[0], last = buttons[buttons.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
  if(e.key==='Enter'&&e.target.id==='student-search'){e.preventDefault();subjectMenu=false;render();}
});
const query = new URLSearchParams(location.search);
if (query.get('screen')) screen=query.get('screen')==='mobile'?'parent':query.get('screen');
if (!Object.hasOwn(screenNames,screen)) screen='today';
render();
