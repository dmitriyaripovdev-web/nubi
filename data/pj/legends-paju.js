// ============================================================
// Легенды Пхаджу (파주). Тексты пересказаны своими словами.
// Источники (проверено 27.11.2026):
//   Энциклопедия корейской культуры (encykorea.aks.ac.kr): 용미리 마애이불입상, 화석정, 심지원 묘, 감악산, 혜음원지, 관미성
//   Корейская организация туризма (ktriptips / visitkorea): 파평용연, 반구정, 보광사
//   Газеты: 경향신문 2001-06-28 (심학산), 경북매일 2014-08-21 (윤관 и карпы)
// Координаты: поиск Kakao, сверены с адресами из источников.
// wish:true — место, куда по традиции приходят молиться и загадывать желания (здесь можно повесить фонарик).
// approx:true — гора или большая территория, печать в радиусе 1 км.
// Файл района (data/<район>/): загружает js/datastore.js по мере надобности.
// ============================================================
Data.put("legends", [

// ---------- Два будды Ёнми-ри ----------
{id:"pj_yongmi", region:"pj", wish:true, lat:37.754193, lng:126.864582, // Kakao: 파주용미리마애이불입상 (광탄면 용미리 산8)
 name:{ko:"용미리 마애이불입상", ru:"Два каменных будды Ёнми-ри", en:"Twin Rock Buddhas of Yongmi-ri"},
 place:{ko:"파주시 광탄면 용미리", ru:"Пхаджу, Квантхан-мён, Ёнми-ри", en:"Yongmi-ri, Gwangtan-myeon, Paju"},
 legend:{
  ko:"고려 선종에게는 오랫동안 아들이 없었습니다. 왕은 원신궁주를 새 왕비로 맞았지만 아이는 여전히 생기지 않았습니다.\n\n어느 날 밤, 궁주의 꿈에 두 스님이 나타나 말했습니다. “우리는 장지산 남쪽 기슭 바위틈에 사는데, 몹시 배가 고프오.” 이튿날 사람을 보내 보니, 정말로 그 산 아래에 커다란 바위 두 개가 나란히 서 있었습니다.\n\n왕은 그 바위에 꿈속의 두 스님을 새기고 절을 지었습니다. 그리고 바로 그해, 기다리던 왕자 한산후가 태어났다고 전해집니다.",
  ru:"У корёского короля Сонджона долго не было сына. Он взял новую супругу, Вонсин-гунджу, но детей всё не было.\n\nОднажды ночью ей приснились два монаха. «Мы живём в расщелине скалы на южном склоне горы Чанджисан, — сказали они, — и очень голодны». Наутро туда послали людей — и правда, у подножия горы рядом стояли две огромные скалы.\n\nКороль велел высечь на скалах двух монахов из сна и построить храм. Говорят, в тот же год родился долгожданный принц Хансан-ху.",
  en:"King Seonjong of Goryeo had long been without a son. He took Princess Wonsin as a new consort, but still no child came.\n\nOne night two monks appeared in her dream. “We live in a crack in the rocks on the southern slope of Mount Jangji,” they said, “and we are very hungry.” Men were sent the next day, and there at the foot of the mountain stood two great rocks side by side.\n\nThe king had the monks from the dream carved into the rocks and built a temple. That very year, the story goes, the long-awaited prince Hansan-hu was born."},
 fact:{
  ko:"두 불상은 높이가 약 17.4m로, 자연 암벽을 몸체로 삼고 머리와 갓은 따로 만들어 얹었습니다. 1963년 보물로 지정되었습니다. 전설 때문에 고려 시대 작품으로 여겨 왔지만, 바위에서 ‘성화 7년(1471)’이라는 글자가 발견되어 조선 초기에 만들어졌다는 견해도 있습니다.",
  ru:"Высота фигур — около 17,4 м. Тела высечены прямо в скале, а головы и шапки сделаны отдельно и поставлены сверху. В 1963 году будды признаны национальным сокровищем (보물). Из-за легенды их считали работой эпохи Корё, но на скале нашли надпись «7-й год Сонхва» (1471), поэтому есть мнение, что их создали в начале Чосона.",
  en:"The two figures stand about 17.4 m tall: the bodies are carved into the natural rock face, while the heads and hats were made separately and set on top. They were designated a Treasure in 1963. The legend made people date them to Goryeo, but an inscription reading “7th year of Chenghua” (1471) found on the rock suggests they may come from early Joseon."},
 find:{
  ko:"두 불상의 모자 모양을 비교해 보세요. 둥근 갓과 네모난 갓이 다릅니다.",
  ru:"Сравните головные уборы двух будд: у одного круглая шапка, у другого — квадратная.",
  en:"Compare the two hats: one is round, the other square."}},

// ---------- Павильон Хвасокчон ----------
{id:"pj_hwaseokjeong", region:"pj", lat:37.887886, lng:126.805357, // Kakao: 화석정 (파평면 율곡리 산100-1)
 name:{ko:"화석정", ru:"Павильон Хвасокчон", en:"Hwaseokjeong Pavilion"},
 place:{ko:"파주시 파평면 율곡리 (임진강 가)", ru:"Пхаджу, Пхапхён-мён, Юльгок-ри, берег реки Имджин", en:"Yulgok-ri, Papyeong-myeon, Paju, on the Imjin River"},
 legend:{
  ko:"율곡 이이는 임진강 나루 위에 정자를 짓고 ‘화석정’이라 이름 붙였습니다. 그는 틈날 때마다 사람을 시켜 정자의 마루를 기름 걸레로 닦게 했습니다. 사람들은 그 까닭을 몰랐습니다.\n\n이이는 세상을 떠나기 전, 어려운 때가 오면 열어 보라며 봉한 편지를 남겼습니다.\n\n임진왜란이 일어나 선조가 피난길에 올랐습니다. 비 내리는 밤, 임진강 나루에 이르렀지만 앞이 보이지 않아 강을 건널 수 없었습니다. 그때 한 신하가 편지를 열자 이렇게 적혀 있었습니다. “화석정에 불을 지르라.” 기름을 먹은 정자는 크게 타올라 강을 밝혔고, 임금 일행은 무사히 강을 건넜다고 합니다.",
  ru:"Учёный Юльгок Ли И построил над переправой через Имджин павильон и назвал его Хвасокчон. Время от времени он велел натирать пол павильона тряпкой, пропитанной маслом. Зачем — никто не понимал.\n\nПеред смертью Ли И оставил запечатанное письмо и велел открыть его, когда придут тяжёлые времена.\n\nНачалась Имджинская война, и король Сонджо бежал на север. Дождливой ночью он вышел к переправе, но в темноте нельзя было переправиться. Тогда один из сановников вскрыл письмо. Там было написано: «Подожгите Хвасокчон». Пропитанный маслом павильон вспыхнул и осветил реку, и королевский отряд благополучно переправился.",
  en:"The scholar Yulgok Yi I built a pavilion above the Imjin River ferry and named it Hwaseokjeong. From time to time he had the floor wiped with an oil-soaked rag. No one understood why.\n\nBefore he died, Yi I left a sealed letter, to be opened when hard times came.\n\nWhen the Imjin War broke out, King Seonjo fled north. On a rainy night he reached the ferry, but it was too dark to cross. A minister opened the letter. It said: “Set fire to Hwaseokjeong.” The oil-soaked pavilion blazed up and lit the river, and the royal party crossed safely."},
 fact:{
  ko:"화석정은 율곡 이이가 자주 머물며 시를 짓고 제자들과 이야기를 나누던 곳입니다. 임진왜란 때 불탄 뒤 여러 번 다시 지어졌고, 지금의 건물은 한국전쟁 뒤 복원한 것입니다. 정자 앞에서 임진강이 크게 굽이칩니다.",
  ru:"Здесь Ли И часто бывал: писал стихи и беседовал с учениками. Павильон сгорел во время Имджинской войны, его не раз отстраивали заново. Нынешнее здание восстановлено после Корейской войны. Прямо под павильоном Имджин делает большую петлю.",
  en:"Yi I often stayed here, writing poems and talking with his students. The pavilion burned during the Imjin War and was rebuilt several times; the present building was restored after the Korean War. Below it, the Imjin River makes a wide bend."},
 find:{
  ko:"정자 앞 큰 느티나무 아래에서 임진강을 내려다보세요. 그날 밤 임금이 건넌 나루가 바로 이 아래였습니다.",
  ru:"Встаньте под большой дзельквой у павильона и посмотрите вниз на Имджин: та самая переправа была прямо под вами.",
  en:"Stand under the big zelkova by the pavilion and look down at the Imjin: the ferry the king crossed that night was right below."}},

// ---------- Пруд Ёнён: рождение рода Пхапхён Юн ----------
{id:"pj_yongyeon", region:"pj", lat:37.928518, lng:126.846337, // Kakao: 파평용연 (파평면 눌노리 385-1); visitkorea: 37.92855, 126.84631
 name:{ko:"파평 용연", ru:"Пруд дракона Пхапхён Ёнён", en:"Papyeong Yongyeon Pond"},
 place:{ko:"파주시 파평면 눌노리", ru:"Пхаджу, Пхапхён-мён, Нулло-ри", en:"Nullo-ri, Papyeong-myeon, Paju"},
 legend:{
  ko:"893년 음력 8월 보름, 안개 낀 연못 위로 금빛 상자 하나가 떠올랐습니다. 이웃에 사는 윤씨 할머니가 상자를 건져 열어 보니, 그 안에 옥빛 털에 싸인 사내아기가 있었습니다.\n\n아기의 양 어깨에는 붉은 점이, 겨드랑이에는 비늘 같은 무늬 81개가, 발바닥에는 북두칠성 모양의 점이 있었습니다. 아이는 자라서 높은 벼슬에 올랐고, 파평 윤씨의 시조 윤신달이 되었다고 합니다.\n\n윤씨 가문에는 또 하나의 이야기가 전합니다. 후손인 윤관 장군이 전쟁에서 적에게 쫓겨 강가에 이르렀을 때, 잉어 떼가 모여 다리를 놓아 장군을 건네주었다는 것입니다. 그래서 파평 윤씨는 은혜를 잊지 않으려고 잉어를 먹지 않는다고 전해집니다.",
  ru:"В 893 году, в пятнадцатый день восьмой луны, над затянутым туманом прудом всплыл золотой ларец. Соседка, бабушка Юн, достала его и открыла. Внутри лежал мальчик, завёрнутый в мех цвета нефрита.\n\nНа плечах у малыша были красные отметины, под мышками — 81 узор, похожий на чешую, а на ступнях — родинки в форме Большой Медведицы. Мальчик вырос, стал важным сановником и основателем рода Пхапхён Юн — Юн Синдалем.\n\nВ роду Юн хранят и другое предание. Потомок Юн Синдаля, полководец Юн Гван, уходя от погони, оказался у реки. Тогда стая карпов собралась и выстроила для него мост. С тех пор, говорят, Пхапхён Юн не едят карпов — в благодарность.",
  en:"In 893, on the fifteenth day of the eighth lunar month, a golden box rose from the misty pond. A neighbour, Grandmother Yun, pulled it out and opened it. Inside lay a baby boy wrapped in jade-coloured fur.\n\nHe had red marks on both shoulders, 81 scale-like patterns under his arms and dark spots shaped like the Big Dipper on his soles. The boy grew up to hold high office and became Yun Sin-dal, founder of the Papyeong Yun clan.\n\nThe clan keeps another story too. When his descendant, General Yun Gwan, was chased to a riverbank by the enemy, a shoal of carp gathered into a bridge and carried him across. That is why, it is said, the Papyeong Yun do not eat carp."},
 fact:{
  ko:"용연은 파평 윤씨 시조의 탄생 설화가 깃든 연못으로, 지금도 연못가에 ‘파평윤씨발상지’ 비석이 서 있습니다. 파평(坡平)이라는 본관 이름도 이 지역 이름에서 왔습니다. 윤관(?~1111)은 고려의 장군으로, 여진을 정벌하고 동북 9성을 쌓은 인물입니다.",
  ru:"Пруд Ёнён связан с преданием о рождении основателя рода Пхапхён Юн. На берегу стоит стела «Место, где зародился род Пхапхён Юн». Само название рода — Пхапхён — взято от этой местности. Юн Гван (ум. 1111) — полководец Корё, ходил в походы против чжурчжэней и построил девять крепостей на северо-востоке.",
  en:"Yongyeon is tied to the birth legend of the Papyeong Yun clan's founder, and a stele by the water marks the clan's birthplace. The clan name Papyeong comes from this area. Yun Gwan (d. 1111) was a Goryeo general who campaigned against the Jurchen and built nine forts in the northeast."},
 find:{
  ko:"연못가의 ‘파평윤씨발상지’ 비석을 찾아보세요.",
  ru:"Найдите у пруда стелу «Место, где зародился род Пхапхён Юн».",
  en:"Find the stele marking the birthplace of the Papyeong Yun clan by the pond."}},

// ---------- Могила Юн Гвана и 400-летний спор ----------
{id:"pj_yungwan", region:"pj", lat:37.768581, lng:126.856868, // Kakao: 윤관장군묘 (광탄면 분수리 산4-1); 심지원묘 37.767909, 126.85856
 name:{ko:"윤관 장군 묘", ru:"Могила полководца Юн Гвана", en:"Tomb of General Yun Gwan"},
 place:{ko:"파주시 광탄면 분수리", ru:"Пхаджу, Квантхан-мён, Пунсу-ри", en:"Bunsu-ri, Gwangtan-myeon, Paju"},
 legend:{
  ko:"고려의 명장 윤관 장군의 묘는 오랜 세월 아무도 위치를 모를 만큼 잊혀 있었습니다. 그사이 조선의 영의정 심지원의 가족이 바로 그 위쪽에 묘를 썼습니다.\n\n뒤늦게 조상의 묘를 찾은 파평 윤씨 가문은 심씨 묘를 옮겨 달라고 했고, 청송 심씨 가문은 자기 조상의 묘를 지키려 했습니다. 두 가문의 ‘산송(묘지 다툼)’은 임금까지 나서도 쉽게 풀리지 않았고, 무려 400년 가까이 이어졌다고 전합니다.\n\n지금도 두 무덤은 같은 산자락에 나란히 남아 있습니다. 죽은 사람들은 말이 없지만, 산 사람들의 다툼은 몇백 년을 갔습니다.",
  ru:"Могила великого корёского полководца Юн Гвана со временем была забыта настолько, что никто не помнил, где она. За эти века семья чосонского первого министра Сим Дживона похоронила своих прямо над ней.\n\nКогда род Пхапхён Юн наконец отыскал могилу предка, он потребовал перенести захоронения Симов. Род Чхонсон Сим отстаивал своих. Этот «спор о горе» не смог разрешить даже король, и, по преданию, он тянулся почти 400 лет.\n\nДве могилы и сейчас лежат на одном склоне. Мёртвые молчат, а спор живых растянулся на столетия.",
  en:"The tomb of the great Goryeo general Yun Gwan was forgotten for so long that no one knew where it was. Meanwhile the family of the Joseon chief minister Sim Ji-won buried their dead right above it.\n\nWhen the Papyeong Yun clan finally found their ancestor's grave, they demanded that the Sim graves be moved; the Cheongsong Sim clan defended theirs. This “mountain grave dispute” could not be settled even by the king and, so the story goes, lasted nearly 400 years.\n\nThe two tombs still lie on the same slope. The dead are silent, but the quarrel of the living lasted for centuries."},
 fact:{
  ko:"윤관 장군 묘는 사적으로 지정되어 있습니다. 바로 곁의 심지원 묘와 신도비는 경기도 기념물로, 『한국민족문화대백과사전』도 두 가문의 산송이 조선 시대부터 약 400년 동안 이어졌다고 적고 있습니다. 1988년 윤관 묘를 정비하며 쌓은 담이 심지원 묘의 앞을 가리기도 했습니다.",
  ru:"Могила Юн Гвана — национальный исторический памятник (사적). Соседняя могила Сим Дживона со стелой — памятник провинции Кёнгидо. В «Энциклопедии корейской культуры» сказано, что спор двух родов длился около 400 лет, начиная с эпохи Чосон. В 1988 году при обустройстве могилы Юн Гвана построили стену, которая закрыла вид от могилы Сим Дживона.",
  en:"Yun Gwan's tomb is a national Historic Site; the neighbouring tomb and stele of Sim Ji-won are a Gyeonggi monument. The Encyclopedia of Korean Culture notes that the two clans' dispute lasted about 400 years from the Joseon period. A wall built in 1988 when Yun Gwan's tomb was restored even blocked the view from Sim Ji-won's grave."},
 find:{
  ko:"윤관 장군 묘에서 바로 옆 심지원 묘를 찾아보세요. 두 무덤이 얼마나 가까운지 직접 확인할 수 있습니다.",
  ru:"От могилы Юн Гвана найдите рядом могилу Сим Дживона и посмотрите, как близко они друг к другу.",
  en:"From Yun Gwan's tomb, find Sim Ji-won's grave next door and see how close the two are."}},

// ---------- Гора Камаксан ----------
{id:"pj_gamaksan", region:"pj", wish:true, lat:37.941219, lng:126.969921, approx:true, // Kakao: 감악산 (적성면 객현리), высота 674,9 м
 name:{ko:"감악산", ru:"Гора Камаксан", en:"Gamaksan"},
 place:{ko:"파주시 적성면 · 양주 · 연천 경계", ru:"Пхаджу, Чоксон-мён, на границе с Янджу и Ёнчхоном", en:"Jeokseong-myeon, Paju, on the Yangju–Yeoncheon border"},
 legend:{
  ko:"감악산(紺岳山)이라는 이름은 바위에서 검은빛과 푸른빛이 함께 흘러나왔다는 이야기에서 왔다고 합니다.\n\n이 산에는 당나라 장수 설인귀의 이야기도 전합니다. 산 위에는 설인귀를 모신 사당 ‘감악사’가 있었고, 사람들은 그를 산의 신처럼 받들었다고 합니다.\n\n정상에는 글자가 다 닳아 아무것도 읽을 수 없는 오래된 비석이 서 있습니다. 사람들은 이 비를 ‘빗돌대왕비’ 또는 ‘설인귀 비’라고 부르며 여러 이야기를 붙였습니다. 누가, 왜 세웠는지는 지금도 수수께끼입니다.",
  ru:"Название Камаксан — «Тёмно-синяя гора». Говорят, из её скал струился чёрный и синий свет.\n\nЗдесь живёт и предание о танском полководце Сюэ Жэньгуе (по-корейски Соль Ингви). На горе стояло святилище Камакса в его честь, и люди почитали его как горного духа.\n\nНа вершине стоит древняя стела, надпись на которой стёрлась целиком. Её называют «Стелой великого короля» или «Стелой Соль Ингви» и рассказывают о ней разное. Кто и зачем её поставил — загадка до сих пор.",
  en:"The name Gamaksan means “dark-blue peak”; it is said black and blue light once streamed from its rocks.\n\nThe mountain also keeps the story of the Tang general Xue Rengui (Seol In-gwi in Korean). A shrine, Gamaksa, stood here in his honour, and people revered him like a mountain spirit.\n\nOn the summit stands an ancient stele whose inscription has worn away completely. People call it the “Great King's Stele” or “Seol In-gwi's Stele” and tell many stories about it. Who put it up, and why, is still a mystery."},
 fact:{
  ko:"감악산은 높이 674.9m로 파주에서 가장 높은 산이며, 조선 시대에 나라에서 제사를 지내던 ‘경기 5악’ 가운데 하나였습니다. 정상의 비석은 글자가 없어 ‘몰자비’라고도 불리며, 북한산 진흥왕순수비와 모양이 비슷해 신라 때 비석이라는 견해도 있습니다. 감악사 사당은 지금 남아 있지 않습니다.",
  ru:"Высота Камаксана — 674,9 м, это самая высокая гора Пхаджу. В эпоху Чосон она входила в «пять священных гор Кёнгидо», где государство проводило обряды. Стелу на вершине называют ещё «стелой без иероглифов». По форме она похожа на стелу силлаского короля Чинхына на Пукхансане, поэтому некоторые учёные считают её силлаской. Святилище Камакса не сохранилось.",
  en:"At 674.9 m, Gamaksan is the highest mountain in Paju, and in Joseon times it was one of the “five sacred peaks of Gyeonggi” where the state held rites. The summit stele is also called the “stele without letters”; its shape resembles King Jinheung's stele on Bukhansan, so some scholars think it dates from Silla. The Gamaksa shrine no longer exists."},
 find:{
  ko:"정상에서 글자 없는 비석을 찾아 보세요. 손으로 만져 보면 정말 글자가 하나도 남아 있지 않습니다.",
  ru:"Найдите на вершине стелу без надписи. Проведите по ней рукой — не осталось ни одного знака.",
  en:"Find the blank stele on the summit. Run your hand over it — not a single character remains."}},

// ---------- Гора Симхаксан: где нашли журавлей ----------
{id:"pj_simhaksan", region:"pj", wish:true, lat:37.706816, lng:126.695561, approx:true, // Kakao: 심학산 (산남동 산42), высота 194 м
 name:{ko:"심학산", ru:"Гора Симхаксан", en:"Simhaksan"},
 place:{ko:"파주시 교하동 · 동패동 · 산남동", ru:"Пхаджу, район Кёха (Тонпхэ-дон, Саннам-дон)", en:"Gyoha area (Dongpae-dong, Sannam-dong), Paju"},
 legend:{
  ko:"조선 숙종 때의 일입니다. 궁궐에서 기르던 학 두 마리가 어느 날 날아가 버렸습니다. 왕이 아끼던 학이었기에 사람들이 사방으로 찾아 나섰습니다.\n\n그런데 한강과 임진강이 만나는 곳, 들판 끝에 홀로 솟은 작은 산에서 두 마리 학을 모두 찾아냈습니다. 그 뒤로 이 산은 ‘학을 찾은 산’, 곧 심학산(尋鶴山)이라 불리게 되었다고 전해집니다.",
  ru:"Это случилось при короле Сукчоне. Из дворца улетели два журавля, которых там держали. Король их очень любил, и люди искали журавлей повсюду.\n\nНашли обоих на небольшой горе, одиноко стоящей на краю равнины, там, где сливаются реки Ханган и Имджин. С тех пор, говорят, гору зовут Симхаксан — «Гора, где нашли журавлей».",
  en:"It happened in the reign of King Sukjong. Two cranes kept at the royal palace flew away one day. The king loved them, so people searched far and wide.\n\nBoth cranes were found on a small mountain rising alone at the edge of the plain where the Han and Imjin rivers meet. From then on, the story goes, it was called Simhaksan, “the mountain where the cranes were found.”"},
 fact:{
  ko:"심학산은 높이 194m의 낮은 산이지만, 주변에 높은 산이 없어 전망이 뛰어납니다. 정상 팔각정에서는 한강과 임진강이 만나는 모습과 북한산, 그리고 날이 맑으면 북한 개성 쪽까지 보입니다. 산 둘레에는 걷기 좋은 둘레길이 있습니다.",
  ru:"Симхаксан невысок, всего 194 м, но вокруг нет других гор, поэтому вид отсюда прекрасный. Из восьмиугольной беседки на вершине видно, как сливаются Ханган и Имджин, видна гора Пукхансан, а в ясную погоду даже окрестности Кэсона в Северной Корее. Вокруг горы проложена удобная кольцевая тропа.",
  en:"Simhaksan is only 194 m high, but with no other peaks around, the views are superb. From the octagonal pavilion on top you can see the Han and Imjin rivers meet, Bukhansan, and on clear days even the Gaeseong area in North Korea. A pleasant trail circles the mountain."},
 find:{
  ko:"정상 팔각정에서 서쪽을 보세요. 두 강이 하나로 만나는 곳이 보입니다. 학들도 이 풍경에 반했던 걸까요?",
  ru:"Посмотрите с беседки на вершине на запад: там две реки сливаются в одну. Может, журавлей привлёк именно этот вид?",
  en:"Look west from the summit pavilion and see two rivers become one. Perhaps that view is what drew the cranes."}},

// ---------- Павильон Бангуджон ----------
{id:"pj_bangujeong", region:"pj", lat:37.867853, lng:126.752712, // адрес 반구정로85번길 3 (Kakao); visitkorea: 37.86792, 126.75272
 name:{ko:"반구정", ru:"Павильон Бангуджон", en:"Bangujeong Pavilion"},
 place:{ko:"파주시 문산읍 (임진강 가)", ru:"Пхаджу, Мунсан-ып, берег реки Имджин", en:"Munsan-eup, Paju, on the Imjin River"},
 legend:{
  ko:"세종 대왕 곁에서 19년 동안 영의정을 지낸 황희 정승은 벼슬에서 물러난 뒤 임진강 가 절벽 위의 정자로 왔습니다.\n\n강가에는 갈매기들이 늘 모여들었습니다. 나라의 큰일을 평생 짊어졌던 노재상은 이제 갈매기를 벗 삼아 강을 바라보며 남은 날을 보냈습니다. 그래서 정자 이름도 ‘갈매기를 벗하는 정자’, 반구정(伴鷗亭)이 되었습니다.",
  ru:"Хван Хи 19 лет был первым министром при великом короле Седжоне. Уйдя в отставку, он поселился в павильоне на скале над рекой Имджин.\n\nНа берег постоянно слетались чайки. Старый министр, всю жизнь нёсший на себе дела страны, теперь проводил дни, глядя на реку в компании чаек. Отсюда и название — Бангуджон, «Павильон дружбы с чайками».",
  en:"Hwang Hui served as chief state councillor under King Sejong the Great for nineteen years. When he retired, he came to a pavilion on a cliff above the Imjin River.\n\nGulls always gathered on the shore. The old minister, who had carried the nation's affairs all his life, now spent his days watching the river with the gulls for company. Hence the name Bangujeong: “the pavilion of friendship with gulls.”"},
 fact:{
  ko:"황희(1363~1452)는 조선 초의 명재상으로, 세종 때 오랫동안 영의정을 맡았고 청렴하고 너그러운 인품으로 이름났습니다. 90세에 세상을 떠났습니다. 지금의 반구정은 한국전쟁 때 불탄 것을 다시 지은 것이며, 곁에 황희 선생 유적지와 영당이 있습니다.",
  ru:"Хван Хи (1363–1452) — знаменитый министр начала Чосона. При Седжоне он долго был первым министром и прославился честностью и добротой. Умер в 90 лет. Павильон сгорел в Корейскую войну и был отстроен заново. Рядом — мемориал Хван Хи и святилище с его портретом.",
  en:"Hwang Hui (1363–1452) was a renowned minister of early Joseon, long chief state councillor under Sejong and famous for his integrity and kindness. He died at 90. The pavilion burned during the Korean War and was rebuilt; next to it are the Hwang Hui memorial site and portrait shrine."},
 find:{
  ko:"정자에 올라 임진강을 바라보세요. 오늘도 갈매기가 보이나요?",
  ru:"Поднимитесь в павильон и посмотрите на Имджин. Видны ли сегодня чайки?",
  en:"Climb into the pavilion and look out over the Imjin. Can you see any gulls today?"}},

// ---------- Хеымвон: королевская гостиница Корё ----------
{id:"pj_hyeeumwon", region:"pj", lat:37.735385, lng:126.891885, // Kakao: 파주혜음원지 (광탄면 용미리 234-1)
 name:{ko:"혜음원지", ru:"Руины гостиницы Хеымвон", en:"Hyeeumwon Site"},
 place:{ko:"파주시 광탄면 용미리 (혜음령 아래)", ru:"Пхаджу, Квантхан-мён, Ёнми-ри, у перевала Хеымнён", en:"Yongmi-ri, Gwangtan-myeon, Paju, below Hyeeum Pass"},
 legend:{
  ko:"고려의 서울 개경과 남경(지금의 서울)을 오가는 길에는 험한 고개 혜음령이 있었습니다. 지친 나그네들이 이 고개에서 쉬어 갈 곳이 없어 큰 고생을 했습니다.\n\n그래서 1120년 무렵, 고개 아래에 나그네를 위한 숙소 ‘혜음원(惠蔭院)’이 세워졌습니다. 이름처럼 ‘은혜로운 그늘’이 되어, 관리도 백성도 이곳에서 쉬어 갔습니다. 숙소 곁에는 절과, 임금이 머무는 별궁까지 있었다고 합니다.\n\n수백 년 동안 땅속에 묻혀 있던 이곳은 1999년, ‘혜음원’이라는 글자가 새겨진 기와 한 장이 발견되면서 세상에 다시 모습을 드러냈습니다.",
  ru:"На дороге между корёской столицей Кэгён и Намгёном (нынешний Сеул) лежал трудный перевал Хеымнён. Усталым путникам негде было там отдохнуть.\n\nПоэтому около 1120 года у подножия перевала построили гостиницу Хеымвон — «Благодатная тень». Здесь отдыхали и чиновники, и простой народ. Рядом стояли храм и даже дворец, где останавливался король.\n\nСотни лет это место лежало под землёй. Его нашли в 1999 году, когда из земли достали черепицу с надписью «Хеымвон».",
  en:"On the road between the Goryeo capital Gaegyeong and Namgyeong (today's Seoul) lay the hard Hyeeum Pass, and weary travellers had nowhere to rest.\n\nSo around 1120 an inn called Hyeeumwon, “Kindly Shade”, was built below the pass. Officials and commoners alike rested here, and beside it stood a temple and even a palace where the king could stay.\n\nFor centuries the site lay buried. It was rediscovered in 1999, when a roof tile inscribed “Hyeeumwon” was dug up."},
 fact:{
  ko:"혜음원은 1120년(예종 15)에 짓기 시작해 약 2년 만에 완성되었습니다. 1999년부터 2004년까지 다섯 차례 발굴에서 건물터, 연못 다섯 곳, 금동여래상, 많은 기와와 도자기 조각이 나왔습니다. 13세기에 불탄 것으로 보이며, 2005년 사적으로 지정되었습니다. 옆에 방문자센터가 있습니다.",
  ru:"Строительство началось в 1120 году (15-й год правления Йеджона) и шло около двух лет. При пяти раскопках в 1999–2004 годах нашли фундаменты зданий, пять прудов, позолоченную статуэтку Будды, множество черепицы и осколков керамики. Похоже, комплекс сгорел в XIII веке. В 2005 году он признан историческим памятником (사적). Рядом есть центр для посетителей.",
  en:"Construction began in 1120 (the 15th year of King Yejong) and took about two years. Five excavations from 1999 to 2004 uncovered building foundations, five ponds, a gilt-bronze Buddha, and many roof tiles and ceramic shards. The complex seems to have burned in the 13th century. It became a Historic Site in 2005, and there is a visitor centre beside it."},
 find:{
  ko:"방문자센터에서 ‘혜음원’ 글자가 새겨진 기와 이야기를 찾아보세요. 이 기와 한 장이 모든 것을 밝혀냈습니다.",
  ru:"В центре для посетителей найдите рассказ о черепице с надписью «Хеымвон» — именно она раскрыла тайну.",
  en:"At the visitor centre, look for the story of the tile inscribed “Hyeeumwon” — the single tile that revealed it all."}},

// ---------- Храм Погванса и можжевельник Ёнджо ----------
{id:"pj_bogwangsa", region:"pj", wish:true, lat:37.752951, lng:126.92001, // Kakao: 보광사 대웅보전 (광탄면 영장리 13)
 name:{ko:"보광사", ru:"Храм Погванса", en:"Bogwangsa Temple"},
 place:{ko:"파주시 광탄면 영장리 (고령산)", ru:"Пхаджу, Квантхан-мён, гора Корёнсан", en:"Goryeongsan, Gwangtan-myeon, Paju"},
 legend:{
  ko:"조선의 임금 영조의 어머니 숙빈 최씨는 궁궐에서 가장 낮은 일을 하던 무수리 출신이었다고 전합니다. 왕이 된 뒤에도 영조는 어머니를 늘 그리워했습니다.\n\n어머니의 묘 소령원이 가까운 보광사를 어머니의 명복을 비는 절로 정하고, 절 안에 어머니의 위패를 모신 어실각을 세웠습니다. 그리고 그 앞에 향나무 한 그루를 손수 심었다고 합니다.\n\n300년 가까이 지난 지금도 그 향나무는 어실각 앞을 지키고 있습니다. 어머니를 그리는 아들의 마음처럼요.",
  ru:"Мать чосонского короля Ёнджо, госпожа Чхве, по преданию, начинала с самой простой работы во дворце — была служанкой-водоноской. Став королём, Ёнджо всю жизнь тосковал по матери.\n\nМогила матери, Сорёнвон, находится неподалёку, и король сделал храм Погванса местом молитв за её душу. Здесь построили павильон Осильгак с её поминальной табличкой. Перед ним, говорят, Ёнджо своими руками посадил можжевельник.\n\nПочти 300 лет спустя дерево всё ещё стоит у павильона — как любовь сына к матери.",
  en:"Lady Choe, mother of the Joseon king Yeongjo, is said to have begun as a palace maid of the lowest rank. Even as king, Yeongjo always missed his mother.\n\nHer tomb, Soryeongwon, lies nearby, so he made Bogwangsa the temple that prayed for her soul and built the Eosilgak shrine for her memorial tablet. In front of it, the story goes, he planted a juniper with his own hands.\n\nNearly 300 years later the juniper still guards the shrine, like a son's longing for his mother."},
 fact:{
  ko:"보광사는 894년 도선 국사가 세웠다고 전하는 오래된 절입니다. 임진왜란 때 불탔다가 다시 지어졌고, 1740년 무렵 숙빈 최씨 묘 소령원의 원찰이 되면서 대웅보전을 고치고 만세루를 세웠습니다. 대웅보전 바깥벽의 오래된 벽화도 유명합니다.",
  ru:"По преданию, Погванса основал в 894 году монах Тосон. Храм сгорел во время Имджинской войны и был отстроен. Около 1740 года он стал храмом при могиле матери Ёнджо, и тогда отремонтировали главный зал и построили павильон Мансеру. Известны и старинные росписи на внешних стенах главного зала.",
  en:"Bogwangsa is said to have been founded in 894 by the monk Doseon. It burned in the Imjin War and was rebuilt, and around 1740 it became the prayer temple for Lady Choe's tomb, when the main hall was repaired and the Manseru pavilion built. The old murals on the main hall's outer walls are also famous."},
 find:{
  ko:"어실각 앞의 향나무를 찾아보세요. 영조가 직접 심었다고 전하는 나무입니다.",
  ru:"Найдите можжевельник перед павильоном Осильгак — по преданию, его посадил сам король Ёнджо.",
  en:"Find the juniper in front of the Eosilgak shrine, said to have been planted by King Yeongjo himself."}},

// ---------- Крепость Одусансон ----------
{id:"pj_odusan", region:"pj", lat:37.771294, lng:126.677066, approx:true, // Kakao: 파주오두산성 (탄현면 성동리 산86); рядом 오두산통일전망대
 name:{ko:"오두산성", ru:"Крепость Одусансон", en:"Odusanseong Fortress"},
 place:{ko:"파주시 탄현면 성동리 (한강·임진강 합류 지점)", ru:"Пхаджу, Тханхён-мён, там, где сливаются Ханган и Имджин", en:"Seongdong-ri, Tanhyeon-myeon, Paju, where the Han and Imjin meet"},
 legend:{
  ko:"『삼국사기』에는 백제의 요새 관미성이 나옵니다. ‘사방이 가파르고 바닷물로 둘러싸인’ 난공불락의 성이었습니다.\n\n391년, 고구려의 광개토대왕은 군사를 일곱 길로 나누어 이 성을 쳤고, 20일 만에 마침내 함락시켰습니다. 2년 뒤 백제 장수 진무가 1만 군사로 되찾으려 했지만 끝내 실패했습니다.\n\n그 관미성이 어디였는지는 지금도 논쟁거리입니다. 그 가운데 하나가 바로 이곳, 한강과 임진강이 만나 바다로 흘러가는 물가의 오두산성이라는 견해입니다.",
  ru:"В хронике «Самгук саги» упоминается крепость Пэкче под названием Кванмисон: «отвесная со всех сторон и окружённая морской водой». Её считали неприступной.\n\nВ 391 году король Когурё Квангэтхо разделил войско на семь отрядов, двадцать дней штурмовал крепость и всё-таки взял её. Через два года полководец Пэкче Чинму с десятью тысячами воинов пытался её отбить, но не смог.\n\nГде стоял Кванмисон, спорят до сих пор. Одна из версий — здесь, в крепости Одусансон, у места, где Ханган и Имджин вместе уходят в море.",
  en:"The Samguk Sagi chronicle mentions Gwanmiseong, a Baekje fortress “steep on all four sides and surrounded by sea water” — thought to be impregnable.\n\nIn 391 King Gwanggaeto of Goguryeo split his army into seven columns and took it after a twenty-day assault. Two years later the Baekje general Jinmu tried to retake it with ten thousand men and failed.\n\nWhere Gwanmiseong stood is still debated. One theory places it right here, at Odusanseong, where the Han and Imjin rivers flow together into the sea."},
 fact:{
  ko:"관미성의 위치로는 강화 교동도, 이곳 오두산성, 예성강 하구 등 여러 견해가 있습니다. 오두산성은 산 정상을 둘러싼 산성으로, 2022년 발굴에서 통일신라 시대 성벽도 확인되었습니다. 지금 산 위에는 오두산 통일전망대가 있어 강 건너 북한 땅이 보입니다.",
  ru:"Версий о месте Кванмисона несколько: остров Кёдон у Канхвы, эта крепость Одусансон, устье реки Есонган. Одусансон — горная крепость вокруг вершины. При раскопках 2022 года здесь нашли и стену времён Объединённого Силла. Сейчас на вершине стоит Обсерватория объединения Одусан, откуда за рекой видна Северная Корея.",
  en:"Several sites are proposed for Gwanmiseong: Gyodong Island near Ganghwa, this Odusanseong, and the mouth of the Yeseong River. Odusanseong is a hilltop fortress, and a 2022 excavation found a wall from the Unified Silla period too. Today the Odusan Unification Observatory stands on top, looking across the river into North Korea."},
 find:{
  ko:"전망대에서 강 건너를 바라보세요. 1600년 전 이 물길을 두고 두 나라가 싸웠습니다.",
  ru:"Посмотрите с обсерватории за реку: 1600 лет назад за эти воды сражались два королевства.",
  en:"Look across the river from the observatory: 1,600 years ago two kingdoms fought over these waters."}}
]);
