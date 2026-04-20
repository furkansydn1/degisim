// =========================================================
// KAIZEN — ANA UYGULAMA MANTIĞI
// Sabitler data.js'te (QUESTIONS, QUOTES, SLOGANS, TIME_SLOTS, GUIDE_ARTICLES, STOPWORDS)
// Stiller styles.css'te
// =========================================================

import { SLOGANS, QUOTES, QUESTIONS, TIME_SLOTS, STOPWORDS, GUIDE_ARTICLES } from './data.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, getDocs, query, orderBy, Timestamp, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBl4EyTFAPiKMgbgmRztm5MmToAdHKFTPQ",
  authDomain: "zinciri-kirma-486a3.firebaseapp.com",
  projectId: "zinciri-kirma-486a3",
  storageBucket: "zinciri-kirma-486a3.firebasestorage.app",
  messagingSenderId: "189866155572",
  appId: "1:189866155572:web:31fdf2fc9b0e502c74f461",
  measurementId: "G-880SWBJ3MC"
};

const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);
const provider = new GoogleAuthProvider();

let currentUser = null;
let userData = {
  vision: '',
  antiVision: '',
  identity: '',
  yearGoal: { title: '', start: '', deadline: '' },
  monthGoal: { title: '', deadline: '', progress: 0 },
  dailyLevers: [],
  constraints: [],
  streak: 0,
  lastActiveDate: null,
  joinedDate: null,
  kurulusCompleted: false,
  kurulusIndex: 0,
  lastWeeklyRitual: null,
  lastMonthlyRitual: null,
  onboardingDone: false,
  notifEnabled: false,
  journalPinHash: null,
  journalIncludeInPatterns: false
};
let currentQuestType = null;
let currentQuestSlot = null;
let currentQuestIndex = 0;
let currentQuestList = [];
let currentAnswers = [];
let historyCache = [];
let historyFilter = 'all';
let onboardIndex = 0;
let journalCache = [];
let journalUnlocked = false;
let currentJournalEntry = null;

document.getElementById('loginBtn').addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    try { await signInWithRedirect(auth, provider); }
    catch(e2) { showToast('Giriş hatası: ' + e2.message); }
  }
});

getRedirectResult(auth).catch(e => console.warn(e));

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('login').classList.add('hidden');
    try {
      await loadUserData();
    } catch (e) {
      console.error('loadUserData hatası:', e);
      // Hata olsa bile uygulamayı aç, kullanıcı sonsuza kadar yükleme ekranında kalmasın
    }
    if (!userData.onboardingDone) {
      document.getElementById('loading').classList.add('hidden');
      showOnboard();
    } else {
      try {
        initApp();
      } catch (e) {
        console.error('initApp hatası:', e);
      }
      document.getElementById('loading').classList.add('hidden');
      document.getElementById('app').classList.add('active');
      document.getElementById('bottomNav').classList.add('show');
    }
  } else {
    currentUser = null;
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');
    document.getElementById('app').classList.remove('active');
    document.getElementById('bottomNav').classList.remove('show');
  }
});

window.doLogout = async function() {
  if (!confirm('Çıkış yapmak istediğinden emin misin?')) return;
  await signOut(auth);
};

async function loadUserData() {
  const ref = doc(db, 'users', currentUser.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    userData = { ...userData, ...snap.data() };
    // Mevcut ama joinedDate'i olmayan eski kullanıcılar için:
    if (!userData.joinedDate) {
      userData.joinedDate = todayStr();
      await setDoc(ref, { joinedDate: userData.joinedDate }, { merge: true });
    }
  } else {
    userData.joinedDate = todayStr();
    await setDoc(ref, userData);
  }
  await loadHistory();
  await loadJournal();
  await updateStreak();
}

async function saveUserData() {
  if (!currentUser) return;
  const ref = doc(db, 'users', currentUser.uid);
  await setDoc(ref, userData, { merge: true });
}

async function updateStreak() {
  const today = todayStr();
  if (userData.lastActiveDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (userData.lastActiveDate === yesterday) {
    userData.streak = (userData.streak || 0) + 1;
  } else if (userData.lastActiveDate) {
    userData.streak = 1;
  } else {
    userData.streak = 1;
  }
  userData.lastActiveDate = today;
  await saveUserData();
}

async function addAnswer(type, questionId, questionText, answerText, slotKey, lateMinutes) {
  if (!answerText.trim()) return;
  const ref = collection(db, 'users', currentUser.uid, 'answers');
  await addDoc(ref, {
    type: type,
    questionId: questionId,
    question: questionText,
    answer: answerText.trim(),
    slotKey: slotKey || null,
    lateMinutes: lateMinutes || 0,
    date: todayStr(),
    timestamp: Timestamp.now()
  });
}

async function loadHistory() {
  const ref = collection(db, 'users', currentUser.uid, 'answers');
  const q = query(ref, orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  historyCache = [];
  snap.forEach(d => {
    historyCache.push({ id: d.id, ...d.data() });
  });
}

async function loadJournal() {
  try {
    const ref = collection(db, 'users', currentUser.uid, 'journal');
    const q = query(ref, orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    journalCache = [];
    snap.forEach(d => {
      journalCache.push({ id: d.id, ...d.data() });
    });
  } catch (e) {
    console.warn('Journal yüklenemedi:', e);
    journalCache = [];
  }
}

async function addJournalEntry(title, content) {
  const ref = collection(db, 'users', currentUser.uid, 'journal');
  const docRef = await addDoc(ref, {
    title: title.trim(),
    content: content.trim(),
    date: todayStr(),
    timestamp: Timestamp.now()
  });
  return docRef.id;
}

async function updateJournalEntry(id, title, content) {
  const ref = doc(db, 'users', currentUser.uid, 'journal', id);
  await setDoc(ref, {
    title: title.trim(),
    content: content.trim(),
    date: todayStr(),
    timestamp: Timestamp.now()
  }, { merge: true });
}

async function deleteJournalEntry(id) {
  const ref = doc(db, 'users', currentUser.uid, 'journal', id);
  await deleteDoc(ref);
}

async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + '::kaizen::' + currentUser.uid);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

window.showScreen = function(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + name);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.screen === name);
  });
  if (name === 'home') renderHome();
  if (name === 'vision') renderVisionForm();
  if (name === 'goals') renderGoalsForm();
  if (name === 'history') renderHistory();
  if (name === 'patterns') renderPatterns();
  if (name === 'capsule') renderCapsule();
  if (name === 'guide') renderGuide();
  if (name === 'journal') renderJournal();
  if (name === 'settings') renderSettings();
  window.scrollTo(0, 0);
};

function initApp() {
  document.querySelectorAll('.nav-item').forEach(n => {
    n.addEventListener('click', () => showScreen(n.dataset.screen));
  });
  document.getElementById('historySearch').addEventListener('input', renderHistory);
  document.querySelectorAll('.seg-group button').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.seg-group button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      historyFilter = b.dataset.filter;
      renderHistory();
    });
  });
  document.querySelectorAll('.history-mode-toggle button').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.history-mode-toggle button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      historyMode = b.dataset.mode;
      renderHistory();
    });
  });
  document.getElementById('questNext').addEventListener('click', onQuestNext);
  document.getElementById('questPrev').addEventListener('click', onQuestPrev);

  // Footer görünür olsun
  const footer = document.getElementById('appFooter');
  if (footer) footer.style.display = 'block';

  renderHome();
  setTimeout(checkRituals, 800);
  setupNotifs();
}

function renderHome() {
  const today = new Date();
  document.getElementById('todayDate').textContent = today.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });

  // Kayıt gününden itibaren kaçıncı gün
  let dayNumber = 1;
  if (userData.joinedDate) {
    const joined = new Date(userData.joinedDate + 'T00:00:00');
    const now = new Date(todayStr() + 'T00:00:00');
    dayNumber = Math.max(1, Math.floor((now - joined) / 86400000) + 1);
  }
  document.getElementById('dayCounter').textContent = `${dayNumber}. gün`;

  // Günlük alıntı için hâlâ yılın günü (çeşitlilik olsun diye)
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const seed = today.getDate() + today.getMonth() * 31;
  const slogan = SLOGANS[seed % SLOGANS.length];
  document.getElementById('slogan').innerHTML = `${escapeHtml(slogan.a)}<br><em>${escapeHtml(slogan.b)}</em>`;

  const hour = today.getHours();
  const quoteSeed = dayOfYear * 6 + Math.floor(hour / 4);
  const quote = QUOTES[quoteSeed % QUOTES.length];
  document.getElementById('dailyQuote').textContent = `"${quote.t}"`;
  document.getElementById('dailyQuoteAuthor').textContent = quote.a || '';

  document.getElementById('streakNum').textContent = userData.streak || 0;
  const consistency = calcConsistency();
  document.getElementById('consistencyNum').textContent = Math.round(consistency * 100);
  document.getElementById('writtenCount').textContent = historyCache.length;

  const identity = userData.identity;
  const stmtEl = document.getElementById('identityStmt');
  if (identity) {
    stmtEl.classList.remove('empty');
    stmtEl.innerHTML = escapeHtml(identity);
  } else {
    stmtEl.classList.add('empty');
    stmtEl.textContent = 'Ben henüz kim olduğumu tanımlamadım.';
  }

  const yg = userData.yearGoal || {};
  const mqPct = calcMainProgress();
  document.getElementById('mainQuestTitle').textContent = yg.title || '1 yıllık vizyonunu tanımla.';
  document.getElementById('mainQuestPct').textContent = mqPct.toFixed(1);
  document.getElementById('mainQuestBar').style.width = Math.min(100, mqPct) + '%';
  if (yg.start && yg.deadline) {
    const total = (new Date(yg.deadline) - new Date(yg.start)) / 86400000;
    const passed = Math.max(0, (Date.now() - new Date(yg.start)) / 86400000);
    const remain = Math.max(0, Math.ceil((new Date(yg.deadline) - Date.now()) / 86400000));
    document.getElementById('mainQuestDays').textContent = `${Math.floor(passed)} / ${Math.floor(total)} gün`;
    document.getElementById('mainQuestRemain').textContent = `${remain} gün kaldı`;
  } else {
    document.getElementById('mainQuestDays').textContent = 'Hedef tanımla';
    document.getElementById('mainQuestRemain').textContent = '';
  }

  const mg = userData.monthGoal || {};
  document.getElementById('bossTitle').textContent = mg.title || 'Bu ayki proje?';
  const mp = mg.progress || 0;
  document.getElementById('bossBar').style.width = mp + '%';
  document.getElementById('bossMeta').textContent = mp + '%' + (mg.deadline ? ` · ${new Date(mg.deadline).toLocaleDateString('tr-TR')}` : '');

  const av = userData.antiVision;
  const shadowEl = document.getElementById('shadowText');
  if (av) {
    shadowEl.classList.remove('empty');
    shadowEl.textContent = '"' + (av.length > 110 ? av.slice(0, 110) + '...' : av) + '"';
  } else {
    shadowEl.classList.add('empty');
    shadowEl.textContent = 'Kaçtığın hayatı tanımla.';
  }

  renderTimeSlots();
  renderInsights();
}

function calcConsistency() {
  if (historyCache.length < 2) return 0;
  const days = new Set();
  const cutoff = Date.now() - 30 * 86400000;
  historyCache.forEach(a => {
    if (a.timestamp && a.timestamp.toDate && a.timestamp.toDate().getTime() > cutoff) {
      days.add(a.date);
    }
  });
  return Math.min(1, days.size / 30);
}

function calcMainProgress() {
  const yg = userData.yearGoal || {};
  if (!yg.start || !yg.deadline) return 0;
  const start = new Date(yg.start);
  const end = new Date(yg.deadline);
  const total = (end - start) / 86400000;
  if (total <= 0) return 0;
  const passed = Math.max(0, (Date.now() - start) / 86400000);
  const timeRatio = Math.min(1, passed / total);
  const consistency = calcConsistency();
  const multiplier = 0.5 + consistency;
  return Math.min(100, timeRatio * multiplier * 100);
}

function getCurrentHourDecimal() {
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
}

function renderTimeSlots() {
  const now = getCurrentHourDecimal();
  const today = todayStr();
  const box = document.getElementById('timeSlots');

  if (!userData.kurulusCompleted) {
    box.innerHTML = `
      <div class="time-slot active" onclick="startQuest('kurulus', null)">
        <div class="time-stamp">kuruluş</div>
        <div class="q-body">
          <div class="q-title">Kuruluş · ${userData.kurulusIndex || 0} / ${QUESTIONS.kurulus.length}</div>
          <div class="q-meta">Bu seferlik, kendinin haritasını çıkar</div>
        </div>
        <div class="q-arrow">→</div>
      </div>
    `;
    document.getElementById('todayCount').textContent = 'Önce kuruluş';
    return;
  }

  let html = '';
  let doneCount = 0;
  const totalSlots = TIME_SLOTS.length;

  TIME_SLOTS.forEach(slot => {
    const todayAnswers = historyCache.filter(a => a.date === today && a.slotKey === slot.key);
    const isDone = todayAnswers.length >= slot.count;
    const isActive = !isDone && now >= slot.start && now < slot.end;
    const isUpcoming = !isDone && now < slot.start;
    const isMissed = !isDone && now >= slot.end;

    if (isDone) doneCount++;

    let state = '';
    let icon = '';
    let meta = '';
    let clickable = true;

    if (isDone) {
      state = 'done';
      icon = `<div class="q-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>`;
      const t = todayAnswers[0].timestamp?.toDate();
      const tStr = t ? `${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}` : '';
      meta = tStr ? `✓ ${tStr}'de cevapladın` : '✓ Cevaplandı';
    } else if (isActive) {
      state = 'active';
      icon = `<div class="q-arrow">→</div>`;
      const endH = Math.floor(slot.end);
      const endM = Math.round((slot.end - endH) * 60);
      meta = `ŞİMDİ — ${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}'e kadar açık`;
    } else if (isUpcoming) {
      state = 'locked';
      icon = `<div class="q-lock">🔒</div>`;
      const untilMin = Math.round((slot.start - now) * 60);
      meta = untilMin >= 60 ? `${Math.floor(untilMin / 60)} saat ${untilMin % 60} dk sonra açılır` : `${untilMin} dk sonra açılır`;
      clickable = false;
    } else {
      state = 'missed late';
      icon = `<div class="q-missed">geç</div>`;
      meta = '⚠ Geç kaldın — yine de cevaplayabilirsin';
    }

    const onclickAttr = isDone
      ? `onclick="openAnswerView('${slot.key}', '${today}')"`
      : (clickable ? `onclick="startQuest('${slot.type}', '${slot.key}')"` : '');

    html += `
      <div class="time-slot ${state}" ${onclickAttr}>
        <div class="time-stamp">${slot.time}</div>
        <div class="q-body">
          <div class="q-title">${escapeHtml(slot.label)}</div>
          <div class="q-meta">${escapeHtml(meta)}</div>
        </div>
        ${icon}
      </div>
    `;
  });

  box.innerHTML = html;
  document.getElementById('todayCount').textContent = `${doneCount} / ${totalSlots} tamam`;
}

function renderInsights() {
  const box = document.getElementById('insightsSection');
  const insights = detectPatterns();
  let html = '';
  insights.slice(0, 3).forEach(ins => {
    html += `<div class="insight-card ${ins.type || ''}">
      <div class="lbl">${escapeHtml(ins.label)}</div>
      <div class="msg">${ins.msg}</div>
    </div>`;
  });
  box.innerHTML = html;
  updateBadges(insights);
}

function updateBadges(insights) {
  const patternCount = insights.filter(i => i.type === 'warn' || !i.type).length;
  const pb = document.getElementById('patternsBadge');
  if (patternCount > 0) { pb.textContent = patternCount; pb.classList.remove('hidden'); }
  else pb.classList.add('hidden');

  const cap = getCapsuleEntries();
  const cb = document.getElementById('capsuleBadge');
  if (cap.length > 0) { cb.textContent = cap.length; cb.classList.remove('hidden'); }
  else cb.classList.add('hidden');
}

function detectPatterns() {
  const out = [];
  if (!historyCache.length) return out;

  // Kayıttan kaç gün geçti?
  let daysSinceJoined = 0;
  if (userData.joinedDate) {
    const joined = new Date(userData.joinedDate + 'T00:00:00');
    const now = new Date(todayStr() + 'T00:00:00');
    daysSinceJoined = Math.floor((now - joined) / 86400000);
  }

  // İlk hafta — daha sıcak, suçlamasız bir ton
  if (daysSinceJoined < 7) {
    if (historyCache.length >= 1 && historyCache.length < 5) {
      out.push({
        type: 'celebrate',
        label: 'Başladın',
        msg: `İlk cevapların geldi. Bir hafta boyunca birikim olmadan örüntü çıkmaz — kendi sesini bul, gerisi kendiliğinden gelir.`
      });
    } else if (historyCache.length >= 5) {
      out.push({
        type: 'celebrate',
        label: 'İyi gidiyor',
        msg: `<em>${historyCache.length}</em> cevap birikti. Birkaç güne örüntülerin ortaya çıkmaya başlar.`
      });
    }
    if ((userData.streak || 0) >= 3) {
      out.push({
        type: 'celebrate',
        label: 'Süreklilik',
        msg: `<em>${userData.streak} gün</em> üst üste geldin. Bu, düşündüğünden daha önemli — kimlik burada oluşuyor.`
      });
    }
    return out;
  }

  // 7 günden sonra gerçek örüntü analizi başlasın
  const recent = historyCache.slice(0, 100);
  const words = {};
  recent.forEach(a => {
    const clean = (a.answer || '').toLowerCase().replace(/[^\wçğıöşü\s]/gi, ' ');
    clean.split(/\s+/).forEach(w => {
      if (w.length > 4 && !STOPWORDS.has(w)) words[w] = (words[w] || 0) + 1;
    });
  });
  // Kullanıcı isterse günlük yazılarını da analize dahil et
  if (userData.journalIncludeInPatterns && journalCache.length) {
    journalCache.slice(0, 100).forEach(entry => {
      const text = ((entry.title || '') + ' ' + (entry.content || '')).toLowerCase().replace(/[^\wçğıöşü\s]/gi, ' ');
      text.split(/\s+/).forEach(w => {
        if (w.length > 4 && !STOPWORDS.has(w)) words[w] = (words[w] || 0) + 1;
      });
    });
  }
  const top = Object.entries(words).filter(([w, c]) => c >= 4).sort((a, b) => b[1] - a[1]);
  if (top.length) {
    const w = top[0];
    out.push({
      type: '',
      label: 'Bir şeyi tekrarlıyorsun',
      msg: `Son cevaplarında <em>"${escapeHtml(w[0])}"</em> kelimesi <em>${w[1]}</em> kez geçti. Tesadüf değil — bir yere parmak basıyor.`
    });
  }

  if ((userData.streak || 0) >= 7) {
    out.push({
      type: 'celebrate',
      label: 'Kanıt birikiyor',
      msg: `<em>${userData.streak} gün</em> üst üste geldin. Artık "ara sıra yapan biri" değilsin — yapan kişi sen oluyorsun.`
    });
  }

  if (userData.yearGoal?.title && historyCache.length > 5) {
    const last7 = new Set();
    for (let i = 0; i < 7; i++) last7.add(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10));
    const activeDays = new Set(historyCache.filter(a => last7.has(a.date)).map(a => a.date));
    if (activeDays.size < 3) {
      out.push({
        type: 'warn',
        label: 'Söz ve eylem ayrışıyor',
        msg: `Vizyonunda "<em>${escapeHtml(userData.yearGoal.title)}</em>" yazıyor ama son 7 günde sadece <em>${activeDays.size} gün</em> buradaydın. Hangisi gerçek sen — yazan mı, yapan mı?`
      });
    }
  }

  const today = todayStr();
  const y1 = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const y2 = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
  const missed = [y1, y2].filter(d => !historyCache.some(a => a.date === d));
  if (missed.length === 2 && !historyCache.some(a => a.date === today)) {
    out.push({
      type: 'warn',
      label: 'Üç gündür yoksun',
      msg: `Üç gündür uğramadın. Bu da bir cevap aslında — neden kaçıyorsun?`
    });
  }

  // Geç cevap örüntüsü — son 14 gündeki gün içi cevaplarına bak
  const last14 = new Set();
  for (let i = 0; i < 14; i++) last14.add(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10));
  const guniciRecent = historyCache.filter(a => a.type === 'gunici' && last14.has(a.date));
  if (guniciRecent.length >= 5) {
    const lateOnes = guniciRecent.filter(a => (a.lateMinutes || 0) > 30);
    const ratio = lateOnes.length / guniciRecent.length;
    if (ratio >= 0.5) {
      const avgMin = Math.round(lateOnes.reduce((s, a) => s + a.lateMinutes, 0) / lateOnes.length);
      out.push({
        type: 'warn',
        label: 'Kronik erteleme',
        msg: `Son 14 günde gün içi sorularının <em>%${Math.round(ratio * 100)}</em>'sine pencere kapandıktan sonra cevap verdin — ortalama <em>${avgMin} dakika</em> geç. Bu bir örüntü. Neyi erteliyorsun?`
      });
    }
  }

  const capsules = getCapsuleEntries();
  if (capsules.length) {
    out.push({
      type: 'celebrate',
      label: 'Geçmişten mesaj',
      msg: `<em>${capsules.length}</em> yeni kapsül açıldı. Eski sen, yeni seni bekliyor.`
    });
  }

  return out;
}

window.startQuest = function(type, slotKey) {
  currentQuestType = type;
  currentQuestSlot = slotKey;
  currentAnswers = [];

  if (type === 'kurulus') {
    currentQuestList = QUESTIONS.kurulus.slice(userData.kurulusIndex || 0);
  } else if (type === 'sabah') {
    // Sabah her gün aynı 3 soru — örüntü çıksın diye
    currentQuestList = QUESTIONS.sabah.slice(0, 3);
  } else if (type === 'gunici') {
    // Gün içi: TIME_SLOTS'taki fixedQuestionId'ye göre sabit tek soru (Dan Koe yapısı)
    const slot = TIME_SLOTS.find(s => s.key === slotKey);
    const q = QUESTIONS.gunici.find(qq => qq.id === slot?.fixedQuestionId) || QUESTIONS.gunici[0];
    currentQuestList = [q];
  } else if (type === 'aksam') {
    currentQuestList = QUESTIONS.aksam.slice(0, 3);
  } else if (type === 'haftalik') {
    currentQuestList = QUESTIONS.haftalik.slice();
  } else if (type === 'aylik') {
    currentQuestList = QUESTIONS.aylik.slice();
  }

  currentQuestIndex = 0;
  showScreen('quest');
  renderQuest();
};

function renderQuest() {
  const stamps = {
    kurulus: 'KURULUŞ · PSİKOLOJİK KAZI',
    sabah: 'SABAH · KAZI',
    gunici: 'GÜN İÇİ · KONTROL',
    aksam: 'AKŞAM · SENTEZ',
    haftalik: 'HAFTALIK RİTÜEL',
    aylik: 'AYLIK RİTÜEL'
  };
  document.getElementById('questStamp').textContent = stamps[currentQuestType] || 'SORU';

  const q = currentQuestList[currentQuestIndex];
  if (!q) { finishQuest(); return; }

  document.getElementById('questText').textContent = q.q;
  const hintBox = document.getElementById('questHintBox');
  if (q.hint) {
    hintBox.style.display = 'block';
    document.getElementById('questHint').textContent = q.hint;
  } else {
    hintBox.style.display = 'none';
  }
  document.getElementById('questCount').textContent = `Soru ${currentQuestIndex + 1} / ${currentQuestList.length}`;

  // Bu soruya önceki cevaplar (bugün hariç)
  renderQuestPrevAnswers(q.id);

  const ta = document.getElementById('questAnswer');
  ta.value = currentAnswers[currentQuestIndex] || '';
  setTimeout(() => ta.focus(), 200);

  document.getElementById('questPrev').style.visibility = currentQuestIndex === 0 ? 'hidden' : 'visible';
  document.getElementById('questNext').textContent = currentQuestIndex === currentQuestList.length - 1 ? 'Bitir ✓' : 'Sonraki →';
}

function renderQuestPrevAnswers(questionId) {
  const box = document.getElementById('questPrevBox');
  const listEl = document.getElementById('questPrevList');
  const summaryEl = document.getElementById('questPrevSummary');
  const today = todayStr();

  // Bu soruya verilen önceki cevaplar (bugün hariç), en yeni önce
  const prev = historyCache
    .filter(a => a.questionId === questionId && a.date !== today)
    .slice(0, 5);

  if (!prev.length) {
    box.style.display = 'none';
    return;
  }

  box.style.display = 'block';
  box.classList.remove('expanded');
  listEl.style.display = 'none';
  summaryEl.textContent = ` — son ${prev.length} cevap (görmek için dokun)`;

  listEl.innerHTML = prev.map(a => {
    const d = a.timestamp?.toDate ? a.timestamp.toDate() : new Date();
    const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    const lateStr = a.lateMinutes ? ` · ${Math.round(a.lateMinutes)} dk geç` : '';
    return `<div class="entry">
      <div class="date">${dateStr}${lateStr}</div>
      <div class="txt">${escapeHtml(a.answer)}</div>
    </div>`;
  }).join('');
}

window.toggleQuestPrev = function() {
  const box = document.getElementById('questPrevBox');
  const listEl = document.getElementById('questPrevList');
  const summaryEl = document.getElementById('questPrevSummary');
  if (box.classList.contains('expanded')) {
    box.classList.remove('expanded');
    listEl.style.display = 'none';
    summaryEl.style.display = 'inline';
  } else {
    box.classList.add('expanded');
    listEl.style.display = 'block';
    summaryEl.style.display = 'none';
  }
};

// Bir slot için geç dakika hesaplar — pencere geçtiyse geçiş süresini döndürür
function calcLateMinutes(slotKey) {
  if (!slotKey) return 0;
  const slot = TIME_SLOTS.find(s => s.key === slotKey);
  if (!slot) return 0;
  const now = getCurrentHourDecimal();
  if (now < slot.end) return 0; // Pencere hâlâ açık
  const lateHours = now - slot.end;
  return Math.round(lateHours * 60);
}

async function onQuestNext() {
  const ta = document.getElementById('questAnswer');
  currentAnswers[currentQuestIndex] = ta.value;
  if (!ta.value.trim()) {
    if (!confirm('Bu soruyu boş geçmek istediğine emin misin?')) return;
  }
  const q = currentQuestList[currentQuestIndex];
  if (ta.value.trim()) {
    const late = calcLateMinutes(currentQuestSlot);
    await addAnswer(currentQuestType, q.id, q.q, ta.value, currentQuestSlot, late);
  }
  currentQuestIndex++;
  if (currentQuestIndex >= currentQuestList.length) {
    await finishQuest();
  } else {
    renderQuest();
  }
}

function onQuestPrev() {
  const ta = document.getElementById('questAnswer');
  currentAnswers[currentQuestIndex] = ta.value;
  currentQuestIndex--;
  if (currentQuestIndex < 0) currentQuestIndex = 0;
  renderQuest();
}

async function finishQuest() {
  const filledCount = currentAnswers.filter(a => a && a.trim()).length;

  if (currentQuestType === 'kurulus') {
    userData.kurulusIndex = (userData.kurulusIndex || 0) + filledCount;
    if (userData.kurulusIndex >= QUESTIONS.kurulus.length) {
      userData.kurulusCompleted = true;
      showToast('Kuruluş tamam. Yol açıldı.');
    } else {
      showToast(`${filledCount} soru kaydedildi. Kaldığın yerden devam edersin.`);
    }
  } else {
    const msg = filledCount > 0 ? `${filledCount} cevap kaydedildi.` : 'Kaydedildi.';
    showToast(msg);
  }

  if (currentQuestType === 'haftalik') userData.lastWeeklyRitual = todayStr();
  if (currentQuestType === 'aylik') userData.lastMonthlyRitual = todayStr();

  await saveUserData();
  await loadHistory();
  await updateStreak();
  showScreen('home');
}

function renderVisionForm() {
  document.getElementById('antiVision').value = userData.antiVision || '';
  document.getElementById('vision').value = userData.vision || '';
  document.getElementById('identityInput').value = userData.identity || '';
}

window.saveVision = async function() {
  userData.antiVision = document.getElementById('antiVision').value.trim();
  userData.vision = document.getElementById('vision').value.trim();
  userData.identity = document.getElementById('identityInput').value.trim();
  await saveUserData();
  showToast('Kaydedildi.');
  showScreen('home');
};

function renderGoalsForm() {
  const yg = userData.yearGoal || {};
  document.getElementById('yearGoal').value = yg.title || '';
  document.getElementById('yearStart').value = yg.start || todayStr();
  document.getElementById('yearDeadline').value = yg.deadline || '';
  const mg = userData.monthGoal || {};
  document.getElementById('monthGoal').value = mg.title || '';
  document.getElementById('monthDeadline').value = mg.deadline || '';
  document.getElementById('monthProgress').value = mg.progress || 0;
  renderGoalList('daily-levers', userData.dailyLevers || []);
  renderGoalList('constraints', userData.constraints || []);
}

function renderGoalList(id, list) {
  const el = document.getElementById(id);
  if (!list.length) list.push('');
  el.innerHTML = list.map((item, i) => `
    <div class="goal-row">
      <input type="text" value="${escapeAttr(item)}" data-list="${id}" data-idx="${i}" placeholder="Yaz...">
      <button class="del-btn" onclick="delGoal('${id}', ${i})">×</button>
    </div>
  `).join('');
}

window.addGoal = function(id) {
  const list = id === 'daily-levers' ? (userData.dailyLevers || []) : (userData.constraints || []);
  document.querySelectorAll(`input[data-list="${id}"]`).forEach((inp, i) => list[i] = inp.value);
  list.push('');
  if (id === 'daily-levers') userData.dailyLevers = list;
  else userData.constraints = list;
  renderGoalList(id, list);
};

window.delGoal = function(id, idx) {
  const list = id === 'daily-levers' ? (userData.dailyLevers || []) : (userData.constraints || []);
  document.querySelectorAll(`input[data-list="${id}"]`).forEach((inp, i) => list[i] = inp.value);
  list.splice(idx, 1);
  if (id === 'daily-levers') userData.dailyLevers = list;
  else userData.constraints = list;
  renderGoalList(id, list);
};

window.saveGoals = async function() {
  userData.yearGoal = {
    title: document.getElementById('yearGoal').value.trim(),
    start: document.getElementById('yearStart').value,
    deadline: document.getElementById('yearDeadline').value
  };
  userData.monthGoal = {
    title: document.getElementById('monthGoal').value.trim(),
    deadline: document.getElementById('monthDeadline').value,
    progress: parseInt(document.getElementById('monthProgress').value) || 0
  };
  userData.dailyLevers = [];
  document.querySelectorAll('input[data-list="daily-levers"]').forEach(inp => {
    if (inp.value.trim()) userData.dailyLevers.push(inp.value.trim());
  });
  userData.constraints = [];
  document.querySelectorAll('input[data-list="constraints"]').forEach(inp => {
    if (inp.value.trim()) userData.constraints.push(inp.value.trim());
  });
  await saveUserData();
  showToast('Hedefler kaydedildi.');
  showScreen('home');
};

let historyMode = 'timeline'; // 'timeline' | 'by-question'

function renderHistory() {
  const box = document.getElementById('historyList');
  const search = document.getElementById('historySearch').value.toLowerCase().trim();
  let filtered = historyCache;
  if (historyFilter !== 'all') filtered = filtered.filter(a => a.type === historyFilter);
  if (search) {
    filtered = filtered.filter(a =>
      (a.answer || '').toLowerCase().includes(search) ||
      (a.question || '').toLowerCase().includes(search)
    );
  }
  if (!filtered.length) {
    box.innerHTML = `<div class="empty">
      <h3>Henüz yazılı bir şey yok</h3>
      <p>Günlük soruları cevapladıkça kelimelerin burada birikir. Geriye döndüğünde kendini okuyacaksın.</p>
    </div>`;
    return;
  }

  if (historyMode === 'by-question') {
    renderHistoryByQuestion(box, filtered);
    return;
  }

  box.innerHTML = filtered.map(a => {
    const d = a.timestamp?.toDate ? a.timestamp.toDate() : new Date();
    const typeLabel = { sabah: 'Sabah', gunici: 'Gün içi', aksam: 'Akşam', kurulus: 'Kuruluş', haftalik: 'Haftalık', aylik: 'Aylık' }[a.type] || a.type;
    const lateStr = a.lateMinutes && a.lateMinutes > 0 ? ` · <em style="color: var(--crimson);">${Math.round(a.lateMinutes)} dk geç</em>` : '';
    return `
    <div class="history-entry ${a.type}">
      <div class="meta">
        <span>${d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} · ${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}${lateStr}</span>
        <span>${typeLabel}</span>
      </div>
      <div class="q">${escapeHtml(a.question)}</div>
      <div class="a">${escapeHtml(a.answer)}</div>
    </div>`;
  }).join('');
}

function renderHistoryByQuestion(box, answers) {
  // Soru ID'sine göre grupla
  const groups = {};
  answers.forEach(a => {
    const key = a.questionId || a.question;
    if (!groups[key]) groups[key] = { question: a.question, type: a.type, entries: [] };
    groups[key].entries.push(a);
  });

  // Cevap sayısına göre sırala
  const groupList = Object.entries(groups)
    .map(([k, v]) => ({ key: k, ...v }))
    .sort((a, b) => b.entries.length - a.entries.length);

  box.innerHTML = groupList.map((g, idx) => {
    const entriesHtml = g.entries.map(a => {
      const d = a.timestamp?.toDate ? a.timestamp.toDate() : new Date();
      const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
      const lateStr = a.lateMinutes && a.lateMinutes > 0 ? `<span class="late">${Math.round(a.lateMinutes)} dk geç</span>` : '';
      return `<div class="entry">
        <div class="meta"><span>${dateStr}</span>${lateStr}</div>
        <div class="txt">${escapeHtml(a.answer)}</div>
      </div>`;
    }).join('');

    return `<div class="question-group" data-group-idx="${idx}">
      <div class="head" onclick="this.parentElement.classList.toggle('open')">
        <div class="q">${escapeHtml(g.question)}</div>
        <div class="count">${g.entries.length}</div>
      </div>
      <div class="answers">${entriesHtml}</div>
    </div>`;
  }).join('');
}

function renderPatterns() {
  const box = document.getElementById('patternsList');
  const insights = detectPatterns();

  // Kayıttan kaç gün geçti?
  let daysSinceJoined = 0;
  if (userData.joinedDate) {
    const joined = new Date(userData.joinedDate + 'T00:00:00');
    const now = new Date(todayStr() + 'T00:00:00');
    daysSinceJoined = Math.floor((now - joined) / 86400000);
  }

  if (!insights.length) {
    if (daysSinceJoined < 7) {
      const kaldi = 7 - daysSinceJoined;
      box.innerHTML = `<div class="empty">
        <h3>Henüz erken</h3>
        <p>Bir hafta dolmadan anlamlı bir örüntü çıkmaz. <em>${kaldi} gün</em> daha cevap biriktir, sonra kendi sesin karşına çıkmaya başlar.</p>
      </div>`;
    } else {
      box.innerHTML = `<div class="empty">
        <h3>Ortada bir şey yok</h3>
        <p>Birkaç gün daha cevap verince tekrarlayan temaların ve tutarsızlıkların burada görünür. Sistem seni izliyor — sen yazdıkça o da konuşacak.</p>
      </div>`;
    }
    return;
  }
  box.innerHTML = insights.map(ins => `
    <div class="insight-card ${ins.type || ''}">
      <div class="lbl">${escapeHtml(ins.label)}</div>
      <div class="msg">${ins.msg}</div>
    </div>
  `).join('');
}

function getCapsuleEntries() {
  const out = [];
  const targets = [30, 60, 90];
  for (const days of targets) {
    const target = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
    const candidates = historyCache.filter(a => a.date === target && (a.type === 'kurulus' || a.type === 'aksam' || a.type === 'sabah'));
    if (candidates.length) out.push({ daysAgo: days, entry: candidates[0] });
  }
  return out;
}

function renderCapsule() {
  const box = document.getElementById('capsuleList');
  const capsules = getCapsuleEntries();
  if (!capsules.length) {
    box.innerHTML = `<div class="empty">
      <h3>Kapsüller henüz boş</h3>
      <p>30, 60, 90 gün önceki cevapların zamanı geldiğinde burada açılır. Geçmişteki sen, şimdiki seni bekler.</p>
    </div>`;
    return;
  }
  box.innerHTML = capsules.map(c => {
    const d = c.entry.timestamp?.toDate ? c.entry.timestamp.toDate() : new Date();
    const challenges = [
      'Bu cümleyi yazan sen, bugünküne ne söylerdi?',
      'O günden bu yana ne değişti? Dürüst ol.',
      'Bu cevap hâlâ seni anlatıyor mu?',
      'Elinde kanıt var mı, yoksa aynı yalanı mı söylüyorsun?'
    ];
    return `
    <div class="capsule-card">
      <div class="header">
        <div class="title">${c.daysAgo} gün önce</div>
        <div class="date">${d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>
      <div class="old-q">${escapeHtml(c.entry.question)}</div>
      <div class="old-a">${escapeHtml(c.entry.answer)}</div>
      <div class="challenge">→ ${challenges[c.daysAgo % challenges.length]}</div>
    </div>`;
  }).join('');
}

let currentGuideArticle = null;

function renderGuide() {
  const box = document.getElementById('guideContent');
  if (!currentGuideArticle) {
    let html = '<div class="guide-toc">';
    GUIDE_ARTICLES.forEach(a => {
      html += `<div class="toc-item" onclick="openGuideArticle('${a.id}')">
        <div class="ttl">${escapeHtml(a.title)}</div>
        <div class="arrow">→</div>
      </div>`;
    });
    html += '</div>';
    box.innerHTML = html;
  } else {
    const art = GUIDE_ARTICLES.find(a => a.id === currentGuideArticle);
    if (!art) { currentGuideArticle = null; renderGuide(); return; }
    box.innerHTML = `
      <div class="guide-article">
        <div class="back" onclick="closeGuideArticle()">← Tüm bölümler</div>
        <h3>${escapeHtml(art.title)}</h3>
        <div class="lead">${escapeHtml(art.lead)}</div>
        ${art.body}
      </div>
    `;
  }
}

window.openGuideArticle = function(id) {
  currentGuideArticle = id;
  renderGuide();
  window.scrollTo(0, 0);
};

window.closeGuideArticle = function() {
  currentGuideArticle = null;
  renderGuide();
};

window.goToGuide = function(id) {
  currentGuideArticle = id;
  showScreen('guide');
};

function checkRituals() {
  const today = new Date();
  const dow = today.getDay();
  const dom = today.getDate();
  const lastW = userData.lastWeeklyRitual ? new Date(userData.lastWeeklyRitual) : null;
  const daysSinceLastW = lastW ? Math.floor((today - lastW) / 86400000) : 999;

  if (dow === 0 && daysSinceLastW >= 6) {
    setTimeout(() => {
      if (confirm('Pazar geldi. Haftalık ritüele ne dersin? (4 kısa soru)')) {
        startQuest('haftalik', null);
      }
    }, 1200);
  }

  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const lastM = userData.lastMonthlyRitual ? new Date(userData.lastMonthlyRitual) : null;
  const sameMonth = lastM && lastM.getMonth() === today.getMonth() && lastM.getFullYear() === today.getFullYear();

  if (dom >= lastDayOfMonth - 2 && !sameMonth) {
    setTimeout(() => {
      if (confirm('Ay kapanıyor. Aylık ritüel vakti (4 soru). Hemen yapalım mı?')) {
        startQuest('aylik', null);
      }
    }, 3000);
  }
}

function renderSettings() {
  const sw = document.getElementById('notifSwitch');
  sw.classList.toggle('on', !!userData.notifEnabled);
}

window.toggleNotif = async function() {
  if (!userData.notifEnabled) {
    if (!('Notification' in window)) {
      showToast('Tarayıcın bildirimleri desteklemiyor.');
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      userData.notifEnabled = true;
      await saveUserData();
      document.getElementById('notifSwitch').classList.add('on');
      showToast('Bildirimler açık. Saati geldiğinde haber veririm.');
      new Notification('Kaizen', { body: 'Bildirimler aktif. Her soru saatinde seni dürteceğim.', icon: '' });
      scheduleNotifs();
    } else {
      showToast('Bildirim izni verilmedi.');
    }
  } else {
    userData.notifEnabled = false;
    await saveUserData();
    document.getElementById('notifSwitch').classList.remove('on');
    showToast('Bildirimler kapandı.');
  }
};

let notifTimers = [];
function setupNotifs() {
  notifTimers.forEach(t => clearTimeout(t));
  notifTimers = [];
  if (!userData.notifEnabled) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  scheduleNotifs();
}

function scheduleNotifs() {
  const now = new Date();
  TIME_SLOTS.forEach(slot => {
    const [h, m] = slot.time.split(':').map(Number);
    const target = new Date(now);
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const ms = target - now;
    if (ms > 0 && ms < 24 * 3600 * 1000) {
      const timer = setTimeout(() => {
        const today = todayStr();
        const done = historyCache.filter(a => a.date === today && a.slotKey === slot.key).length;
        if (done < slot.count) {
          new Notification('Kaizen — ' + slot.time, {
            body: slot.label + ' vakti. Bir dakika ayır, kendine sor, yaz.',
            tag: slot.key
          });
        }
      }, ms);
      notifTimers.push(timer);
    }
  });
}

window.exportData = async function() {
  const data = { profile: userData, answers: historyCache, exportDate: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kaizen-${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

window.resetData = async function() {
  if (!confirm('TÜM verilerin silinecek. Devam edelim mi?')) return;
  if (!confirm('Gerçekten emin misin? Bu geri alınamaz.')) return;
  const answersRef = collection(db, 'users', currentUser.uid, 'answers');
  const snap = await getDocs(answersRef);
  for (const d of snap.docs) await deleteDoc(d.ref);
  await deleteDoc(doc(db, 'users', currentUser.uid));
  showToast('Her şey silindi.');
  setTimeout(() => signOut(auth), 1500);
};

window.replayOnboard = function() {
  showOnboard();
};

function showOnboard() {
  document.getElementById('app').classList.remove('active');
  document.getElementById('bottomNav').classList.remove('show');
  document.getElementById('onboard').classList.add('show');
  onboardIndex = 0;
  renderOnboardDots();
  document.getElementById('onboardSlides').scrollTo({ left: 0, behavior: 'instant' });
}

function renderOnboardDots() {
  const slides = document.querySelectorAll('.onboard .slide');
  const dots = document.getElementById('onboardDots');
  dots.innerHTML = '';
  for (let i = 0; i < slides.length; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === onboardIndex ? ' active' : '');
    dots.appendChild(d);
  }
  const nextBtn = document.getElementById('onboardNext');
  if (onboardIndex === slides.length - 1) nextBtn.textContent = 'Başla →';
  else nextBtn.textContent = 'İleri →';
}

document.getElementById('onboardNext').addEventListener('click', async () => {
  const slides = document.querySelectorAll('.onboard .slide');
  if (onboardIndex < slides.length - 1) {
    onboardIndex++;
    const slideW = document.getElementById('onboardSlides').clientWidth;
    document.getElementById('onboardSlides').scrollTo({ left: slideW * onboardIndex, behavior: 'smooth' });
    renderOnboardDots();
  } else {
    userData.onboardingDone = true;
    await saveUserData();
    document.getElementById('onboard').classList.remove('show');
    initApp();
    document.getElementById('app').classList.add('active');
    document.getElementById('bottomNav').classList.add('show');
  }
});

document.getElementById('onboardSkip').addEventListener('click', async () => {
  userData.onboardingDone = true;
  await saveUserData();
  document.getElementById('onboard').classList.remove('show');
  initApp();
  document.getElementById('app').classList.add('active');
  document.getElementById('bottomNav').classList.add('show');
});

document.getElementById('onboardSlides').addEventListener('scroll', () => {
  const slideW = document.getElementById('onboardSlides').clientWidth;
  const newIdx = Math.round(document.getElementById('onboardSlides').scrollLeft / slideW);
  if (newIdx !== onboardIndex) {
    onboardIndex = newIdx;
    renderOnboardDots();
  }
});

setInterval(() => {
  if (document.getElementById('screen-home').classList.contains('active')) {
    renderTimeSlots();
  }
}, 60000);

window.openAnswerView = function(slotKey, date) {
  const answers = historyCache.filter(a => a.slotKey === slotKey && a.date === date);
  if (!answers.length) return;
  const slot = TIME_SLOTS.find(s => s.key === slotKey);
  const slotLabel = slot ? slot.label : 'Cevaplar';
  const slotTime = slot ? slot.time : '';

  const modal = document.getElementById('answerModal');
  const title = document.getElementById('answerModalTitle');
  const sub = document.getElementById('answerModalSub');
  const list = document.getElementById('answerModalList');

  title.textContent = slotLabel;
  sub.textContent = slotTime ? `${slotTime} · ${new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}` : '';

  list.innerHTML = answers.map(a => {
    const t = a.timestamp?.toDate ? a.timestamp.toDate() : null;
    const timeStr = t ? `${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}` : '';
    return `
      <div class="answer-view-card">
        <div class="answer-view-time">${timeStr ? `✓ ${timeStr}'de yazıldı` : '✓ Kayıtlı'}</div>
        <div class="answer-view-q">${escapeHtml(a.question)}</div>
        <div class="answer-view-a">${escapeHtml(a.answer)}</div>
      </div>
    `;
  }).join('');

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
};

window.closeAnswerView = function() {
  document.getElementById('answerModal').classList.remove('show');
  document.body.style.overflow = '';
};

// =========================================================
// GÜNLÜK (JOURNAL) — Serbest Yazma
// =========================================================

function renderJournal() {
  if (userData.journalPinHash && !journalUnlocked) {
    renderJournalLock();
    return;
  }
  if (!userData.journalPinHash) {
    renderJournalPinSetup();
    return;
  }
  renderJournalList();
}

function renderJournalPinSetup() {
  const box = document.getElementById('journalContent');
  box.innerHTML = `
    <div class="journal-setup">
      <div class="journal-setup-icon">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="5" y="11" width="14" height="10" rx="2"/>
          <path d="M8 11V7a4 4 0 018 0v4"/>
        </svg>
      </div>
      <h3>Günlüğünü şifrele</h3>
      <p class="journal-setup-lead">Burada yazdıkların sadece sana ait. Telefonun başka birinin eline geçse bile erişemez.</p>
      <div class="journal-pin-info">
        <div class="pin-info-item">
          <span class="pin-info-dot"></span>
          <span>4-6 haneli sayısal PIN belirle</span>
        </div>
        <div class="pin-info-item">
          <span class="pin-info-dot"></span>
          <span>Google şifrenden ayrıdır — sadece günlük için</span>
        </div>
        <div class="pin-info-item warn">
          <span class="pin-info-dot"></span>
          <span>PIN'i unutursan, kurtarılamaz — eski yazıları silmeden göremezsin</span>
        </div>
      </div>
      <div class="pin-input-block">
        <label>Yeni PIN</label>
        <input type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" class="pin-input" id="newPin1" placeholder="••••">
        <label style="margin-top: 14px;">PIN'i tekrar gir</label>
        <input type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" class="pin-input" id="newPin2" placeholder="••••">
        <div class="pin-error hidden" id="pinError"></div>
      </div>
      <button class="btn-save" onclick="saveNewPin()">PIN'i kaydet ve günlüğe gir</button>
    </div>
  `;
}

window.saveNewPin = async function() {
  const p1 = document.getElementById('newPin1').value.trim();
  const p2 = document.getElementById('newPin2').value.trim();
  const err = document.getElementById('pinError');
  err.classList.add('hidden');

  if (!/^\d{4,6}$/.test(p1)) {
    err.textContent = 'PIN 4 ile 6 arası rakamdan oluşmalı';
    err.classList.remove('hidden');
    return;
  }
  if (p1 !== p2) {
    err.textContent = 'İki PIN eşleşmiyor';
    err.classList.remove('hidden');
    return;
  }

  userData.journalPinHash = await hashPin(p1);
  await saveUserData();
  journalUnlocked = true;
  showToast('PIN ayarlandı. Günlüğün güvende.');
  renderJournal();
};

let pinAttempts = 0;
let pinLockUntil = 0;

function renderJournalLock() {
  const box = document.getElementById('journalContent');
  const now = Date.now();
  const locked = now < pinLockUntil;
  const remainSec = Math.ceil((pinLockUntil - now) / 1000);

  box.innerHTML = `
    <div class="journal-lock">
      <div class="lock-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
          <rect x="5" y="11" width="14" height="10" rx="2"/>
          <path d="M8 11V7a4 4 0 018 0v4"/>
        </svg>
      </div>
      <h3>Günlüğüne PIN gir</h3>
      <p class="lock-lead">Yazdıkların sadece sana ait.</p>
      ${locked ? `
        <div class="lock-countdown">
          ${remainSec} saniye bekle...
        </div>
      ` : `
        <div class="pin-input-block">
          <input type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" class="pin-input pin-input-center" id="unlockPin" placeholder="••••" autofocus>
          <div class="pin-error hidden" id="lockPinError"></div>
        </div>
        <button class="btn-save" onclick="tryUnlock()">Kilidi aç</button>
        <div class="lock-footer" onclick="forgotPin()">PIN'imi unuttum</div>
      `}
    </div>
  `;

  if (locked) {
    setTimeout(() => renderJournalLock(), 1000);
  } else {
    setTimeout(() => {
      const inp = document.getElementById('unlockPin');
      if (inp) {
        inp.focus();
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') window.tryUnlock();
        });
      }
    }, 100);
  }
}

window.tryUnlock = async function() {
  const pin = document.getElementById('unlockPin').value.trim();
  const err = document.getElementById('lockPinError');
  err.classList.add('hidden');

  if (!/^\d{4,6}$/.test(pin)) {
    err.textContent = 'PIN 4-6 rakam olmalı';
    err.classList.remove('hidden');
    return;
  }

  const hash = await hashPin(pin);
  if (hash === userData.journalPinHash) {
    journalUnlocked = true;
    pinAttempts = 0;
    showToast('Hoş geldin.');
    renderJournal();
  } else {
    pinAttempts++;
    if (pinAttempts >= 3) {
      pinLockUntil = Date.now() + 60000;
      pinAttempts = 0;
      err.textContent = '3 yanlış deneme. 60 saniye bekle.';
    } else {
      err.textContent = `Yanlış PIN. ${3 - pinAttempts} hakkın kaldı.`;
    }
    err.classList.remove('hidden');
    document.getElementById('unlockPin').value = '';
    if (pinLockUntil > Date.now()) renderJournalLock();
  }
};

window.forgotPin = async function() {
  const confirmed = confirm('PIN\'i sıfırlamak için tüm günlük yazılarını silmek gerekiyor. Devam etmek istiyor musun?');
  if (!confirmed) return;
  const confirmed2 = confirm('Emin misin? Bu işlem GERİ ALINAMAZ. Tüm günlük yazıların silinecek.');
  if (!confirmed2) return;

  const jRef = collection(db, 'users', currentUser.uid, 'journal');
  const snap = await getDocs(jRef);
  for (const d of snap.docs) await deleteDoc(d.ref);

  userData.journalPinHash = null;
  await saveUserData();
  journalCache = [];
  pinAttempts = 0;
  pinLockUntil = 0;
  journalUnlocked = false;
  showToast('Günlük sıfırlandı. Yeni PIN belirle.');
  if (document.getElementById('screen-journal').classList.contains('active')) {
    renderJournal();
  }
};

window.changeJournalPin = async function() {
  if (!userData.journalPinHash) {
    showToast('Henüz PIN belirlememişsin. Günlük sekmesinden belirle.');
    showScreen('journal');
    return;
  }

  const oldPin = prompt('Mevcut PIN\'ini gir:');
  if (!oldPin) return;
  const oldHash = await hashPin(oldPin.trim());
  if (oldHash !== userData.journalPinHash) {
    showToast('Mevcut PIN yanlış.');
    return;
  }

  const newPin = prompt('Yeni PIN (4-6 rakam):');
  if (!newPin || !/^\d{4,6}$/.test(newPin.trim())) {
    showToast('Geçersiz PIN formatı.');
    return;
  }
  const confirmPin = prompt('Yeni PIN\'i tekrar gir:');
  if (confirmPin?.trim() !== newPin.trim()) {
    showToast('PIN\'ler eşleşmiyor.');
    return;
  }

  userData.journalPinHash = await hashPin(newPin.trim());
  await saveUserData();
  showToast('PIN güncellendi.');
};

function renderJournalList() {
  const box = document.getElementById('journalContent');
  if (currentJournalEntry !== null) {
    renderJournalEditor();
    return;
  }

  const patternStatus = userData.journalIncludeInPatterns
    ? { txt: 'Örüntülere dahil', cls: 'on' }
    : { txt: 'Örüntülerden ayrı', cls: 'off' };

  let listHtml = '';
  if (!journalCache.length) {
    listHtml = `
      <div class="journal-empty">
        <p>Henüz yazılmış bir sayfa yok.</p>
        <p class="small">Sağ üstteki "Yeni sayfa" ile başla.</p>
      </div>
    `;
  } else {
    listHtml = journalCache.map(entry => {
      const d = entry.timestamp?.toDate ? entry.timestamp.toDate() : new Date();
      const preview = entry.content.replace(/\s+/g, ' ').slice(0, 140);
      const title = entry.title || 'Başlıksız';
      return `
        <div class="journal-card" onclick="openJournalEntry('${entry.id}')">
          <div class="journal-card-date">
            ${d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            · ${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div class="journal-card-title">${escapeHtml(title)}</div>
          <div class="journal-card-preview">${escapeHtml(preview)}${entry.content.length > 140 ? '...' : ''}</div>
        </div>
      `;
    }).join('');
  }

  box.innerHTML = `
    <div class="journal-top-bar">
      <div class="journal-count">
        <span class="count-num">${journalCache.length}</span>
        <span class="count-lbl">${journalCache.length === 1 ? 'sayfa' : 'sayfa'}</span>
      </div>
      <div class="journal-actions">
        <button class="journal-pattern-toggle ${patternStatus.cls}" onclick="toggleJournalPatterns()" title="${patternStatus.txt}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>
          <span>${patternStatus.txt}</span>
        </button>
        <button class="journal-new-btn" onclick="openJournalEntry('new')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          <span>Yeni sayfa</span>
        </button>
      </div>
    </div>
    <div class="journal-list">${listHtml}</div>
  `;
}

window.toggleJournalPatterns = function() {
  const modal = document.getElementById('answerModal');
  const title = document.getElementById('answerModalTitle');
  const sub = document.getElementById('answerModalSub');
  const list = document.getElementById('answerModalList');
  const footer = document.querySelector('.answer-modal-footer');

  const isOn = userData.journalIncludeInPatterns;
  title.textContent = 'Örüntü Algılayıcı Nedir?';
  sub.textContent = 'Günlük yazılarını dahil etmeli miyim?';

  list.innerHTML = `
    <div class="pattern-explain">
      <p>Örüntü algılayıcı, cevaplarındaki <em>tekrarlayan kelimeleri</em> ve <em>kendi tutarsızlıklarını</em> sadece <strong>SANA</strong> gösterir.</p>
      <p><strong>Kimse başka göremez.</strong> Ben de, arkadaşların da, kimse. Veriler Firebase'de şifreli duruyor — sadece senin Google hesabınla açılıyor.</p>
      <p>Örnek: 14 günde 11 kez "yorgunum" yazmışsan, sistem sana "<em>bir mesaj mı taşıyor?</em>" diye sorar.</p>
      <div class="pattern-explain-options">
        <div class="pattern-option ${isOn ? '' : 'selected'}" onclick="setJournalPatterns(false)">
          <div class="pattern-option-head">
            <div class="pattern-option-radio ${isOn ? '' : 'on'}"></div>
            <div class="pattern-option-title">Sadece soru cevapları</div>
          </div>
          <div class="pattern-option-desc">Günlüğün tamamen özel kalır. Sistem günlük yazılarından örüntü çıkarmaz.</div>
        </div>
        <div class="pattern-option ${isOn ? 'selected' : ''}" onclick="setJournalPatterns(true)">
          <div class="pattern-option-head">
            <div class="pattern-option-radio ${isOn ? 'on' : ''}"></div>
            <div class="pattern-option-title">Soru cevapları + Günlük</div>
          </div>
          <div class="pattern-option-desc">Günlük yazıların da analiz edilir. Daha derin örüntüler görürsün ama yine kimse okumaz.</div>
        </div>
      </div>
    </div>
  `;

  footer.innerHTML = 'İstediğin an buradan değiştirebilirsin.';
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
};

window.setJournalPatterns = async function(val) {
  userData.journalIncludeInPatterns = val;
  await saveUserData();
  window.closeAnswerView();
  showToast(val ? 'Günlük örüntülere dahil edildi.' : 'Günlük örüntülerden ayrıldı.');
  renderJournal();
};

window.openJournalEntry = function(idOrNew) {
  if (idOrNew === 'new') {
    currentJournalEntry = { id: null, title: '', content: '', new: true };
  } else {
    const entry = journalCache.find(e => e.id === idOrNew);
    if (!entry) return;
    currentJournalEntry = { ...entry, new: false };
  }
  renderJournalEditor();
};

window.closeJournalEntry = function() {
  currentJournalEntry = null;
  renderJournalList();
};

function renderJournalEditor() {
  const box = document.getElementById('journalContent');
  const today = new Date();
  const dateStr = currentJournalEntry.new
    ? today.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : (() => {
        const d = currentJournalEntry.timestamp?.toDate ? currentJournalEntry.timestamp.toDate() : new Date();
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
      })();

  box.innerHTML = `
    <div class="journal-editor">
      <div class="journal-page">
        <div class="journal-page-header">
          <button class="journal-back" onclick="closeJournalEntry()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span>Kapat</span>
          </button>
          <div class="journal-page-date">${dateStr}</div>
          ${!currentJournalEntry.new ? `<button class="journal-delete" onclick="deleteCurrentJournal()" title="Sil"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg></button>` : `<div style="width: 30px;"></div>`}
        </div>
        <input
          type="text"
          class="journal-title-input"
          id="journalTitle"
          placeholder="Başlık (istersen)..."
          value="${escapeAttr(currentJournalEntry.title || '')}"
        >
        <textarea
          class="journal-content"
          id="journalContent_ta"
          placeholder="İçinden ne geçiyorsa yaz. Saçma gelsin, mantıklı gelsin, dağınık olsun — fark etmez. Burası senin defterin."
        >${escapeHtml(currentJournalEntry.content || '')}</textarea>
      </div>
      <div class="journal-editor-footer">
        <div class="journal-save-status" id="journalSaveStatus">Otomatik kaydediliyor</div>
        <button class="btn-primary journal-save-btn" onclick="saveJournalManual()">Kaydet & Kapat</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const ta = document.getElementById('journalContent_ta');
    if (ta && currentJournalEntry.new) ta.focus();

    let saveTimer = null;
    const doAutoSave = async () => {
      const title = document.getElementById('journalTitle').value;
      const content = document.getElementById('journalContent_ta').value;
      if (!content.trim() && !title.trim()) return;

      const status = document.getElementById('journalSaveStatus');
      status.textContent = 'Kaydediliyor...';

      if (currentJournalEntry.new && !currentJournalEntry.id) {
        const id = await addJournalEntry(title, content);
        currentJournalEntry.id = id;
        currentJournalEntry.new = false;
      } else if (currentJournalEntry.id) {
        await updateJournalEntry(currentJournalEntry.id, title, content);
      }
      await loadJournal();
      status.textContent = 'Kaydedildi ✓';
      setTimeout(() => { if (status) status.textContent = 'Otomatik kaydediliyor'; }, 1500);
    };

    const scheduleAutoSave = () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(doAutoSave, 1200);
    };

    document.getElementById('journalTitle').addEventListener('input', scheduleAutoSave);
    if (ta) ta.addEventListener('input', scheduleAutoSave);
  }, 100);
}

window.saveJournalManual = async function() {
  const title = document.getElementById('journalTitle').value;
  const content = document.getElementById('journalContent_ta').value;
  if (!content.trim() && !title.trim()) {
    closeJournalEntry();
    return;
  }
  if (currentJournalEntry.new && !currentJournalEntry.id) {
    await addJournalEntry(title, content);
  } else if (currentJournalEntry.id) {
    await updateJournalEntry(currentJournalEntry.id, title, content);
  }
  await loadJournal();
  showToast('Kaydedildi.');
  closeJournalEntry();
};

window.deleteCurrentJournal = async function() {
  if (!currentJournalEntry?.id) return;
  if (!confirm('Bu sayfayı silmek istediğine emin misin?')) return;
  await deleteJournalEntry(currentJournalEntry.id);
  await loadJournal();
  showToast('Sayfa silindi.');
  closeJournalEntry();
};

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function escapeAttr(s) {
  if (!s) return '';
  return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Acil durum: 15 saniye içinde hâlâ loading varsa otomatik kapat ve login göster
setTimeout(() => {
  const loading = document.getElementById('loading');
  if (loading && !loading.classList.contains('hidden')) {
    console.warn('Yükleme 15 saniyede bitmedi, acil durum kurtarması');
    loading.classList.add('hidden');
    const login = document.getElementById('login');
    const app = document.getElementById('app');
    if (login && (!app || !app.classList.contains('active'))) {
      login.classList.remove('hidden');
    }
  }
}, 15000);
