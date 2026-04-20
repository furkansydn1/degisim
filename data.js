// =========================================================
// KAIZEN — VERİ DOSYASI
// Buradaki içerikleri düzenlemek için kod bilgisine gerek yok.
// Soruları, alıntıları, sloganları, rehber yazılarını direkt değiştirebilirsin.
// =========================================================

// ---------- SLOGANLAR (Anasayfa hero) ----------
const SLOGANS = [
  { a: 'Küçük değişimler,', b: 'büyük oluş.' },
  { a: 'Bugün değişmezsen,', b: 'yarın hep aynısın.' },
  { a: 'Disiplin değil,', b: 'kimlik.' },
  { a: 'Hareket,', b: 'kelimeden ağırdır.' },
  { a: 'Hazır olmayı bekleme.', b: 'Başla.' },
  { a: 'Eski sen,', b: 'bir seçimdir.' },
  { a: 'Bir gün değil,', b: 'bugün.' },
  { a: 'Yap.', b: 'Konuşma.' },
  { a: 'Sessizce,', b: 'sürekli.' },
  { a: 'Hep aynı yerdeysen,', b: 'yanlış sorular soruyorsun.' },
  { a: 'Kimlik önce,', b: 'davranış sonra.' },
  { a: 'Ben olmak bir an değil,', b: 'bir alışkanlıktır.' },
  { a: 'Bir cümle yaz,', b: 'bir adım at.' },
  { a: 'Kaçtığını tanı,', b: 'kaç.' },
  { a: 'Sözün değil,', b: 'tekrarların seni yapar.' },
  { a: 'Zincir kırılır,', b: 'her gün biraz.' },
  { a: 'Korkunu yaz,', b: 'büyüsü kaçsın.' },
  { a: 'Henüz değil,', b: 'ama yolda.' },
  { a: 'Sadece bugün.', b: 'Yarın yarın gelir.' },
  { a: 'Kaçış da bir cevaptır,', b: 'görmek yeter.' },
  { a: 'Küçük söz,', b: 'büyük eylem.' },
  { a: 'Değişim sessizdir,', b: 'dinlemeyi bil.' },
  { a: 'Hep aynı yöne,', b: 'her gün biraz.' },
  { a: 'Dürüstlük,', b: 'en kısa yoldur.' },
  { a: 'Sert gerçek,', b: 'tatlı yalandan iyidir.' },
  { a: 'Her gün,', b: 'yeniden seç.' },
  { a: 'Eski kalıp,', b: 'yeni kişi değildir.' },
  { a: 'Bekleme yok,', b: 'oluşma var.' },
  { a: 'Bir satır,', b: 'bir niyet.' },
  { a: 'Mükemmel değil,', b: 'düzenli.' }
];

// ---------- ALINTILAR (Anasayfa altı, rastgele) ----------
const QUOTES = [
  { t: "Suya geç girmek suyu ısıtmaz. Sadece üşütür.", a: "" },
  { t: "Başarı büyük sıçramaların toplamı değil, küçük adımların çarpımıdır.", a: "" },
  { t: "Eğer bir şey seni yoruyorsa, o seni büyütüyor olabilir.", a: "" },
  { t: "En iyi zaman yirmi yıl önceydi. İkinci en iyi zaman bugün.", a: "Çin Atasözü" },
  { t: "Kendini bulmak istiyorsan, kendini unut. Bir işe, bir disipline, bir sevgiye ver.", a: "" },
  { t: "Küçük şeylerde sadakatsizsen, büyük şeylerde de sadakatsizsindir.", a: "" },
  { t: "Sadece harekete güven. Hayat kelimelerde değil, olaylarda geçer.", a: "Alfred Adler" },
  { t: "İnsan ne kadar az isterse, o kadar çoğa sahiptir.", a: "Sokrates" },
  { t: "Geçmişe saplanmak, geleceğe körleşmektir.", a: "" },
  { t: "Zincirleri görmeyen kişi, özgürlüğü arayamaz.", a: "" },
  { t: "Cesaret, korkunun yokluğu değil; korkunun üstüne yürümektir.", a: "" },
  { t: "Her gün azıcık. Azıcık her gün. Fark, yolda ortaya çıkar.", a: "" },
  { t: "Bilmediğini bilmek, bildiğini sorgulamakla başlar.", a: "" },
  { t: "Sabır acıdır ama meyvesi tatlıdır.", a: "Aristoteles" },
  { t: "En büyük zafer hiç düşmemek değil, her düştüğünde kalkmaktır.", a: "Konfüçyüs" },
  { t: "Kendini savunmak için harcadığın enerji, değişmek için kullansan zaten savunmaya gerek kalmazdı.", a: "" },
  { t: "Yapmak istemediğin şeyi yap. Orada bir şey öğreneceksin.", a: "" },
  { t: "Hayat seni test etmez. Senin içinden çıkarılanı gösterir.", a: "" },
  { t: "Bir ağaca bakanın en çok ihtiyacı olan şey, sabırdır.", a: "" },
  { t: "Başarısızlık, denemenin zıddı değildir. Başarısızlık denemenin kendisidir.", a: "" },
  { t: "Kendi yolundan başkasını takip eden, ömür boyu kaybolur.", a: "" },
  { t: "Zor olan yapılması doğru olandır. Kolay olan ise alıştığındır.", a: "" },
  { t: "Önce yap. Anlamayı yaparken öğrenirsin.", a: "" },
  { t: "Kimse seni kurtarmaya gelmiyor. Bu iyi haber.", a: "" },
  { t: "Nehir dağı aşamadı çünkü akmayı bırakıp kararlı olmayı denedi.", a: "" },
  { t: "Acı geçicidir. Pes etmek kalıcıdır.", a: "Lance Armstrong" },
  { t: "Yolun bittiğini sandığın an, başka bir yol açılır. Yeter ki yürümeyi bırakma.", a: "" },
  { t: "Kendine verdiğin her sözü tut. Tutmadığın her söz benlik saygını yer.", a: "" },
  { t: "Değişim rahat değildir. Rahatlık da değişim değildir.", a: "" },
  { t: "Bir şey seni rahatsız ediyorsa, ona daha yakından bakmanın zamanı gelmiştir.", a: "" },
  { t: "Umutsuzluk, yeterince denemediğinin kanıtıdır.", a: "" },
  { t: "Başkasının hayatını yaşamak, en incelikli intihar biçimidir.", a: "" },
  { t: "Sen aynı nehre iki kez giremezsin, çünkü o başka sular; sen başka bir sensin.", a: "Heraklitos" },
  { t: "Düşündüğün gibi yaşamazsan, yaşadığın gibi düşünmeye başlarsın.", a: "Paul Bourget" },
  { t: "Sessizlikten korkan, kendiyle tanışmamıştır.", a: "" },
  { t: "İçinde bir şey yanmıyorsa, kimseyi ısıtamazsın.", a: "" },
  { t: "İyi tohum kötü toprakta büyümez. Önce toprağı değiştir.", a: "" },
  { t: "Kendini küçük görme. Ama abartma da. Sadece gör.", a: "" },
  { t: "Bir işi ertelemek, onu iki katına çıkarmaktan farksızdır.", a: "" },
  { t: "Mükemmel olmayı bekleme. Yeterli olmak yeterli.", a: "" },
  { t: "Güçlü olmak, kırılmamak değil; kırıldığında yeniden birleşmektir.", a: "" },
  { t: "Her büyük yolculuk, tek bir adımla başlar.", a: "Lao Tzu" },
  { t: "Sabah yatağını topla. Küçük bir zafer, büyük bir gün açar.", a: "" },
  { t: "Her 'hayır' bir 'evet'in alanını açar. Seçmekten korkma.", a: "" },
  { t: "Konfor sana ne verdiyse geri almaya hazırdır. Zorluk ise yeni bir şey verir.", a: "" },
  { t: "Bir çocuk gibi merak et. Bir yaşlı gibi sabret.", a: "" },
  { t: "Çaba, yeteneksizliğin telafisi değildir. Yeteneğin tek görünür hâlidir.", a: "" },
  { t: "Ne ekersen onu biçersin. Bu, doğanın adaleti değil, kuralıdır.", a: "" }
];

// =========================================================
// SORULAR — Dan Koe'nin "How to Change Your Life in 1 Day"
// makalesindeki 3 katmanlı yapıya birebir uyarlandı:
//   KURULUŞ  → Tek seferlik, 14 soru (Morning - Psychological Excavation)
//   SABAH    → Her gün, 3 soru (Vision sabitleme + günlük niyet)
//   GÜN İÇİ  → Her saate sabit tek soru (Interrupting Autopilot)
//   AKŞAM    → Her gün, 3 soru (Synthesizing Insight)
//   HAFTALIK → Pazar, 4 soru (senin eklemen)
//   AYLIK    → Ay sonu, 4 soru (senin eklemen)
// =========================================================

const QUESTIONS = {
  // ---------- KURULUŞ — Tek seferlik, 14 soru ----------
  kurulus: [
    { id: 'k1', q: 'Yaşamayı öğrendiğin, sıradanlaşmış ama hâlâ içini kemiren memnuniyetsizlik ne?', hint: 'Ağlatacak kadar büyük bir acı değil. Alıştığın, "işte hayat bu" dediğin ama içten içe kabullenmediğin şey. Pazartesi sabahı gözünü açarken midende beliren şey nedir?' },
    { id: 'k2', q: 'Geçen yıl en çok tekrarladığın 3 şikayet neydi?', hint: 'Arkadaşlarınla kahvede, eşinle akşam yemeğinde, kendine duşta ne söylüyorsun? Hep aynı 3 şeyden şikayet ediyorsan ve hâlâ o durumdaysan, kendine şunu sor: gerçekten değişmesini istiyor muyum?' },
    { id: 'k3', q: 'Bu şikayetlere bakarak, davranışını izleyen biri gerçekten ne istediğini söylerdi?', hint: 'Sözlerin bir şey, hareketlerin başka bir şey söylüyor. "İşimi sevmiyorum" diyorsun ama iş aramıyorsun — o zaman gerçek isteğin ne? Güvenlik mi? Mazeret mi? Dürüst ol.' },
    { id: 'k4', q: 'Saygı duyduğun birine itiraf etmen zor olacak, hayatına dair bir gerçek ne?', hint: 'Babana, eski bir öğretmenine ya da seni gerçekten tanıyan birine anlatsan utanacağın şey. Yüzü düştüğünde hissedeceğin şey — genelde asıl gerçek oradadır.' },
    { id: 'k5', q: 'Hiçbir şey değişmezse 5 yıl sonra ortalama bir Salı günün nasıl geçer?', hint: 'Romantikleştirme. Saat kaçta uyanıyorsun, yatak nasıl kokuyor, telefona ilk ne için bakıyorsun, öğle yemeğinde kimin yanında oturuyorsun, 22:00\'de yüzün nasıl? Bir kısa film gibi yaz.' },
    { id: 'k6', q: '10 yıl sonra neyi kaçırmış olurdun? Hangi fırsatlar kapanmış olur?', hint: 'Hangi ilişkiler artık kurulamaz? Hangi bedenler bir daha gelmez? Annenle yapmadığın o yolculuk? 30\'una yetişemediğin o beceri? Somut say.' },
    { id: 'k7', q: 'Hayatının sonundasın. Güvenli versiyonu yaşadın. Bedeli ne?', hint: 'Başlamadığın işler. İtiraf edemediğin sevgiler. Denemediğin için "nasılmış" merak ettiğin şeyler. Yatakta, gözlerini kapatmadan önce içinde kalan o ukde — adı ne?' },
    { id: 'k8', q: 'Hayatında zaten senin korktuğun geleceği yaşayan biri var mı?', hint: 'Amcan, eski bir meslektaş, mahalleden bir komşu. Yıllar önce seninkine benzer durumdaydı, şimdi orada. Onun yüzüne baktığında ne hissediyorsun? İşte o his, seni uyarıyor.' },
    { id: 'k9', q: 'Gerçekten değişmek için hangi kimliği bırakman gerek?', hint: 'Kendini hangi sıfatlarla tanıttığını düşün: "ben tembel biriyim", "ben sosyal değilim", "ben sporcu tipi değilim". Bu etiketleri çıkarırsan kim kalır? Ve o boşluk seni neden korkutuyor?' },
    { id: 'k10', q: 'Değişmemenin en utanç verici sebebi ne?', hint: '"Zamanım yok" değil. O ezbere. Bir katman derine in: başkalarının ne diyeceğinden mi korkuyorsun? Başarısız olmaktan mı? Başarılı olmaktan mı? Çocuk gibi hissediyorsun belki — o utancı yaz.' },
    { id: 'k11', q: 'Davranışın bir koruma biçimiyse, tam olarak neyi koruyorsun?', hint: 'Ertelemek seni neden koruyor? Belki denemezsen başarısız olamazsın. Belki önemsemezsen kırılamazsın. Korunan şey genelde kırılgan bir yer — o yer neresi?' },
    { id: 'k12', q: 'Pratikliği unut: 3 yıl sonra yaşamak istediğin hayatta ortalama bir Salı nasıl geçer?', hint: '"Gerçekçi ol" deme şimdi. Aynı detayla yaz: saat, mekan, yanındaki insan, yaptığın iş, akşam ne yiyorsun. Hayal bile kuramıyorsan, zaten sorun orada.' },
    { id: 'k13', q: 'O hayatın zorlama değil doğal hissetmesi için kendin hakkında neye inanman gerek?', hint: 'O Salı\'daki kişi kendini nasıl biri olarak görüyor? "Ben ... türü biriyim." Cümleyi tamamla. Şimdiki kimliğinle bu cümle çelişiyor mu? İşte değişmesi gereken yer.' },
    { id: 'k14', q: 'Zaten o kişi olsan, bu hafta tek başına yapacağın şey ne?', hint: 'Büyük şey değil — o kişi gayet doğal yapardı. Bir e-posta atmak. Bir randevu almak. 20 dakika yazmak. Senin zor bulduğun, onun için sıradan olan o küçük eylem ne?' }
  ],

  // ---------- SABAH — Her gün, 3 soru ----------
  // Dan Koe: "Vision sabitleme + günlük niyet"
  sabah: [
    { id: 's1', q: 'Bugün en çok neyle yüzleşmekten kaçıyorum?', hint: 'Gözünü açtığında aklına "ah, bir de o mesele var" diye gelen şey. Yapılacaklar listenden sürekli ertelediğin o iş. İçten içe biliyorsun neyse — adını koy, büyüklüğü azalsın.' },
    { id: 's2', q: 'Bugün, olmak istediğim kişinin en küçük versiyonu ne yapardı?', hint: 'Kahraman olmana gerek yok. O kişi bu sabah doğal olarak ne yapardı? 10 dakika yazardı belki. Asansörü değil merdiveni kullanırdı. Bir mesaj atardı. Tek, somut, bugün.' },
    { id: 's3', q: 'Bugün gelecekteki ben, şimdiki bana ne söylerdi?', hint: '5 yıl sonra, olmak istediğin yerdeki sen, bu sabaha bakıp ne derdi? "Şu adımı at" mı? "Bu telefonu bırak" mı? "O mesajı yaz artık" mı? Onun sesini duy.' }
  ],

  // ---------- GÜN İÇİ — Sabit saatler, her saate tek soru ----------
  // Dan Koe'nin makalesindeki 5 saat + 19:30 eklemesi
  // Bu diziden DEĞİL, TIME_SLOTS'taki `fixedQuestionId`'ye göre çekilir
  gunici: [
    { id: 'g1', q: 'Şu an yaptığım şeyle neyi erteliyorum?', hint: 'Bu sekme, bu video, bu "bir bakayım"lar hangi işin üzerini örtüyor? Genelde bildiğin ama yapmaktan çekindiğin şeyin üstüne kapatılan bir bardır bu.' },
    { id: 'g2', q: 'Son 2 saatimi izleyen biri, ne istediğimi söylerdi?', hint: 'Sessiz bir kamera seni izliyor. Ne yaptığını görünce ne söylerdi? "Bu kişi odaklanmak istiyor" mu? "Bu kişi kaçmak istiyor" mu? Davranış niyetten daha dürüsttür.' },
    { id: 'g3', q: 'Nefret ettiğim hayata mı, istediğim hayata mı doğru hareket ediyorum?', hint: 'Bu an bir oya dönüşüyor. Son 30 dakikan, 5 yıl sonraki hangi Salı\'ya çıkıyor? Kaçtığın hayata mı, vizyonuna mı? Şu anki yön gerçek yöndür.' },
    { id: 'g4', q: 'Önemsiz numarası yaptığım en önemli şey ne?', hint: '"Yarın halledilir" dediğin. "Zaten çok büyük mesele değil" diye geçiştirdiğin. İçindeki ses ise "aslında çok önemli" diyor. Adını koymaktan kaçtığın şey ne?' },
    { id: 'g5', q: 'Şu an gerçek bir istekten mi, kimlik korumasından mı hareket ediyorum?', hint: 'Bu işi gerçekten istediğin için mi yapıyorsun, yoksa "ben böyle biriyim" dediğin kişiyi kaybetmemek için mi? Çalıştığını göstermek çalışmaktan yorucudur.' },
    { id: 'g6', q: 'Şu an beni en çok tüketen düşünce ne?', hint: 'Arka planda sessizce çalışan, enerjini emen o düşünce. Bir konuşma. Bir karar. Bir suçluluk. Adını yazmak bile onu yarı yarıya küçültür — dene.' }
  ],

  // ---------- AKŞAM — Her gün, 3 soru ----------
  aksam: [
    { id: 'a1', q: 'Bugün en canlı ne zaman hissettim? En ölü ne zaman?', hint: 'Hangi an gözün parladı, hangi an omuzların çöktü? İkisini de yaz. Canlılık verenler senin yönün, ölü hissettirenler uzaklaşman gereken yer — ikisi birlikte haritayı çizer.' },
    { id: 'a2', q: 'Bugün hangi eylemim, olmak istediğim kişinin eylemiydi?', hint: 'Küçük de olsa. Bir tek şey. Masaya oturduğun 30 dakika. Atlamadığın spor. Söylediğin o zor söz. Kanıt birikmiyor değil — sadece görmeyi unutuyorsun.' },
    { id: 'a3', q: 'Yarın sabah, bugünden farklı yapmak istediğim tek şey ne?', hint: 'Listeler dağıtır, tek şey odaklar. Yarın uyanınca hangi tek değişiklik günü baştan aşağı farklı yapar? Abartma — sıradan, mümkün, somut.' }
  ],

  // ---------- HAFTALIK — Pazar, 4 soru ----------
  haftalik: [
    { id: 'h1', q: 'Bu hafta kaç kez sözümle eylemim uyuştu? Kaç kez uyuşmadı?', hint: 'Dedik ama yapmadık: kaç kez? Yapacağız dediğimizi yaptık: kaç kez? Yuvarlama, dürüst say. Fark senin gerçek karakterinle söylediğin karakter arasındaki mesafedir.' },
    { id: 'h2', q: 'Geçen pazar ile bu pazar arasında ben olarak ne değişti?', hint: '"Hiçbir şey" bir cevaptır ve önemli bir cevaptır. Değişmediysen, neden? Değiştiysen, hangi an kırıldı bir şey? Somut ve küçük olabilir — örneğin "artık şu mesele beni o kadar rahatsız etmiyor".' },
    { id: 'h3', q: 'Bu hafta en çok hangi duygudan kaçtım?', hint: 'Tekrar eden bir his vardı bu hafta — sıkıldın mı, yalnız mı hissettin, kıskandın mı, korktun mu? Kaçış genelde meşguliyet, ekran veya yeme olarak kendini gösterir. Hangi duyguyu susturmak için?' },
    { id: 'h4', q: 'Gelecek hafta için tek bir küçük niyetim olsa ne olur?', hint: 'Devrim değil. Küçük bir niyet. "Her sabah 10 dakika yürüyeceğim." "Salı akşamı şu kişiyi arayacağım." Küçüklüğüne aldanma — yapacağın tek şey, yapmayacağın on şeyden değerli.' }
  ],

  // ---------- AYLIK — Ay sonu, 4 soru ----------
  aylik: [
    { id: 'ay1', q: 'Bu ay kaçtığım hayata ne kadar yaklaştım?', hint: '1-10 arası. Korktuğun o hayata benzeyen davranışların hangileriydi bu ay? Sert ol — kaçtığını bilirsen, yönünü düzeltmek kolay.' },
    { id: 'ay2', q: 'Bu ay kimlik ifademe en çok hangi eylem kanıt oldu?', hint: '"Ben ... biriyim" dediğin cümlenin altını dolduran tek bir eylem. Büyük olmak zorunda değil — sadece gerçek olmalı. Kanıt birikir, kimlik kendi kendini inşa eder.' },
    { id: 'ay3', q: 'Vizyonum evrilmeli mi? Öyleyse nasıl?', hint: 'Bir ay önceki vizyonun hâlâ seni çekiyor mu? Artık küçük mü geliyor, yoksa yön mü değişti? Vizyon sabit değil, canlıdır — değiştirmek kararsızlık değil, olgunluktur.' },
    { id: 'ay4', q: 'Bu ay kendime söylediğim en büyük yalan neydi?', hint: 'Tek bir günün değil, 30 günün yalanı. Belki "çok yoğunum"du. Belki "sonra başlarım"dı. Belki "bu sefer cidden" idi. Farkındasın ama söylemek istemiyorsun — burada söyle.' }
  ]
};

// =========================================================
// ZAMAN SLOTLARI — Dan Koe'nin sabit saatleri
// Her gün içi saatinin SABİT bir sorusu var (fixedQuestionId)
// Pencere açılır → bir sonraki pencere açılana kadar "aktif"
// Sonraki açılınca önceki "geç" olur ama yine cevaplanabilir
// =========================================================

const TIME_SLOTS = [
  { key: 'sabah-block', time: '07:30', label: 'Sabah · 3 soru', type: 'sabah', count: 3, start: 0, end: 11 },
  { key: 'g-1100',      time: '11:00', label: 'Öğle öncesi',    type: 'gunici', count: 1, start: 11,   end: 13.5, fixedQuestionId: 'g1' },
  { key: 'g-1330',      time: '13:30', label: 'Öğle sonrası',   type: 'gunici', count: 1, start: 13.5, end: 15.25, fixedQuestionId: 'g2' },
  { key: 'g-1515',      time: '15:15', label: 'İkindi',         type: 'gunici', count: 1, start: 15.25, end: 17,   fixedQuestionId: 'g3' },
  { key: 'g-1700',      time: '17:00', label: 'Akşamüstü',      type: 'gunici', count: 1, start: 17,   end: 19.5, fixedQuestionId: 'g4' },
  { key: 'g-1930',      time: '19:30', label: 'Gün sonu',       type: 'gunici', count: 1, start: 19.5, end: 21,   fixedQuestionId: 'g5' },
  { key: 'aksam-block', time: '21:00', label: 'Akşam · 3 soru', type: 'aksam', count: 3, start: 21,   end: 24 }
];

// ---------- STOPWORDS — Örüntü analizi için göz ardı edilen kelimeler ----------
const STOPWORDS = new Set([
  'bile','için','olan','olarak','benim','senin','sonra','önce','gibi','daha','çok','çünkü',
  'ama','fakat','sadece','kadar','belki','şöyle','böyle','nasıl','neden','zaman','şimdi',
  'bugün','yarın','dün','biraz','hiç','evet','hayır','aslında','yani','hep','her',
  'ben','sen','biz','onlar','bu','şu','var','yok','ve','veya','ile','değil',
  'olmak','etmek','yapmak','gelmek','gitmek','istemek','bilmek',
  'kendi','kendimi','kendimden','kendine','kendime','olduğumu','yaptığım',
  'ediyorum','yapıyorum','oluyor','olmaz','olacak','sanırım','galiba',
  'hissediyorum','düşünüyorum','eğer','dedim','dedi','diye','şey','şeyi','şeyin'
]);

// =========================================================
// REHBER YAZILARI
// =========================================================

const GUIDE_ARTICLES = [
  {
    id: 'why',
    title: 'Bu uygulama neden işe yarar?',
    lead: 'Çünkü sana bilgi öğretmiyor — seni kendi cevaplarınla yüzleştiriyor.',
    body: `
      <p>İnsanların %90'ı neden değişemez? Çünkü <em>yanlış katmanda</em> değişmeye çalışırlar. "Bu hafta daha disiplinli olacağım" der, 2 hafta sonra bırakırlar. Sorun motivasyon değil, <em>kimlik</em>.</p>
      <h4>Davranış vs. Kimlik</h4>
      <p>Fit olan biri sağlıklı yemek yemek için kendini zorlamıyor — tersine, <em>sağlıksız yemek yemek</em> ona zor geliyor. CEO sabah kalkmak için değil, yatakta yatmak için kendini zorlar. Kimliği değişmiş, davranış kendiliğinden akıyor.</p>
      <blockquote>"Eğer hayatımdan keyif almıyor olsaydım, bunu neden yapıyor olayım ki?"</blockquote>
      <p>Kaizen tam da bunu yapıyor: Her gün sana birkaç soru sorar. Cevaplarını biriktirir. 30 gün sonra sana <em>kanıt</em> gösterir — ne dediğinle ne yaptığın uyuşuyor mu, uyuşmuyor mu?</p>
      <p>İç sesinle dış kanıtın yüzleşmesi. Bir süre sonra kendini artık kandıramazsın.</p>
    `
  },
  {
    id: 'structure',
    title: 'Sorular nasıl çalışır?',
    lead: '3 katman var: Kuruluş bir kez, günlük ritim sürekli, haftalık/aylık tekrar eder.',
    body: `
      <p>Kaizen'deki sorular karışık değil, net bir hiyerarşi var.</p>
      <h4>1. Kuruluş — Tek seferlik (14 soru)</h4>
      <p>İlk girdiğinde karşına çıkar. Vizyonunun, kaçtığın hayatın, kimliğinin temelini atarsın. 20-30 dakika sürer. Bir oturuşta bitirmek zorunda değilsin — kaldığın yerden devam edersin.</p>
      <h4>2. Günlük ritim — Her gün (3 + 5 + 3 soru)</h4>
      <p><em>Sabah (3 soru)</em> — Gün başlamadan niyetini topla.<br>
      <em>Gün içi (5 sabit saat, her saate 1 soru)</em> — Otopilotu kır. 11:00, 13:30, 15:15, 17:00, 19:30.<br>
      <em>Akşam (3 soru)</em> — Günü kapat, yarına mesaj bırak.</p>
      <p>Gün içi soruları <strong>sabittir</strong> — 11:00'de hep aynı soru gelir, 13:30'da hep aynı. Çünkü amaç çeşitlilik değil, aynı soruya farklı günlerde ne farklı cevap verdiğini görmek.</p>
      <h4>3. Ritüeller — Haftada / ayda bir (4+4 soru)</h4>
      <p><em>Haftalık</em> — Pazar günü. Geçen hafta sözünle eylemin uyuştu mu?<br>
      <em>Aylık</em> — Ay sonunda. Vizyonun evrilmeli mi?</p>
      <h4>Geç cevap sistemi</h4>
      <p>Bir pencere geçtiğinde (mesela 13:30 geldiğinde 11:00 sorusu) eski soru hâlâ cevaplanabilir. Sadece "geç" olarak işaretlenir. Sistem kaç dakika geç cevapladığını kaydeder — çünkü kronik erteleme bir örüntüdür ve görünür olması lazım.</p>
    `
  },
  {
    id: 'vision',
    title: 'Vizyon nasıl yazılır?',
    lead: 'İki örnekle — yanlış ve doğru.',
    body: `
      <p>Vizyon bir <em>hedef değildir</em>. Bir <em>bakış açısıdır</em>. Dünyayı hangi gözle göreceğinin sözleşmesi.</p>
      <h4>Eski cümle vs. Yeni cümle</h4>
      <div class="example">
        <div class="compare-box wrong">
          <div class="lbl">Eski</div>
          "Yazar olmak istiyorum." / "Daha disiplinli olacağım." / "Kilo vereceğim."
        </div>
        <div class="compare-box right">
          <div class="lbl">Yeni</div>
          "Ben her gün yazan biriyim." / "Ben sözünden çok hareketine güvenen biriyim."
        </div>
      </div>
      <p>Farkı gördün mü? Eski cümleler <em>gelecek zamanda</em>. Yeni cümleler <em>şimdiki zamanda</em>. Sen zaten o kişisin — kanıtı henüz biriktirmedin, o kadar.</p>
      <h4>İyi bir vizyonun 3 özelliği</h4>
      <p>1. <em>Şimdiki zaman</em> — "olmak istiyorum" değil, "benim."<br>
      2. <em>Kişisel</em> — başkasının cümleleriyle değil, kendi cümlelerinle.<br>
      3. <em>Evrilir</em> — mükemmel yazmak zorunda değilsin. Yaz, aylarca sonra dön, güncelle.</p>
      <blockquote>"Vizyonun bir ürün gibidir. Önce kaba bir hal, sonra sürekli iterasyon."</blockquote>
    `
  },
  {
    id: 'anti-vision',
    title: 'Kaçtığın Hayatı (Anti-Vizyon) nasıl yazılır?',
    lead: 'Kaçtığın hayat, gideceğin hayattan çoğu zaman daha güçlü motive eder.',
    body: `
      <p>İnsanlar "pozitif motivasyon"u över, ama sinir sistemi <em>kaybetmek</em> riskine çok daha güçlü tepki verir. Kaçtığın hayatı yazmak, bu yüzden vizyonun kadar önemlidir.</p>
      <h4>Nasıl yazılır?</h4>
      <p>Kendini 10 yıl sonra hayal et — <em>hiçbir şey değişmemiş</em>. Aynı iş, aynı şikayetler, aynı bahaneler. Bu hayatın detaylarını içini acıtacak kadar gerçekçi yaz.</p>
      <div class="example">
        <div class="compare-box wrong">
          <div class="lbl">Yüzeysel</div>
          "Başarısız olmak istemiyorum."
        </div>
        <div class="compare-box right">
          <div class="lbl">Etkili</div>
          "40 yaşında, hâlâ aynı şikayetleri eden, yazmadığı kitaptan bahseden, vaktinden önce yorulmuş biri olmak."
        </div>
      </div>
      <blockquote>"Kaçtığın hayatı tanıyana kadar ondan kaçamazsın. Tanıdığında ise kaçmana gerek kalmaz."</blockquote>
    `
  },
  {
    id: 'identity',
    title: 'Kimlik nasıl inşa edilir?',
    lead: 'Değişim şöyle olmuyor: kendini zorla, daha çok zorla, sonunda değiş. Şöyle oluyor: önce kimliği değiştir, davranış otomatik gelsin.',
    body: `
      <p>Kimliğin şu an neden bu hâlde?</p>
      <p>1. Bir hedefin oldu (genelde farkında bile değildin)<br>
      2. O hedefe göre dünyayı algıladın<br>
      3. Hedefe götürecek davranışları yaptın<br>
      4. Yaptıkça alışkanlık oldu<br>
      5. Alışkanlık "Ben şöyle biriyim"e dönüştü<br>
      6. Artık kimliğini <em>savunuyorsun</em></p>
      <p>Yeni bir kimlik inşa etmek için bu döngüyü <em>tersten</em> işletirsin: Önce "Ben şöyle biriyim" dersin, sonra o kişinin yapacağı küçük şeyleri yaparsın, alışkanlık olur, en sonunda gerçekten o kişi olursun.</p>
      <h4>Önemli nokta</h4>
      <p>"Ben henüz o değilim" diyebiliyorsan doğru yoldasın. Kimse bir anda kimliğini değiştirmez. Kaizen'in mantığı: <em>küçük kanıtlar biriktir, kimlik kendi kendini yazsın</em>.</p>
      <blockquote>"İki yazı yazdıktan sonra yazar olmadın. Ama bir ay boyunca her gün yazdıysan, artık yazmayan biri olmak <em>sana tuhaf gelmeye başlar</em>."</blockquote>
    `
  },
  {
    id: 'progress',
    title: 'Ana yol yüzdesi nasıl hesaplanır?',
    lead: 'Senin müdahalene gerek kalmadan — otomatik ve adil.',
    body: `
      <p>Ana yol yüzden iki şeyin çarpımı:</p>
      <p><em>Zaman oranı</em> — Başlangıç ile bitiş tarihi arasında ne kadar yol aldın. Doğal akıyor, senin müdahalen olmadan.</p>
      <p><em>Tutarlılık çarpanı</em> — Son 30 gündeki soru tamamlama oranın. Ne kadar çok cevap verirsen, o kadar hızlı ilerliyor. Kaçırdıkça yavaşlıyor.</p>
      <h4>Formül</h4>
      <p><em>Yüzde = (geçen gün / toplam gün) × (0.5 + tamamlama oranı)</em></p>
      <p>Örnek: Başlangıcın 1 Ocak, sonun 31 Aralık. Bugün 1 Nisan. Geçen gün %25. Son 30 günde %80 tutarlılık göstermişsin. Yüzde = 25 × 1.3 = <em>%32.5</em>. Beklentinin üstünde.</p>
      <blockquote>"İlerleme otomatik değil. Ama haksız da değil. Kanıtın kadar ilerliyor."</blockquote>
    `
  },
  {
    id: 'time',
    title: 'Neden belirli saatlerde sorular?',
    lead: '"Bir ara yaparım" demek, "hiç yapmam" demektir.',
    body: `
      <p>Beynimizin en sevdiği kaçış: <em>sorumluluğu zamansızlaştırmak</em>. "Bir ara" diyorsun, o "bir ara" hiç gelmiyor. Uygulama bu yüzden seni <em>saate bağlıyor</em>.</p>
      <h4>Saatler ve sabit sorular</h4>
      <p><em>Sabah (07:30-11:00)</em> — 3 soru. Güne niyetle başla.<br>
      <em>11:00</em> — "Şu an yaptığım şeyle neyi erteliyorum?"<br>
      <em>13:30</em> — "Son 2 saatimi izleyen biri ne istediğimi söylerdi?"<br>
      <em>15:15</em> — "Nefret ettiğim mi, istediğim hayata mı hareket ediyorum?"<br>
      <em>17:00</em> — "Önemsiz numarası yaptığım en önemli şey ne?"<br>
      <em>19:30</em> — "Gerçek istekten mi, kimlik korumasından mı hareket ediyorum?"<br>
      <em>21:00 sonrası</em> — 3 soru. Akşam sentezi.</p>
      <p>Her pencere bir sonraki saat gelene kadar "aktif". Sonraki pencere gelince önceki "geç" olur ama hâlâ cevaplayabilirsin. Sistem kaç dakika geç cevapladığını not alır — zamanla ne kadar kronik ertelediğin örüntüde görünür.</p>
      <blockquote>"Kaçırmak da bir cevaptır. Sadece duyması daha zor bir cevap."</blockquote>
    `
  },
  {
    id: 'patterns',
    title: 'Örüntüler ne işe yarar?',
    lead: 'Tek bir cevap fazla şey söylemez. Otuz cevap her şeyi söyler.',
    body: `
      <p>"Neden kaçıyorum?" sorusunu bir kez cevaplamak faydalı ama sınırlı kalır. Aynı soruyu 30 gün cevaplayıp <em>tekrar eden kelimeleri</em> görmek, işte orada iş değişir.</p>
      <p>Kaizen senin cevaplarını sürekli tarar. Aradığı şeyler:</p>
      <p>1. <em>Tekrarlayan kelimeler</em> — 14 günde 12 kez "yorgunum" yazmışsın. Bu bir mesaj.<br>
      2. <em>Tutarsızlık</em> — "Her gün yazacağım" dedin, son 7 günde 2 kez geldin.<br>
      3. <em>Kaçışlar</em> — 3 gün üst üste gelmediysen sistem sorar: "Neden kaçıyorsun?"<br>
      4. <em>Geç cevaplar</em> — Gün içi sorularına sürekli pencere kapandıktan sonra cevap veriyorsan, bu da bir örüntü.<br>
      5. <em>Süreklilik</em> — 7 gün üst üste geldiysen: "Kanıt birikiyor."</p>
      <blockquote>"Tek bir dürüst cevap az şey söyler. Bin dürüst cevap, kim olduğunu söyler."</blockquote>
    `
  },
  {
    id: 'capsule',
    title: 'Zaman kapsülü nedir?',
    lead: 'Eski senin, şimdiki sene hesap sorması.',
    body: `
      <p>Bugün yazdığın bir cevabı 30 gün sonra sana göstersek ne olur? İki ihtimal var:</p>
      <p>1. O sen hâlâ aynı sensin → <em>yüzleşme</em>. "Ne değişti?" dediğimizde cevap veremiyorsan, değişim olmamış demektir.</p>
      <p>2. O sen artık yok → <em>kutlama</em>. "30 gün önce 'asla olmayacak' demiştim, şimdi yaşıyorum" demek, kimlik kanıtının en güçlü hâli.</p>
      <p>Kapsül iki senaryoda da işe yarar: <em>değiştiysen seni onaylar, değişmediysen seni uyandırır</em>.</p>
      <blockquote>"Geçmişteki sen, şimdiki senin en dürüst tanığıdır."</blockquote>
    `
  }
];

// ---------- BFI-44 KİŞİLİK TESTİ ----------
// Her maddenin "d" alanı boyut kodu, "r" alanı ters-kodlu mu
// Boyutlar: E=Dışa dönüklük, A=Uyumluluk, C=Sorumluluk, N=Nevrotiklik, O=Yeniliğe açıklık
const BFI_QUESTIONS = [
  { n: 1, t: 'Konuşkan biriyim.', d: 'E' },
  { n: 2, t: 'Başkalarında hata bulmaya eğilimliyim.', d: 'A', r: true },
  { n: 3, t: 'İşleri tam ve eksiksiz yaparım.', d: 'C' },
  { n: 4, t: 'Depresif hissetmeye veya moralim bozulmaya eğilimliyim.', d: 'N' },
  { n: 5, t: 'Orijinal biriyimdir, yeni fikirlere açığım.', d: 'O' },
  { n: 6, t: 'Ketumumdur (kendimi zor açarım).', d: 'E', r: true },
  { n: 7, t: 'Genel olarak yardımsever ve özverili biriyim.', d: 'A' },
  { n: 8, t: 'Biraz dikkatsiz veya umursamaz olabilirim.', d: 'C', r: true },
  { n: 9, t: 'Rahat biriyim, stresle kolay başa çıkarım.', d: 'N', r: true },
  { n: 10, t: 'Birçok farklı konuya ilgi duyarım.', d: 'O' },
  { n: 11, t: 'Enerji doluyumdur.', d: 'E' },
  { n: 12, t: 'Başkalarıyla sık sık tartışır veya ters düşerim.', d: 'A', r: true },
  { n: 13, t: 'Güvenilir ve sadık bir çalışanım.', d: 'C' },
  { n: 14, t: 'Sık sık gergin hissedebilirim.', d: 'N' },
  { n: 15, t: 'Zeki ve derin düşünen biriyim.', d: 'O' },
  { n: 16, t: 'Heyecan yaratırım (dikkat çekmeyi severim).', d: 'E' },
  { n: 17, t: 'İnsanları kolay bağışlarım.', d: 'A' },
  { n: 18, t: 'İşleri düzensiz veya dağınık yaparım.', d: 'C', r: true },
  { n: 19, t: 'Sık sık endişelenirim.', d: 'N' },
  { n: 20, t: 'Hayal gücü yüksek biriyim.', d: 'O' },
  { n: 21, t: 'Sessiz biriyimdir.', d: 'E', r: true },
  { n: 22, t: 'Genelde insanlara güvenirim.', d: 'A' },
  { n: 23, t: 'Tembel olmaya eğilimliyimdir.', d: 'C', r: true },
  { n: 24, t: 'Duygusal olarak dengeliyimdir, kolay sarsılmam.', d: 'N', r: true },
  { n: 25, t: 'Keşfetmeyi seven, yaratıcı biriyim.', d: 'O' },
  { n: 26, t: 'Girişken ve atılgan biriyim.', d: 'E' },
  { n: 27, t: 'Bazen başkalarına karşı soğuk veya mesafeli olabilirim.', d: 'A', r: true },
  { n: 28, t: 'Bir göreve başlayıp bitirene kadar devam ederim.', d: 'C' },
  { n: 29, t: 'Karamsarlığa kapılıp huysuzlaşabilirim.', d: 'N' },
  { n: 30, t: 'Sanata ve estetiğe değer veririm.', d: 'O' },
  { n: 31, t: 'Utangaç veya çekingen biriyim.', d: 'E', r: true },
  { n: 32, t: 'Hemen hemen herkese karşı nazik ve saygılıyım.', d: 'A' },
  { n: 33, t: 'İşleri verimli ve hızlı bir şekilde yaparım.', d: 'C' },
  { n: 34, t: 'Zor durumlarda sakin kalırım.', d: 'N', r: true },
  { n: 35, t: 'Rutin ve alışılmış işleri tercih ederim.', d: 'O', r: true },
  { n: 36, t: 'Sosyal ortamlarda dışa dönük biriyim.', d: 'E' },
  { n: 37, t: 'Bazen başkalarına karşı kaba davranabilirim.', d: 'A', r: true },
  { n: 38, t: 'Kendi planlarımı yapar ve onlara uyarım.', d: 'C' },
  { n: 39, t: 'Kolayca sinirlenebilirim.', d: 'N' },
  { n: 40, t: 'Düşünmeyi veya teorik fikirlerle uğraşmayı severim.', d: 'O' },
  { n: 41, t: 'Sanata veya sanatsal etkinliklere çok ilgi duymam.', d: 'O', r: true },
  { n: 42, t: 'Diğer insanlarla işbirliği yapmayı severim.', d: 'A' },
  { n: 43, t: 'Dikkatim kolayca dağılır.', d: 'C', r: true },
  { n: 44, t: 'Müzik ve sanat alanlarında sofistike zevklerim vardır.', d: 'O' }
];

// Boyut bilgileri (ad, renk, kısa açıklama)
const BFI_DIMENSIONS = {
  E: {
    name: 'Dışa Dönüklük',
    key: 'E',
    color: 'copper',
    short: 'Sosyal enerjin, etrafındaki insanlara yönelişin',
  },
  A: {
    name: 'Uyumluluk',
    key: 'A',
    color: 'sage',
    short: 'İnsanlarla uyum kurma eğilimin, sıcaklığın',
  },
  C: {
    name: 'Sorumluluk',
    key: 'C',
    color: 'copper',
    short: 'Disiplin, hedef odaklılık, düzen sevgin',
  },
  N: {
    name: 'Duygusal Denge',
    key: 'N',
    color: 'crimson',
    short: 'Stres altında kalma, duygu yoğunluğun',
  },
  O: {
    name: 'Yeniliğe Açıklık',
    key: 'O',
    color: 'violet',
    short: 'Merak, yaratıcılık, yeniye açıklığın',
  }
};

// Her boyut için 3 seviye yorum: düşük, orta, yüksek
const BFI_INTERPRETATIONS = {
  E: {
    low: {
      label: 'İçe dönük',
      text: 'Sessizliği, derin düşünceyi ve yalnız kalmayı seviyorsun. Enerjini kalabalıkta değil, kendi alanında toparlıyorsun. Bu bir zayıflık değil — güçlü bir düşünür olabilirsin.',
      kaizen: 'Gün içi kontrollerin senin için altın — içsel sesine dönmek zaten doğal yeteneğin.'
    },
    mid: {
      label: 'Orta (dengeli)',
      text: 'Hem sosyalleşmeyi hem yalnız zamanı dengeli yönetiyorsun. İhtiyacına göre iki modu da kullanabiliyorsun. Esneksin.',
      kaizen: 'Çeşitli sosyal durumlarda kendini test etmek için iyi bir fırsat — hangi modun seni gerçekten beslediğini fark et.'
    },
    high: {
      label: 'Yüksek (dışa dönük)',
      text: 'İnsanlarla vakit geçirmek seni canlandırıyor. Girişken, enerjik ve sosyal ortamlarda parlayan birisin. Ama bazen içsel işe zaman ayırmak zor gelebilir.',
      kaizen: 'Akşam sentezi senin için özellikle değerli — dış enerjiden kopup içine dönmen kimliğini kuran şey.'
    }
  },
  A: {
    low: {
      label: 'Düşük (rekabetçi)',
      text: 'Fikrini savunmaktan çekinmezsin. Eleştirel düşünürsün, kolay "evet" demezsin. Bu liderlik avantajı ama ilişkilerde bazen sert algılanabilirsin.',
      kaizen: 'Uyumluluk sorularında kendini dürüstçe gözlemle — empati kasın, disiplin kasın gibi geliştirilebilir.'
    },
    mid: {
      label: 'Orta (dengeli)',
      text: 'Hem kendi çıkarını gözetiyorsun hem başkalarını önemsiyorsun. Gerektiğinde hayır diyebilen, gerektiğinde yardım eden bir denge.',
      kaizen: 'Sınırlarını yazmak için "Kurallar" bölümü senin için önemli — kendini neyin için feda etmeyeceğini netleştir.'
    },
    high: {
      label: 'Yüksek (uyumlu)',
      text: 'Başkalarına karşı yumuşaksın, işbirlikçi ve affedicisin. Güven veriyor, etrafını yumuşatıyorsun. Ama kendi ihtiyaçlarını geri plana atma riskin var.',
      kaizen: '"Kaçtığın hayat" bölümünü dolduruken kendi için iste — herkesi memnun eden bir hayat değil, seni besleyen bir hayat.'
    }
  },
  C: {
    low: {
      label: 'Düşük (esnek, spontane)',
      text: 'Yapıya değil akışa göre yaşıyorsun. Yaratıcı olabilirsin ama hedeflere ulaşmak zorlaşabilir. Planlı değilsin — iyi ve kötü yönüyle.',
      kaizen: 'Günlük kaldıraçları ÇOK KÜÇÜK başlat — "her gün 5 dakika yaz" gibi. Büyük planlar seni ezer. Kaizen\'in mantığı tam senin için.'
    },
    mid: {
      label: 'Orta',
      text: 'Planlı olabiliyorsun ama zorlandığında vazgeçebiliyorsun. Hedeflere sadakatin durumsal — motivasyon varsa çok iyi, yoksa zor.',
      kaizen: 'Streak\'e bağlan. Ardışık gün sayısı sende motivasyon yaratır — tutarlılık bir kez oluşunca kendini besler.'
    },
    high: {
      label: 'Yüksek (disiplinli)',
      text: 'Planlı, güvenilir, hedef odaklısın. Söz verdiğinde tutan biri. Kaizen\'in ritmi sana doğal gelir. Dikkat: mükemmellikçilik tuzağına düşme.',
      kaizen: '"Sessizliğe Hakkım Var" anlayışını benimse — bir gün kaçırmak dünyanın sonu değil. Esneklik, disiplinden kolay gelmez sana.'
    }
  },
  N: {
    low: {
      label: 'Düşük (sakin, dengeli)',
      text: 'Duygusal olarak dengeli, sakin, stres altında bile stabil kalıyorsun. Yıkılmaz bir karakter. Ama bazen duygularından uzak kalma riski olabilir.',
      kaizen: 'Duygusal farkındalık için "bugün neye canlı hissettim?" sorusu önemli — denge bazen hissizliğe dönüşebilir.'
    },
    mid: {
      label: 'Orta (normal dalgalanmalar)',
      text: 'Bazı günler iyi, bazıları zor — insan olmanın normal seyrinde bir yerdesin. Yoğun stresle yüzleşince zorlanabilirsin ama genelde tutunursun.',
      kaizen: 'Örüntü algılayıcı senin için değerli — hangi dönemlerde düşüşe girdiğini fark edersen önlem alabilirsin.'
    },
    high: {
      label: 'Yüksek (duygusal yoğunluk)',
      text: 'Duyguların yoğun — bu bir güç (empati, sezgi, yaratıcılık) ama stres dönemlerinde seni zorlayabilir. Kolay etkilenirsin. Duygularınla yaşamayı öğrenmek senin yolun.',
      kaizen: 'Gün içi kontrolleri kaçırma — duyguların patlamadan önce fark etmek, patladıktan sonra temizlemekten kolay. Günlük sekmesi senin için can simidi.'
    }
  },
  O: {
    low: {
      label: 'Düşük (somut, pratik)',
      text: 'Alışılmış, denenmiş, pratik olanı seviyorsun. Soyut fikirlere değil, somut sonuçlara yönelirsin. Güvenilir, yere basan birisin.',
      kaizen: 'Vizyonunu soyut tutma — "mutlu olmak" değil, "her Cumartesi dağa çıkmak". Somut olduğunda sende çalışır.'
    },
    mid: {
      label: 'Orta',
      text: 'Hem yeni fikirlere açıksın hem pratikliği seversin. Bir ayağın yerde, bir ayağın hayalde. Dengeli bir keşifçi.',
      kaizen: 'Vizyonunu 3 ayda bir gözden geçir — evrilsin ama savrulmasın. "Kaizen" felsefesi sana çok uygun.'
    },
    high: {
      label: 'Yüksek (meraklı, yaratıcı)',
      text: 'Meraklı, yaratıcı, derin düşünensin. Yeni fikirleri kovalıyor, sanat ve felsefeyi seviyorsun. Ama bazen "başlamadan düşünme" tuzağına düşebilirsin.',
      kaizen: 'Vizyonunu çok karmaşıklaştırma. Dan Koe\'nun felsefesi tam senin için: "hazır hissetmeyi bekleme, başla". Hareket, düşünceden ağırdır sende.'
    }
  }
};

// Genel profil sentezi — skorlara göre tek paragraf
function generateProfileSummary(scores) {
  const getLvl = (s) => s < 2.5 ? 'low' : s > 3.5 ? 'high' : 'mid';
  const parts = [];

  const E = getLvl(scores.E);
  const A = getLvl(scores.A);
  const C = getLvl(scores.C);
  const N = getLvl(scores.N);
  const O = getLvl(scores.O);

  if (C === 'high') parts.push('Hedeflerini takip eden <em>disiplinli</em> biriyim');
  else if (C === 'low') parts.push('<em>Esnek ve spontane</em> biriyim');
  else parts.push('Planlılıkla esneklik arasında <em>dengeli</em> biriyim');

  if (O === 'high') parts.push('yeni fikirlere <em>çok açığım</em>');
  else if (O === 'low') parts.push('<em>somut ve pratik</em> düşünürüm');

  if (A === 'high') parts.push('insanlarla <em>uyumluyum</em>');
  else if (A === 'low') parts.push('fikrimi <em>açıkça söylerim</em>');

  if (E === 'high') parts.push('sosyal ortamlarda <em>canlanırım</em>');
  else if (E === 'low') parts.push('<em>kendi alanıma</em> çekilirim');

  if (N === 'high') parts.push('ama stres anlarında <em>kırılganlaşabiliyorum</em>');
  else if (N === 'low') parts.push('ve <em>sakin</em> kalmayı başarırım');

  return parts.join(', ') + '.';
}



// ---------- DERTLEŞME (VENTİNG) — 6 kategori × 10 vurucu soru ----------
// Kişi bir konu seçer, 10 sorudan istediğini (hepsini veya bazılarını) cevaplar.
// Her soru uzun yazım davet eden, içe dönüşü tetikleyen tarzda.
const VENT_CATEGORIES = [
  {
    key: 'aile',
    name: 'Aile',
    sub: 'Anne, baba, kardeş, akraba. Kurduğun ve miras aldığın bağlar.',
    color: 'copper',
    questions: [
      'Ailenle olan ilişkin seni hangi yönde şekillendirdi? Onlardan miras aldığın ama kendinde hiç istemediğin bir kalıp var mı? Hâlâ o kalıba göre mi yaşıyorsun, yoksa kırmaya çalışıyor musun?',
      'Ailende söylenmemiş, ama herkesin bildiği bir gerçek var mı? Bu sessizlik sana ne öğretti? Söylemek isteyip söyleyemediğin bir şey, kime söylemek istiyorsun aslında?',
      'Annenle ilişkin bugünkü kadınla/erkekle ilişkine nasıl yansıdı? Onun seni sevmediği ya da yeterince görmediği bir yön var mı? Şu an partnerinden onu mu arıyorsun?',
      'Babanla ilişkin seni nasıl şekillendirdi? Ondan öğrendiğin ama ağır gelen bir şey var mı? Onun yerinde olsaydın, kendi çocuğuna ne yapardın, ne yapmazdın?',
      'Kardeşinle aranızda hiç konuşulmayan ama ikinizin de bildiği bir kırgınlık ya da rekabet var mı? Sen onu, o seni ne zaman en çok incitti?',
      'Ailen seni "ne olarak" görüyor? O kimlik sana uyuyor mu, yoksa rol yapıyor musun? Gerçek olsan, kim olurdun?',
      'Çocukluğunda hiç anlatmadığın, içine attığın bir anı var mı? Bugün o çocuğa ne söylemek isterdin?',
      'Ailenden uzaklaştığını, soğuduğunu hissettiğin oldu mu? Bunun sebebi sen miydin, onlar mı, yoksa hayatın akışı mı? Pişman olduğun bir mesafe var mı?',
      'Ailenin içinde "kurban" gibi davranan biri var mı? Bu rolü neden bırakmıyor sence? Sen de bazen aynı rolü mü oynuyorsun?',
      'Eğer bugün ailenden birine mektup yazsan ve o asla okumayacak olsa, kime yazardın ve ne derdin?'
    ]
  },
  {
    key: 'sevgili',
    name: 'Sevgili / Eş',
    sub: 'Partner ilişkin. Aşk, kırılganlık, vazgeçiş, bağlanma.',
    color: 'crimson',
    questions: [
      'Eşinin/sevgilinin doğru kişi olduğunu düşünüyor musun? Değilse neden hâlâ birliktesiniz? Seni ona bağlayan, ayrılamadığın bir nokta mı var? Vazgeçememe sebebin sen misin, yoksa o mu? Onunla tekrar karşılaşsan yine sevgili olmak ister miydin?',
      'Onu en son ne zaman gerçekten görmüştün, "vay, bu insan" diyerek? Şimdi ne değişti? Seni mi değiştirdi, onu mu, yoksa ikinizi de zaman mı?',
      'Onunla olmasaydın kim olurdun? Sana kattığı bir şey mi daha çok, götürdüğü bir şey mi? Kendi sesini hâlâ duyabiliyor musun onunla birlikteyken?',
      'Hiç söyleyemediğin bir şey var mı ona? Neden söylemiyorsun — korktuğun ne? Söylesen ne olur? Söylemezsen ne oluyor şu an?',
      'Onu gerçekten affettiğin oldu mu bir kırgınlık üzerine — yoksa sadece "geçiştirdin" mi? İçinde hâlâ biriken bir defter var mı?',
      'Beraber olduğunuz günün %80\'i nasıl geçiyor? O %80 seni besliyor mu, yoksa sadece %20\'lik "iyi anlar" için mi katlanıyorsun? Kendine yalan söylüyor olabilir misin?',
      'Eğer bu ilişki yarın bitse, en çok neye üzülürdün? En çok neye — itiraf etmekten çekindiğin de olsa — rahatlardın?',
      'Ondan gizlediğin bir yanın var mı — duygusal, zihinsel, fiziksel? Neden gizliyorsun? Bilse ne olurdu sence?',
      'Beraber bir geleceğiniz olduğunu hayal ettiğinde canlılıkla mı, mecburiyetle mi hayal ediyorsun? "Olması gereken" mi yoksa "istediğin" mi?',
      'Ona bugün yazsaydın ve hiç kızmayacağını, incinmeyeceğini bilseydin — sana söylemen gereken en önemli cümle ne olurdu?'
    ]
  },
  {
    key: 'is',
    name: 'İş / Kariyer',
    sub: 'Mesleğin, zamanın, paran. Yaptığın işle kim olduğun arasındaki boşluk.',
    color: 'sage',
    questions: [
      'Şu an yaptığın iş, 5 yıl sonraki seni gururlandırır mı? Yoksa sırf maaş için katlandığın bir zaman mı? İçin sızlıyor mu, rahat mı?',
      'İşte olduğun "kişi" ile özelde olduğun "kişi" aynı mı? Değilse hangisi gerçek? Maskeni ne zaman takıp çıkardığını fark ediyor musun?',
      'Para sana ne ifade ediyor — özgürlük mü, korku mu, statü mü, hayatta kalma aracı mı? Paran hakkında anneyle/babanla aynı şekilde mi düşünüyorsun? Bu miras, sana bir yük mü?',
      'Bugün işten hiç gelmesen, kimse seni aramasa, hiçbir şey olmasa — ne hissederdin? Rahatlama mı, boşluk mu, suçluluk mu?',
      'Hayalindeki işi yapmanı engelleyen gerçek şey ne? Para mı, korku mu, yetenek eksikliği mi, yoksa "ya başarısız olursam?" mı? Kendine dürüst ol.',
      'Bugüne kadar işte verdiğin en büyük taviz neydi? Değer miydi? Aynısını bugün tekrar verir miydin?',
      'İşinde başarılı olsan bile mutlu olamayacağını biliyor olabilir misin? Başarı ne demek sana — başkaları için mi, kendin için mi?',
      'Çocukluğunda "ne olmak istiyorsun?" sorusuna verdiğin cevap neydi? Bugün ondan ne kadar uzaksın? Yakınlaşmanı engelleyen sen misin?',
      'İşine kim olarak gidiyorsun — aç bir insan mı, tok bir insan mı? Aç gidiyorsan neyin eksik? Ton gidiyorsan ne sayesinde?',
      'Yarın işini bıraksan, 1 yıl sonra hayatın nasıl olurdu? En kötü ihtimal ne? Orada olsan gerçekten biterdin miydi, yoksa kendini yeniden mi kurardın?'
    ]
  },
  {
    key: 'arkadas',
    name: 'Arkadaşlık',
    sub: 'Gerçek dostlar, sahte yakınlıklar, yalnızlık, sosyal çevre.',
    color: 'violet',
    questions: [
      'Gerçekten seni tanıyan kaç kişi var hayatında? Bu sayı seni üzüyor mu, rahatlatıyor mu? Daha fazla olsun ister miydin, ama uğraşmak istemiyor musun?',
      'Kaç kişiye, kalbini açtığında reddedilmeyeceğini bilerek açabilirsin? Bu güveni nasıl kurdun? Kuramadığın birine neden kuramadın?',
      'Sosyal medya dışında son ne zaman bir arkadaşınla uzun bir sohbet ettin — gerçekten? Bu iletişimsizlik senin mi seçimin, hayatın mı götürdüğü?',
      'Seni incitmiş ama hâlâ hayatında olan bir arkadaş var mı? Neden gitmesine izin vermiyorsun? Alışkanlık mı, bağlılık mı, yoksa "başkasını bulamam" korkusu mu?',
      'Sen hangi arkadaşının hayatında bir yer kaplıyorsun? Onun için neyi temsil ediyorsun sence? Bu rol sana uyuyor mu?',
      'Yalnız kalmaktan korkuyor musun? Yalnızlık mı, yalnızlığın anlamı mı, yoksa "kimse beni sevmez" düşüncesi mi daha çok ağır geliyor?',
      'Arkadaşlarının arasında "gerçek sen" olduğunu hissediyor musun, yoksa gruba uymak için bir rol mü oynuyorsun? Bu maskeyi çıkarmak sana neye mal olur?',
      'Çocukluk arkadaşlarından biriyle tekrar karşılaşsan, o sana "çok değiştin" dese — değişimini savunur muydun, utanır mıydın?',
      'Biriyle küsüp konuşmuyorsan, gerçekten kızgınlık mı, yoksa "pes etmek" gururuna mı ağır geliyor? İlk adımı sen atsan ne olurdu?',
      'Kendini "iyi bir arkadaş" olarak tanımlıyor musun? Senin için en son birisi ne yaptı — gerçekten yaptı mı, yoksa beklenti miydi?'
    ]
  },
  {
    key: 'kendimle',
    name: 'Kendimle',
    sub: 'Öz değer, korku, beden, öz eleştiri. En çok kimi eleştiriyorsun — sen kendini.',
    color: 'crimson',
    questions: [
      'Kendin hakkında başkalarına hiç söylemediğin bir gerçek var mı? Niye sakladın? Bilse kimse daha az mı severdi seni?',
      'Aynaya baktığında ne görüyorsun — seveni mi, yabancıyı mı? Ne zaman "bu ben değilim" hissine kapılıyorsun?',
      'Kendinle nasıl konuşuyorsun — bir dost gibi mi, bir düşman gibi mi? İç sesini tanısan, onu sevebilir misin?',
      'En çok neden korkuyorsun — gerçekten? Başarısız olmaktan mı, sevilmemekten mi, yanlış yaşamaktan mı, ölmekten mi? Bu korku nereden geldi?',
      'Eğer yarın uyansan ve kimse seni tanımasa, hiçbir geçmişin olmasa — kim olmak isterdin? Şu anki senden ne kadar farklı?',
      'Bedeninle ilişkin nasıl? Onu kullanıyor musun, taşıyor musun, cezalandırıyor musun, görmezden mi geliyorsun? Bu ilişki ne zaman kuruldu?',
      'Kendine yeterli olduğunu hissettiğin bir alanın var mı? Yoksa her şeyde "yetmiyorum" mu diyorsun? Bu "yetmeme" hissinin sesi, çocukluğundaki kimin sesi?',
      'Sevdiğin bir yönün ile utandığın bir yönün yan yana dursa, ikisi birlikte "sen"i oluşturuyor mu? Yoksa birini gizleyip diğerini mi sergiliyorsun?',
      'Bir hata yaptığında kendini ne kadar affediyorsun? Ya da günlerce, haftalarca üzerine düşünüyor musun? Başkası aynı hatayı yapsa, ona da aynı sertlikle bakar mıydın?',
      'Şu an bu satırları okuyan "sen"e 5 yaşındaki sen mektup yazsa, ne derdi? Ondan kim olmaya söz vermiştin, onu tuttun mu?'
    ]
  },
  {
    key: 'gecmis',
    name: 'Geçmiş',
    sub: 'Pişmanlıklar, affedememe, kırgınlıklar. Taşıdığın ve bırakamadığın yükler.',
    color: 'ash',
    questions: [
      'Hayatının en çok pişman olduğun kararı ne? O anda gerçekten seçenek var mıydı, yoksa sen o sen olduğun için başka seçim yapamaz mıydın? Kendini affettin mi?',
      'Affedemediğin biri var mı? Onu affetmediğin için kim daha çok acı çekiyor — o mu, sen mi? Onu içinde taşımanın bedeli ne?',
      'Keşke yapmasaydım dediğin bir şey var mı? O anın sana öğrettiği bir şey oldu mu? Olmasaydı bugünkü sen olur muydun?',
      '"Zaman iyi geldi" dediğin yaralar gerçekten iyileşti mi, yoksa kapandı mı sadece? Bazı anılar geldiğinde hâlâ eski acıyı hissediyor musun?',
      'Geçmişindeki bir olay, bugünkü kararlarını hâlâ şekillendiriyor mu? Seni o olay mı, o olaya verdiğin anlam mı bağlıyor?',
      'Hiç intikam almak istediğin biri oldu mu? Almasaydın, içinde ne değişirdi? Almadıysan, neden almadın — korkudan mı, değer vermemekten mi, kibarlıktan mı?',
      'Geçmişe bir cümle söyleyebilsen, hangi ana ve ne söylerdin? O anı değiştirmek istemekten çok, kendini anlatma isteğiyle mi söylüyor olurdun?',
      'Hiç çocukken hayal ettiğin "büyüdüğümde" resmiyle şu an arasındaki farka bakıyor musun? Bu farka üzülmek mi daha doğru, gurur duymak mı, yoksa her ikisi de mi?',
      'Yaşamadığın bir hayat var mı içinde? "Şu yolu seçseydim" dediğin — hangisi? O hayali neden bırakmadın? O hayal seni şu an tutan şey olabilir mi?',
      'Ölmeden önce ne olmuş olmak istersin? Bu sorunun cevabı bugünkü seninle uyumlu mu? Yoksa bugünkü sen, o ideale giden yolda bir duraklama mı?'
    ]
  }
];



// ES modül olarak dışa aç — app.js import eder
export { SLOGANS, QUOTES, QUESTIONS, TIME_SLOTS, STOPWORDS, GUIDE_ARTICLES, BFI_QUESTIONS, BFI_DIMENSIONS, BFI_INTERPRETATIONS, generateProfileSummary, VENT_CATEGORIES };
