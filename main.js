
let voices = [];


const voiceSelect = document.getElementById("voiceSelect");
const textArea = document.getElementById("text");
const speakBtn = document.getElementById("speakBtn");
const msg = document.getElementById("msg");


if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
  speakBtn.disabled = true;
  msg.textContent = "Sizning brauzeringiz matnni ovozga o‘girishni qo‘llab-quvvatlamaydi.";
}


function loadVoices() {
  voices = window.speechSynthesis.getVoices() || [];
  voiceSelect.innerHTML = "";

  if (voices.length === 0) {
   
    const opt = document.createElement("option");
    opt.textContent = "Ovozlar yuklanmoqda…";
    opt.disabled = true;
    opt.selected = true;
    voiceSelect.appendChild(opt);
    return;
  }

 
  voices
    .sort((a, b) => a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name))
    .forEach((v) => {
      const option = document.createElement("option");
      option.value = v.name;
      option.textContent = `${v.name} (${v.lang})${v.default ? " — default" : ""}`;
      voiceSelect.appendChild(option);
    });

  
  const prefer = voices.find(v => /uz|ru|en/i.test(v.lang));
  if (prefer) voiceSelect.value = prefer.name;
}


function speakText() {
  const text = (textArea.value || "").trim();
  if (!text) {
    msg.textContent = "Avval matn kiriting 🙂";
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);

  const selected = voices.find(v => v.name === voiceSelect.value);
  if (selected) utter.voice = selected;

 
  utter.rate = 1;  
  utter.pitch = 1; 

  
  speakBtn.disabled = true;
  msg.textContent = "O‘qilmoqda…";

  utter.onend = () => {
    speakBtn.disabled = false;
    msg.textContent = "Tayyor!";
  };
  utter.onerror = () => {
    speakBtn.disabled = false;
    msg.textContent = "Xatolik yuz berdi. Qayta urining.";
  };

  window.speechSynthesis.cancel(); 
  window.speechSynthesis.speak(utter);
}

speakBtn.addEventListener("click", speakText);
window.speechSynthesis.onvoiceschanged = loadVoices;
window.addEventListener("load", loadVoices);
