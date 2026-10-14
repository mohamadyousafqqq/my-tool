const container = document.getElementById("tool-container");

const toolNames = [
"word-counter",
"bmi-calculator",
"password-generator",
"qr-code-generator",
"age-calculator",
"percentage-calculator",
"case-converter",
"unit-converter",
"random-number-generator",
"base64",
"color-picker",
"text-to-speech"
];

const params = new URLSearchParams(window.location.search);
const pathTool = window.location.pathname.split("/").filter(Boolean).pop();
const selectedTool = params.get("tool") || (toolNames.includes(pathTool) ? pathTool : "word-counter");

const tools = {
"word-counter": {
title: "Word Counter",
description: "Count words, characters, sentences and paragraphs.",
html: "<textarea id="text" rows="7" placeholder="Type or paste your text here"></textarea><div class="result" id="word-result">Words: 0 | Characters: 0 | Sentences: 0 | Paragraphs: 0</div>",
init() {
const input = document.getElementById("text");
const output = document.getElementById("word-result");
const update = () => {
const v = input.value;
const words = v.trim() ? v.trim().split(/\s+/).length : 0;
const sentences = (v.match(/[.!?]+/g) || []).length;
const paragraphs = v.trim() ? v.trim().split(/\n\s*\n/).length : 0;
output.textContent = "Words: ${words} | Characters: ${v.length} | Sentences: ${sentences} | Paragraphs: ${paragraphs}";
};
input.addEventListener("input", update);
}
},
"bmi-calculator": {
title: "BMI Calculator",
description: "Calculate Body Mass Index using metric measurements.",
html: "<label>Weight (kg)</label><input id="weight" type="number" min="1"><label>Height (cm)</label><input id="height" type="number" min="1"><button id="bmi-btn">Calculate BMI</button><div class="result" id="bmi-result"></div>",
init() {
document.getElementById("bmi-btn").onclick = () => {
const w = Number(document.getElementById("weight").value);
const h = Number(document.getElementById("height").value) / 100;
const out = document.getElementById("bmi-result");
if (w <= 0 || h <= 0) { out.textContent = "Enter a valid weight and height."; return; }
const bmi = w / (h * h);
const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal range" : bmi < 30 ? "Overweight" : "Obesity range";
out.textContent = "BMI: ${bmi.toFixed(1)} — ${category}.";
};
}
},
"password-generator": {
title: "Password Generator",
description: "Generate a random password from 8 to 64 characters.",
html: "<label>Password length (8–64)</label><input id="pass-length" type="number" min="8" max="64" value="16"><label><input id="pass-symbols" type="checkbox" checked> Include symbols</label><button id="pass-btn">Generate Password</button><input id="pass-result" readonly placeholder="Your password"><button id="pass-copy">Copy Password</button><div class="result" id="pass-message"></div>",
init() {
document.getElementById("pass-btn").onclick = () => {
const length = Number(document.getElementById("pass-length").value);
const out = document.getElementById("pass-result");
const msg = document.getElementById("pass-message");
if (!Number.isInteger(length) || length < 8 || length > 64) { msg.textContent = "Choose a length from 8 to 64."; return; }
let chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
if (document.getElementById("pass-symbols").checked) chars += "!@#$%&_-+=";
const bytes = new Uint8Array(length);
crypto.getRandomValues(bytes);
out.value = Array.from(bytes, n => chars[n % chars.length]).join("");
msg.textContent = "Password generated.";
};
document.getElementById("pass-copy").onclick = async () => {
const out = document.getElementById("pass-result");
try {
await navigator.clipboard.writeText(out.value);
document.getElementById("pass-message").textContent = "Copied!";
} catch {
out.select();
document.getElementById("pass-message").textContent = "Select and copy the password.";
}
};
}
},
"qr-code-generator": {
title: "QR Code Generator",
description: "Create a QR code from text or a website URL.",
html: "<input id="qr-text" placeholder="Enter text or URL"><button id="qr-btn">Generate QR Code</button><div id="qr-result" class="result"></div>",
init() {
document.getElementById("qr-btn").onclick = () => {
const value = document.getElementById("qr-text").value.trim();
const out = document.getElementById("qr-result");
out.replaceChildren();
if (!value) { out.textContent = "Enter text or a URL first."; return; }
const img = document.createElement("img");
img.alt = "Generated QR code";
img.width = 200;
img.height = 200;
img.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(value);
out.appendChild(img);
};
}
},
"age-calculator": {
title: "Age Calculator",
description: "Calculate your age from your date of birth.",
html: "<label>Date of birth</label><input id="birth-date" type="date"><button id="age-btn">Calculate Age</button><div class="result" id="age-result"></div>",
init() {
document.getElementById("age-btn").onclick = () => {
const raw = document.getElementById("birth-date").value;
const out = document.getElementById("age-result");
if (!raw) { out.textContent = "Please select your birth date."; return; }
const [y, m, d] = raw.split("-").map(Number);
const birth = new Date(y, m - 1, d);
const now = new Date();
if (birth > now) { out.textContent = "Birth date cannot be in the future."; return; }
let years = now.getFullYear() - y;
let months = now.getMonth() - (m - 1);
let days = now.getDate() - d;
if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
if (months < 0) { years--; months += 12; }
out.textContent = "Age: ${years} years, ${months} months and ${days} days.";
};
}
},
"percentage-calculator": {
title: "Percentage Calculator",
description: "Find what percentage one number is of another.",
html: "<label>Value</label><input id="pct-value" type="number"><label>Total</label><input id="pct-total" type="number"><button id="pct-btn">Calculate Percentage</button><div class="result" id="pct-result"></div>",
init() {
document.getElementById("pct-btn").onclick = () => {
const a = document.getElementById("pct-value").value;
const b = document.getElementById("pct-total").value;
const out = document.getElementById("pct-result");
if (a === "" || b === "") { out.textContent = "Enter both numbers."; return; }
if (Number(b) === 0) { out.textContent = "Total cannot be zero."; return; }
out.textContent = "${a} is ${(Number(a) / Number(b) * 100).toFixed(2)}% of ${b}.";
};
}
},
"case-converter": {
title: "Text Case Converter",
description: "Convert text to uppercase, lowercase or title case.",
html: "<textarea id="case-text" rows="6" placeholder="Enter your text"></textarea><button id="upper-btn">UPPERCASE</button><button id="lower-btn">lowercase</button><button id="title-btn">Title Case</button><button id="sentence-btn">Sentence case</button>",
init() {
const input = document.getElementById("case-text");
document.getElementById("upper-btn").onclick = () => input.value = input.value.toUpperCase();
document.getElementById("lower-btn").onclick = () => input.value = input.value.toLowerCase();
document.getElementById("title-btn").onclick = () => input.value.toLowerCase().replace(/\b\p{L}/gu, c => c.toUpperCase());
document.getElementById("sentence-btn").onclick = () => input.value.toLowerCase().replace(/(^\s\p{L}|[.!?]\s*\p{L})/gu, c => c.toUpperCase());
}
},
"unit-converter": {
title: "Length Unit Converter",
description: "Convert common length measurements.",
html: "<label>Value</label><input id="unit-value" type="number" value="1"><label>From</label><select id="unit-from"></select><label>To</label><select id="unit-to"></select><button id="unit-btn">Convert</button><div class="result" id="unit-result"></div>",
init() {
const units = { mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, ft: 0.3048, mile: 1609.344 };
const from = document.getElementById("unit-from");
const to = document.getElementById("unit-to");
Object.keys(units).forEach(k => { from.add(new Option(k, k)); to.add(new Option(k, k)); });
from.value = "m"; to.value = "cm";
document.getElementById("unit-btn").onclick = () => {
const raw = document.getElementById("unit-value").value;
const out = document.getElementById("unit-result");
if (raw === "" || !Number.isFinite(Number(raw))) { out.textContent = "Enter a valid number."; return; }
const result = Number(raw) * units[from.value] / units[to.value];
out.textContent = "${raw} ${from.value} = ${Number(result.toPrecision(10))} ${to.value}";
};
}
},
"random-number-generator": {
title: "Random Number Generator",
description: "Generate a random integer within a chosen range.",
html: "<label>Minimum</label><input id="rand-min" type="number" value="1"><label>Maximum</label><input id="rand-max" type="number" value="100"><button id="rand-btn">Generate Number</button><div class="result" id="rand-result"></div>",
init() {
document.getElementById("rand-btn").onclick = () => {
const min = Number(document.getElementById("rand-min").value);
const max = Number(document.getElementById("rand-max").value);
const out = document.getElementById("rand-result");
if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || max < min || max - min > 4294967295) { out.textContent = "Enter a valid integer range."; return; }
const range = max - min + 1;
const limit = Math.floor(4294967296 / range) * range;
const buf = new Uint32Array(1);
do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
out.textContent = String(min + (buf[0] % range));
};
}
},
"base64": {
title: "Base64 Encoder & Decoder",
description: "Encode text to Base64 or decode Base64 to text.",
html: "<textarea id="b64-input" rows="5" placeholder="Enter text or Base64"></textarea><button id="b64-encode">Encode</button><button id="b64-decode">Decode</button><textarea id="b64-output" rows="5" readonly placeholder="Result"></textarea><div class="result" id="b64-message"></div>",
init() {
const input = document.getElementById("b64-input");
const output = document.getElementById("b64-output");
const msg = document.getElementById("b64-message");
document.getElementById("b64-encode").onclick = () => {
output.value = btoa(unescape(encodeURIComponent(input.value)));
msg.textContent = "Encoded successfully.";
};
document.getElementById("b64-decode").onclick = () => {
try {
output.value = decodeURIComponent(escape(atob(input.value.trim())));
msg.textContent = "Decoded successfully.";
} catch {
output.value = "";
msg.textContent = "Invalid Base64 or text encoding.";
}
};
}
},
"color-picker": {
title: "Color Picker",
description: "Choose a color and copy its HEX value.",
html: "<input id="color-input" type="color" value="#6750A4"><label>HEX color</label><input id="color-hex" readonly value="#6750A4"><div id="color-preview" style="height:100px;border-radius:12px;background:#6750A4;margin:12px 0"></div><button id="color-copy">Copy HEX</button><div class="result" id="color-message"></div>",
init() {
const picker = document.getElementById("color-input");
const hex = document.getElementById("color-hex");
const preview = document.getElementById("color-preview");
picker.oninput = () => { hex.value = picker.value; preview.style.background = picker.value; };
document.getElementById("color-copy").onclick = async () => {
try {
await navigator.clipboard.writeText(hex.value);
document.getElementById("color-message").textContent = "HEX copied!";
} catch {
hex.select();
document.getElementById("color-message").textContent = "Select and copy the HEX value.";
}
};
}
},
"text-to-speech": {
title: "Text to Speech",
description: "Listen to text using your browser's speech engine.",
html: "<textarea id="tts-text" rows="6" placeholder="Enter text to read aloud"></textarea><label>Voice</label><select id="tts-voice"></select><label>Speed</label><input id="tts-rate" type="number" min="0.5" max="2" step="0.1" value="1"><button id="tts-speak">Speak</button><button id="tts-stop">Stop</button><div class="result" id="tts-message"></div>",
init() {
const select = document.getElementById("tts-voice");
const msg = document.getElementById("tts-message");
if (!("speechSynthesis" in window)) { msg.textContent = "Text-to-speech is not supported by this browser."; return; }
const load = () => {
select.replaceChildren();
speechSynthesis.getVoices().forEach((v, i) => select.add(new Option("${v.name} (${v.lang})", String(i)));
};
load();
speechSynthesis.onvoiceschanged = load;
document.getElementById("tts-speak").onclick = () => {
const text = document.getElementById("tts-text").value.trim();
const rate = Number(document.getElementById("tts-rate").value);
if (!text) { msg.textContent = "Enter some text first."; return; }
if (rate < 0.5 || rate > 2) { msg.textContent = "Speed must be between 0.5 and 2."; return; }
speechSynthesis.cancel();
const utterance = new SpeechSynthesisUtterance(text);
utterance.rate = rate;
const voice = speechSynthesis.getVoices()[Number(select.value)];
if (voice) utterance.voice = voice;
utterance.onstart = () => msg.textContent = "Speaking...";
utterance.onend = () => msg.textContent = "Finished.";
utterance.onerror = () => msg.textContent = "Speech playback failed.";
speechSynthesis.speak(utterance);
};
document.getElementById("tts-stop").onclick = () => { speechSynthesis.cancel(); msg.textContent = "Speech stopped."; };
}
}
};

function renderTool() {
const tool = tools[selectedTool] || tools["word-counter"];
document.title = "${tool.title} | My Tools";
container.replaceChildren();
const heading = document.createElement("h2");
heading.textContent = tool.title;
const description = document.createElement("p");
description.textContent = tool.description;
const panel = document.createElement("section");
panel.className = "tool-panel";
panel.innerHTML = tool.html;
container.append(heading, description, panel);
tool.init();
}

if (container) renderTool();
