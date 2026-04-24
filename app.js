// =========================================================
// KAIZEN — ANA UYGULAMA MANTIĞI
// Sabitler data.js'te (QUESTIONS, QUOTES, SLOGANS, TIME_SLOTS, GUIDE_ARTICLES, STOPWORDS)
// Stiller styles.css'te
// =========================================================

console.log('[Kaizen] app.js yükleniyor...');

import { SLOGANS, QUOTES, QUESTIONS, TIME_SLOTS, STOPWORDS, GUIDE_ARTICLES, BFI_QUESTIONS, BFI_DIMENSIONS, BFI_INTERPRETATIONS, generateProfileSummary, VENT_CATEGORIES } from './data.js';

console.log('[Kaizen] data.js içe aktarıldı');

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, getDocs, query, orderBy, Timestamp, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log('[Kaizen] Firebase modülleri içe aktarıldı');

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

console.log('[Kaizen] Firebase başlatıldı');

let currentUser = null;
let userData = {
  vision: '',
  antiVision: '',
  identity: '',
  yearGoal: { title: '', start: '', deadline: '' },
  monthGoal: { title: '', deadline: '', tasks: [], startDate: null, celebrated: false },
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
  keyboardSound: true,
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
let bfiCache = [];
let bfiAnswers = {};
let bfiCurrentIndex = 0;

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
  console.log('[Kaizen] onAuthStateChanged tetiklendi, user:', user ? user.email : 'null');
  if (user) {
    currentUser = user;
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('login').classList.add('hidden');
    try {
      console.log('[Kaizen] loadUserData başlıyor...');
      await loadUserData();
      console.log('[Kaizen] loadUserData tamam.');
    } catch (e) {
      console.error('[Kaizen] loadUserData hatası:', e);
      // Hata olsa bile uygulamayı aç, kullanıcı sonsuza kadar yükleme ekranında kalmasın
    }
    if (!userData.onboardingDone) {
      console.log('[Kaizen] Onboarding gösteriliyor');
      document.getElementById('loading').classList.add('hidden');
      showOnboard();
    } else {
      try {
        console.log('[Kaizen] initApp çağrılıyor');
        initApp();
        console.log('[Kaizen] initApp tamam');
      } catch (e) {
        console.error('[Kaizen] initApp hatası:', e);
      }
      document.getElementById('loading').classList.add('hidden');
      document.getElementById('app').classList.add('active');
      document.getElementById('bottomNav').classList.add('show');
    }
  } else {
    console.log('[Kaizen] Kullanıcı yok, login ekranı gösteriliyor');
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
  console.log('[Kaizen] loadUserData: user doc alınıyor');
  const ref = doc(db, 'users', currentUser.uid);
  const snap = await getDoc(ref);
  console.log('[Kaizen] loadUserData: user doc alındı, exists:', snap.exists());
  if (snap.exists()) {
    userData = { ...userData, ...snap.data() };
    // Mevcut ama joinedDate'i olmayan eski kullanıcılar için:
    if (!userData.joinedDate) {
      userData.joinedDate = todayStr();
      await setDoc(ref, { joinedDate: userData.joinedDate }, { merge: true });
    }
    // Migration: eski monthGoal yapısından yeni yapıya geç
    if (userData.monthGoal) {
      if (!Array.isArray(userData.monthGoal.tasks)) {
        userData.monthGoal.tasks = [];
      }
      if (userData.monthGoal.celebrated === undefined) {
        userData.monthGoal.celebrated = false;
      }
      if (!userData.monthGoal.startDate && userData.monthGoal.title) {
        userData.monthGoal.startDate = userData.joinedDate || todayStr();
      }
    }
  } else {
    userData.joinedDate = todayStr();
    await setDoc(ref, userData);
  }
  console.log('[Kaizen] loadUserData: loadHistory çağrılıyor');
  await loadHistory();
  console.log('[Kaizen] loadUserData: loadJournal çağrılıyor');
  await loadJournal();
  console.log('[Kaizen] loadUserData: loadBfiResults çağrılıyor');
  await loadBfiResults();
  console.log('[Kaizen] loadUserData: loadVentings çağrılıyor');
  await loadVentings();
  console.log('[Kaizen] loadUserData: updateStreak çağrılıyor');
  await updateStreak();
  console.log('[Kaizen] loadUserData: TAMAM');
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
  try {
    const ref = collection(db, 'users', currentUser.uid, 'answers');
    const q = query(ref, orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    historyCache = [];
    snap.forEach(d => {
      historyCache.push({ id: d.id, ...d.data() });
    });
    console.log('[Kaizen] loadHistory: ' + historyCache.length + ' cevap yüklendi');
  } catch (e) {
    console.error('[Kaizen] loadHistory HATASI:', e);
    historyCache = [];
  }
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

// =========================================================
// DERTLEŞME (VENTING) — Firebase CRUD
// =========================================================
let ventCache = [];
let currentVentCategory = null;
let currentVentQuestion = null;
let currentVentEntry = null;

async function loadVentings() {
  try {
    const ref = collection(db, 'users', currentUser.uid, 'ventings');
    const q = query(ref, orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    ventCache = [];
    snap.forEach(d => {
      ventCache.push({ id: d.id, ...d.data() });
    });
  } catch (e) {
    console.warn('Dertleşme yüklenemedi:', e);
    ventCache = [];
  }
}

async function addVentEntry(categoryKey, questionIndex, content) {
  const ref = collection(db, 'users', currentUser.uid, 'ventings');
  const docRef = await addDoc(ref, {
    category: categoryKey,
    questionIndex: questionIndex,
    content: content.trim(),
    date: todayStr(),
    timestamp: Timestamp.now()
  });
  return docRef.id;
}

async function updateVentEntry(id, content) {
  const ref = doc(db, 'users', currentUser.uid, 'ventings', id);
  await setDoc(ref, {
    content: content.trim(),
    timestamp: Timestamp.now()
  }, { merge: true });
}

async function deleteVentEntry(id) {
  const ref = doc(db, 'users', currentUser.uid, 'ventings', id);
  await deleteDoc(ref);
}

async function loadBfiResults() {
  try {
    const ref = collection(db, 'users', currentUser.uid, 'personalityTests');
    const q = query(ref, orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    bfiCache = [];
    snap.forEach(d => {
      bfiCache.push({ id: d.id, ...d.data() });
    });
  } catch (e) {
    console.warn('BFI sonuçları yüklenemedi:', e);
    bfiCache = [];
  }
}

async function saveBfiResult(scores, answers) {
  const ref = collection(db, 'users', currentUser.uid, 'personalityTests');
  const docRef = await addDoc(ref, {
    scores: scores,
    answers: answers,
    date: todayStr(),
    timestamp: Timestamp.now()
  });
  return docRef.id;
}

function getLastBfiDate() {
  if (!bfiCache.length) return null;
  return bfiCache[0].date;
}

function daysSinceLastBfi() {
  const last = getLastBfiDate();
  if (!last) return null;
  const d = new Date(last + 'T00:00:00');
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

function canTakeBfi() {
  const days = daysSinceLastBfi();
  if (days === null) return { can: true, daysLeft: 0 };
  const daysLeft = 30 - days;
  return { can: daysLeft <= 0, daysLeft: Math.max(0, daysLeft) };
}

function calcBfiScores(answers) {
  const totals = { E: 0, A: 0, C: 0, N: 0, O: 0 };
  const counts = { E: 0, A: 0, C: 0, N: 0, O: 0 };

  BFI_QUESTIONS.forEach(q => {
    const raw = answers[q.n];
    if (raw === undefined || raw === null) return;
    const value = q.r ? (6 - raw) : raw;
    totals[q.d] += value;
    counts[q.d] += 1;
  });

  const scores = {};
  ['E', 'A', 'C', 'N', 'O'].forEach(d => {
    scores[d] = counts[d] ? parseFloat((totals[d] / counts[d]).toFixed(2)) : 0;
  });
  return scores;
}

async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + '::kaizen::' + currentUser.uid);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// =========================================================
// BOSS GÖREV YARDIMCI FONKSİYONLARI
// =========================================================

function getWeekKey(date) {
  const d = date ? new Date(date) : new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function isTaskDoneToday(task) {
  if (!task) return false;
  if (task.type === 'milestone') {
    return !!task.completedAt;
  }
  if (task.type === 'daily') {
    return (task.completions || []).includes(todayStr());
  }
  if (task.type === 'weekly') {
    const weekKey = getWeekKey();
    const weekCompletions = (task.completions || []).filter(d => getWeekKey(d) === weekKey);
    return weekCompletions.length >= (task.targetPerWeek || 1);
  }
  return false;
}

function getTaskWeekProgress(task) {
  // weekly görev için bu haftaki N/hedef durumu
  if (task.type !== 'weekly') return null;
  const weekKey = getWeekKey();
  const thisWeek = (task.completions || []).filter(d => getWeekKey(d) === weekKey).length;
  return { current: thisWeek, target: task.targetPerWeek || 1 };
}

function calcBossProgress() {
  const tasks = userData.monthGoal?.tasks || [];
  if (!tasks.length) return 0;

  const mg = userData.monthGoal;
  const start = mg.startDate ? new Date(mg.startDate) : new Date();
  const end = mg.deadline ? new Date(mg.deadline) : new Date(Date.now() + 30 * 86400000);
  const now = new Date();
  const totalDays = Math.max(1, Math.round((end - start) / 86400000));
  const passedDays = Math.max(1, Math.round((now - start) / 86400000) + 1);
  const totalWeeks = Math.max(1, Math.ceil(totalDays / 7));
  const passedWeeks = Math.max(1, Math.ceil(passedDays / 7));

  let totalExpected = 0;
  let totalDone = 0;

  tasks.forEach(task => {
    if (task.type === 'milestone') {
      totalExpected += 1;
      if (task.completedAt) totalDone += 1;
    } else if (task.type === 'daily') {
      const expected = Math.min(passedDays, totalDays);
      const done = (task.completions || []).filter(d => {
        const dd = new Date(d);
        return dd >= start && dd <= now;
      }).length;
      totalExpected += expected;
      totalDone += Math.min(done, expected);
    } else if (task.type === 'weekly') {
      const target = task.targetPerWeek || 1;
      const expected = Math.min(passedWeeks, totalWeeks) * target;
      const done = (task.completions || []).filter(d => {
        const dd = new Date(d);
        return dd >= start && dd <= now;
      }).length;
      totalExpected += expected;
      totalDone += Math.min(done, expected);
    }
  });

  if (totalExpected === 0) return 0;
  return Math.min(100, Math.round((totalDone / totalExpected) * 100));
}

async function toggleTaskCompletion(taskId) {
  const task = (userData.monthGoal?.tasks || []).find(t => t.id === taskId);
  if (!task) return;

  const today = todayStr();

  if (task.type === 'milestone') {
    task.completedAt = task.completedAt ? null : today;
  } else if (task.type === 'daily') {
    task.completions = task.completions || [];
    if (task.completions.includes(today)) {
      task.completions = task.completions.filter(d => d !== today);
    } else {
      task.completions.push(today);
    }
  } else if (task.type === 'weekly') {
    task.completions = task.completions || [];
    // weekly için, bugün işaretli mi check et
    const todayIdx = task.completions.indexOf(today);
    if (todayIdx >= 0) {
      task.completions.splice(todayIdx, 1);
    } else {
      task.completions.push(today);
    }
  }

  await saveUserData();
  renderHome();
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
  if (name === 'vent') renderVent();
  if (name === 'guide') renderGuide();
  if (name === 'journal') renderJournal();
  if (name === 'profile') renderProfile();
  if (name === 'settings') renderSettings();
  window.scrollTo(0, 0);
};

// =========================================================
// KLAVYE SES MOTORU — gerçek mekanik klavye ses dosyaları
// =========================================================

// jsDelivr CDN üzerinden kbsim repo'sundan Cherry MX Blue ses dosyaları
// Lisans: MIT (tplai/kbsim)
const KEY_SOUND_URLS = {
  down: [
    'https://cdn.jsdelivr.net/gh/tplai/kbsim@master/src/assets/audio/cherrymxblue/GENERIC_R0.mp3',
    'https://cdn.jsdelivr.net/gh/tplai/kbsim@master/src/assets/audio/cherrymxblue/GENERIC_R1.mp3',
    'https://cdn.jsdelivr.net/gh/tplai/kbsim@master/src/assets/audio/cherrymxblue/GENERIC_R2.mp3',
    'https://cdn.jsdelivr.net/gh/tplai/kbsim@master/src/assets/audio/cherrymxblue/GENERIC_R3.mp3',
    'https://cdn.jsdelivr.net/gh/tplai/kbsim@master/src/assets/audio/cherrymxblue/GENERIC_R4.mp3'
  ],
  space: 'https://cdn.jsdelivr.net/gh/tplai/kbsim@master/src/assets/audio/cherrymxblue/SPACE.mp3',
  enter: 'https://cdn.jsdelivr.net/gh/tplai/kbsim@master/src/assets/audio/cherrymxblue/ENTER.mp3',
  backspace: 'https://cdn.jsdelivr.net/gh/tplai/kbsim@master/src/assets/audio/cherrymxblue/BACKSPACE.mp3'
};

// Önceden yüklenmiş audio buffer'ları
let keyAudioBuffers = {
  down: [],
  space: null,
  enter: null,
  backspace: null
};
let keyAudioLoaded = false;
let audioCtx = null;
let audioCtxReady = false;
let lastKeyTime = 0;
let keystrokeCounter = 0;
let keyVolumeGain = null;

function initAudioContext() {
  if (audioCtx) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = new AC();
    // Master volume kontrolü — yüksek ses için
    keyVolumeGain = audioCtx.createGain();
    keyVolumeGain.gain.value = 1.8; // Varsayılan yüksek ses
    keyVolumeGain.connect(audioCtx.destination);
  } catch (e) {
    console.warn('AudioContext başlatılamadı:', e);
  }
}

// Ses dosyalarını önceden yükle (buffer olarak)
async function preloadKeySounds() {
  if (!audioCtx || keyAudioLoaded) return;

  try {
    // Paralel yükleme
    const downPromises = KEY_SOUND_URLS.down.map(url =>
      fetch(url).then(r => r.arrayBuffer()).then(ab => audioCtx.decodeAudioData(ab)).catch(() => null)
    );
    const [downs, space, enter, backspace] = await Promise.all([
      Promise.all(downPromises),
      fetch(KEY_SOUND_URLS.space).then(r => r.arrayBuffer()).then(ab => audioCtx.decodeAudioData(ab)).catch(() => null),
      fetch(KEY_SOUND_URLS.enter).then(r => r.arrayBuffer()).then(ab => audioCtx.decodeAudioData(ab)).catch(() => null),
      fetch(KEY_SOUND_URLS.backspace).then(r => r.arrayBuffer()).then(ab => audioCtx.decodeAudioData(ab)).catch(() => null)
    ]);

    keyAudioBuffers.down = downs.filter(b => b !== null);
    keyAudioBuffers.space = space;
    keyAudioBuffers.enter = enter;
    keyAudioBuffers.backspace = backspace;
    keyAudioLoaded = keyAudioBuffers.down.length > 0;

    console.log('[Kaizen] Klavye sesleri yüklendi:', keyAudioBuffers.down.length, 'harf sesi');
  } catch (e) {
    console.warn('Klavye sesleri yüklenemedi:', e);
  }
}

// Kullanıcı etkileşiminden sonra AudioContext'i hazır hale getir
function unlockAudio() {
  if (audioCtxReady) return;
  initAudioContext();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => {
      audioCtxReady = true;
      preloadKeySounds();
    });
  } else {
    audioCtxReady = true;
    preloadKeySounds();
  }
}

// Belgenin her yerinde ilk tıklama/tuş basımında sesi aç
document.addEventListener('click', unlockAudio, { once: false });
document.addEventListener('keydown', unlockAudio, { once: false });
document.addEventListener('touchstart', unlockAudio, { once: false });

function playBuffer(buffer, volumeMult = 1.0) {
  if (!audioCtx || !buffer) return;
  try {
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.value = volumeMult;
    source.connect(gain);
    gain.connect(keyVolumeGain || audioCtx.destination);
    source.start(0);
  } catch (e) {
    // Sessiz kal
  }
}

function playKeyClick(keyType = 'letter') {
  // Ayar kapalıysa çıkma
  if (!userData.keyboardSound) return;
  if (!audioCtx || !audioCtxReady) return;

  // Çok hızlı basmaları süz
  const now = audioCtx.currentTime;
  if (now - lastKeyTime < 0.025) return;
  lastKeyTime = now;

  keystrokeCounter++;

  // Hafif ses seviyesi varyasyonu (%85-105)
  const variation = 0.85 + Math.random() * 0.20;

  // Gerçek ses dosyaları yüklüyse onları çal
  if (keyAudioLoaded) {
    if (keyType === 'space' && keyAudioBuffers.space) {
      playBuffer(keyAudioBuffers.space, variation);
      return;
    }
    if (keyType === 'enter' && keyAudioBuffers.enter) {
      playBuffer(keyAudioBuffers.enter, variation);
      return;
    }
    if (keyType === 'backspace' && keyAudioBuffers.backspace) {
      playBuffer(keyAudioBuffers.backspace, variation);
      return;
    }
    // Normal harf — rastgele varyantlardan birini seç
    const buffers = keyAudioBuffers.down;
    if (buffers.length > 0) {
      const idx = Math.floor(Math.random() * buffers.length);
      playBuffer(buffers[idx], variation);
      return;
    }
  }

  // Gerçek sesler yüklenememişse fallback: basit sentez
  playFallbackClick(keyType !== 'letter');
}

// Fallback — CDN erişilemezse sentezlenmiş ses
function playFallbackClick(isSpecialKey = false) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  try {
    const volume = isSpecialKey ? 0.65 : 0.5;
    const duration = isSpecialKey ? 0.06 : 0.04;

    const bufferSize = Math.floor(audioCtx.sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3);
    }

    const src = audioCtx.createBufferSource();
    src.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = isSpecialKey ? 800 : 2000;
    filter.Q.value = 2;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(keyVolumeGain || audioCtx.destination);
    src.start(now);
    src.stop(now + duration);
  } catch (e) {}
}

// Global event listener — tüm input/textarea'lara uygulanır
function attachKeyboardSounds() {
  document.addEventListener('keydown', (e) => {
    const target = e.target;
    if (!target) return;
    const tag = target.tagName;
    const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
    if (!isTyping) return;

    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) return;

    let keyType = 'letter';
    if (e.key === ' ') keyType = 'space';
    else if (e.key === 'Enter') keyType = 'enter';
    else if (e.key === 'Backspace') keyType = 'backspace';

    playKeyClick(keyType);
  });
}

function initApp() {
  attachKeyboardSounds();
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

function renderSetupBanner() {
  const box = document.getElementById('setupBanner');
  if (!box) return;

  const missing = [];
  if (!userData.vision) missing.push({ label: 'Vizyon', screen: 'vision' });
  if (!userData.antiVision) missing.push({ label: 'Kaçtığın Hayat', screen: 'vision' });
  if (!userData.identity) missing.push({ label: 'Kimlik', screen: 'vision' });
  if (!userData.yearGoal?.title) missing.push({ label: '1 Yıllık Hedef', screen: 'goals' });
  if (!userData.monthGoal?.title) missing.push({ label: 'Aylık Hedef', screen: 'goals' });

  if (missing.length === 0) {
    box.innerHTML = '';
    box.style.display = 'none';
    return;
  }

  box.style.display = 'block';
  const totalChecks = 5;
  const doneCount = totalChecks - missing.length;

  box.innerHTML = `
    <div class="setup-banner">
      <div class="setup-banner-head">
        <div>
          <div class="setup-banner-label">İLK KURULUM</div>
          <div class="setup-banner-title">Önce kendini <em>kur.</em></div>
        </div>
        <div class="setup-banner-progress">${doneCount}/${totalChecks}</div>
      </div>
      <div class="setup-banner-desc">
        Kaizen'in tüm sihri şu alanları doldurduktan sonra başlıyor. Hepsi 5-10 dakikanı alır.
      </div>
      <div class="setup-banner-list">
        ${missing.map(m => `
          <button class="setup-banner-item" onclick="showScreen('${m.screen}')">
            <div class="setup-banner-bullet">○</div>
            <div class="setup-banner-item-label">${escapeHtml(m.label)} yaz</div>
            <div class="setup-banner-arrow">→</div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderHome() {
  const today = new Date();
  const dateEl = document.getElementById('homeDate');
  if (dateEl) {
    dateEl.textContent = today.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  // Kayıt gününden itibaren kaçıncı gün
  let dayNumber = 1;
  if (userData.joinedDate) {
    const joined = new Date(userData.joinedDate + 'T00:00:00');
    const now = new Date(todayStr() + 'T00:00:00');
    dayNumber = Math.max(1, Math.floor((now - joined) / 86400000) + 1);
  }
  document.getElementById('dayCounter').textContent = `${dayNumber}. gün`;

  // Slogan
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const seed = today.getDate() + today.getMonth() * 31;
  const slogan = SLOGANS[seed % SLOGANS.length];
  document.getElementById('slogan').innerHTML = `${escapeHtml(slogan.a)}<br><em>${escapeHtml(slogan.b)}</em>`;

  // Günlük alıntı
  const hour = today.getHours();
  const quoteSeed = dayOfYear * 6 + Math.floor(hour / 4);
  const quote = QUOTES[quoteSeed % QUOTES.length];
  document.getElementById('dailyQuote').textContent = `"${quote.t}"`;
  document.getElementById('dailyQuoteAuthor').textContent = quote.a || '';

  // Mikro istatistikler
  document.getElementById('streakNum').textContent = userData.streak || 0;
  const consistency = calcConsistency();
  document.getElementById('consistencyNum').textContent = Math.round(consistency * 100);
  document.getElementById('writtenCount').textContent = historyCache.length;

  // Setup banner — eksiklerin listesi
  renderSetupBanner();

  // Kimlik ifadesi
  const identity = userData.identity;
  const stmtEl = document.getElementById('identityStmt');
  if (identity) {
    stmtEl.classList.remove('empty');
    stmtEl.innerHTML = escapeHtml(identity);
  } else {
    stmtEl.classList.add('empty');
    stmtEl.innerHTML = 'Kimlik ifadeni henüz yazmadın. <span class="tap-hint">Tıkla, başla →</span>';
  }

  // 1 yıllık hedef
  const yg = userData.yearGoal || {};
  const mqPct = calcMainProgress();
  document.getElementById('mainQuestTitle').innerHTML = yg.title
    ? escapeHtml(yg.title)
    : '1 yıllık vizyonunu tanımla. <span class="tap-hint">Tıkla →</span>';
  document.getElementById('mainQuestPct').textContent = mqPct.toFixed(1);
  document.getElementById('mainQuestBar').style.width = Math.min(100, mqPct) + '%';
  if (yg.start && yg.deadline) {
    const total = (new Date(yg.deadline) - new Date(yg.start)) / 86400000;
    const passed = Math.max(0, (Date.now() - new Date(yg.start)) / 86400000);
    const remain = Math.max(0, Math.ceil((new Date(yg.deadline) - Date.now()) / 86400000));
    document.getElementById('mainQuestDays').textContent = `${Math.floor(passed)} / ${Math.floor(total)} gün`;
    document.getElementById('mainQuestRemain').textContent = `${remain} gün kaldı`;
  } else {
    document.getElementById('mainQuestDays').textContent = 'Hedef belirlenmedi';
    document.getElementById('mainQuestRemain').textContent = '';
  }

  // Aylık hedef
  const mg = userData.monthGoal || {};
  document.getElementById('bossTitle').innerHTML = mg.title
    ? escapeHtml(mg.title)
    : 'Bu ayki hedefini yaz. <span class="tap-hint">Tıkla →</span>';
  const mp = calcBossProgress();
  document.getElementById('bossBar').style.width = mp + '%';
  const tasks = mg.tasks || [];
  const todayDoneCount = tasks.filter(t => {
    if (t.type === 'milestone') return !!t.completedAt;
    if (t.type === 'daily') return (t.completions || []).includes(todayStr());
    if (t.type === 'weekly') {
      const weekKey = getWeekKey();
      return (t.completions || []).some(d => getWeekKey(d) === weekKey && d === todayStr());
    }
    return false;
  }).length;
  const relevantTodayCount = tasks.filter(t => t.type !== 'milestone' || !t.completedAt).length;
  document.getElementById('bossMeta').textContent = mp + '%' + (tasks.length ? ` · bugün ${todayDoneCount}/${relevantTodayCount}` : ' · görev ekle');

  renderBossTasks();
  checkBossCelebration();

  renderTimeSlots();
  renderActiveQuestHero();
}

// Ana sayfadaki "aktif quest" büyük kartı — en üstte gözüken
function renderActiveQuestHero() {
  const box = document.getElementById('activeQuestBlock');
  if (!box) return;

  const now = getCurrentHourDecimal();
  const today = todayStr();

  // Kuruluş tamamlanmadı mı?
  if (!userData.kurulusCompleted) {
    box.innerHTML = `
      <div class="active-quest-hero" onclick="startQuest('kurulus', null)">
        <div class="aqh-accent-bar"></div>
        <div class="aqh-head">
          <div>
            <div class="aqh-label">KURULUŞ</div>
            <div class="aqh-title">Kendinin haritasını çıkar</div>
            <div class="aqh-sub">${userData.kurulusIndex || 0} / ${QUESTIONS.kurulus.length} soru · 20-30 dk</div>
          </div>
          <div class="aqh-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Aktif slot var mı?
  let activeSlot = null;
  let nextSlot = null;
  let doneCount = 0;
  let sabahDone = false, gunIciDone = false, aksamDone = false;

  TIME_SLOTS.forEach(slot => {
    const todayAnswers = historyCache.filter(a => a.date === today && a.slotKey === slot.key);
    const isDone = todayAnswers.length >= slot.count;
    if (isDone) {
      doneCount++;
      if (slot.type === 'sabah') sabahDone = true;
      if (slot.type === 'gunici') gunIciDone = true;
      if (slot.type === 'aksam') aksamDone = true;
    }
    const isActive = !isDone && now >= slot.start && now < slot.end;
    if (isActive && !activeSlot) activeSlot = slot;
    if (!isDone && !activeSlot && now < slot.start && !nextSlot) nextSlot = slot;
  });

  // Aktif slot varsa
  if (activeSlot) {
    const endH = Math.floor(activeSlot.end);
    const endM = Math.round((activeSlot.end - endH) * 60);
    const endTime = `${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}`;

    // Durum göstergesi
    const pillSabah = sabahDone ? '<span class="aqh-pill on">sabah ✓</span>' : (activeSlot.type === 'sabah' ? '<span class="aqh-pill active">sabah</span>' : '<span class="aqh-pill">sabah</span>');
    const pillGun = gunIciDone ? '<span class="aqh-pill on">gün içi ✓</span>' : (activeSlot.type === 'gunici' ? '<span class="aqh-pill active">gün içi</span>' : '<span class="aqh-pill">gün içi</span>');
    const pillAksam = aksamDone ? '<span class="aqh-pill on">akşam ✓</span>' : (activeSlot.type === 'aksam' ? '<span class="aqh-pill active">akşam</span>' : '<span class="aqh-pill">akşam</span>');

    box.innerHTML = `
      <div class="active-quest-hero pulsing" onclick="startQuest('${activeSlot.type}', '${activeSlot.key}')">
        <div class="aqh-accent-bar"></div>
        <div class="aqh-head">
          <div>
            <div class="aqh-label">GÜNLÜK SORU · ${activeSlot.time}</div>
            <div class="aqh-title">${escapeHtml(activeSlot.label)}</div>
            <div class="aqh-sub">${endTime}'e kadar açık · 1 soru</div>
          </div>
          <div class="aqh-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </div>
        </div>
        <div class="aqh-pills">${pillSabah}${pillGun}${pillAksam}</div>
      </div>
    `;
    return;
  }

  // Kaçırılmış slot var mı?
  let missedSlot = null;
  TIME_SLOTS.forEach(slot => {
    const todayAnswers = historyCache.filter(a => a.date === today && a.slotKey === slot.key);
    const isDone = todayAnswers.length >= slot.count;
    if (!isDone && now >= slot.end && !missedSlot) missedSlot = slot;
  });

  if (missedSlot) {
    box.innerHTML = `
      <div class="active-quest-hero missed" onclick="startQuest('${missedSlot.type}', '${missedSlot.key}')">
        <div class="aqh-accent-bar missed-bar"></div>
        <div class="aqh-head">
          <div>
            <div class="aqh-label missed-label">KAÇIRILDI · ${missedSlot.time}</div>
            <div class="aqh-title">${escapeHtml(missedSlot.label)}</div>
            <div class="aqh-sub">Penceresi kapandı — ama hâlâ cevaplayabilirsin</div>
          </div>
          <div class="aqh-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Sıradaki slot (gelecekte)
  if (nextSlot) {
    const untilMin = Math.round((nextSlot.start - now) * 60);
    const untilText = untilMin >= 60 ? `${Math.floor(untilMin / 60)} saat ${untilMin % 60} dk sonra` : `${untilMin} dk sonra`;

    box.innerHTML = `
      <div class="active-quest-hero upcoming">
        <div class="aqh-head">
          <div>
            <div class="aqh-label upcoming-label">BİR SONRAKİ · ${nextSlot.time}</div>
            <div class="aqh-title upcoming-title">${escapeHtml(nextSlot.label)}</div>
            <div class="aqh-sub">${untilText} açılacak</div>
          </div>
          <div class="aqh-arrow upcoming-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Bütün gün bitti — hepsi tamam
  const totalSlots = TIME_SLOTS.length;
  if (doneCount === totalSlots) {
    box.innerHTML = `
      <div class="active-quest-hero all-done">
        <div class="aqh-head">
          <div>
            <div class="aqh-label sage-label">BUGÜN TAMAM</div>
            <div class="aqh-title">Bugünki soruları cevapladın</div>
          </div>
          <div class="aqh-arrow sage-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
      </div>
    `;
  }
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

function renderBossTasks() {
  const box = document.getElementById('bossTasksBox');
  if (!box) return;

  const tasks = userData.monthGoal?.tasks || [];
  if (!tasks.length) {
    box.innerHTML = `
      <div class="boss-empty-tasks" onclick="showScreen('goals')">
        <span>Henüz görev yok.</span>
        <em>Hedeflerden ekle →</em>
      </div>
    `;
    return;
  }

  // Sıralama: milestone tamamlanmamışlar önce, sonra daily, sonra weekly, sonra tamamlanmış milestone'lar
  const sorted = [...tasks].sort((a, b) => {
    const aDone = a.type === 'milestone' && a.completedAt;
    const bDone = b.type === 'milestone' && b.completedAt;
    if (aDone && !bDone) return 1;
    if (!aDone && bDone) return -1;
    const order = { daily: 1, weekly: 2, milestone: 3 };
    return (order[a.type] || 99) - (order[b.type] || 99);
  });

  box.innerHTML = sorted.map(task => {
    const done = isTaskDoneToday(task);
    const todayMark = (task.completions || []).includes(todayStr());

    let typeLabel = '';
    let metaText = '';

    if (task.type === 'daily') {
      typeLabel = 'Her gün';
      metaText = todayMark ? 'Bugün tamamlandı' : 'Bugün henüz yapılmadı';
    } else if (task.type === 'weekly') {
      const wp = getTaskWeekProgress(task);
      typeLabel = `Haftada ${wp.target}`;
      metaText = `Bu hafta ${wp.current}/${wp.target}`;
    } else if (task.type === 'milestone') {
      typeLabel = 'Tek seferlik';
      metaText = task.completedAt ? `✓ ${new Date(task.completedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}` : 'Bitirilecek';
    }

    const isChecked = (task.type === 'milestone' && task.completedAt) || (task.type !== 'milestone' && todayMark);
    const doneClass = done ? 'all-done' : '';

    return `
      <div class="boss-task ${doneClass}" onclick="event.stopPropagation(); toggleBossTask('${task.id}')">
        <div class="boss-task-check ${isChecked ? 'on' : ''}">
          ${isChecked ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </div>
        <div class="boss-task-body">
          <div class="boss-task-title ${isChecked ? 'done' : ''}">${escapeHtml(task.title)}</div>
          <div class="boss-task-meta">
            <span class="boss-task-type">${typeLabel}</span>
            <span class="boss-task-dot">·</span>
            <span class="boss-task-status">${metaText}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.toggleBossTask = async function(taskId) {
  await toggleTaskCompletion(taskId);
};

window.toggleBossExpand = function() {
  const panel = document.getElementById('bossTasksPanel');
  const icon = document.getElementById('bossExpandIcon');
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  if (isOpen) {
    panel.classList.remove('open');
    icon.classList.remove('open');
  } else {
    panel.classList.add('open');
    icon.classList.add('open');
    renderBossTasks();
  }
};

function checkBossCelebration() {
  const mg = userData.monthGoal;
  if (!mg || !mg.tasks?.length || !mg.deadline) return;
  if (mg.celebrated) return;

  const end = new Date(mg.deadline);
  const now = new Date();
  if (now < end) return;

  // Boss süresi bitti, kutlama göster
  setTimeout(() => showBossCelebration(), 800);
}

function showBossCelebration() {
  const mg = userData.monthGoal;
  const modal = document.getElementById('celebrationModal');
  if (!modal) return;

  const pct = calcBossProgress();
  const tasks = mg.tasks || [];
  const doneCount = tasks.filter(t => {
    if (t.type === 'milestone') return !!t.completedAt;
    return (t.completions || []).length > 0;
  }).length;

  const level = pct >= 80 ? 'zafer' : pct >= 50 ? 'dengeli' : 'dersler';
  const titles = {
    zafer: 'Hedef bitti!',
    dengeli: 'Hedef geçildi',
    dersler: 'Ay bitti'
  };
  const subs = {
    zafer: 'Hakettin. Kanıt birikti, kimliğin büyüdü.',
    dengeli: 'Tam değil ama anlamlı. Neyin işe yaradığını biliyorsun artık.',
    dersler: 'Tamamlanmamış bir ay da bir cevaptır. Ne fark etti?'
  };

  document.getElementById('celebrationTitle').textContent = titles[level];
  document.getElementById('celebrationSub').textContent = subs[level];
  document.getElementById('celebrationPct').textContent = pct;
  document.getElementById('celebrationBossName').textContent = mg.title || 'Aylık Hedef';
  document.getElementById('celebrationTaskCount').textContent = doneCount;
  document.getElementById('celebrationTaskTotal').textContent = tasks.length;

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

window.closeCelebration = async function() {
  userData.monthGoal.celebrated = true;
  await saveUserData();
  document.getElementById('celebrationModal').classList.remove('show');
  document.body.style.overflow = '';
};

window.startNewBoss = async function() {
  userData.monthGoal.celebrated = true;
  await saveUserData();
  document.getElementById('celebrationModal').classList.remove('show');
  document.body.style.overflow = '';
  showScreen('goals');
  setTimeout(() => {
    const el = document.getElementById('monthGoal');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
    }
  }, 300);
};

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
  renderBossTasksEditor();
  renderGoalList('daily-levers', userData.dailyLevers || []);
  renderGoalList('constraints', userData.constraints || []);
}

function renderBossTasksEditor() {
  const el = document.getElementById('boss-tasks-editor');
  if (!el) return;
  const tasks = userData.monthGoal?.tasks || [];

  if (!tasks.length) {
    el.innerHTML = `<div class="boss-editor-empty">Henüz görev eklenmemiş. Boss'unu somutlaştır — her gün/hafta ne yapacaksın?</div>`;
    return;
  }

  el.innerHTML = tasks.map((task, i) => {
    const typeLabels = {
      daily: 'Her gün',
      weekly: 'Haftada N',
      milestone: 'Tek seferlik'
    };
    const weekField = task.type === 'weekly'
      ? `<input type="number" min="1" max="7" value="${task.targetPerWeek || 1}" class="task-week-input" data-task-idx="${i}" data-field="targetPerWeek" title="Haftada kaç kez?">`
      : '';
    return `
      <div class="boss-editor-row">
        <div class="boss-editor-top">
          <select class="task-type-select" data-task-idx="${i}" data-field="type" onchange="updateTaskField(${i}, 'type', this.value)">
            <option value="daily" ${task.type === 'daily' ? 'selected' : ''}>Her gün</option>
            <option value="weekly" ${task.type === 'weekly' ? 'selected' : ''}>Haftada N</option>
            <option value="milestone" ${task.type === 'milestone' ? 'selected' : ''}>Tek seferlik</option>
          </select>
          ${weekField}
          <button class="del-btn" onclick="delBossTask(${i})">×</button>
        </div>
        <input type="text" class="task-title-input" placeholder="Görev adı..." value="${escapeAttr(task.title || '')}" data-task-idx="${i}" data-field="title">
      </div>
    `;
  }).join('');
}

window.updateTaskField = function(idx, field, value) {
  if (!userData.monthGoal.tasks[idx]) return;
  userData.monthGoal.tasks[idx][field] = value;
  if (field === 'type' && value === 'weekly' && !userData.monthGoal.tasks[idx].targetPerWeek) {
    userData.monthGoal.tasks[idx].targetPerWeek = 3;
  }
  renderBossTasksEditor();
};

window.addBossTask = function() {
  if (!userData.monthGoal.tasks) userData.monthGoal.tasks = [];
  // Önce mevcut inputları oku, kaybolmasın
  document.querySelectorAll('[data-task-idx]').forEach(inp => {
    const idx = parseInt(inp.dataset.taskIdx);
    const field = inp.dataset.field;
    if (userData.monthGoal.tasks[idx]) {
      let val = inp.value;
      if (field === 'targetPerWeek') val = parseInt(val) || 1;
      userData.monthGoal.tasks[idx][field] = val;
    }
  });
  userData.monthGoal.tasks.push({
    id: 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    title: '',
    type: 'daily',
    completions: [],
    completedAt: null
  });
  renderBossTasksEditor();
};

window.delBossTask = function(idx) {
  if (!confirm('Bu görevi silmek istediğine emin misin? Tamamlama kayıtları da silinir.')) return;
  // Önce diğer inputları oku
  document.querySelectorAll('[data-task-idx]').forEach(inp => {
    const ti = parseInt(inp.dataset.taskIdx);
    const field = inp.dataset.field;
    if (userData.monthGoal.tasks[ti] && ti !== idx) {
      let val = inp.value;
      if (field === 'targetPerWeek') val = parseInt(val) || 1;
      userData.monthGoal.tasks[ti][field] = val;
    }
  });
  userData.monthGoal.tasks.splice(idx, 1);
  renderBossTasksEditor();
};

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

  // Boss inputlarını oku
  const existingTasks = userData.monthGoal?.tasks || [];
  document.querySelectorAll('[data-task-idx]').forEach(inp => {
    const idx = parseInt(inp.dataset.taskIdx);
    const field = inp.dataset.field;
    if (existingTasks[idx]) {
      let val = inp.value;
      if (field === 'targetPerWeek') val = parseInt(val) || 1;
      existingTasks[idx][field] = val;
    }
  });
  // Boş başlıklı görevleri sil
  const cleanTasks = existingTasks.filter(t => (t.title || '').trim());

  const newMonthTitle = document.getElementById('monthGoal').value.trim();
  const newDeadline = document.getElementById('monthDeadline').value;

  // Eğer yeni boss ise (başlık değişti veya startDate yoksa), celebrate flag'i sıfırla
  const isNewBoss = !userData.monthGoal?.startDate || userData.monthGoal?.title !== newMonthTitle;

  userData.monthGoal = {
    title: newMonthTitle,
    deadline: newDeadline,
    tasks: cleanTasks,
    startDate: isNewBoss ? todayStr() : userData.monthGoal.startDate,
    celebrated: isNewBoss ? false : (userData.monthGoal.celebrated || false)
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

  const ksSw = document.getElementById('keyboardSoundSwitch');
  if (ksSw) ksSw.classList.toggle('on', !!userData.keyboardSound);
}

window.toggleKeyboardSound = async function() {
  userData.keyboardSound = !userData.keyboardSound;
  await saveUserData();
  const sw = document.getElementById('keyboardSoundSwitch');
  if (sw) sw.classList.toggle('on', userData.keyboardSound);

  if (userData.keyboardSound) {
    // Açıldığında küçük bir test sesi — kullanıcıya nasıl çıkacağını duyurur
    unlockAudio();
    setTimeout(() => playKeyClick('letter'), 100);
    setTimeout(() => playKeyClick('letter'), 220);
    setTimeout(() => playKeyClick('space'), 380);
    showToast('Klavye sesi açık. Yazmaya başla, dinle.');
  } else {
    showToast('Klavye sesi kapalı.');
  }
};

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

window.cleanupDuplicates = async function() {
  if (!confirm('Aynı cevapları (bire bir aynı olanları) temizleyeceğim. Benzer ama farklı cevaplar korunacak. Devam?')) return;

  showToast('Tarama başladı, bekle...');

  try {
    // TAZE VERİ YÜKLE - cache eski olabilir
    await loadHistory();

    console.log('[Cleanup] Toplam kayıt:', historyCache.length);
    console.log('[Cleanup] İlk kayıt örneği:', historyCache[0]);

    // STRATEJİ: Birden fazla anahtar kombinasyonu dene
    // En güvenlisi: aynı answer metni + aynı date (en sık görülen duplikay tipi)
    const groups = {};
    historyCache.forEach(a => {
      // Normalize et: boşlukları temizle, lowercase'e çevirme YOK (dürüst kal)
      const normalizedAnswer = (a.answer || '').trim().replace(/\s+/g, ' ');
      if (!normalizedAnswer) return; // Boş cevapları atla

      // PRIMARY KEY: tarih + soru metni + cevap metni (en güvenilir)
      const questionText = (a.question || '').trim();
      const key = `${a.date || ''}::${questionText}::${normalizedAnswer}`;

      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    });

    let toDelete = [];
    let duplicateGroups = 0;
    Object.entries(groups).forEach(([key, group]) => {
      if (group.length > 1) {
        duplicateGroups++;
        console.log(`[Cleanup] Kopya grubu (${group.length} kez):`, key.slice(0, 80), group.map(g => g.id));

        // Timestamp'e göre sırala, en eski (ilk yazılan) kalsın
        group.sort((a, b) => {
          let ta = 0, tb = 0;
          try {
            ta = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : (a.timestamp?.seconds ? a.timestamp.seconds * 1000 : 0);
          } catch (e) {}
          try {
            tb = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : (b.timestamp?.seconds ? b.timestamp.seconds * 1000 : 0);
          } catch (e) {}
          return ta - tb;
        });

        // İlk (en eski) kalır, gerisi silinir
        toDelete.push(...group.slice(1));
      }
    });

    console.log('[Cleanup] Bulunan kopya grubu sayısı:', duplicateGroups);
    console.log('[Cleanup] Silinecek kayıt sayısı:', toDelete.length);

    if (toDelete.length === 0) {
      alert('Hiç kopya bulamadım. Eğer hâlâ aynı cevapları görüyorsan:\n\n1. F12 tuşuna bas, Console sekmesini aç\n2. "Aynı cevapları temizle" butonuna tekrar bas\n3. Console\'da ne yazdığını gördüğünde bana yapıştır\n\nVeya Firebase Console\'dan manuel silebilirsin.');
      return;
    }

    const msg = `${toDelete.length} adet kopya bulundu (${duplicateGroups} farklı sorudan). Silinsin mi?\n\n(En eski kayıt korunur, sonra gelenler silinir.)`;
    if (!confirm(msg)) return;

    showToast(`${toDelete.length} kopya siliniyor...`);
    let deleted = 0;
    let failed = 0;

    for (const a of toDelete) {
      try {
        const ref = doc(db, 'users', currentUser.uid, 'answers', a.id);
        await deleteDoc(ref);
        deleted++;
      } catch (e) {
        console.error('[Cleanup] Silme hatası:', a.id, e);
        failed++;
      }
    }

    await loadHistory();
    if (failed > 0) {
      alert(`${deleted} kopya silindi, ${failed} tanesi silinemedi (hata). Tekrar denemek istersen butona basman yeterli.`);
    } else {
      showToast(`✓ ${deleted} kopya temizlendi!`);
    }

    if (document.getElementById('screen-home').classList.contains('active')) renderHome();
    if (document.getElementById('screen-history').classList.contains('active')) renderHistory();
  } catch (e) {
    console.error('[Cleanup] Genel hata:', e);
    alert('Hata oluştu: ' + e.message + '\n\nF12 → Console\'da detaylarına bak.');
  }
};

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

// =========================================================
// DERTLEŞME (VENTING) — kategori seçimi, soru listesi, yazma
// =========================================================

function renderVent() {
  const box = document.getElementById('ventContent');
  if (!box) return;

  if (currentVentEntry !== null) {
    renderVentEditor();
    return;
  }

  if (currentVentCategory) {
    renderVentCategoryQuestions();
    return;
  }

  renderVentCategoryList();
}

function renderVentCategoryList() {
  const box = document.getElementById('ventContent');

  // Her kategorinin kaç dertleşmesi var, say
  const categoryCounts = {};
  ventCache.forEach(v => {
    categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
  });

  const cards = VENT_CATEGORIES.map(cat => {
    const count = categoryCounts[cat.key] || 0;
    return `
      <button class="vent-cat-card c-${cat.color}" onclick="selectVentCategory('${cat.key}')">
        <div class="vent-cat-head">
          <div class="vent-cat-name">${escapeHtml(cat.name)}</div>
          ${count > 0 ? `<div class="vent-cat-count">${count}</div>` : ''}
        </div>
        <div class="vent-cat-sub">${escapeHtml(cat.sub)}</div>
        <div class="vent-cat-arrow">→</div>
      </button>
    `;
  }).join('');

  const totalCount = ventCache.length;
  const allLink = totalCount > 0
    ? `<button class="vent-all-link" onclick="renderVentAllList()">Tüm yazdıklarımı gör (${totalCount})</button>`
    : '';

  box.innerHTML = `
    <div class="vent-intro">
      <p>Hayatın bir alanına odaklan. Seni en çok zorlayan, en çok düşündüğün hangi konu? Oraya gir, 10 soru seni bekliyor. İstediğine yaz, istediğini atla — baskı yok. Yazdıkların burada saklı kalır, dilediğin zaman dönüp okuyabilirsin.</p>
    </div>
    ${allLink}
    <div class="vent-cat-grid">${cards}</div>
  `;
}

window.renderVentAllList = function() {
  const box = document.getElementById('ventContent');
  if (!ventCache.length) {
    box.innerHTML = `
      <div class="vent-intro"><p>Henüz hiçbir şey yazmamışsın. Bir kategoriye gir, başla.</p></div>
      <button class="vent-back-btn" onclick="backToVentCategories()">← Kategorilere dön</button>
    `;
    return;
  }

  // Tarihe göre azalan sırala
  const sorted = [...ventCache].sort((a, b) => {
    const ta = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0;
    const tb = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0;
    return tb - ta;
  });

  const items = sorted.map(v => {
    const cat = VENT_CATEGORIES.find(c => c.key === v.category);
    if (!cat) return '';
    const qText = cat.questions[v.questionIndex] || '';
    const d = v.timestamp?.toDate ? v.timestamp.toDate() : new Date();
    const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    const excerpt = (v.content || '').slice(0, 220);

    return `
      <div class="vent-all-card c-${cat.color}" onclick="openExistingVent('${v.id}'); selectVentCategory('${cat.key}');">
        <div class="vent-all-head">
          <span class="vent-all-cat">${escapeHtml(cat.name)}</span>
          <span class="vent-all-date">${dateStr}</span>
        </div>
        <div class="vent-all-q">${escapeHtml(qText.slice(0, 100))}${qText.length > 100 ? '...' : ''}</div>
        <div class="vent-all-excerpt">${escapeHtml(excerpt)}${v.content && v.content.length > 220 ? '...' : ''}</div>
      </div>
    `;
  }).join('');

  box.innerHTML = `
    <button class="vent-back-btn" onclick="backToVentCategories()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      Kategorilere dön
    </button>
    <div class="vent-all-header">
      <h3>Tüm yazdıklarım</h3>
      <p>${ventCache.length} dertleşme · en yeniden eskiye</p>
    </div>
    <div class="vent-all-list">${items}</div>
  `;
};

window.selectVentCategory = function(key) {
  currentVentCategory = VENT_CATEGORIES.find(c => c.key === key);
  if (!currentVentCategory) return;
  renderVent();
};

window.backToVentCategories = function() {
  currentVentCategory = null;
  currentVentQuestion = null;
  renderVent();
};

function renderVentCategoryQuestions() {
  const box = document.getElementById('ventContent');
  const cat = currentVentCategory;

  const answeredMap = {};
  ventCache.forEach(v => {
    if (v.category === cat.key && v.questionIndex !== undefined) {
      if (!answeredMap[v.questionIndex]) answeredMap[v.questionIndex] = [];
      answeredMap[v.questionIndex].push(v);
    }
  });

  const questionCards = cat.questions.map((q, i) => {
    const answers = answeredMap[i] || [];
    const hasAnswers = answers.length > 0;

    return `
      <div class="vent-q-card ${hasAnswers ? 'answered' : ''}" onclick="openVentQuestion(${i})">
        <div class="vent-q-head">
          <div class="vent-q-num">${String(i + 1).padStart(2, '0')}</div>
          ${hasAnswers ? `<div class="vent-q-badge">${answers.length} yazı</div>` : ''}
        </div>
        <div class="vent-q-text">${escapeHtml(q)}</div>
        <div class="vent-q-action">${hasAnswers ? 'Yazdıkların →' : 'Dert dök →'}</div>
      </div>
    `;
  }).join('');

  box.innerHTML = `
    <div class="vent-category-header c-${cat.color}">
      <button class="vent-back-btn" onclick="backToVentCategories()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Kategoriler
      </button>
      <h3 class="vent-cat-title">${escapeHtml(cat.name)}</h3>
      <p class="vent-cat-lead">${escapeHtml(cat.sub)}</p>
    </div>
    <div class="vent-questions">${questionCards}</div>
  `;
}

window.openVentQuestion = function(qIndex) {
  currentVentQuestion = qIndex;
  currentVentEntry = { id: null, new: true, content: '', category: currentVentCategory.key, questionIndex: qIndex };
  renderVent();
};

window.closeVentEntry = function() {
  currentVentEntry = null;
  currentVentQuestion = null;
  renderVent();
};

function renderVentEditor() {
  const box = document.getElementById('ventContent');
  const cat = currentVentCategory;
  const qIndex = currentVentEntry.questionIndex;
  const qText = cat.questions[qIndex];

  // Bu soruya olan tüm geçmiş cevaplar
  const prevEntries = ventCache.filter(v => v.category === cat.key && v.questionIndex === qIndex);

  let prevHtml = '';
  if (prevEntries.length > 0) {
    prevHtml = `
      <div class="vent-prev-section">
        <div class="vent-prev-header">
          <span>ÖNCEKİ YAZDIKLARIN (${prevEntries.length})</span>
        </div>
        <div class="vent-prev-list">
          ${prevEntries.map(e => {
            const d = e.timestamp?.toDate ? e.timestamp.toDate() : new Date();
            const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
            return `
              <div class="vent-prev-card" onclick="openExistingVent('${e.id}')">
                <div class="vent-prev-date">${dateStr}</div>
                <div class="vent-prev-excerpt">${escapeHtml((e.content || '').slice(0, 180))}${e.content && e.content.length > 180 ? '...' : ''}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  box.innerHTML = `
    <div class="vent-editor">
      <div class="vent-editor-header c-${cat.color}">
        <button class="vent-back-btn" onclick="closeVentEntry()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Geri
        </button>
        <div class="vent-editor-cat">${escapeHtml(cat.name)} · Soru ${qIndex + 1}/10</div>
      </div>

      <div class="vent-editor-question">
        ${escapeHtml(qText)}
      </div>

      <textarea
        class="vent-editor-area"
        id="ventEditorArea"
        placeholder="Ne hissediyorsan onu yaz. Kısa olsun uzun olsun, parça parça olsun — fark etmez. Seni kimse görmüyor."
      >${escapeHtml(currentVentEntry.content || '')}</textarea>

      <div class="vent-editor-footer">
        <div class="vent-editor-status" id="ventEditorStatus">Otomatik kaydediliyor</div>
        <div class="vent-editor-actions">
          ${!currentVentEntry.new && currentVentEntry.id ? `<button class="btn-ghost vent-delete-btn" onclick="deleteCurrentVent()">Sil</button>` : ''}
          <button class="btn-primary" onclick="saveVentManual()">Kaydet & Kapat</button>
        </div>
      </div>

      ${prevHtml}
    </div>
  `;

  setTimeout(() => {
    const ta = document.getElementById('ventEditorArea');
    if (ta && currentVentEntry.new) ta.focus();

    let saveTimer = null;
    const doAutoSave = async () => {
      const content = document.getElementById('ventEditorArea').value;
      if (!content.trim()) return;

      const status = document.getElementById('ventEditorStatus');
      if (status) status.textContent = 'Kaydediliyor...';

      try {
        if (currentVentEntry.new && !currentVentEntry.id) {
          const id = await addVentEntry(currentVentCategory.key, currentVentEntry.questionIndex, content);
          currentVentEntry.id = id;
          currentVentEntry.new = false;
        } else if (currentVentEntry.id) {
          await updateVentEntry(currentVentEntry.id, content);
        }
        await loadVentings();
        if (status) {
          status.textContent = 'Kaydedildi ✓';
          setTimeout(() => { if (status) status.textContent = 'Otomatik kaydediliyor'; }, 1500);
        }
      } catch (e) {
        console.error(e);
        if (status) status.textContent = 'Kayıt hatası';
      }
    };

    const scheduleAutoSave = () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(doAutoSave, 1500);
    };

    if (ta) ta.addEventListener('input', scheduleAutoSave);
  }, 100);
}

window.openExistingVent = function(id) {
  const entry = ventCache.find(v => v.id === id);
  if (!entry) return;
  currentVentEntry = { ...entry, new: false };
  currentVentQuestion = entry.questionIndex;
  renderVent();
};

window.saveVentManual = async function() {
  const content = document.getElementById('ventEditorArea')?.value || '';
  if (!content.trim()) {
    closeVentEntry();
    return;
  }

  try {
    if (currentVentEntry.new && !currentVentEntry.id) {
      await addVentEntry(currentVentCategory.key, currentVentEntry.questionIndex, content);
    } else if (currentVentEntry.id) {
      await updateVentEntry(currentVentEntry.id, content);
    }
    await loadVentings();
    showToast('Kaydedildi.');
    closeVentEntry();
  } catch (e) {
    showToast('Hata: ' + e.message);
  }
};

window.deleteCurrentVent = async function() {
  if (!currentVentEntry?.id) return;
  if (!confirm('Bu dertleşmeyi silmek istediğine emin misin?')) return;
  await deleteVentEntry(currentVentEntry.id);
  await loadVentings();
  showToast('Silindi.');
  closeVentEntry();
};

// =========================================================
// BFI-44 KİŞİLİK TESTİ
// =========================================================

function renderProfile() {
  const box = document.getElementById('profileContent');
  if (!box) return;

  // Beklemede kalmış bir test var mı kontrol et
  try {
    const pending = localStorage.getItem('kaizen_bfi_pending');
    if (pending) {
      const data = JSON.parse(pending);
      const hoursSince = (Date.now() - data.savedAt) / 3600000;
      // 7 günden eskiyse sil, göster değme
      if (hoursSince > 168) {
        localStorage.removeItem('kaizen_bfi_pending');
      } else {
        box.innerHTML = `
          <div class="bfi-pending-notice">
            <div class="bfi-pending-icon">●</div>
            <div class="bfi-pending-body">
              <h3>Beklemede bir testin var</h3>
              <p>Geçen sefer kaydedilemedi ama cevapların tarayıcında duruyor. Tekrar gönderelim mi?</p>
              <div class="bfi-pending-actions">
                <button class="btn btn-primary" onclick="retryBfiSave()">Şimdi gönder</button>
                <button class="btn btn-ghost" onclick="discardPendingBfi()">Vazgeç</button>
              </div>
            </div>
          </div>
        `;
        return;
      }
    }
  } catch (_) {}

  const status = canTakeBfi();
  const hasResults = bfiCache.length > 0;

  if (!hasResults) {
    renderBfiIntro(box, status);
  } else {
    renderBfiResults(box, status);
  }
}

window.discardPendingBfi = function() {
  if (!confirm('Beklemede kalan testi silecek. Emin misin?')) return;
  try { localStorage.removeItem('kaizen_bfi_pending'); } catch (_) {}
  renderProfile();
};

function renderBfiIntro(box, status) {
  box.innerHTML = `
    <div class="bfi-intro">
      <div class="bfi-intro-badge">PSİKOLOJİK TEST</div>
      <h2 class="bfi-intro-title">Kendini <em>tanı.</em></h2>
      <p class="bfi-intro-lead">Büyük Beşli Kişilik Envanteri — bilimsel geçerliliği yüksek 44 soru, senin 5 boyutunu çıkarır.</p>

      <div class="bfi-info-block">
        <div class="bfi-info-row">
          <div class="bfi-info-num">5</div>
          <div class="bfi-info-body">
            <div class="bfi-info-title">5 Kişilik Boyutu</div>
            <div class="bfi-info-desc">Dışa dönüklük · Uyumluluk · Sorumluluk · Duygusal denge · Yeniliğe açıklık</div>
          </div>
        </div>
        <div class="bfi-info-row">
          <div class="bfi-info-num sage">10</div>
          <div class="bfi-info-body">
            <div class="bfi-info-title">10-15 dakika</div>
            <div class="bfi-info-desc">Acele etme. İlk aklına gelen cevabı seç — en dürüst olandır.</div>
          </div>
        </div>
        <div class="bfi-info-row">
          <div class="bfi-info-num ash">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          </div>
          <div class="bfi-info-body">
            <div class="bfi-info-title">Ayda Bir Kez</div>
            <div class="bfi-info-desc">Bir testi tamamladıktan sonra 30 gün kilit. Sonra tekrar edip değişimini görürsün.</div>
          </div>
        </div>
      </div>

      <div class="bfi-quote">
        "Kendini tanımak tüm bilgeliğin başlangıcıdır." — Aristoteles
      </div>

      <button class="btn-save bfi-start-btn" onclick="startBfiTest()">Testi Başlat →</button>
    </div>
    ${renderTimeCapsuleBlock()}
  `;
}

function renderTimeCapsuleBlock() {
  const capsules = getCapsuleEntries();
  if (!capsules.length) return '';

  return `
    <div class="time-capsule-block">
      <div class="time-capsule-header">
        <div class="tc-label">ZAMAN KAPSÜLÜ</div>
        <div class="tc-sub">Geçmişteki sen, şimdiki sana hesap soruyor.</div>
      </div>
      <div class="time-capsule-list">
        ${capsules.map(c => {
          const d = c.entry.timestamp?.toDate ? c.entry.timestamp.toDate() : new Date(c.entry.date);
          const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
          return `
            <div class="tc-card">
              <div class="tc-card-head">
                <span class="tc-days">${c.daysAgo} gün önce</span>
                <span class="tc-date">${dateStr}</span>
              </div>
              <div class="tc-q">${escapeHtml(c.entry.question || '')}</div>
              <div class="tc-a">${escapeHtml((c.entry.answer || '').slice(0, 260))}${c.entry.answer && c.entry.answer.length > 260 ? '...' : ''}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderBfiResults(box, status) {
  const latest = bfiCache[0];
  const scores = latest.scores;
  const testDate = latest.timestamp?.toDate ? latest.timestamp.toDate() : new Date(latest.date);
  const dateStr = testDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  const previous = bfiCache.length > 1 ? bfiCache[1] : null;
  const prevScores = previous ? previous.scores : null;

  let retakeBlock = '';
  if (status.can) {
    retakeBlock = `
      <div class="bfi-retake-block can">
        <div class="bfi-retake-icon">✓</div>
        <div class="bfi-retake-text">
          <div class="bfi-retake-title">Yeniden test yapabilirsin</div>
          <div class="bfi-retake-desc">30 gün geçti. Karakterinin evrimini görmek ister misin?</div>
        </div>
        <button class="btn-primary bfi-retake-btn" onclick="startBfiTest()">Tekrar yap</button>
      </div>
    `;
  } else {
    retakeBlock = `
      <div class="bfi-retake-block wait">
        <div class="bfi-retake-icon wait">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
        </div>
        <div class="bfi-retake-text">
          <div class="bfi-retake-title">${status.daysLeft} gün sonra tekrar yapabilirsin</div>
          <div class="bfi-retake-desc">Kişilik bir anda değişmez — en az 30 gün bekleyip değişimi ölçmek daha sağlıklı.</div>
        </div>
      </div>
    `;
  }

  let dimCards = '';
  ['E', 'A', 'C', 'N', 'O'].forEach(key => {
    const dim = BFI_DIMENSIONS[key];
    const score = scores[key] || 0;
    const lvl = score < 2.5 ? 'low' : score > 3.5 ? 'high' : 'mid';
    const interp = BFI_INTERPRETATIONS[key][lvl];
    const pct = Math.round((score / 5) * 100);

    let diffBadge = '';
    if (prevScores && prevScores[key] !== undefined) {
      const diff = (score - prevScores[key]);
      if (Math.abs(diff) >= 0.2) {
        const sign = diff > 0 ? '+' : '';
        const arrow = diff > 0 ? '↑' : '↓';
        const cls = diff > 0 ? 'up' : 'down';
        diffBadge = `<span class="bfi-diff ${cls}">${arrow} ${sign}${diff.toFixed(1)}</span>`;
      }
    }

    dimCards += `
      <div class="bfi-dim-card c-${dim.color}">
        <div class="bfi-dim-head">
          <div>
            <div class="bfi-dim-label">${escapeHtml(dim.name.toUpperCase())}</div>
            <div class="bfi-dim-lvl">${escapeHtml(interp.label)} ${diffBadge}</div>
          </div>
          <div class="bfi-dim-score">${score.toFixed(1)}<span class="slash">/5</span></div>
        </div>
        <div class="bfi-dim-bar">
          <div class="bfi-dim-fill" style="width: ${pct}%"></div>
        </div>
        <div class="bfi-dim-text">${escapeHtml(interp.text)}</div>
        <div class="bfi-dim-kaizen">
          <span class="bfi-kaizen-lbl">KAİZEN İPUCU</span>
          <div>${escapeHtml(interp.kaizen)}</div>
        </div>
      </div>
    `;
  });

  const summary = generateProfileSummary(scores);

  box.innerHTML = `
    <div class="bfi-results">
      <div class="bfi-results-header">
        <div class="bfi-results-badge">TEST TAMAMLANDI</div>
        <h2 class="bfi-results-title">İşte <em>sen.</em></h2>
        <div class="bfi-results-date">${dateStr} · ${bfiCache.length} test kayıtlı</div>
      </div>

      ${retakeBlock}

      <div class="bfi-dims">${dimCards}</div>

      <div class="bfi-summary">
        <div class="bfi-summary-label">BENİM PROFİLİM</div>
        <div class="bfi-summary-text">${summary}</div>
      </div>

      ${bfiCache.length > 1 ? `
      <div class="bfi-history-toggle" onclick="toggleBfiHistory()">
        Geçmiş testlerim (${bfiCache.length}) →
      </div>
      <div class="bfi-history-list hidden" id="bfiHistoryList">
        ${bfiCache.slice(1).map((t, i) => {
          const td = t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.date);
          return `
          <div class="bfi-history-card">
            <div class="bfi-history-date">${td.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div class="bfi-history-scores">
              <span>E: ${t.scores.E.toFixed(1)}</span>
              <span>A: ${t.scores.A.toFixed(1)}</span>
              <span>C: ${t.scores.C.toFixed(1)}</span>
              <span>N: ${t.scores.N.toFixed(1)}</span>
              <span>O: ${t.scores.O.toFixed(1)}</span>
            </div>
          </div>
          `;
        }).join('')}
      </div>
      ` : ''}
    </div>
    ${renderTimeCapsuleBlock()}
  `;
}

window.toggleBfiHistory = function() {
  const el = document.getElementById('bfiHistoryList');
  if (el) el.classList.toggle('hidden');
};

window.startBfiTest = function() {
  const status = canTakeBfi();
  if (!status.can) {
    showToast(`${status.daysLeft} gün sonra tekrar yapabilirsin.`);
    return;
  }
  bfiAnswers = {};
  bfiCurrentIndex = 0;
  renderBfiQuestion();
};

function renderBfiQuestion() {
  const box = document.getElementById('profileContent');
  const q = BFI_QUESTIONS[bfiCurrentIndex];
  const total = BFI_QUESTIONS.length;
  const pct = Math.round((bfiCurrentIndex / total) * 100);
  const selected = bfiAnswers[q.n];

  const options = [
    { val: 1, label: 'Kesinlikle katılmıyorum', cls: 'opt-1' },
    { val: 2, label: 'Biraz katılmıyorum', cls: 'opt-2' },
    { val: 3, label: 'Ne katılıyorum, ne katılmıyorum', cls: 'opt-3' },
    { val: 4, label: 'Biraz katılıyorum', cls: 'opt-4' },
    { val: 5, label: 'Kesinlikle katılıyorum', cls: 'opt-5' }
  ];

  box.innerHTML = `
    <div class="bfi-test">
      <div class="bfi-test-top">
        <div class="bfi-test-counter">SORU ${bfiCurrentIndex + 1} / ${total}</div>
        <div class="bfi-test-pct">%${pct} tamam</div>
      </div>

      <div class="bfi-test-progress">
        <div class="bfi-test-progress-fill" style="width: ${pct}%"></div>
      </div>

      <div class="bfi-test-prompt">Kendimi şöyle biri olarak görüyorum:</div>
      <div class="bfi-test-question">${escapeHtml(q.t)}</div>

      <div class="bfi-options">
        ${options.map(opt => `
          <button class="bfi-option ${opt.cls} ${selected === opt.val ? 'selected' : ''}" onclick="selectBfiAnswer(${opt.val})">
            <div class="bfi-option-num">${opt.val}</div>
            <div class="bfi-option-label">${opt.label}${selected === opt.val ? ' <span class="selected-mark">← seçili</span>' : ''}</div>
          </button>
        `).join('')}
      </div>

      <div class="bfi-test-footer">
        ${bfiCurrentIndex > 0 ? `<button class="btn-ghost bfi-test-prev" onclick="prevBfiQuestion()">← Önceki</button>` : '<div></div>'}
        <div class="bfi-test-note">Otomatik kayıt · yarıda bırakabilirsin</div>
      </div>

      <button class="bfi-test-cancel" onclick="cancelBfiTest()">Testi iptal et</button>
    </div>
  `;
}

window.selectBfiAnswer = async function(val) {
  const q = BFI_QUESTIONS[bfiCurrentIndex];
  bfiAnswers[q.n] = val;

  if (bfiCurrentIndex < BFI_QUESTIONS.length - 1) {
    setTimeout(() => {
      bfiCurrentIndex++;
      renderBfiQuestion();
    }, 180);
  } else {
    // Son soru — testi bitir
    await finishBfiTest();
  }
};

window.prevBfiQuestion = function() {
  if (bfiCurrentIndex > 0) {
    bfiCurrentIndex--;
    renderBfiQuestion();
  }
};

window.cancelBfiTest = function() {
  if (!confirm('Testi iptal etmek istediğine emin misin? İlerlemen kaybolur.')) return;
  bfiAnswers = {};
  bfiCurrentIndex = 0;
  renderProfile();
};

async function finishBfiTest() {
  const box = document.getElementById('profileContent');
  box.innerHTML = `
    <div class="bfi-finishing">
      <div class="bfi-finishing-spinner"></div>
      <div class="bfi-finishing-text">Profilin oluşturuluyor...</div>
    </div>
  `;

  const scores = calcBfiScores(bfiAnswers);
  const answersSnapshot = { ...bfiAnswers }; // Yedek al

  // Cevapları localStorage'a da yedekle — tarayıcı kapansa bile kaybolmasın
  try {
    localStorage.setItem('kaizen_bfi_pending', JSON.stringify({
      scores: scores,
      answers: answersSnapshot,
      savedAt: Date.now()
    }));
  } catch (_) {}

  // 3 kez dene, her seferinde biraz bekle
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await saveBfiResult(scores, answersSnapshot);
      await loadBfiResults();
      // Başarılı — yedeği temizle
      try { localStorage.removeItem('kaizen_bfi_pending'); } catch (_) {}
      bfiAnswers = {};
      bfiCurrentIndex = 0;
      showToast('Test tamamlandı!');
      renderProfile();
      return;
    } catch (e) {
      console.error(`[BFI] Kaydetme denemesi ${attempt}/3 başarısız:`, e);
      lastError = e;
      if (attempt < 3) {
        // 1sn, sonra 2sn bekle
        await new Promise(r => setTimeout(r, attempt * 1000));
      }
    }
  }

  // 3 deneme de başarısız — kullanıcıya kurtarma seç
  box.innerHTML = `
    <div class="bfi-error-recover">
      <div class="bfi-error-icon">⚠</div>
      <h3>Bağlantı sorunu</h3>
      <p>Cevapların kaybolmadı — güvende. Sunucuya ulaşamadık sadece. Tekrar deneyelim mi?</p>
      <div class="bfi-error-detail">${escapeHtml(lastError ? lastError.message : 'Bilinmeyen hata')}</div>
      <div class="bfi-error-actions">
        <button class="btn btn-primary" onclick="retryBfiSave()">Tekrar dene</button>
        <button class="btn btn-ghost" onclick="showScreen('profile')">Sonra</button>
      </div>
      <div class="bfi-error-note">Cevapların tarayıcında yedekli — sayfayı yenileyip Profil'e dönersen "Beklemede" uyarısıyla tekrar gönderebilirsin.</div>
    </div>
  `;
}

// Kaydedilememiş testi yeniden göndermek için
window.retryBfiSave = async function() {
  let pending;
  try {
    const raw = localStorage.getItem('kaizen_bfi_pending');
    if (!raw) {
      showToast('Beklemede test yok.');
      renderProfile();
      return;
    }
    pending = JSON.parse(raw);
  } catch (_) {
    showToast('Yedek bozulmuş, tekrar teste girmen gerek.');
    renderProfile();
    return;
  }

  const box = document.getElementById('profileContent');
  if (box) {
    box.innerHTML = `
      <div class="bfi-finishing">
        <div class="bfi-finishing-spinner"></div>
        <div class="bfi-finishing-text">Tekrar gönderiliyor...</div>
      </div>
    `;
  }

  try {
    await saveBfiResult(pending.scores, pending.answers);
    await loadBfiResults();
    try { localStorage.removeItem('kaizen_bfi_pending'); } catch (_) {}
    showToast('Test başarıyla kaydedildi!');
    renderProfile();
  } catch (e) {
    console.error('[BFI] Yeniden gönderme başarısız:', e);
    showToast('Hâlâ bağlanamıyor. Biraz sonra dene.');
    renderProfile();
  }
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
