// Английский
window.I18N = window.I18N || {};
I18N.en = {
  sub:"Legend Walk", stamps:"Stamps",
  navWalk:"Legends", navMap:"Map", navChal:"Challenges", navMe:"Profile", navMore:"Nubi",
  all:"All", sealGot:"Got", back:"← Back", userLegend:"submitted by {n}", tagUser:"user", where:"Location",
  addBtn:"+ Submit a legend",
  // Отметка по GPS
  checkin:"Stamp it on site", locating:"Finding your location…",
  tooFar:"You are {d} away. Get within {r} m to collect the stamp.",
  gpsDenied:"No location access. Allow location in your browser settings.",
  gpsErr:"Couldn't get your location. Try again outdoors.",
  checkinHint:"The stamp only works within {r} m of the place.",
  distAway:"{d} away", kakao:"Open in Kakao Map", showMap:"Show on map",
  visited:"Visited {d}", sealBig:"Visited", noTitle:"No title", testStamp:"test stamp",
  myLoc:"Locate me",
  // Челленджи
  chH:"Challenges", chActive:"Active", chDoneH:"Completed", chDone:"Completed!", reward:"Reward title: {t}", seeAll:"All challenges →",
  chChain:"Route · within {d} {d:day|days}", chPeriod:"Limited time · {a} – {b}", chWeekend:"Weekend",
  // Профиль
  meH:"Profile", edit:"Change nickname", save:"Save", cancel:"Cancel",
  stStamps:"Stamps", stTitles:"Titles", stAdded:"Legends",
  titlesH:"Titles", titlesHint:"Tap Wear to show a title next to your nickname.", wear:"Wear", worn:"Wearing",
  bookH:"Stamp book", bookEmpty:"No stamps yet",
  rankH:"This month's ranking", rankNote:"Other players are examples. Real rankings appear once the server is connected.", you:"you",
  settingsH:"Settings", testMode:"Test mode", testHint:"When on, the stamp button works without a GPS check. Handy for testing at home.",
  testOn:"Test mode on", testOff:"Test mode off",
  reset:"Delete all data", resetQ:"This deletes your stamps, titles, legends, nickname and the link to your server account. It can't be undone. Continue?", resetYes:"Delete everything",
  // Добавление легенды
  addH:"Submit a legend", fName:"Place name", fNamePh:"e.g. Seobongsan summit", fRegion:"Region",
  fPlace:"Address or directions", fPlacePh:"e.g. Hyangnam, Hwaseong",
  fStory:"The legend", fStoryPh:"What locals tell, what the sign says",
  fSubmit:"Submit legend", fNote:"Saved on this phone only for now. Once the server is connected, everyone will see it. Write in any language.",
  // Раздел «Нуби»
  moreH:"More in Nubi", inUse:"Live", soon:"Coming soon",
  // Разделы во вкладке «Нуби». Ключи старые (их ждёт app.js), содержимое — под идеи команды:
  // meet = футзал, gear = кемпинг, cup = рыбалка, cult = турниры и челленджи
  sec:{walk:["Legend Walk","Visit legendary places, collect stamps"], meet:["Futsal","Team matching by skill and fair-play rating, local team rankings"], gear:["Camping","Campsites, reviews, find people to go with"],
       cup:["Fishing","Fishing spots, catch log, angler meetups"], cult:["Contests & Challenges","Local contests, time-limited challenges"]},
  // Уведомления
  toastStamp:"Stamped", toastTitle:"New title: {t}", toastAdded:"Legend submitted",
  toastWorn:"Now wearing “{t}”", toastSaved:"Saved",
  origLang:"This legend was written in {l}. The full app will translate it automatically.",
  // Первый запуск
  wTitle:"Walk to the legends around you", wText:"Visit places tied to local legends, collect stamps, earn titles, and add the stories you know.",
  wLang:"Language", wNick:"Nickname", wNickPh:"2–12 characters", wStart:"Start", nickErr:"Nickname must be 2–12 characters.",
  langName:{ko:"Korean", ru:"Russian", en:"English"},
  hLegend:"The legend", hFact:"What really happened", hFind:"Find it on site",
  noPin:"location pending", approxNote:"Approximate location: stamps work within {r} m.",
  noCoords:"The exact spot isn't marked yet. If you're there, turn on Profile → Mapping mode and record it.",
  markMode:"Mapping mode", markHint:"Stand at the legend's place and tap the button to save that spot as its location.",
  pinHere:"📍 Save this spot as the legend's location", pinSaved:"Saved: {c}", pinOk:"Location saved",
  markOn:"Mapping mode on", markOff:"Mapping mode off",
  pinsH:"Saved locations ({n})", pinsCopy:"Copy and send to the developer", pinsCopied:"Copied",
  photoH:"Photo of the place", takePhoto:"Take a photo in the app", retake:"Retake", shutter:"Shoot",
  photoNeed:"A photo is required. Shoot the place with the app camera on site and the location is added automatically.",
  photoCoords:"Taken {d} · {c}", photoBy:"Photo: {n} · {d}",
  camDenied:"No camera access. Allow the camera in your browser settings.", camErr:"Couldn't open the camera.",
  photoGpsFail:"Couldn't get your location, so the photo wasn't saved. Try again outdoors.",
  findBtn:"Found a sign", findH:"Found a sign", findIntro:"Found a sign with a legend? Photograph it in the app. The location is recorded automatically; later AI reads the text, checks it against other sources and turns it into a new legend.",
  findShoot:"Photograph the sign", findTip1:"Shoot straight on so the text fills the frame.", findTip2:"If there's glare, step to one side.", findTip3:"For long text, take several shots: top and bottom.",
  findNote:"Note (optional)", findNotePh:"e.g. fork below the Seobongsan summit", findSaved:"Find saved",
  findsH:"My finds ({n})", findsHint:"Send opens your phone's share menu with the photo and location. For now, send finds to the developer to be added.",
  findSend:"Send", findSent:"Sent", findSentTag:"sent", findWaitTag:"waiting",
  findCopied:"Location copied. Long-press the photo to save it.", findLongPress:"Long-press the photo to save it, then send it in a messenger.", findShareErr:"Couldn't share",
  qDark:"The photo is too dark; the text may be unreadable. Try again.", qBlurry:"The photo looks blurry. Try again.",
  // Сервер
  sending:"Sending…", nickTaken:"That nickname is taken. Try another.", nickChanged:"Your nickname was taken, so you're now “{n}”. You can change it in your profile.",
  offlineBanner:"No connection to the server. Stamps are saved on this phone only and don't count toward points or rankings.",
  offlineNote:"No server connection: stamp saved on this phone only, no points.", offlineTag:"offline",
  ptsToast:"Collection +{c} · Hikes +{h}", walkedToast:"Hike on foot counted!", bonusToast:"Bonus +{p}: {r}",
  errAlready:"You already checked in here today. Come back tomorrow!", errAcc:"GPS is imprecise (±{a} m). Wait a moment or move to open ground.",
  errTeleport:"Too fast since your last check-in — nobody gets here that quickly.", errServer:"The server didn't respond. Please try again.",
  checkinAgain:"Check in again (hike)", visitedTodayNote:"You already checked in here today. Come back tomorrow for more hike points.",
  diffLbl:"Difficulty: {d} {d:point|points}", keeperLbl:"Keeper of the month: {n} ({c} {c:visit|visits})", keeperNone:"No keeper yet. Visit 3 times this month to become one.",
  ascentBtn:"Start the climb here", ascentHint:"Tap at the trailhead, at least 1 km from the place. Climbing on foot gives ×1.5 points.", ascentOn:"Climb started at {t}", ascentGo:"Stamp at the top within 4 hours.", ascentFar:"You're too close to the place. Start at least 1 km away.",
  stColl:"Collection", stHikes:"Hikes (month)", boardColl:"Collection · month", boardHikes:"Hikes · month", boardAll:"Collection · all time", boardLoading:"Loading…", boardEmpty:"Nobody yet. Be the first!",
  rankNoteServer:"Rankings are calculated by the server. Test stamps don't count.",
  pendingTag:"in review", pendingNote:"This legend is in review. Once approved, everyone can see it and check in here.",
  fNoteServer:"Your legend and photo go to the server. After review everyone sees it and you get 100 points.", toastSubmitted:"Legend sent for review",
  findsHintServer:"Sign photos upload to the server automatically. 30 points after review.", findOnServer:"on server", findUploaded:"Sign photo uploaded",
  pinOkServer:"Location saved and sent for review",
  accountAnon:"You have a temporary account tied to this phone. Connect Kakao to keep your stamps and points — even on a new phone.",
  locale:"en-US"
};

// ===== Sections: sports, fishing, camping =====
Object.assign(I18N.en, {
  secs:{walk:["Legend walk","Visit legend sites and collect stamps"], sport:["Sports","Pitches, futsal, tennis, gyms, pools — and people to play with"],
        fish:["Fishing","Hwaseong fishing spots — fish, fees, what's nearby"], camp:["Camping","Campsites, reviews, people to go with"],
        cult:["Contests","Local tournaments and limited-time challenges"]},
  navPlaces:"Places", navTalk:"Talk", demo:"Preview", nubiNow:"You're here",
  placesN:"{n} {n:place|places}", legendsN:"{n} {n:legend|legends}",
  secDemoNote:"Sports, fishing and camping are a preview built on Hwaseong open data. Talk and booking open after Kakao login.",
  srcNote:"Based on Hwaseong open data (Hwaseong Urban Corporation, city hall, 2025–2026). Call ahead before you go.",
  srcShort:"Source: data.go.kr — Hwaseong Urban Corporation, Hwaseong City",
  campNote:"For now only the city-run auto campsites are listed. Private campsites will come with the Korea Tourism Organization's GoCamping data.",
  nearMe:"📍 Nearest first", noneHere:"No places match this filter.", noMapPin:"No map pin — search the address in Kakao Map",
  bookOnly:"Bookable", bookTag:"bookable",
  bookingH:"Book on 공유누리", bookText:"This place is on Hwaseong's list of public facilities open for booking. Pick a date and time on the government portal 공유누리.", bookBtn:"Open 공유누리",
  gameH:"Get a game together", gameText:"You'll be able to post a game here and find teammates. Skill levels and manner ratings are planned.",
  fishGoH:"Find people to go with", campGoH:"Find people to go with", goText:"Share catches and reviews and find company here.", toTalk:"Open Talk",
  ownerH:"Do you run this place?", ownerText:"Owners and managers will be able to verify “this is my place”, manage photos, hours and prices, and post news.", ownerBtn:"Verify (coming soon)",
  offLbl:"Closed", telLbl:"Phone", call:"Call", guestsLbl:"Guests",
  off:{h:"Seollal and Chuseok holidays", hw:"Seollal, Chuseok, weekends and holidays", w:"Weekends and holidays", n:"Open all year"},
  fishTypes:{r:"Reservoir", s:"Sea", i:"Indoor"}, fishLbl:"Fish", feeLbl:"Fee · capacity", nearLbl:"Nearby",
  feeV:"₩{p}", capV:"{n} {n:spot|spots}", guests:"{n} guests in 2025",
  noCoordsN:"{n} more {n:place|places} without exact coordinates are in the Places list.",
  talkH:"Talk", talkText:"Each section gets its own feed: find teammates, games today, place reviews, questions. Posting opens after Kakao login so the feed stays real people.",
  talkPh:"Write a post", talkSoon:"Opens after Kakao login", talkEmpty:"Nothing here yet. The first posts will show up here.",
  talkTopics:{sport:["Need players","Playing today","Reviews","Questions"], fish:["Catches","Go together","Reviews","Questions"], camp:["Reviews","Go together","Gear","Questions"]},
  kinds:{soccer:"Soccer", futsal:"Futsal", tennis:"Tennis", basket:"Basketball", badm:"Badminton", base:"Baseball", pool:"Pool",
         indoor:"Indoor gym", center:"Sports center", pgolf:"Park golf", jokgu:"Jokgu", gate:"Gateball", inline:"Inline skating",
         xgame:"X-park", archery:"Archery", multi:"Multi-court", etc:"Other"}
});

// ===== Kakao login =====
Object.assign(I18N.en, {
  kakaoStart:"Continue with Kakao", kakaoLink:"Connect Kakao", orNick:"or start with a nickname only",
  kakaoIn:"You're signed in with Kakao. Just pick a nickname for Nubi.",
  accountH:"Account", kakaoLinked:"Kakao connected",
  accountKakao:"Sign in with Kakao on another phone and your stamps and points will be there.",
  kakaoOk:"Kakao connected",
  kakaoTaken:"This Kakao account is already connected to another Nubi profile. You can sign in to that profile, but the temporary records on this phone won't move over.",
  kakaoSwitch:"Sign in to that profile", kakaoErr:"Kakao login failed: {e}"
});

// ===== Wishes and the lantern wall =====
Object.assign(I18N.en, {
  wishStep1:"Come here and get a stamp (within 1 km)", wishStep2:"Write your wish", wishStep3:"Hang a lantern — it lights up on the wall after review", wishGoStamp:"Go to stamp",
  wishPlace:"Wish spot", wishChip:"Wish spots", wishH:"Make a wish",
  wishIntro:"People have made wishes here since long ago. Write yours.",
  wishNeedStamp:"Get a stamp here and you can make a wish.",
  wishPh:"My wish (up to 120 characters)", wishPublic:"Hang a lantern on the wish wall (anonymous)", wishSend:"Make a wish",
  wishRules:"Don't write other people's names or contacts. Public wishes are reviewed and shown without a name.",
  wishEmptyText:"Write your wish", wishOkPrivate:"Wish made. Only you can see it.",
  wishOkPublic:"Lantern hung. It will light up on the wall after review.", wishErrAny:"Couldn't send. Please try again a bit later.",
  wishErr:{no_visit:"Get a stamp at this place first.", limit:"You've made three wishes here today. Come back tomorrow!", bad_text:"A wish is 1–120 characters.", no_user:"No connection to the server."},
  wallH:"Wish wall · {n} {n:lantern|lanterns}", wallEmpty:"No lanterns yet. Light the first one.",
  fulfilledTag:"Came true ✨", mineTag:"mine", myWishesH:"🏮 My wishes",
  wishStatus:{private:"only me", pending:"in review", approved:"glowing on the wall", hidden:"hidden"},
  fulfillBtn:"It came true!", fulfillAsk:"30 days have passed. Did it come true?", fulfilledOk:"Congratulations! Your wish came true ✨",
  noWishes:"No wishes yet. Look for 🏮 wish spots in the list."
});
