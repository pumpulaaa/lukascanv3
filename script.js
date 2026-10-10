const photoInput = document.getElementById("photoInput");
const dropZone = document.getElementById("dropZone");
const previewWrap = document.getElementById("previewWrap");
const photoPreview = document.getElementById("photoPreview");
const fileName = document.getElementById("fileName");
const scanBtn = document.getElementById("scanBtn");
const errorMsg = document.getElementById("errorMsg");
const uploadPanel = document.getElementById("uploadPanel");
const scanPanel = document.getElementById("scanPanel");
const resultsPanel = document.getElementById("resultsPanel");
let currentPhotoUrl = "";
let scanTimers = [];

const reports = [
  {
    score: 7, verdict: "საღი აზრი ვერ მოიძებნა",
    caption: "ტვინი ალბათ შესვენებაზეა გასული.",
    roast: "ჩვენმა სუპერკომპიუტერმა 3 წამი იფიქრა, შემდეგ ამოიოხრა და ყავა მოითხოვა. დასკვნა: შენს ტვინს განახლება სჭირდება… ან დამტენი მაინც. 😂",
    metrics: [["საღი აზრი", 2, "2/100"], ["იდეების გენერირება", 18, "18/100"], ["უაზრო გადაწყვეტილებები", 99, "99/100"], ["ლაპარაკის სიჩქარე", 96, "96/100"], ["დაფიქრების დრო", 4, "4/100"], ["თავდაჯერებულობა", 100, "100/100"]]
  },
  {
    score: 12, verdict: "ტვინი პასუხს არ იძლევა",
    caption: "სიგნალი სუსტია, მაგრამ იმედი ჯერ არის.",
    roast: "ანალიზის დროს ტვინის უჯრედებმა ჯგუფური ჩატი გახსნეს და ყველამ დატოვა ჯგუფი. არ ინერვიულო — მთავარია, თავდაჯერებულობა გაქვს! 💀",
    metrics: [["საღი აზრი", 9, "9/100"], ["იდეების გენერირება", 23, "23/100"], ["უაზრო გადაწყვეტილებები", 94, "94/100"], ["ლაპარაკის სიჩქარე", 88, "88/100"], ["დაფიქრების დრო", 6, "6/100"], ["თავდაჯერებულობა", 98, "98/100"]]
  },
  {
    score: 3, verdict: "სისტემა დაიბნა",
    caption: "შედეგი იმდენად უცნაურია, რომ სერვერს რცხვენია.",
    roast: "ვცადეთ შენი აზრების პოვნა, მაგრამ მხოლოდ ექო დაგვიბრუნდა: „რა?“ „ჰა?“ „მერე რა?“ გილოცავ, შენ ახალი რეკორდი დაამყარე. 🏆",
    metrics: [["საღი აზრი", 1, "1/100"], ["იდეების გენერირება", 11, "11/100"], ["უაზრო გადაწყვეტილებები", 100, "100/100"], ["ლაპარაკის სიჩქარე", 91, "91/100"], ["დაფიქრების დრო", 2, "2/100"], ["თავდაჯერებულობა", 100, "100/100"]]
  },

  
{
    score: 16,
    verdict: "ქაოსის გენიოსი",
    caption: "შენ ქაოსს ქმნი იქ, სადაც სხვები წესრიგს ხედავენ.",
    roast: "შენი გადაწყვეტილებები იმდენად მოულოდნელია, რომ Google Maps-იც კი გეუბნება: გზას თავად მიხედეო. თავდაჯერებულობა გაქვს, ლოგიკა — მოგვიანებით მოვა. 🗺️",
    metrics: [
        ["საღი აზრი", 14, "14/100"],
        ["იდეების გენერირება", 76, "76/100"],
        ["უაზრო გადაწყვეტილებები", 98, "98/100"],
        ["ლაპარაკის სიჩქარე", 85, "85/100"],
        ["დაფიქრების დრო", 8, "8/100"],
        ["თავდაჯერებულობა", 100, "100/100"]
    ]
},


{
    score: 4,
    verdict: "ტვინი შვებულებაშია",
    caption: "სისტემამ გონების კვალი ვერ აღმოაჩინა.",
    roast: "შენი აზრების სკანირება დავიწყეთ, მაგრამ ტვინმა პასუხი არ გაგვცა. ალბათ უხელფასო შვებულებაშია. 📉",
    metrics: [
        ["საღი აზრი", 4, "4/100"],
        ["იდეების გენერირება", 12, "12/100"],
        ["უაზრო გადაწყვეტილებები", 96, "96/100"],
        ["ლაპარაკის სიჩქარე", 88, "88/100"],
        ["დაფიქრების დრო", 3, "3/100"],
        ["თავდაჯერებულობა", 99, "99/100"]
    ]
},



{
    score: 2,
    verdict: "კრიტიკული შეცდომა",
    caption: "სკანირებისას ლოგიკა სისტემიდან მოულოდნელად გავიდა.",
    roast: "შენი ტვინი იმდენად ჩუმად მუშაობს, რომ ენერგიის გადასახადსაც კი არ ითხოვს. რთულ კითხვას რომ გისვამენ, პასუხის ნაცვლად სისტემური განახლება გჭირდება. 🔄",
    metrics: [
        ["საღი აზრი", 2, "2/100"],
        ["იდეების გენერირება", 9, "9/100"],
        ["უაზრო გადაწყვეტილებები", 100, "100/100"],
        ["ლაპარაკის სიჩქარე", 93, "93/100"],
        ["დაფიქრების დრო", 1, "1/100"],
        ["თავდაჯერებულობა", 97, "97/100"]
    ]
},

  
  
];

function setPhoto(file) {
  errorMsg.textContent = "";
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    errorMsg.textContent = "გთხოვ, აირჩიე JPG, PNG ან WEBP ფორმატის ფოტო.";
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    errorMsg.textContent = "ფოტოს ზომა 10 მბ-ზე ნაკლები უნდა იყოს.";
    return;
  }
  if (currentPhotoUrl) URL.revokeObjectURL(currentPhotoUrl);
  currentPhotoUrl = URL.createObjectURL(file);
  photoPreview.src = currentPhotoUrl;
  fileName.textContent = file.name;
  previewWrap.hidden = false;
  dropZone.hidden = true;
  scanBtn.disabled = false;
}
photoInput.addEventListener("change", () => setPhoto(photoInput.files[0]));
document.getElementById("changePhoto").addEventListener("click", () => photoInput.click());

["dragenter", "dragover"].forEach(eventName => {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });
});
["dragleave", "drop"].forEach(eventName => {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
  });
});
dropZone.addEventListener("drop", event => setPhoto(event.dataTransfer.files[0]));

function clearTimers() {
  scanTimers.forEach(timer => clearTimeout(timer));
  scanTimers = [];
}
function later(callback, delay) {
  scanTimers.push(setTimeout(callback, delay));
}

function startScan() {
  if (!currentPhotoUrl) return;
  errorMsg.textContent = "";
  uploadPanel.hidden = true;
  resultsPanel.hidden = true;
  scanPanel.hidden = false;
  document.getElementById("scanPhoto").src = currentPhotoUrl;
  document.getElementById("progressFill").style.width = "0%";
  document.getElementById("progressLabel").textContent = "0% დასრულებულია";
  document.getElementById("scanTitle").textContent = "სისტემის მომზადება…";
  document.getElementById("scanDesc").textContent = "გთხოვ, მოითმინე. მეცნიერება ძალიან დაკავებულია.";
  const items = [...document.querySelectorAll("#scanList li")];
  items.forEach(item => { item.className = ""; item.lastElementChild.textContent = "მოლოდინში"; });
  const steps = [
    [12, "ფოტოს ჩატვირთვა…", "ფოტო წარმატებით ჩაიტვირთა.", 650],
    [35, "ტვინის სიგნალის ძიება…", "ვცდილობთ სიგნალის დაჭერას.", 1500],
    [59, "საღი აზრის შემოწმება…", "საღი აზრი ჯერ არ პასუხობს.", 2400],
    [82, "შედეგების გამოთვლა…", "კალკულატორმაც ეჭვი შეიტანა.", 3300],
    [100, "ანგარიშის მომზადება…", "დასრულდა! შედეგებს თავადაც ვერ ვიჯერებთ.", 4300]
  ];
  steps.forEach((step, index) => later(() => {
    document.getElementById("progressFill").style.width = step[0] + "%";
    document.getElementById("progressLabel").textContent = step[0] + "% დასრულებულია";
    document.getElementById("scanTitle").textContent = step[1];
    document.getElementById("scanDesc").textContent = step[2];
    const activeIndex = Math.min(index, items.length - 1);
    items.forEach((item, i) => {
      item.className = i < activeIndex ? "done" : (i === activeIndex ? "active" : "");
      item.lastElementChild.textContent = i < activeIndex ? "დასრულებულია" : (i === activeIndex ? "მიმდინარეობს…" : "მოლოდინში");
    });
    if (step[0] === 100) later(showResults, 800);
  }, step[3]));
}
function showResults() {
  scanPanel.hidden = true;
  resultsPanel.hidden = false;
  const report = reports[Math.floor(Math.random() * reports.length)];
  document.getElementById("score").textContent = report.score;
  document.getElementById("scoreBar").style.width = report.score + "%";
  document.getElementById("scoreCaption").textContent = report.caption;
  document.getElementById("verdict").textContent = report.verdict;
  document.getElementById("roastText").textContent = report.roast;
  const metrics = document.getElementById("metrics");
  metrics.innerHTML = "";
  report.metrics.forEach(metric => {
    const item = document.createElement("div");
    item.className = "metric";
    const top = document.createElement("div");
    top.className = "metric-top";
    const label = document.createElement("span");
    label.textContent = metric[0];
    const value = document.createElement("span");
    value.textContent = metric[2];
    top.append(label, value);
    const track = document.createElement("div");
    track.className = "metric-track";
    const fill = document.createElement("span");
    fill.style.width = metric[1] + "%";
    track.append(fill);
    item.append(top, track);
    metrics.append(item);
  });
  window.scrollTo({ top: resultsPanel.offsetTop - 20, behavior: "smooth" });
}
function resetApp(goHome) {
  clearTimers();
  scanPanel.hidden = true;
  resultsPanel.hidden = true;
  uploadPanel.hidden = false;
  if (goHome) window.scrollTo({ top: 0, behavior: "smooth" });
}
scanBtn.addEventListener("click", startScan);
document.getElementById("againBtn").addEventListener("click", () => {
  resetApp(false);
  startScan();
});
document.getElementById("homeBtn").addEventListener("click", () => {
  resetApp(true);
});





const cameraBtn = document.getElementById("cameraBtn");
const cameraModal = document.getElementById("cameraModal");
const cameraVideo = document.getElementById("cameraVideo");
let cameraStream = null;
let facing = "user"; // "user" = front camera, "environment" = back camera

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  cameraVideo.srcObject = null;
}

async function openCamera() {
  errorMsg.textContent = "";
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    errorMsg.textContent = "ამ ბრაუზერში კამერა მხარდაჭერილი არ არის (საჭიროა HTTPS).";
    return;
  }
  try {
    stopCamera();
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facing },
      audio: false
    });
    cameraVideo.srcObject = cameraStream;
    cameraModal.hidden = false;
  } catch (err) {
    cameraModal.hidden = true;
    errorMsg.textContent = "კამერაზე წვდომა ვერ მოხერხდა. გთხოვ, დაუშვი კამერის გამოყენება.";
  }
}

function closeCamera() {
  stopCamera();
  cameraModal.hidden = true;
}

function capturePhoto() {
  if (!cameraVideo.videoWidth) return;
  const canvas = document.createElement("canvas");
  canvas.width = cameraVideo.videoWidth;
  canvas.height = cameraVideo.videoHeight;
  canvas.getContext("2d").drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
  canvas.toBlob(blob => {
    if (!blob) return;
    const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
    setPhoto(file);
    closeCamera();
  }, "image/jpeg", 0.92);
}

cameraBtn.addEventListener("click", openCamera);
document.getElementById("changeCamera").addEventListener("click", openCamera);
document.getElementById("captureBtn").addEventListener("click", capturePhoto);
document.getElementById("closeCamBtn").addEventListener("click", closeCamera);
document.getElementById("switchCamBtn").addEventListener("click", () => {
  facing = facing === "user" ? "environment" : "user";
  openCamera();
});