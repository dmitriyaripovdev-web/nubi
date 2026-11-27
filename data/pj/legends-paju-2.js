// ============================================================
// Легенды Пхаджу, часть 2. Тексты пересказаны своими словами.
// Главный источник: 파주문화원 «전설모음» (pajucc.or.kr, раздел 한마당, 95 записей, проверено 27.11.2026).
// Сверка мест: Kakao (поиск по названию и по адресу из текста легенды), для могилы Хоннан —
//   новости мэрии Пхаджу «파주에서 쉬고 있는 조선시대 여류 문학가들» (адрес 다율동 519-7).
// Не вошли: места внутри ДМЗ и за рекой (판문교, 덕진당, 장단), места без точного адреса,
//   сюжеты с насилием и самоубийством (не для семейного приложения).
// approx:true — деревня, гора или большая территория, печать в радиусе 1 км.
// Файл района (data/<район>/): загружает js/datastore.js по мере надобности.
// ============================================================
Data.put("legends", [

// ---------- Пруд богача (장자못) ----------
{id:"pj_jangjamot", region:"pj", lat:37.979586, lng:126.845706, approx:true, // Kakao: 장좌못 (적성면 장좌리 479) = адрес из легенды «장좌리 479번지»
 name:{ko:"장자못", ru:"Пруд богача Чанджамот", en:"Jangjamot, the Rich Man's Pond"},
 place:{ko:"파주시 적성면 장좌리", ru:"Пхаджу, Чоксон-мён, Чанджва-ри", en:"Jangjwa-ri, Jeokseong-myeon, Paju"},
 legend:{
  ko:"옛날 장좌리에 송씨 성을 가진 큰 부자가 살았습니다. 그는 몹시 인색해서 스님이 시주를 청하자 쌀 대신 말똥을 바리때에 넣어 주었습니다.\n\n부엌에서 이를 본 며느리는 시아버지 몰래 쌀 한 말을 퍼서 스님께 드렸습니다. 스님은 며느리에게 말했습니다. “아끼는 것을 챙겨 나를 따라오시오. 무슨 소리가 나도 절대 뒤를 돌아보면 안 됩니다.”\n\n며느리는 강아지를 안고 스님을 따라 임진강을 건넜습니다. 그때 등 뒤에서 하늘이 무너지는 듯한 벼락 소리가 났습니다. 며느리가 그만 뒤를 돌아본 순간, 며느리와 강아지는 돌이 되고 말았습니다. 부잣집이 있던 자리는 깊은 연못이 되었는데, 사람들은 그 못을 장자못이라 불렀습니다.",
  ru:"Когда-то в Чанджва-ри жил богач по фамилии Сон. Он был так скуп, что монаху, просившему подаяние, положил в чашу вместо риса конский навоз.\n\nНевестка видела это из кухни. Тайком от свёкра она насыпала мешочек риса и отдала монаху. Тот сказал ей: «Возьми самое дорогое и иди за мной. Что бы ни случилось за спиной — не оглядывайся».\n\nНевестка взяла на руки щенка и пошла за монахом через реку Имджин. Вдруг позади грянул такой гром, будто рушилось небо. Она обернулась — и в тот же миг вместе со щенком превратилась в камень. А на месте богатого дома разлился глубокий пруд. Его и назвали Чанджамот — «пруд богача».",
  en:"Long ago a rich man named Song lived in Jangjwa-ri. He was so stingy that when a monk asked for alms, he dropped horse dung into the monk's bowl instead of rice.\n\nHis daughter-in-law saw it from the kitchen. Behind his back she scooped up some rice and gave it to the monk. The monk told her: “Take what you treasure most and follow me. Whatever you hear behind you, never look back.”\n\nShe picked up her puppy and followed the monk across the Imjin River. Suddenly thunder roared behind her as if the sky were falling. She turned to look, and in that instant she and the puppy turned to stone. Where the rich man's house had stood, a deep pond appeared. People called it Jangjamot, the rich man's pond."},
 fact:{
  ko:"마을 어른들의 이야기로는 이 못이 너무 깊어서 명주실 한 타래를 다 풀어 넣어도 바닥에 닿지 않았고, 이무기가 살며 소를 잡아먹었다고 합니다. 돌이 된 며느리 바위는 강 건너 고랑포 어귀에 있었는데, 한국전쟁 때 사라졌다고 전해집니다.",
  ru:"Старожилы рассказывали, что пруд был так глубок, что целый моток шёлковой нити не доставал до дна, а в нём жил змей-имуги и утаскивал коров. Камень-невестку показывали за рекой, у переправы Корангпхо, но во время Корейской войны он пропал.",
  en:"Old villagers said the pond was so deep that a whole skein of silk thread could not reach the bottom, and that an imugi serpent lived in it and dragged off cows. The stone daughter-in-law stood across the river near the Gorangpo ferry, but it disappeared during the Korean War."},
 find:{
  ko:"못가에 서서 임진강 쪽을 바라보세요. 며느리가 걸어간 길이 바로 그 방향입니다.",
  ru:"Встаньте у пруда и посмотрите в сторону Имджина: именно туда ушла невестка.",
  en:"Stand by the pond and look toward the Imjin: that is the way the daughter-in-law walked."}},

// ---------- Брод, где расступилась река (여음탄) ----------
{id:"pj_yeoeumtan", region:"pj", lat:37.945623, lng:126.83454, approx:true, // Kakao: 리비교 역사문화공원 (파평면 장파리 429-23); брод — выше моста Риби, по легенде
 name:{ko:"여음탄과 리비교", ru:"Брод Ёымтхан у моста Риби", en:"Yeoeumtan Ford by Libby Bridge"},
 place:{ko:"파주시 파평면 장파리 (임진강 가)", ru:"Пхаджу, Пхапхён-мён, Чанпха-ри, берег Имджина", en:"Jangpa-ri, Papyeong-myeon, Paju, on the Imjin River"},
 legend:{
  ko:"리비교 위쪽 임진강에는 바닥에 바위가 깔려 물이 얕은 여울이 있습니다. 사람들은 그 맑은 물을 떠 마셨다고 해서 이곳을 여음탄이라 불렀습니다.\n\n파평 윤씨의 시조 윤신달은 금파리 집에서 개경으로 갈 때 늘 이 여울을 건넜습니다. 어느 날 그가 말을 타고 강에 들어서자, 강물이 양쪽으로 갈라지며 길을 내주었습니다. 윤신달은 발굽 하나 젖지 않고 강을 건넜다고 전해집니다.",
  ru:"Выше моста Риби дно Имджина выстлано камнями, и там есть мелкий перекат. Люди пили здесь чистую воду, поэтому место назвали Ёымтхан — «брод, где пьют».\n\nОснователь рода Пхапхён Юн, Юн Синдаль, переходил этот брод всякий раз, когда ехал из дома в Кымпха-ри в столицу Кэгён. Однажды, когда он въехал в реку верхом, вода расступилась в обе стороны и открыла ему дорогу. Говорят, он перешёл реку, не замочив ни одного копыта.",
  en:"Above Libby Bridge the bed of the Imjin is lined with rocks, making a shallow ford. People drank its clear water, so they called the place Yeoeumtan, the drinking ford.\n\nYun Sin-dal, founder of the Papyeong Yun clan, crossed here whenever he rode from his home in Geumpa-ri to the capital, Gaegyeong. One day, as he rode into the river, the water parted on both sides and opened a path. They say he crossed without his horse wetting a hoof."},
 fact:{
  ko:"리비교는 한국전쟁 때 미군이 놓은 다리로, 전투 중 숨진 미군 리비 병사의 이름을 땄습니다. 오랫동안 민간인이 건널 수 없었지만 지금은 다리 옆이 역사문화공원으로 꾸며져 있습니다.",
  ru:"Мост Риби построили американские военные во время Корейской войны и назвали в честь погибшего солдата Либби. Долгие годы гражданским по нему ходить было нельзя, а теперь рядом с мостом устроен историко-культурный парк.",
  en:"Libby Bridge was built by the US Army during the Korean War and named after Libby, a soldier killed in action. For decades civilians could not cross it; today a history and culture park lies beside it."},
 find:{
  ko:"공원에서 다리 위쪽 강물을 보세요. 물살이 하얗게 부서지는 곳이 여울입니다.",
  ru:"Посмотрите из парка на реку выше моста: где вода белеет на камнях — там и брод.",
  en:"From the park, look at the river above the bridge: where the water breaks white over the rocks, that's the ford."}},

// ---------- Колодец заговорщиков (공수물) ----------
{id:"pj_gongsumul", region:"pj", lat:37.775971, lng:126.79602, approx:true, // Kakao: адрес 월롱면 영태리 (колодец в поле, точного адреса нет)
 name:{ko:"공수물", ru:"Колодец Консумуль", en:"Gongsumul Well"},
 place:{ko:"파주시 월롱면 영태리", ru:"Пхаджу, Воллон-мён, Ёнтхэ-ри", en:"Yeongtae-ri, Wollong-myeon, Paju"},
 legend:{
  ko:"1623년 봄, 광해군을 몰아내려는 이서와 동지들이 장단에서 한양을 향해 몰래 길을 나섰습니다. 그들은 밤새 강을 건너고 개울을 지나 영태리의 작은 마을에 이르렀습니다.\n\n지친 군사들은 마을 우물에 둘러서서 물을 떠 마시고 다시 길을 재촉했습니다. 며칠 뒤 그들은 궁궐에 들어가 새 임금 인조를 세웠습니다. 그 뒤로 사람들은 이 우물을 ‘물을 바친 샘’, 공수물이라 불렀고 마을 이름도 공수물이 되었습니다.",
  ru:"Весной 1623 года Ли Со и его соратники, задумавшие свергнуть короля Кванхэ-гуна, тайно вышли из Чандана в сторону Ханяна. Всю ночь они переходили реки и ручьи и наконец добрались до деревушки в Ёнтхэ-ри.\n\nУставшие воины обступили деревенский колодец, напились и поспешили дальше. Через несколько дней они вошли во дворец и возвели на трон нового короля Инджо. С тех пор колодец звали Консумуль — «колодец, что дал воду», так же назвали и деревню.",
  en:"In the spring of 1623, Yi Seo and his comrades, plotting to depose King Gwanghaegun, set out secretly from Jangdan toward Hanyang. All night they crossed rivers and streams until they reached a small village in Yeongtae-ri.\n\nThe weary men gathered around the village well, drank, and hurried on. A few days later they entered the palace and put a new king, Injo, on the throne. Ever since, the well was called Gongsumul, the well that gave water, and the village took the same name."},
 fact:{
  ko:"공수물 마을은 세 집만 남았다가 사라졌고, 우물은 경지 정리 때 논 가운데 묻혔습니다. 옛 파주군지에도 ‘인조반정 때 동지들이 이 우물물을 마셨다’는 기록이 있습니다.",
  ru:"Деревня Консумуль со временем опустела, а колодец засыпали при выравнивании полей — теперь он под рисовым полем. Старая летопись уезда Пхаджу тоже пишет, что заговорщики пили из этого колодца.",
  en:"The village shrank to three houses and then disappeared, and the well was buried under a rice field during land consolidation. The old Paju county gazetteer also records that the conspirators drank from this well."},
 find:{
  ko:"월롱에서 영태리로 넘어오는 육교를 지나 약 100m, 오른쪽 논을 바라보세요. 우물은 그 논 가운데 잠들어 있습니다.",
  ru:"Пройдите метров сто от пешеходного моста из Воллона в Ёнтхэ-ри и посмотрите на поле справа: колодец спит под ним.",
  en:"Walk about 100 m past the footbridge from Wollong into Yeongtae-ri and look at the rice field on the right: the well sleeps beneath it."}},

// ---------- Гора Фениксов (봉서산) ----------
{id:"pj_bongseosan", region:"pj", lat:37.837312, lng:126.80698, approx:true, // Kakao: 봉서산 (파주읍 봉서리)
 name:{ko:"봉서산", ru:"Гора Бонсосан", en:"Bongseosan"},
 place:{ko:"파주시 파주읍 봉서리", ru:"Пхаджу, Пхаджу-ып, Бонсо-ри", en:"Bongseo-ri, Paju-eup, Paju"},
 legend:{
  ko:"봉서산은 봉황이 깃들어 노래하던 산이라 하여 이런 이름을 얻었습니다. 산꼭대기에는 우물이 두 개 있었습니다.\n\n하나는 힘센 장사가 마셨다는 장사우물이고, 다른 하나는 물이 끊이지 않는 전대우물입니다. 전대우물은 너무 깊어서 명주실 한 타래를 다 풀어도 바닥에 닿지 않았다고 합니다. 산마루에는 장사가 공기놀이를 하던 공기바위와 용마가 남긴 용마바위도 있었다고 전해집니다.",
  ru:"Гору Бонсосан назвали так потому, что здесь гнездились и пели фениксы. На её вершине было два колодца.\n\nИз одного пил богатырь — его так и звали: колодец богатыря. Другой никогда не пересыхал и был таким глубоким, что целый моток шёлковой нити не доставал до дна. А на гребне лежали камни-«конги», которыми богатырь играл, как дети играют в камешки, и скала дракона-коня.",
  en:"Bongseosan got its name because phoenixes nested and sang here. At the summit there were two wells.\n\nOne was the strongman's well, where a mighty hero drank. The other never ran dry and was so deep that a whole skein of silk thread could not reach the bottom. On the ridge lay the gonggi rocks the strongman tossed like a child's jacks, and the rock of the dragon-horse."},
 fact:{
  ko:"봉서산은 벌판 가운데 솟아 문산 포구를 내려다보는 요충지라 옛날부터 산성이 있었습니다. 임진왜란 때 권율 장군이 행주대첩 뒤 이 산성으로 와서 지켰다고 전해집니다.",
  ru:"Гора стоит посреди равнины и смотрит на гавань Мунсана, поэтому с давних времён здесь была крепость. Говорят, во время Имджинской войны полководец Квон Юль после победы при Хэнджу пришёл сюда и держал оборону.",
  en:"Rising alone from the plain and overlooking the old Munsan harbor, the hill has held a fortress since ancient times. During the Imjin War, General Gwon Yul is said to have come here after his victory at Haengju to defend it."},
 find:{
  ko:"등산로에서 벌판을 내려다보세요. 봉황이 내려앉을 만큼 사방이 탁 트여 있습니다. 정상 쪽은 군부대라 출입 표지를 꼭 지키세요.",
  ru:"Посмотрите с тропы на равнину: обзор во все стороны — фениксу было где сесть. Вершина занята воинской частью, соблюдайте таблички.",
  en:"Look down over the plain from the trail: open in every direction, a fitting perch for a phoenix. The summit is a military site, so follow the signs."}},

// ---------- Перевал Хеымнён и два разбойника ----------
{id:"pj_hyeeumryeong", region:"pj", lat:37.725284, lng:126.892993, // Kakao: 혜음령 (граница Пхаджу и Коян)
 name:{ko:"혜음령", ru:"Перевал Хеымнён", en:"Hyeeumnyeong Pass"},
 place:{ko:"파주시 광탄면 용미리 · 고양시 경계", ru:"Пхаджу, Квантхан-мён, Ёнми-ри, граница с Кояном", en:"Yongmi-ri, Gwangtan-myeon, Paju, on the Goyang border"},
 legend:{
  ko:"혜음령은 한양에서 의주로 가는 큰길이었지만 숲이 깊어 도둑이 자주 나타났습니다. 힘센 도둑 둘이 큰 재물을 빼앗아 숲속에 숨겨 두고, 술 한잔 하고 나누자고 했습니다.\n\n한 도둑이 술을 사러 내려가며 생각했습니다. ‘술에 독을 타면 재물은 다 내 것이다.’ 산에 남은 도둑도 생각했습니다. ‘저놈이 올라오면 칼로 해치우면 된다.’\n\n술을 든 도둑이 올라오자 숨어 있던 도둑이 그를 쓰러뜨렸습니다. 기분이 좋아진 그는 그 술을 마셨고, 그도 쓰러지고 말았습니다. 재물은 숲속에 그대로 남았고, 사람들은 욕심이 두 도둑을 함께 데려갔다고 말했습니다.",
  ru:"Через Хеымнён шла большая дорога из Ханяна в Ыйджу, но лес здесь был густой, и путников часто грабили. Однажды два сильных разбойника спрятали в лесу богатую добычу и решили сперва выпить, а потом поделить.\n\nОдин пошёл вниз за вином и подумал: «Подмешаю яду — и всё достанется мне». Второй, оставшись на горе, подумал: «Как только он поднимется — разделаюсь с ним ножом».\n\nКогда первый вернулся с кувшином, второй выскочил из засады и сразил его. Довольный, он выпил вино — и упал рядом. Добыча так и осталась в лесу, а люди говорили: жадность забрала обоих.",
  en:"Hyeeumnyeong carried the great road from Hanyang to Uiju, but the forest was thick and robbers often struck. Once two strong robbers hid a rich haul in the woods and agreed to drink first and divide it later.\n\nOne went down for wine, thinking: “I'll poison it, and everything will be mine.” The one left on the hill thought: “When he comes back up, I'll finish him with my knife.”\n\nWhen the first returned with the jug, the second leapt from hiding and cut him down. Pleased, he drank the wine, and fell beside him. The treasure stayed in the woods, and people said greed had taken them both."},
 fact:{
  ko:"고개 아래에는 고려 때 나그네를 도둑과 짐승으로부터 지켜 주던 혜음원이 있었습니다. 영조가 어머니 숙빈 최씨의 묘를 지키다 한양으로 가던 길에 이 고개에서 임금이 된다는 소식을 받았다는 이야기도 전합니다.",
  ru:"Под перевалом в эпоху Корё стоял приют Хеымвон, защищавший путников от разбойников и зверей. Есть и другая история: будущий король Ёнджо, охранявший могилу матери, на этом перевале получил весть, что станет королём.",
  en:"Below the pass stood Hyeeumwon, a Goryeo inn that protected travelers from robbers and wild animals. Another tale says the future King Yeongjo, keeping watch at his mother's grave, received word on this pass that he would become king."},
 find:{
  ko:"고갯마루에서 숲을 둘러보세요. 큰길이 나기 전에는 이 숲 사이 좁은 길로 모두가 넘어 다녔습니다.",
  ru:"Оглянитесь на лес с вершины перевала: до новой дороги все шли здесь узкой тропой между деревьями.",
  en:"Look around at the forest from the top of the pass: before the highway, everyone crossed here on a narrow path between the trees."}},

// ---------- Перевал пятидесяти (수레넘이고개) ----------
{id:"pj_sureneomi", region:"pj", lat:37.856298, lng:126.932025, approx:true, // Kakao: 수루레미고개 (법원읍 오현리 391-2), граница с Янджу
 name:{ko:"수레넘이고개", ru:"Перевал Суреноми — «перевал пятидесяти»", en:"Sureneomi Pass, the Pass of Fifty"},
 place:{ko:"파주시 법원읍 (양주 가래비 방향)", ru:"Пхаджу, Помвон-ып, дорога на Каребы (Янджу)", en:"Beobwon-eup, Paju, toward Garaebi in Yangju"},
 legend:{
  ko:"법원 갈곡리에서 양주 가래비로 넘어가는 고개는 옛날 험하고 도둑이 들끓었습니다. 몇 사람이 넘다가는 봉변을 당하기 일쑤였습니다.\n\n그래서 고개 이쪽에서도 저쪽에서도 쉰 명이 모일 때까지 기다렸다가 한꺼번에 넘었다고 합니다. 사람들은 이 고개를 ‘쉰 명이 넘는 고개’, 쉰넘이고개라 불렀습니다.\n\n세월이 흐르며 쉰넘이는 수레넘이가 되었고, 한자로는 수레 차(車) 자를 써서 차유령이 되었습니다. 이름만 들으면 수레가 넘던 고개 같지만, 사실은 쉰 명이 함께 넘던 고개였던 셈입니다.",
  ru:"Перевал из Кальгок-ри в Каребы (Янджу) был когда-то крутым и разбойничьим. Если шли по двое-трое, беды было не миновать.\n\nПоэтому и с той, и с другой стороны ждали, пока соберётся пятьдесят человек, и переходили все вместе. Перевал прозвали «Шин-номи» — «где переходят пятьдесят».\n\nСо временем «шин-номи» превратилось в «суре-номи» — «где перевозят телеги», а по-китайски записали «Чхаюрён», перевал повозок. Звучит так, будто здесь ездили телеги, а на самом деле здесь ходили по пятьдесят.",
  en:"The pass from Galgok-ri over to Garaebi in Yangju was once steep and full of bandits. Anyone crossing in twos or threes was sure to be robbed.\n\nSo on both sides people waited until fifty had gathered, then crossed together. They called it Swin-neomi, the pass crossed by fifty.\n\nOver time Swin-neomi became Sure-neomi, the cart pass, and in Chinese characters it was written Chayuryeong. The name sounds like carts went over it, but really it was the pass where fifty walked as one."},
 fact:{
  ko:"카카오 지도에는 이 고개가 법원읍 오현리의 ‘수루레미고개’로 올라 있습니다. 같은 이름이 입에서 입으로 전해지며 조금씩 바뀐 것입니다.",
  ru:"На картах Kakao перевал подписан как «Сурурэми-когэ» в Охён-ри — то же имя, ещё раз изменившееся в устах людей.",
  en:"Kakao Map lists the pass as Sururemi-gogae in Ohyeon-ri: the same name, changed once more as it passed from mouth to mouth."},
 find:{
  ko:"고갯마루에서 혼자 왔는지 둘러보세요. 옛날이라면 쉰 명이 될 때까지 여기서 기다려야 했습니다.",
  ru:"На перевале оглянитесь: вы один? В старину пришлось бы ждать здесь, пока не наберётся пятьдесят.",
  en:"At the top, look around: are you alone? In the old days you would have waited here until fifty had gathered."}},

// ---------- Соронвон: король и бедный сын ----------
{id:"pj_soryeongwon", region:"pj", lat:37.778088, lng:126.901621, // Kakao: 소령원 (광탄면 영장리 267); адрес из легенды «영장리 산1»
 name:{ko:"소령원", ru:"Гробница Соронвон", en:"Soryeongwon Tomb"},
 place:{ko:"파주시 광탄면 영장리", ru:"Пхаджу, Квантхан-мён, Ёнджан-ри", en:"Yeongjang-ri, Gwangtan-myeon, Paju"},
 legend:{
  ko:"젊은 영조는 말을 타고 산을 다니며 땅의 모양을 살피는 것을 좋아했습니다. 어느 날 그는 가난한 상주가 험한 산비탈에 아버지의 무덤을 파는 것을 보았습니다. 사연을 묻자 상주는 돈이 없어 좋은 자리를 쓸 수 없다고 했습니다.\n\n영조는 그의 바른 마음에 감동해 고을 원님에게 쌀 한 가마와 돈 백 냥을 보내라는 편지를 써 주었습니다. 그리고 그 자리를 골라 준 선비를 찾아가 물었습니다. “어찌 이런 나쁜 자리를 골랐소?” 선비가 웃으며 답했습니다. “쌀 한 가마와 돈 백 냥이 생길 자리인데요.”\n\n영조는 깜짝 놀랐습니다. 훗날 어머니 숙빈 최씨가 세상을 떠나자, 영조는 이름난 풍수가들을 모두 물리고 바로 그 선비를 불러 묏자리를 잡게 했습니다. 그곳이 지금의 소령원입니다.",
  ru:"Молодой принц Ёнджо любил ездить по горам и разглядывать, как лежит земля. Однажды он увидел, как бедняк копает могилу для отца на крутом неудобном склоне. Тот объяснил: денег на хорошее место нет.\n\nЁнджо тронула его честность, и он написал начальнику уезда письмо: выдать бедняку мешок риса и сто лянов. Потом он разыскал учёного, который выбрал это место, и спросил: «Зачем ты дал ему такое плохое место?» Учёный улыбнулся: «Плохое? Это место, что принесёт мешок риса и сто лянов».\n\nЁнджо был поражён. Когда умерла его мать, госпожа Чхве, он отослал всех знаменитых геомантов и позвал того самого учёного. Место, которое тот выбрал, и есть Соронвон.",
  en:"The young prince Yeongjo loved riding through the hills and studying the lie of the land. One day he saw a poor mourner digging his father's grave on a steep, awkward slope. The man explained he had no money for a better spot.\n\nMoved by his honesty, Yeongjo wrote to the county magistrate to send the man a sack of rice and a hundred nyang. Then he found the scholar who had chosen the spot and asked: “Why give him such a bad place?” The scholar smiled: “Bad? It's the place that brings a sack of rice and a hundred nyang.”\n\nYeongjo was astonished. When his mother, Lady Choe, died, he sent away all the famous geomancers and summoned that same scholar. The place he chose is Soryeongwon."},
 fact:{
  ko:"소령원은 영조의 어머니 숙빈 최씨의 무덤입니다. 영조는 무덤 앞에 여막을 짓고 직접 비문을 썼으며, 어머니의 명복을 빌려고 가까운 보광사를 다시 고쳐 지었습니다. 평소에는 내부를 공개하지 않는 때가 많습니다.",
  ru:"Соронвон — могила госпожи Чхве (Сукбин), матери короля Ёнджо. Ёнджо жил у могилы в шалаше скорби, сам написал надпись на стеле и перестроил соседний храм Погванса, чтобы там молились о её душе. Внутрь часто не пускают.",
  en:"Soryeongwon is the tomb of Lady Choe (Sukbin), mother of King Yeongjo. He kept vigil in a hut beside it, wrote the stele inscription himself, and rebuilt nearby Bogwangsa Temple to pray for her. The grounds are often closed to visitors."},
 find:{
  ko:"입구의 안내판과 홍살문 쪽을 바라보세요. 쌀 한 가마를 알아본 선비가 고른 자리가 그 너머에 있습니다.",
  ru:"Найдите у входа табличку и красные ворота хонсальмун: за ними место, выбранное учёным, что предсказал мешок риса.",
  en:"Find the sign and the red hongsalmun gate at the entrance: beyond them lies the spot chosen by the scholar who foresaw the sack of rice."}},

// ---------- Храм Ёнсанса: где прятался король ----------
{id:"pj_yongsangsa", region:"pj", lat:37.798234, lng:126.766261, // Kakao: 용상사 (월롱면 덕은리 268-1), на склоне горы Воллонсан
 name:{ko:"용상사와 월롱산", ru:"Храм Ёнсанса на горе Воллонсан", en:"Yongsangsa Temple on Wollongsan"},
 place:{ko:"파주시 월롱면 덕은리", ru:"Пхаджу, Воллон-мён, Догын-ри", en:"Deogeun-ri, Wollong-myeon, Paju"},
 legend:{
  ko:"1010년 겨울, 거란의 대군이 고려로 쳐들어왔습니다. 개경이 위험해지자 젊은 임금 현종은 평범한 백성의 옷으로 갈아입고 궁을 빠져나왔습니다.\n\n임금은 교하의 월롱산으로 몸을 숨겼다가 남쪽으로 피란을 떠났습니다. 이듬해 거란군이 물러가고 나라가 평온해졌지만, 현종은 목숨을 건졌던 이 산을 잊지 못했습니다.\n\n그는 월롱산에 작은 암자를 짓게 했습니다. ‘임금이 머물렀던 자리’라는 뜻으로 사람들은 이 절을 용상사라 불렀습니다.",
  ru:"Зимой 1010 года огромная армия киданей вторглась в Корё. Когда столице Кэгёну стала грозить беда, молодой король Хёнджон переоделся в простую одежду и тайком покинул дворец.\n\nОн укрылся на горе Воллонсан, а потом ушёл на юг. На следующий год кидани отступили, и всё успокоилось, но король не забыл гору, спасшую ему жизнь.\n\nОн велел построить на ней маленький храм. Люди назвали его Ёнсанса — «храм королевского трона», ведь здесь когда-то сидел король.",
  en:"In the winter of 1010 a vast Khitan army invaded Goryeo. With the capital Gaegyeong in danger, the young King Hyeonjong changed into commoner's clothes and slipped out of the palace.\n\nHe hid on Mount Wollongsan before fleeing south. The next year the Khitans withdrew and peace returned, but the king never forgot the mountain that had saved his life.\n\nHe ordered a small hermitage built there. People called it Yongsangsa, the temple of the royal seat, for a king had once rested here."},
 fact:{
  ko:"조선 세종 때인 1445년 덕은 스님이 절을 다시 세우며 작은 돌부처를 모셨는데, 부처에는 ‘정통 10년’이라는 글씨가 새겨져 있습니다. 절 위 월롱산 꼭대기에는 백제 때 쌓은 것으로 보는 월롱산성 터가 있습니다.",
  ru:"В 1445 году монах Догын восстановил храм и поставил в нём небольшого каменного будду с надписью «10-й год Чжэнтун». Выше храма, на вершине Воллонсан, остались руины крепости, которую считают пэкческой.",
  en:"In 1445 the monk Deogeun rebuilt the temple and enshrined a small stone Buddha inscribed “10th year of Zhengtong”. Above the temple, on the summit of Wollongsan, are the ruins of a fortress thought to date from Baekje."},
 find:{
  ko:"대웅전의 작은 석불좌상을 찾아보세요. 높이가 60cm 남짓한 아담한 부처입니다.",
  ru:"Найдите в главном зале маленького сидящего каменного будду — он всего около 60 см высотой.",
  en:"Look for the small seated stone Buddha in the main hall: it's only about 60 cm tall."}},

// ---------- Нефритовый ручей и пхаджуские крабы (옥돌내) ----------
{id:"pj_okdollae", region:"pj", lat:37.796535, lng:126.791279, approx:true, // Kakao: 월롱면 위전리 (ручей у деревни, точного адреса нет)
 name:{ko:"옥돌내", ru:"Нефритовый ручей Октолле", en:"Okdollae, the Jade Stone Stream"},
 place:{ko:"파주시 월롱면 위전리", ru:"Пхаджу, Воллон-мён, Виджон-ри", en:"Wijeon-ri, Wollong-myeon, Paju"},
 legend:{
  ko:"고려 공민왕 때 중국 명나라의 높은 관리 사공요가 모함을 받아 고려로 건너왔습니다. 그는 월롱 덕은리에 자리를 잡고 살다가 세상을 떠났습니다.\n\n중국 황제는 그를 기려 옥돌로 만든 비석을 보내 주었습니다. 그러나 나라가 어지러운 때가 오자, 후손들은 귀한 비석이 해를 입을까 두려워 집 앞 개울에 넣어 감추었습니다.\n\n그 뒤로 사람들은 이 개울을 ‘옥돌을 버린 내’, 옥돌내라 불렀습니다. 비석은 지금도 개울 어딘가에 잠들어 있다고 합니다.",
  ru:"Во времена корёского короля Конмина в Корё бежал сановник из минского Китая Са Гонъё, оклеветанный при дворе. Он поселился в Догын-ри и там окончил свои дни.\n\nКитайский император в его честь прислал стелу из нефрита. Но настали смутные времена, и потомки, боясь, что драгоценную стелу отнимут или разобьют, опустили её в ручей у дома.\n\nС тех пор ручей зовут Октолле — «ручей нефритового камня». Говорят, стела и сейчас лежит где-то на его дне.",
  en:"In the reign of King Gongmin, Sa Gong-yo, a high official of Ming China, was slandered at court and fled to Goryeo. He settled in Deogeun-ri and lived out his life there.\n\nThe Chinese emperor sent a jade stele in his honor. But when troubled times came, his descendants feared the precious stone would be taken or broken, so they sank it in the stream by their house.\n\nEver since, the stream has been called Okdollae, the stream of the jade stone. They say the stele still lies somewhere on its bed."},
 fact:{
  ko:"임진강의 참게는 크고 맛이 좋아 ‘파주 게’로 이름났고, 옥돌내는 임금님께 올리는 게의 본고장이었습니다. 봄이면 서해에서 올라온 어린 참게들이 이 개울을 따라 영장리까지 거슬러 올라갔다고 합니다.",
  ru:"Крабы реки Имджин славились по всей стране как «пхаджуские», а Октолле был местом, где ловили крабов к королевскому столу. Весной молодые крабы поднимались из Жёлтого моря по этому ручью до самого Ёнджан-ри.",
  en:"Imjin River mitten crabs were famous nationwide as “Paju crabs”, and Okdollae was where crabs for the royal table were caught. Each spring young crabs climbed this stream from the Yellow Sea all the way to Yeongjang-ri."},
 find:{
  ko:"개울가에서 물속 돌들을 들여다보세요. 혹시 반들반들한 옥돌이 보이나요?",
  ru:"Загляните в ручей: может, среди камней блеснёт гладкий нефрит?",
  en:"Peer at the stones in the stream: is that a smooth piece of jade?"}},

// ---------- Скала отшельника (처사바위) ----------
{id:"pj_cheosabawi", region:"pj", lat:37.778104, lng:126.876658, approx:true, // Kakao: 마장리계곡 (광탄면 마장리 430-33), склон горы Пактальсан
 name:{ko:"처사바위", ru:"Скала отшельника Чхоса", en:"Cheosa Rock, the Hermit's Rock"},
 place:{ko:"파주시 광탄면 마장리 (박달산 기슭)", ru:"Пхаджу, Квантхан-мён, Мачжан-ри, у горы Пактальсан", en:"Majang-ri, Gwangtan-myeon, Paju, below Bakdalsan"},
 legend:{
  ko:"박달산 동쪽 기슭에는 마당처럼 넓은 바위가 있고, 그 아래 고령산에서 흘러온 맑은 물이 깊은 웅덩이를 이루었습니다.\n\n왕실의 먼 후손인 이건섭 선생은 벼슬을 마다하고 이 바위에 앉아 책만 읽었습니다. 공부하다 지치면 웅덩이에서 목욕을 하고 다시 책을 폈습니다.\n\n산속 선비의 학문이 깊다는 소문이 나자 사방에서 젊은이들이 배우러 몰려들었습니다. 사람들은 그 바위를 처사바위, 웅덩이를 처사탕이라 불렀습니다.",
  ru:"На восточном склоне горы Пактальсан лежит скала, широкая, как двор, а под ней чистый ручей с горы Корёнсан образовал глубокий омут.\n\nДальний потомок королевского рода, учёный Ли Гонсоп, отказался от должностей и целыми днями читал, сидя на этой скале. Уставая, он купался в омуте и снова брался за книги.\n\nСлава о горном мудреце разошлась далеко, и к нему потянулась молодёжь учиться. Скалу прозвали Чхоса-бави — «скала отшельника», а омут — Чхоса-тхан.",
  en:"On the eastern slope of Bakdalsan lies a rock as wide as a courtyard, and beneath it a clear stream from Goryeongsan once formed a deep pool.\n\nThe scholar Yi Geon-seop, a distant descendant of the royal house, refused official posts and spent his days reading on that rock. When he tired, he bathed in the pool and opened his books again.\n\nWord of the mountain sage spread, and young people came from all around to study with him. The rock became Cheosa-bawi, the hermit's rock, and the pool Cheosa-tang."},
 fact:{
  ko:"이건섭 선생은 조선 말 교하향교의 훈도로 많은 제자를 길렀다고 전해집니다. 처사탕은 세월이 흐르며 메워져, 지금은 얕은 시냇물만 흐릅니다.",
  ru:"Говорят, в конце эпохи Чосон Ли Гонсоп преподавал в конфуцианской школе Кёха и вырастил много учеников. Омут со временем занесло, и теперь там течёт мелкий ручей.",
  en:"In the late Joseon era Yi Geon-seop is said to have taught at the Gyoha Hyanggyo school and trained many students. The pool has since silted up; only a shallow stream flows there now."},
 find:{
  ko:"계곡에서 평평하고 넓은 바위를 찾아 앉아 보세요. 책 한 권 펴기 딱 좋은 자리입니다.",
  ru:"Найдите в ущелье плоский широкий камень и присядьте: отличное место, чтобы открыть книгу.",
  en:"Find a broad flat rock in the valley and sit down: a perfect place to open a book."}},

// ---------- Деревня нефритовой стелы (옥석동) ----------
{id:"pj_okseokdong", region:"pj", lat:37.814169, lng:126.775989, // Kakao: 양경공조연묘소 (월롱면 덕은리 산45) = адрес из легенды
 name:{ko:"조연 묘와 옥석동", ru:"Могила Чо Ёна и деревня Оксокдон", en:"Jo Yeon's Tomb and Okseokdong"},
 place:{ko:"파주시 월롱면 덕은리", ru:"Пхаджу, Воллон-мён, Догын-ри", en:"Deogeun-ri, Wollong-myeon, Paju"},
 legend:{
  ko:"조선 태조의 조카 조연이 세상을 떠나자 세종 임금은 옥돌 비석을 내려 장례를 치르게 했습니다. 그래서 무덤이 있는 마을을 옥석동이라 불렀습니다.\n\n백 년 뒤 집안의 조광조가 모함을 받아 죽고 가문 전체가 위험해지자, 후손들은 옥비를 마을 어귀 논에 묻고 뿔뿔이 흩어졌습니다. 세월이 흘러 후손들은 조상의 무덤 자리마저 잊어버렸습니다.\n\n어느 날 집안의 한 사람이 파주에서 하룻밤 묵다가 꿈을 꾸었습니다. 흰 말을 탄 신령이 서쪽을 가리켰습니다. 아침에 나가 보니 무릎까지 쌓인 눈 위에 말발굽 자국이 서쪽으로 나 있었습니다. 자국을 따라 십 리를 가자 발자국이 사라진 자리에 잊혔던 조연의 무덤이 있었습니다.",
  ru:"Когда умер Чо Ён, племянник основателя династии Чосон, король Седжон прислал для похорон стелу из нефрита. Поэтому деревню у могилы назвали Оксокдон — «деревня нефритового камня».\n\nСто лет спустя его родича Чо Гванджо оклеветали и казнили, и весь род оказался в опасности. Потомки закопали нефритовую стелу в поле у входа в деревню и разъехались. Прошли годы, и они забыли, где даже сама могила предка.\n\nОднажды один из рода заночевал в Пхаджу, и ему приснился дух на белом коне, указывающий на запад. Утром он вышел: на снегу по колено вели на запад следы копыт. Он прошёл по ним десять ли — и там, где следы оборвались, нашёл забытую могилу Чо Ёна.",
  en:"When Jo Yeon, nephew of Joseon's founder, died, King Sejong sent a jade stele for his funeral. So the village by his tomb was called Okseokdong, the village of the jade stone.\n\nA century later his kinsman Jo Gwang-jo was slandered and executed, and the whole clan was in danger. The descendants buried the jade stele in a field at the village entrance and scattered. Years passed until they forgot even where their ancestor's tomb was.\n\nOne night a clansman staying in Paju dreamed of a spirit on a white horse pointing west. In the morning he found hoofprints in knee-deep snow, heading west. He followed them ten li, and where they ended, there was Jo Yeon's forgotten tomb."},
 fact:{
  ko:"조연은 제2차 왕자의 난 때 이방원을 도와 공신이 되었고, 세종 때 우의정에 올랐습니다. 옥비는 끝내 찾지 못했고, 후손들은 지금도 논 어딘가에 묻혀 있으리라 믿는다고 합니다.",
  ru:"Чо Ён помог Ли Банвону (будущему королю Тхэджону) во второй смуте принцев, а при Седжоне стал правым министром. Нефритовую стелу так и не нашли — потомки верят, что она всё ещё лежит где-то в полях.",
  en:"Jo Yeon helped Yi Bang-won (the future King Taejong) in the Second Strife of Princes and became Right State Councillor under Sejong. The jade stele was never found; his descendants still believe it lies somewhere in the fields."},
 find:{
  ko:"무덤 앞에서 서쪽 들판을 바라보세요. 옥비는 아직 저 논 어딘가에 잠들어 있습니다.",
  ru:"Встаньте у могилы и посмотрите на поля: нефритовая стела всё ещё спит где-то там.",
  en:"Stand at the tomb and look over the fields: the jade stele still sleeps somewhere out there."}},

// ---------- Ворона указала место (오금리) ----------
{id:"pj_ogeumri", region:"pj", lat:37.824788, lng:126.717575, // Kakao: 박중손 묘역 장명등 (탄현면 오금리 산19); в легенде — могила Пак Чунсона
 name:{ko:"박중손 묘와 오금리", ru:"Могила Пак Чунсона в Огым-ри", en:"Bak Jung-son's Tomb in Ogeum-ri"},
 place:{ko:"파주시 탄현면 오금리", ru:"Пхаджу, Тханхён-мён, Огым-ри", en:"Ogeum-ri, Tanhyeon-myeon, Paju"},
 legend:{
  ko:"1466년 세조 때의 신하 박중손이 세상을 떠나자, 이름난 지관이 묏자리를 찾아 나섰습니다. 그는 월롱산 줄기를 따라 봉우리를 하나하나 다 뒤졌지만 좋은 자리를 찾지 못했습니다.\n\n지친 지관은 산 아래 마을에 이르러 탄식했습니다. “내 눈이 멀었구나!” 그때 매봉재에서 까마귀가 요란하게 울었습니다.\n\n이상하게 여긴 지관이 까마귀 소리를 따라 올라가 보니, 바로 그곳에 찾던 명당이 있었습니다. 지관은 “까마귀야, 네가 나보다 낫구나” 하고 웃었습니다. 그 일로 마을 이름에 까마귀 이야기가 남았다고 전해집니다.",
  ru:"В 1466 году умер сановник короля Седжо Пак Чунсон, и знаменитый геомант отправился искать место для его могилы. Он обошёл все вершины вдоль хребта Воллонсан, но хорошего места не нашёл.\n\nУсталый, он спустился в деревню у подножия и вздохнул: «Ослеп я, что ли!» И тут на перевале Мэбонджэ громко закаркала ворона.\n\nГеомант удивился и пошёл на её голос — а там оказалось как раз то место, что он искал. «Ворона, да ты зорче меня!» — рассмеялся он. Говорят, с тех пор эта история и осталась в названиях здешних деревень.",
  en:"In 1466 Bak Jung-son, a minister of King Sejo, died, and a famous geomancer set out to find a site for his grave. He searched every peak along the Wollongsan ridge but found nothing good.\n\nExhausted, he came down to a village and sighed: “I must be going blind!” Just then a crow cawed loudly on Maebongjae pass.\n\nCurious, he followed the sound, and there was exactly the spot he had been looking for. “Crow, you see better than I do!” he laughed. They say the story has lived on in the names of the villages here ever since."},
 fact:{
  ko:"박중손의 묘역에는 조선 초기의 돌 장명등이 남아 있어 경기도 문화유산으로 지정되었습니다. 오금리라는 이름은 1914년 옛 마을 ‘질오목’과 ‘오고미’에서 한 글자씩 따서 지었습니다.",
  ru:"У могилы Пак Чунсона сохранился каменный фонарь чанмёндын начала эпохи Чосон — он охраняется как культурное наследие провинции Кёнгидо. Название Огым-ри сложили в 1914 году из слогов двух старых деревень, Чиромок и Огоми.",
  en:"Bak Jung-son's tomb keeps an early-Joseon stone lantern (jangmyeongdeung), protected as Gyeonggi Province heritage. The name Ogeum-ri was formed in 1914 from syllables of two old villages, Jilomok and Ogomi."},
 find:{
  ko:"묘역의 돌 장명등을 찾아보세요. 500년 넘게 무덤을 밝혀 온 돌 등불입니다.",
  ru:"Найдите у могилы каменный фонарь чанмёндын: он «светит» над могилой больше пятисот лет.",
  en:"Find the stone lantern at the tomb: it has kept watch over the grave for more than 500 years."}},

// ---------- Господин Тигр (호대감) ----------
{id:"pj_hodaegam", region:"pj", lat:37.78419, lng:126.684457, approx:true, // Kakao: 요풍동 (탄현면 성동리) = деревня из легенды
 name:{ko:"요풍동 호대감", ru:"Господин Тигр из Ёпхундона", en:"Lord Tiger of Yopung-dong"},
 place:{ko:"파주시 탄현면 성동리 요풍동", ru:"Пхаджу, Тханхён-мён, Сондон-ри, деревня Ёпхундон", en:"Yopung-dong, Seongdong-ri, Tanhyeon-myeon, Paju"},
 legend:{
  ko:"옛날 요풍동에 전주 이씨 한 사람이 살았습니다. 어느 날 그는 마을 사람들과 뒷산에 나무를 하러 갔다가, 쉬는 틈에 장난삼아 돌을 산 아래로 굴렸습니다.\n\n그런데 이씨가 굴린 돌이 하필 산 중턱의 호랑이 굴을 건드렸습니다. 성난 호랑이가 뛰쳐나오자 사람들은 나뭇짐도 버리고 달아났습니다.\n\n호랑이는 다른 사람은 모두 그냥 두고, 돌을 굴린 이씨만 쫓아가 해치고는 산으로 돌아갔습니다. 마을 사람들은 그의 넋을 달래려고 산제를 지내기 시작했고, 그를 ‘호대감’이라 높여 불렀습니다.",
  ru:"Когда-то в Ёпхундоне жил человек из рода Чонджу Ли. Однажды он пошёл с односельчанами за дровами на гору и на привале ради забавы стал скатывать камни вниз по склону.\n\nНа беду, его камень угодил прямо в тигриное логово на середине горы. Разъярённый тигр выскочил, и люди бросились бежать, побросав вязанки.\n\nТигр не тронул никого, кроме того, кто скатил камень, и ушёл обратно в горы. Чтобы успокоить душу погибшего, жители стали проводить горный обряд и почтительно назвали его «Ходэгам» — «господин Тигр».",
  en:"Long ago in Yopung-dong lived a man of the Jeonju Yi clan. One day he went up the hill with the villagers to gather firewood, and during a rest he rolled stones down the slope for fun.\n\nBy bad luck, his stone struck a tiger's den halfway down. The furious tiger burst out, and everyone fled, dropping their loads.\n\nThe tiger left everyone else alone, chased only the man who had rolled the stone, and returned to the mountain. To comfort his spirit, the villagers began holding a mountain rite and respectfully called him Hodaegam, Lord Tiger."},
 fact:{
  ko:"요풍동 사람들은 이 이야기를 기억하며 3년에 한 번씩 ‘호대감’ 산제를 지내 왔다고 합니다. 산에서 함부로 장난치지 말라는 옛사람들의 가르침이 담긴 이야기입니다.",
  ru:"Говорят, жители Ёпхундона раз в три года проводили обряд «Ходэгам». В этой истории — старый урок: в горах не шалят.",
  en:"The people of Yopung-dong are said to have held the Hodaegam rite once every three years. The tale carries an old lesson: don't play pranks on the mountain."},
 find:{
  ko:"마을 뒷산을 올려다보세요. 산중턱 어딘가에 호랑이 굴이 있었다고 합니다. 돌은 굴리지 마세요!",
  ru:"Посмотрите на гору за деревней: где-то на её склоне было логово тигра. Камни не катайте!",
  en:"Look up at the hill behind the village: the tiger's den was somewhere on its slope. No rolling stones!"}},

// ---------- Вершина танцующей девы (금무봉) ----------
{id:"pj_geummubong", region:"pj", lat:37.807965, lng:126.703974, approx:true, // Kakao: адрес 탄현면 금산리 (вершина Кымму — на хребте Ханноксан)
 name:{ko:"금산리 금무봉", ru:"Вершина Кыммубон в Кымсан-ри", en:"Geummubong Peak in Geumsan-ri"},
 place:{ko:"파주시 탄현면 금산리", ru:"Пхаджу, Тханхён-мён, Кымсан-ри", en:"Geumsan-ri, Tanhyeon-myeon, Paju"},
 legend:{
  ko:"월롱산 줄기가 서쪽으로 힘차게 내려오다 우뚝 솟은 봉우리가 금무봉입니다. 사람들은 이 봉우리가 아름다운 옥녀가 춤을 추는 모습이라 하여 귀하게 여겼습니다.\n\n봉우리 동쪽 골짜기에는 옥녀우물이 있습니다. 보통 물은 동쪽에서 서쪽으로 흐르는데, 이 우물물은 서쪽에서 나와 동쪽으로 흐릅니다. 옛사람들은 이렇게 거꾸로 흐르는 물가에서 큰 인물이 난다고 믿었습니다.\n\n실제로 이 마을에서는 정승과 학자, 명필이 여럿 나왔다고 전해집니다.",
  ru:"Отрог горы Воллонсан мощно спускается на запад и вздымается вершиной Кыммубон. Люди почитали её, потому что видели в её очертаниях танцующую прекрасную деву Окнё.\n\nВ долине к востоку от вершины есть колодец девы. Обычно здесь реки текут с востока на запад, а вода этого колодца выходит на западе и течёт на восток. В старину верили: у такой «обратной» воды рождаются великие люди.\n\nИ правда, говорят, из этой деревни вышло немало министров, учёных и мастеров каллиграфии.",
  en:"A spur of Wollongsan runs boldly west and rises into Geummubong peak. People held it dear, seeing in its outline the beautiful maiden Oknyeo dancing.\n\nIn the valley east of the peak is the Maiden's Well. Water here usually flows from east to west, but this well's water rises in the west and runs east. People believed that great figures are born beside such contrary water.\n\nAnd indeed, they say this village produced many ministers, scholars, and master calligraphers."},
 fact:{
  ko:"숙종 때 우의정을 지낸 민암이 이 마을에서 태어났고, 학자 윤선거가 병자호란 뒤 이곳에 숨어 지내며 제자를 길렀다고 전해집니다. 마을에서는 지금도 산신제와 금산리 농요가 이어지고 있습니다.",
  ru:"Говорят, здесь родился Мин Ам, правый министр при короле Сукчоне, а учёный Юн Сонго после маньчжурского вторжения 1636 года скрывался тут и учил учеников. В деревне и сейчас проводят горный обряд и поют крестьянские песни Кымсан-ри.",
  en:"Min Am, Right State Councillor under King Sukjong, is said to have been born here, and the scholar Yun Seon-geo hid here after the 1636 Manchu invasion and taught students. The village still holds a mountain rite and sings the Geumsan-ri farmers' songs."},
 find:{
  ko:"마을에서 봉우리를 올려다보며 춤추는 옥녀의 모습을 찾아보세요. 치맛자락은 어느 쪽일까요?",
  ru:"Посмотрите на вершину из деревни и попробуйте разглядеть танцующую деву. Где у неё подол юбки?",
  en:"Look up at the peak from the village and try to find the dancing maiden. Which way does her skirt swirl?"}},

// ---------- Кровавая голова дракона (두지리) ----------
{id:"pj_dujiri", region:"pj", lat:37.965439, lng:126.889742, approx:true, // Kakao: 두지나루 (적성면 두지리), рядом причал 황포돛배
 name:{ko:"두지리 용머리산", ru:"Гора Голова дракона в Дуджи-ри", en:"Dragon Head Hill in Duji-ri"},
 place:{ko:"파주시 적성면 두지리 (임진강 두지나루)", ru:"Пхаджу, Чоксон-мён, Дуджи-ри, переправа Дуджи на Имджине", en:"Duji-ri, Jeokseong-myeon, Paju, at the Duji ferry on the Imjin"},
 legend:{
  ko:"두지리 용머리산 아래에 욕심 많은 김 노인이 살았습니다. 그는 스님이나 걸인에게 쌀 한 톨 주지 않는 구두쇠였습니다.\n\n어느 날 금강산에서 왔다는 스님이 하룻밤 재워 달라고 했지만 김 노인은 거절했습니다. 돌아서던 스님이 혼잣말처럼 말했습니다. “뒷산 용마루 아래 조상 묘를 쓰면 더 큰 부자가 될 텐데.”\n\n김 노인은 그 말을 믿고 아버지의 묘를 옮기려고 용의 허리를 끊었습니다. 그러자 땅에서 붉은 피가 솟구쳐 임진강으로 흘러내렸고, 하늘에서 벼락이 떨어졌습니다. 피가 고였던 곳을 사람들은 지금도 ‘피머리’라고 부릅니다.",
  ru:"У подножия горы Ёнмори в Дуджи-ри жил жадный старик Ким. Монахам и нищим он не давал ни зёрнышка риса.\n\nОднажды монах, пришедший с Алмазных гор, попросился на ночлег, но старик отказал. Уходя, монах словно бы сам себе сказал: «Перенёс бы он могилу предков под хребет дракона за домом — стал бы ещё богаче».\n\nСтарик поверил и, чтобы перенести туда могилу отца, перерубил дракону хребет. Из земли хлынула алая кровь и потекла в Имджин, а с неба ударила молния. Место, где собиралась кровь, люди до сих пор зовут Пхимори — «кровавая голова».",
  en:"Below Dragon Head Hill in Duji-ri lived a greedy old man named Kim. He never gave a single grain of rice to monks or beggars.\n\nOne day a monk from the Diamond Mountains asked for a night's lodging, and Kim refused. Turning away, the monk said as if to himself: “If he moved his ancestors' grave under the dragon's ridge behind the house, he'd grow even richer.”\n\nKim believed him, and to move his father's grave he cut through the dragon's back. Red blood gushed from the earth and ran into the Imjin, and lightning struck from the sky. People still call the place where the blood pooled Pimeori, the bloody head."},
 fact:{
  ko:"두지리라는 이름은 앞산이 쌀이 가득 찬 뒤주 모양이라 붙었다고 하며, 재산을 모으면 마을을 떠나야 지킬 수 있다는 말도 전해집니다. 마을 사람들은 해마다 음력 9월 9일 밤 산신제를 지냈습니다. 지금 두지나루에서는 황포돛배가 임진강을 오갑니다.",
  ru:"Говорят, название Дуджи-ри дали потому, что гора напротив похожа на сундук, полный риса. Ещё есть поверье: разбогатев, надо уехать из деревни, иначе богатство не удержишь. Жители каждый год в ночь 9-го дня 9-й луны проводили горный обряд. Сейчас от переправы Дуджи по Имджину ходят лодки с жёлтыми парусами.",
  en:"The name Duji-ri is said to come from the hill opposite, shaped like a chest full of rice, and there's a saying that whoever grows rich must leave the village to keep their wealth. Villagers held a mountain rite every year on the night of the 9th day of the 9th lunar month. Today yellow-sailed boats cruise the Imjin from the Duji ferry."},
 find:{
  ko:"나루에서 임진강 물빛을 보세요. 전설 속 붉은 피가 흘러든 바로 그 강입니다.",
  ru:"Посмотрите с переправы на воду Имджина: это та самая река, в которую утекла кровь из легенды.",
  en:"Look at the Imjin from the ferry: this is the very river the legend's red blood flowed into."}},

// ---------- Поэт и кисэн: могила Хоннан ----------
{id:"pj_hongrang", region:"pj", lat:37.738438, lng:126.715542, // Kakao: адрес 다율동 519-7 (из новостей мэрии Пхаджу), за деревней Чхонсок
 name:{ko:"최경창과 홍랑의 묘", ru:"Могилы поэта Чхве Гёнчхана и Хоннан", en:"Graves of Choe Gyeong-chang and Hongrang"},
 place:{ko:"파주시 다율동 (청석마을 뒤 산자락)", ru:"Пхаджу, Даюль-дон, склон за деревней Чхонсок", en:"Dayul-dong, Paju, on the slope behind Cheongseok village"},
 legend:{
  ko:"시인 최경창이 함경도에서 벼슬을 할 때, 홍원의 기생이자 시인인 홍랑과 깊이 사랑하게 되었습니다. 임기를 마치고 한양으로 떠날 때 홍랑은 멀리까지 배웅하고, 버들가지를 꺾어 시 한 수와 함께 보냈습니다.\n\n“묏버들 가려 꺾어 보내노라 님의 손에\n주무시는 창밖에 심어 두고 보소서\n밤비에 새잎 나거든 나인가도 여기소서”\n\n몇 해 뒤 최경창이 병들었다는 소식을 듣자 홍랑은 이레 밤낮을 걸어 한양으로 와 그를 돌보았습니다. 1583년 최경창이 세상을 떠나자 홍랑은 무덤 곁에서 3년 동안 묘를 지켰고, 임진왜란 때는 그의 시고를 안고 피란해 지켜 냈습니다.",
  ru:"Поэт Чхве Гёнчхан служил в провинции Хамгён и полюбил кисэн и поэтессу Хоннан из Хонвона. Когда срок службы кончился и он уезжал в столицу, Хоннан провожала его далеко, а на прощание сорвала ивовую ветку и послала её вместе со стихами:\n\n«Горную иву, выбрав, срываю и шлю в руки любимому.\nПосади её у окна, где спишь, и смотри на неё.\nКогда после ночного дождя распустятся новые листья — думай, что это я».\n\nЧерез несколько лет, услышав, что он болен, Хоннан семь дней и ночей шла пешком в Ханян, чтобы ухаживать за ним. Когда в 1583 году Чхве Гёнчхан умер, она три года жила у его могилы, а во время Имджинской войны бежала, прижимая к себе рукописи его стихов, и сохранила их.",
  en:"While the poet Choe Gyeong-chang served in Hamgyeong Province, he fell deeply in love with Hongrang, a gisaeng and poet of Hongwon. When his term ended and he left for the capital, she saw him off far down the road, broke a willow branch and sent it with a poem:\n\n“I choose and break a mountain willow and send it to my love's hands.\nPlant it outside the window where you sleep and look at it.\nWhen new leaves open after the night rain, think it is me.”\n\nYears later, hearing he was ill, Hongrang walked seven days and nights to Hanyang to nurse him. When he died in 1583, she kept watch at his grave for three years, and during the Imjin War she fled carrying his poems and saved them."},
 fact:{
  ko:"집안 사람들은 홍랑이 세상을 떠나자 최경창 부부의 무덤 바로 아래에 묻어 주었습니다. 무덤은 1969년 월롱 영태리에서 지금 자리로 옮겨졌고, 1981년 두 사람의 시를 새긴 시비가 세워졌습니다.",
  ru:"Когда Хоннан умерла, род Чхве похоронил её прямо под могилой Чхве Гёнчхана и его жены — небывалая честь для кисэн. В 1969 году могилы перенесли сюда из Ёнтхэ-ри, а в 1981 году поставили камень со стихами обоих.",
  en:"When Hongrang died, the Choe family buried her just below the grave of Choe Gyeong-chang and his wife, an unheard-of honor for a gisaeng. In 1969 the graves were moved here from Yeongtae-ri, and in 1981 a stone carved with both their poems was erected."},
 find:{
  ko:"맨 아래 무덤이 홍랑, 그 위가 최경창 부부의 무덤입니다. 시비에서 버들가지 시를 찾아 읽어 보세요.",
  ru:"Нижняя могила — Хоннан, выше — Чхве Гёнчхан с женой. Найдите на камне стихи об иве.",
  en:"The lowest grave is Hongrang's; above it lies Choe Gyeong-chang with his wife. Find the willow poem on the stone."}},

// ---------- Хризантемы горы Чанмёнсан ----------
{id:"pj_jangmyeongsan", region:"pj", lat:37.751946, lng:126.728984, approx:true, // Kakao: 장명산 (파주시 오도동)
 name:{ko:"장명산 구절초", ru:"Хризантемы горы Чанмёнсан", en:"The Chrysanthemums of Jangmyeongsan"},
 place:{ko:"파주시 오도동 (교하)", ru:"Пхаджу, Одо-дон (Кёха)", en:"Odo-dong, Gyoha, Paju"},
 legend:{
  ko:"조선 시대, 아이를 갖지 못해 애태우던 한 아낙이 있었습니다. 그녀는 장명산 중턱의 약수터에 올라 약수로 밥을 지어 먹고, 구절초를 달인 물을 마시며 정성껏 빌었습니다.\n\n얼마 뒤 그녀에게 정말 아기가 생겼습니다. 이 소문은 한양까지 퍼졌습니다.\n\n그 뒤로 해마다 음력 9월 9일이면 아이를 바라는 한양의 부인들이 장명산을 찾아와 약수로 밥을 짓고 구절초 물을 마셨다고 합니다.",
  ru:"В эпоху Чосон жила женщина, которая очень хотела ребёнка, но никак не могла его родить. Она поднялась к целебному источнику на склоне Чанмёнсан, варила рис на его воде, пила отвар горной хризантемы ку-джольчхо и усердно молилась.\n\nВскоре у неё и правда родился малыш. Слух об этом дошёл до самой столицы.\n\nС тех пор каждый год в 9-й день 9-й луны столичные дамы, мечтавшие о детях, приезжали на Чанмёнсан, варили рис на воде источника и пили хризантемовый отвар.",
  en:"In the Joseon era there was a woman who longed for a child but could not have one. She climbed to the spring on the slope of Jangmyeongsan, cooked rice with its water, drank tea of gujeolcho mountain chrysanthemum, and prayed with all her heart.\n\nSoon she really did have a baby. Word spread all the way to the capital.\n\nAfter that, every year on the 9th day of the 9th lunar month, ladies from Hanyang who hoped for children came to Jangmyeongsan to cook rice with the spring water and drink chrysanthemum tea."},
 fact:{
  ko:"구절초는 음력 9월 9일 무렵 꺾어야 약효가 좋다고 해서 ‘아홉 마디 풀’이라는 이름을 얻었다고 합니다. 전설 속 약수터는 지금은 흔적이 남아 있지 않습니다.",
  ru:"Считается, что ку-джольчхо — «трава девяти колен» — лечебнее всего, если сорвать её около 9-го дня 9-й луны. Источник из легенды сейчас не сохранился.",
  en:"Gujeolcho, the nine-joint herb, is said to be most potent when picked around the 9th day of the 9th lunar month. The spring from the legend has since disappeared."},
 find:{
  ko:"가을에 오셨다면 산길에서 하얗고 연분홍빛인 구절초 꽃을 찾아보세요.",
  ru:"Если вы пришли осенью — поищите на тропе бело-розовые цветы ку-джольчхо.",
  en:"If you're here in autumn, look along the trail for the white and pale-pink gujeolcho flowers."}},

// ---------- Лодочник с переправы Имджин ----------
{id:"pj_imjinnaru", region:"pj", lat:37.888073, lng:126.799936, approx:true, // Kakao: 임진리 나루터마을 (문산읍 임진리 5-4)
 name:{ko:"임진나루 뱃사공", ru:"Лодочник переправы Имджин", en:"The Ferryman of Imjin Ferry"},
 place:{ko:"파주시 문산읍 임진리", ru:"Пхаджу, Мунсан-ып, Имджин-ри", en:"Imjin-ri, Munsan-eup, Paju"},
 legend:{
  ko:"임진나루는 한양에서 의주로 가는 큰길의 나루라 온갖 사람이 오갔습니다. 이곳 뱃사공들은 옷차림과 몸짓만 보고도 손님이 어떤 사람인지 척척 알아맞히기로 유명했습니다.\n\n다른 나루의 짓궂은 뱃사공이 이를 시험해 보려고 양반처럼 갓을 쓰고 도포를 입고 와서 반말로 말했습니다. “여보게, 나를 좀 건네주게.” 그러자 김 사공이 버럭 화를 냈습니다. “너는 아무리 양반 흉내를 내도 나 같은 뱃놈이다!”\n\n“어찌 그리 잘 아느냐?” 김 사공이 답했습니다. “노를 젓느라 고개가 한쪽으로 돌아갔고, 강바람에 수염이 한쪽으로 쏠렸으니 뱃사공이 아니고 무엇이냐?” 두 사람은 껄껄 웃었다고 합니다.",
  ru:"Переправа Имджин стояла на большой дороге из Ханяна в Ыйджу, и через неё шёл самый разный народ. Здешние лодочники славились тем, что по одежде и манерам угадывали, кто перед ними.\n\nОдин шутник-лодочник с другой переправы решил это проверить: надел шляпу-кат и халат янбана, пришёл и сказал свысока: «Эй, перевези-ка меня». Лодочник Ким вспылил: «Как ни рядись в янбана, а ты такой же лодочник, как я!»\n\n«Как ты узнал?» — «Голова у тебя повёрнута набок — от вёсел, а борода сбилась на одну сторону — от речного ветра. Кто ж ты, как не лодочник?» И оба расхохотались.",
  en:"Imjin Ferry stood on the great road from Hanyang to Uiju, and all kinds of people passed through. Its ferrymen were famous for telling who a passenger was just from his clothes and bearing.\n\nA prankster ferryman from another crossing decided to test this. Dressed in a nobleman's hat and robe, he came and said haughtily: “You there, take me across.” Ferryman Kim flared up: “Dress like a nobleman all you want, you're a boatman just like me!”\n\n“How could you tell?” “Your head is turned to one side from rowing, and your beard is swept to one side by the river wind. What else could you be?” And the two of them roared with laughter."},
 fact:{
  ko:"임진나루는 조선 시대 한양과 개성, 의주를 잇는 가장 중요한 나루 가운데 하나였습니다. 바로 위쪽 언덕에 율곡 이이의 화석정이 있습니다.",
  ru:"В эпоху Чосон переправа Имджин была одной из главных на пути из Ханяна в Кэсон и Ыйджу. Прямо над ней на холме стоит павильон Хвасокчон учёного Ли И.",
  en:"In the Joseon era Imjin Ferry was one of the key crossings linking Hanyang with Gaeseong and Uiju. Just above it on the hill stands Yi I's Hwaseokjeong pavilion."},
 find:{
  ko:"강가에서 바람을 맞아 보세요. 바람이 오래 불면 수염이 어느 쪽으로 쏠릴까요?",
  ru:"Постойте у реки на ветру: в какую сторону он сбил бы бороду лодочнику?",
  en:"Stand by the river in the wind: which way would it sweep a ferryman's beard?"}},

// ---------- Долина восьми учёных (팔학골) ----------
{id:"pj_palhakgol", region:"pj", lat:37.737617, lng:126.834426, approx:true, // Kakao: 팔학골 (조리읍 봉일천리) = «봉일천4리» из легенды
 name:{ko:"팔학골", ru:"Долина восьми учёных Пхальхакколь", en:"Palhakgol, the Valley of Eight Scholars"},
 place:{ko:"파주시 조리읍 봉일천리", ru:"Пхаджу, Чори-ып, Бонильчхон-ри", en:"Bongilcheon-ri, Jori-eup, Paju"},
 legend:{
  ko:"옛날 봉일천 공릉천이 내려다보이는 벼랑 위 숲속 골짜기에, 김정국이라는 선비가 초가집을 짓고 글을 읽었습니다.\n\n그는 조광조와 함께 나라를 바로 세우려다 기묘사화 때 벼슬에서 쫓겨났습니다. 그러나 그의 학문이 깊다는 소문을 듣고 선비들이 하나둘 골짜기로 찾아왔습니다.\n\n여덟 명의 선비가 이 초당에서 함께 글을 읽고 토론했습니다. 그 뒤로 사람들은 이 골짜기를 ‘여덟 학자의 골짜기’, 팔학골이라 불렀습니다.",
  ru:"Когда-то в лесистой долине над обрывом, откуда видна речка Конныннчхон, учёный Ким Чонгук построил соломенную хижину и читал книги.\n\nОн вместе с Чо Гванджо пытался навести порядок в государстве, но после смуты 1519 года его лишили должности. Однако слава о его учёности разошлась, и в долину один за другим стали приходить учёные люди.\n\nВосемь учёных вместе читали и спорили в этой хижине. С тех пор долину и называют Пхальхакколь — «долина восьми учёных».",
  en:"Long ago, in a wooded valley above the cliffs overlooking the Gongneungcheon stream, a scholar named Kim Jeong-guk built a thatched hut and read his books.\n\nAlong with Jo Gwang-jo he had tried to reform the government, but after the purge of 1519 he lost his post. Still, word of his learning spread, and scholars began to come to the valley one by one.\n\nEight scholars read and debated together in that hut. Ever since, the valley has been called Palhakgol, the valley of eight scholars."},
 fact:{
  ko:"김정국은 훗날 다시 벼슬에 올라 전라도와 경상도 관찰사로 백성을 위한 정치를 폈고, 농촌의 응급 처치법을 모은 ‘촌가구급방’을 남겼습니다. 숙종 때 고양에 세운 문봉서원에서 이 선비들을 함께 모셨습니다.",
  ru:"Позже Ким Чонгук вернулся на службу, был губернатором провинций Чолла и Кёнсан, заботился о народе и составил «Чхонга кугыпбан» — сборник деревенских способов первой помощи. При короле Сукчоне в Кояне основали академию Мунбон, где почитали этих учёных.",
  en:"Kim Jeong-guk later returned to office, governed Jeolla and Gyeongsang provinces with care for the people, and compiled the Chonga Gugeupbang, a book of village first-aid remedies. Under King Sukjong the Munbong Seowon academy in Goyang was founded to honor these scholars."},
 find:{
  ko:"골짜기 위에서 공릉천 쪽을 내려다보세요. 여덟 선비가 글을 읽다 바라보던 풍경입니다.",
  ru:"Посмотрите из долины вниз на речку Конныннчхон: этот вид видели восемь учёных, отрываясь от книг.",
  en:"Look down from the valley toward the Gongneungcheon: the view the eight scholars saw when they looked up from their books."}},

// ---------- Дворец, где родились три слуха (금파리 궁터) ----------
{id:"pj_gungteo", region:"pj", lat:37.924145, lng:126.845765, approx:true, // Kakao: адрес 파평면 금파리; в 파주군지 — «오천궁 유허, 파평산 아래»
 name:{ko:"금파리 고려 궁터", ru:"Руины корёского дворца в Кымпха-ри", en:"Goryeo Palace Site in Geumpa-ri"},
 place:{ko:"파주시 파평면 금파리 (파평산 아래)", ru:"Пхаджу, Пхапхён-мён, Кымпха-ри, у горы Пхапхёнсан", en:"Geumpa-ri, Papyeong-myeon, Paju, below Papyeongsan"},
 legend:{
  ko:"파평산 아래 금파리에는 고려 임금이 머물던 행궁, 오천궁이 있었다고 합니다. 고려가 기울어 갈 무렵, 이곳에서 이상한 소문 세 가지가 퍼져 나갔습니다.\n\n“돌 위에 좀이 먹는다.” “말 머리에 뿔이 난다.” “까마귀 머리가 하얗게 센다.” 모두 있을 수 없는 일들이었습니다.\n\n그런데 사람들은 머지않아 그 일들이 정말로 일어났다고 수군거렸고, 얼마 뒤 고려는 정말 무너졌습니다. 사람들은 그 세 가지 소문이 나라가 망할 징조였다고 말했습니다.",
  ru:"Говорят, в Кымпха-ри у подножия Пхапхёнсана был путевой дворец корёских королей — Очхонгун. Когда Корё клонилось к упадку, отсюда поползли три странных слуха.\n\n«Камень изъели жучки». «У коня на голове вырос рог». «Голова у вороны поседела». Всё это было невозможно.\n\nНо вскоре люди зашептались, что всё это и правда случилось, а потом и само Корё пало. С тех пор говорили, что три слуха были знаками гибели царства.",
  en:"They say Geumpa-ri, below Papyeongsan, held Ocheongung, a detached palace of the Goryeo kings. As Goryeo declined, three strange rumors spread from here.\n\n“Worms are eating the stone.” “A horn has grown on a horse's head.” “A crow's head has turned white.” All of them impossible.\n\nYet people soon whispered that each had really happened, and before long Goryeo fell. Ever after, people said the three rumors had been omens of the kingdom's end."},
 fact:{
  ko:"옛 파주군지에는 ‘파평산 아래 임진강 가에 오천궁 옛터가 있고 주춧돌이 아직 남아 있다’고 적혀 있습니다. 금파리는 파평 윤씨 시조 윤신달이 살던 마을로도 전해집니다.",
  ru:"В старой летописи уезда Пхаджу записано: «у подножия Пхапхёнсана, на берегу Имджина — руины дворца Очхонгун, камни-основания ещё целы». Кымпха-ри считают и родной деревней Юн Синдаля, основателя рода Пхапхён Юн.",
  en:"The old Paju county gazetteer records: “Below Papyeongsan, by the Imjin, are the ruins of Ocheongung; the foundation stones still remain.” Geumpa-ri is also said to be the home village of Yun Sin-dal, founder of the Papyeong Yun clan."},
 find:{
  ko:"마을 둘레의 오래된 돌들을 살펴보세요. 반듯하게 다듬은 큰 돌이 있다면, 궁궐 주춧돌이었을지도 모릅니다.",
  ru:"Приглядитесь к старым камням вокруг деревни: ровно обтёсанный большой камень мог быть основанием дворцовой колонны.",
  en:"Look closely at old stones around the village: a large, neatly squared one may once have held up a palace pillar."}},

// ---------- Жернов честного министра (양미골 연자방아) ----------
{id:"pj_yangmigol", region:"pj", lat:37.933363, lng:126.879265, approx:true, // Kakao: адрес 파평면 덕천리 (деревня Янмиголь, точного адреса нет)
 name:{ko:"양미골 연자방아", ru:"Жернов честного министра в Янмиголе", en:"The Honest Minister's Millstone in Yangmigol"},
 place:{ko:"파주시 파평면 덕천리", ru:"Пхаджу, Пхапхён-мён, Токчхон-ри", en:"Deokcheon-ri, Papyeong-myeon, Paju"},
 legend:{
  ko:"조선 초 정승 유관은 높은 벼슬에 있으면서도 울타리도 없는 초라한 집에서 살 만큼 청렴했습니다. 경상도 관찰사 이희가 그 모습을 보다 못해 자기 돈으로 집과 방앗간 지붕을 고쳐 주었습니다.\n\n그러자 유관은 크게 노했습니다. “관찰사가 얼마나 재물이 많기에 남의 집까지 고치는가!” 그는 이희의 재산을 조사하게 했고, 조상에게 물려받은 돈이라는 것이 밝혀지고서야 노여움을 풀었습니다.\n\n세상을 떠나기 전 유관은 이희에게 부탁했습니다. “내가 죽거든 이 연자방아를 고향으로 옮겨 내 아내가 여생을 살게 해 주게.” 이희는 약속대로 방아를 파평 덕천리 양미골로 옮겼다고 전해집니다.",
  ru:"Министр начала Чосон Ю Гван был так честен, что, занимая высокий пост, жил в бедном доме даже без ограды. Губернатор провинции Кёнсан Ли Хи не выдержал и на свои деньги починил ему дом и крышу мельницы.\n\nЮ Гван страшно рассердился: «Сколько же у губернатора богатств, что он чинит чужие дома?!» Он велел проверить имущество Ли Хи и успокоился, лишь узнав, что деньги были наследством от предков.\n\nПеред смертью Ю Гван попросил Ли Хи: «Когда я умру, перевези этот жернов ко мне на родину, чтобы жене было на что дожить». И Ли Хи, говорят, сдержал слово и перевёз жернов в Янмиголь, в Токчхон-ри.",
  en:"Yu Gwan, an early-Joseon state councillor, was so upright that despite his high rank he lived in a shabby house without even a fence. Yi Hui, governor of Gyeongsang Province, couldn't bear it and repaired the house and the mill roof with his own money.\n\nYu Gwan was furious: “How rich must a governor be to fix other people's houses?!” He had Yi Hui's wealth investigated, and calmed down only when it proved to be an inheritance from his ancestors.\n\nBefore he died, Yu Gwan asked Yi Hui: “When I'm gone, move this millstone to my home village so my wife can live out her days.” Yi Hui, they say, kept his word and moved it to Yangmigol in Deokcheon-ri."},
 fact:{
  ko:"유관은 ‘청백리’로 이름난 인물로, 비가 새는 집에서 우산을 받쳐 들고 “우산 없는 집은 어찌 견디겠소” 했다는 이야기로도 유명합니다. 연자방아는 한국전쟁 때 부서져 지금은 흔적만 남았다고 합니다.",
  ru:"Ю Гван вошёл в историю как образец «чистого чиновника». Известна и другая история: когда в его доме протекла крыша, он сидел под зонтом и вздыхал: «А каково тем, у кого и зонта нет?» Жернов разрушился во время Корейской войны, от него остались лишь следы.",
  en:"Yu Gwan became a model of the honest official. Another story tells how, when his roof leaked, he sat under an umbrella and sighed, “How do those without umbrellas manage?” The millstone was destroyed during the Korean War; only traces remain."},
 find:{
  ko:"마을에서 크고 둥근 맷돌 같은 돌을 찾아보세요. 소가 돌리던 연자방아의 돌입니다.",
  ru:"Поищите в деревне большой круглый камень, похожий на жёрнов: такой камень вращал вол.",
  en:"Look around the village for a big round stone like a millstone: an ox used to turn one like it."}}
]);
