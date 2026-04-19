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
  { a: 'Gölgeni tanı,', b: 'kaç.' },
  { a: 'Sözün değil,', b: 'tekrarların seni yapar.' },
  { a: 'Zincir kırılır,', b: 'her gün biraz.' },
  { a: 'Korkunu yaz,', b: 'büyüsü kaçsın.' },
  { a: 'Henüz değil,', b: 'ama yolda.' },
  { a: 'Sadece bugün.', b: 'Yarın yarın gelir.' },
  { a: 'Kaçış da bir cevaptır,', b: 'görmek yeter.' },
  { a: 'Küçük söz,', b: 'büyük eylem.' },
  { a: 'Değişim sessizdir,', b: 'dinlemeyi bil.' },
  { a: 'İlerlemek yavaşlıktır,', b: 'hep aynı yönde.' },
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
    { id: 'g3', q: 'Nefret ettiğim hayata mı, istediğim hayata mı doğru hareket ediyorum?', hint: 'Bu an bir oya dönüşüyor. Son 30 dakikan, 5 yıl sonraki hangi Salı\'ya çıkıyor? Gölgene mi, vizyonuna mı? Şu anki yön gerçek yöndür.' },
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
    { id: 'ay1', q: 'Bu ay anti-vizyonuma ne kadar yaklaştım?', hint: '1-10 arası. Korktuğun o hayata benzeyen davranışların hangileriydi bu ay? Sert ol — kaçtığını bilirsen, yönünü düzeltmek kolay.' },
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
      <p>İlk girdiğinde karşına çıkar. Vizyonunun, gölgenin, kimliğinin temelini atarsın. 20-30 dakika sürer. Bir oturuşta bitirmek zorunda değilsin — kaldığın yerden devam edersin.</p>
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
    title: 'Anti-vizyon (Gölge) nasıl yazılır?',
    lead: 'Kaçtığın hayat, gideceğin hayattan çoğu zaman daha güçlü motive eder.',
    body: `
      <p>İnsanlar "pozitif motivasyon"u över, ama sinir sistemi <em>kaybetmek</em> riskine çok daha güçlü tepki verir. Gölgeni yazmak, bu yüzden vizyonun kadar önemlidir.</p>
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
      <blockquote>"Gölgeni tanıyana kadar ondan kaçamazsın. Tanıdığında ise kaçmana gerek kalmaz."</blockquote>
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

// ES modül olarak dışa aç — app.js import eder
export { SLOGANS, QUOTES, QUESTIONS, TIME_SLOTS, STOPWORDS, GUIDE_ARTICLES };
