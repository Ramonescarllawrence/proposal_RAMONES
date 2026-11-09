(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body;
  const GIF = body.dataset.gif;
  const calm = false;   // effects always play at full strength

  // ---------- data ----------
  const DATES = [["🌅","Sunset picnic"],["🎬","Movie night in"],["🔭","Stargazing walk"],["☕","Coffee date"],["🎡","Theme park"],["🏖️","Beach day"]];
  const FOODS = [["🍕","Pizza"],["🍣","Sushi"],["🍜","Ramen"],["🍔","Burgers"],["🍰","Dessert"],["🍦","Ice cream"]];
  const TIMES = [["12:30","Lunch"],["17:30","Sunset"],["19:00","Dinner"],["23:30","Midnight snack"]];
  const NO_MSGS = [
    "No? Okay, but I'll keep asking.",
    "Really? My heart just skipped a beat.",
    "Are you sure? Look at this face.",
    "Please? I made a whole page for this.",
    "My heart is crying right now.",
    "I'll wait here. Forever, if I have to."
  ];
  const NO_LABELS = ["No", "No 🙃", "No…", "No… 🥺", "No… 😭"];
  const CRY_GIFS = ["bubu-dudu.gif", "sad-cry.gif", "crying1.gif"];

  // ---------- state (kept in localStorage so a refresh keeps progress) ----------
  const KEY = "dateProposal.v2";
  let s = { step: "landing", date: "", day: "", time: "", food: "" };
  try { Object.assign(s, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };

  // ---------- navigation ----------
  function show(step, userAction = true) {
    s.step = step; save();
    $$("[data-step]").forEach(el => el.hidden = el.dataset.step !== step);
    step === "result" ? partyStart() : partyStop();
    refresh();
    if (step === "result") { fillTicket(); if (userAction) { stamp(); confetti(); } }
    if (userAction) $(`[data-step="${step}"] .title`)?.focus();
  }
  function refresh() {
    $$("[data-need]").forEach(b => b.disabled = !s[b.dataset.need]);
  }
  $$("[data-go]").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.go === "landing") resetNo();
    show(b.dataset.go);
  }));

  // ---------- option pickers ----------
  function pills(box, list, key, cls) {
    list.forEach(([e, l]) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = cls; b.dataset.value = l;
      b.innerHTML = cls === "opt" ? `<span class="e" aria-hidden="true">${e}</span>${l}` : l;
      b.addEventListener("click", () => { s[key] = l; save(); mark(box, l); refresh(); });
      box.appendChild(b);
    });
    mark(box, s[key]);
  }
  const mark = (box, v) => $$("button", box).forEach(b => b.setAttribute("aria-pressed", b.dataset.value === v));

  pills($("#date-options"), DATES, "date", "opt");
  pills($("#food-options"), FOODS, "food", "opt");

  const dayInput = $("#day-input"), chips = $("#time-chips"), hh = $("#hh"), mm = $("#mm"), ampm = $("#ampm");
  const pad = n => String(n).padStart(2, "0");
  let meridiem = "";
  const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dayInput.min = today.toISOString().slice(0, 10);
  dayInput.value = s.day;
  dayInput.addEventListener("input", () => { s.day = dayInput.value; save(); refresh(); });
  // hour / minute / AM-PM pickers -> s.time stored as 24h "HH:MM"
  hh.innerHTML = '<option value="">Hour</option>' + Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("");
  mm.innerHTML = '<option value="">Min</option>' + Array.from({ length: 12 }, (_, i) => `<option value="${pad(i * 5)}">${pad(i * 5)}</option>`).join("");
  function syncTime() {
    if (hh.value && mm.value && meridiem) s.time = `${pad((+hh.value % 12) + (meridiem === "PM" ? 12 : 0))}:${mm.value}`;
    else s.time = "";
    save(); markChips(); refresh();
  }
  function setTimeUI(t) {
    if (!t) { hh.value = mm.value = ""; meridiem = ""; }
    else { const [H, M] = t.split(":").map(Number); meridiem = H >= 12 ? "PM" : "AM"; hh.value = String(H % 12 || 12); mm.value = pad(Math.min(55, Math.round(M / 5) * 5)); }
    $$("button", ampm).forEach(b => b.setAttribute("aria-pressed", b.dataset.value === meridiem));
  }
  hh.addEventListener("change", syncTime); mm.addEventListener("change", syncTime);
  $$("button", ampm).forEach(b => b.addEventListener("click", () => { meridiem = b.dataset.value; $$("button", ampm).forEach(x => x.setAttribute("aria-pressed", x === b)); syncTime(); }));
  setTimeUI(s.time);
  TIMES.forEach(([t, l]) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.dataset.value = t; b.textContent = `${l} · ${fmtTime(t)}`;
    b.addEventListener("click", () => { setTimeUI(t); syncTime(); });
    chips.appendChild(b);
  });
  function markChips() { $$(".chip", chips).forEach(c => c.setAttribute("aria-pressed", c.dataset.value === s.time)); }
  markChips();

  // ---------- the shy No button ----------
  const btnYes = $("#btn-yes"), btnNo = $("#btn-no"), slot = $("#no-slot");
  const msg = $("#no-message"), hero = $("#hero-gif");
  let noCount = 0, flying = false;

  function resetNo() {
    noCount = 0; flying = false;
    btnNo.classList.remove("fly", "flee"); btnNo.removeAttribute("style"); btnNo.textContent = "No";
    slot.appendChild(btnNo);
    btnYes.style.setProperty("--g", 0);
    msg.hidden = true; hero.src = `${GIF}/cuddle-cute.gif`;
  }
  function dodge() {
    if (!flying) { body.appendChild(btnNo); btnNo.classList.add("fly"); flying = true; }
    const m = 12, w = btnNo.offsetWidth, h = btnNo.offsetHeight, y = btnYes.getBoundingClientRect();
    let x, t, tries = 0;
    do {
      x = m + Math.random() * (innerWidth - w - 2 * m);
      t = m + Math.random() * (innerHeight - h - 2 * m);
      tries++;
    } while (tries < 12 && x < y.right + 10 && x + w > y.left - 10 && t < y.bottom + 10 && t + h > y.top - 10);
    btnNo.style.left = x + "px"; btnNo.style.top = t + "px";
  }
  // ---------- effects engine (one canvas, many particles) ----------
  const cv = document.createElement("canvas"); cv.id = "fx"; cv.setAttribute("aria-hidden", "true"); body.appendChild(cv);
  const ctx = cv.getContext("2d"); let parts = [], raf = 0, W = 0, H = 0;
  function fit() { const d = devicePixelRatio || 1; W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); }
  fit(); addEventListener("resize", fit);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const PAPER = ["#e5456f", "#f9b4c2", "#f4bb4a", "#c8916b", "#ffffff", "#4a2c25"];

  // emit(count, x, y, {from, to (degrees), speed:[min,max], g, chars, size:[min,max], life:[min,max]})
  function emit(n, x, y, o) {
    n = Math.ceil(n * (calm ? .4 : 1));   // reduced-motion setting: fewer particles, never none
    for (let i = 0; i < n; i++) {
      const ang = rnd(o.from, o.to) * Math.PI / 180, sp = rnd(...o.speed), ch = o.chars && o.chars[i % o.chars.length];
      parts.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, g: o.g, drag: o.drag || .99, rot: rnd(0, 6.3), vr: rnd(-.25, .25),
        size: rnd(...o.size), max: rnd(...o.life), t: 0, ch, col: PAPER[i % PAPER.length], wob: rnd(0, 6.3) });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    parts = parts.filter(p => {
      p.vy += p.g; p.vx *= p.drag; p.vy *= p.drag; p.x += p.vx + Math.sin(p.t / 9 + p.wob) * (p.ch ? .3 : .6); p.y += p.vy; p.rot += p.vr; p.t++;
      if (p.t > p.max || p.y > H + 60 || p.y < -200) return false;
      ctx.save(); ctx.globalAlpha = Math.min(1, (p.max - p.t) / (p.max * .3));
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      if (p.ch) { ctx.font = `${p.size}px serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(p.ch, 0, 0); }
      else { ctx.fillStyle = p.col; ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * .66); }
      ctx.restore(); return true;
    });
    raf = parts.length ? requestAnimationFrame(tick) : 0;
    if (!raf) ctx.clearRect(0, 0, W, H);
  }
  function retrigger(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  // Pressing No: the card shakes, the picture wobbles, and a heartbreak scatters out of the button
  function scatter() {
    const r = btnNo.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, k = Math.min(noCount, 8);
    retrigger($(".sheet"), "shake"); retrigger(hero.parentElement, "wobble");
    emit(14 + k * 3, x, y, { from: 0, to: 360, speed: [4, 10 + k], g: .28, chars: ["💔", "💧", "😢", "💧"], size: [18, 32], life: [70, 110] });
    emit(24 + k * 4, x, y, { from: 0, to: 360, speed: [3, 9], g: .35, size: [6, 11], life: [50, 90] });       // paper bits
    if (k >= 4) for (let i = 0; i < 12; i++) setTimeout(() => emit(1, rnd(0, W), -20, { from: 80, to: 100, speed: [2, 4], g: .06, chars: ["💧"], size: [18, 28], life: [140, 200] }), i * 90); // crying rain
  }

  btnNo.addEventListener("click", e => {
    noCount++;
    msg.textContent = NO_MSGS[Math.min(noCount - 1, NO_MSGS.length - 1)]; msg.hidden = false;
    hero.src = `${GIF}/${CRY_GIFS[(noCount - 1) % CRY_GIFS.length]}`;
    hero.alt = "A cartoon character crying";
    btnNo.textContent = noCount >= 5 ? "NO PLEASE STOP CLICKING ME 😭" : NO_LABELS[Math.min(noCount, NO_LABELS.length - 1)];
    btnNo.classList.toggle("flee", noCount >= 5);
    btnYes.style.setProperty("--g", Math.min(noCount, 7));
    scatter();
    if (noCount >= 2) dodge();
  });
  // after 5 clicks the No button runs away from the mouse pointer
  const FLEE = 150;
  document.addEventListener("pointermove", e => {
    if (noCount < 5 || !flying || e.pointerType === "touch") return;
    const r = btnNo.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, d = Math.hypot(cx - e.clientX, cy - e.clientY);
    if (d > FLEE) return;
    const m = 12, w = r.width, h = r.height, push = FLEE - d + 70, ux = d ? (cx - e.clientX) / d : 1, uy = d ? (cy - e.clientY) / d : 0;
    let x = Math.max(m, Math.min(innerWidth - w - m, r.left + ux * push)), y = Math.max(m, Math.min(innerHeight - h - m, r.top + uy * push));
    if (Math.hypot(x + w / 2 - e.clientX, y + h / 2 - e.clientY) < FLEE * .8) {      // cornered: hop to a far spot
      for (let i = 0; i < 20; i++) {
        x = rnd(m, innerWidth - w - m); y = rnd(m, innerHeight - h - m);
        if (Math.hypot(x + w / 2 - e.clientX, y + h / 2 - e.clientY) > 280) break;
      }
    }
    btnNo.style.left = x + "px"; btnNo.style.top = y + "px";
  });
  btnYes.addEventListener("click", () => {
    const r = btnYes.getBoundingClientRect();
    emit(22, r.left + r.width / 2, r.top + r.height / 2, { from: 200, to: 340, speed: [5, 11], g: .22, chars: ["💖", "💕", "✨"], size: [18, 30], life: [60, 100] });
    resetNo(); show("date");
  });

  // ---------- result ----------
  function fmtDay(d) { return new Date(d + "T00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }); }
  function fmtTime(t) { return new Date("2000-01-01T" + t).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }); }
  function fillTicket() {
    $("#t-date").textContent = s.date; $("#t-day").textContent = fmtDay(s.day);
    $("#t-time").textContent = fmtTime(s.time); $("#t-food").textContent = s.food;
  }
  // Date confirmed: cannons from both corners, falling hearts, a stamp slams onto the ticket
  function confetti() {
    const chars = ["💖", "✨", "🎉", "💕", "🌸"];
    [0, 260, 520].forEach(d => setTimeout(() => {
      emit(34, 0, H, { from: -85, to: -50, speed: [14, 24], g: .38, drag: .985, chars: chars, size: [20, 34], life: [110, 170] });
      emit(34, W, H, { from: -130, to: -95, speed: [14, 24], g: .38, drag: .985, chars: chars, size: [20, 34], life: [110, 170] });
      emit(50, 0, H, { from: -85, to: -50, speed: [12, 22], g: .38, drag: .985, size: [7, 13], life: [110, 170] });
      emit(50, W, H, { from: -130, to: -95, speed: [12, 22], g: .38, drag: .985, size: [7, 13], life: [110, 170] });
    }, d));
    for (let i = 0; i < (calm ? 10 : 26); i++) setTimeout(() => emit(1, rnd(0, W), -30, { from: 75, to: 105, speed: [1.5, 3.5], g: .03, chars: ["💖", "💗", "💕"], size: [16, 30], life: [220, 320] }), 700 + i * 110);
  }
  function stamp() {
    const t = $('[data-step="result"] .ticket'); if (!t) return;
    let m = $(".stamp", t);
    if (!m) { m = document.createElement("div"); m.className = "stamp"; m.textContent = "It's a date"; t.appendChild(m); }
    retrigger(t, "land"); retrigger(m, "slam");
  }

  const status = $("#status");
  $("#save-plan").addEventListener("click", async e => {
    const btn = e.currentTarget; btn.disabled = true; status.textContent = "Saving…";
    try {
      const res = await fetch(body.dataset.planUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "X-CSRF-TOKEN": $('meta[name="csrf-token"]').content },
        body: JSON.stringify({ to: body.dataset.to, from: body.dataset.from, date_type: s.date, day: s.day, time: s.time, food: s.food })
      });
      if (!res.ok) throw new Error(res.status);
      const { url } = await res.json();
      status.innerHTML = `Saved. Your plan is at <a href="${url}">${url}</a>`;
      try { await navigator.clipboard.writeText(url); status.append(" (link copied)"); } catch (e) {}
    } catch (err) {
      status.textContent = "Couldn't save the plan. Check your connection and try again.";
    }
    btn.disabled = false;
  });

  $("#add-cal").addEventListener("click", () => {
    const p = n => String(n).padStart(2, "0");
    const start = new Date(`${s.day}T${s.time}`), end = new Date(start.getTime() + 2 * 3600e3);
    const f = d => `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
    const ics = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//date-proposal//EN","BEGIN:VEVENT",
      `UID:${Date.now()}@date-proposal`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`,
      `SUMMARY:Our date: ${s.date}`, `DESCRIPTION:Eating: ${s.food}`, "END:VEVENT","END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "our-date.ics"; a.click();
    URL.revokeObjectURL(a.href);
  });

  $("#restart").addEventListener("click", () => {
    s = { step: "landing", date: "", day: "", time: "", food: "" }; save();
    dayInput.value = ""; setTimeUI(""); status.textContent = "";
    [$("#date-options"), $("#food-options")].forEach(b => mark(b, "")); markChips(); resetNo();
    show("landing");
  });

  // ---------- GIF scatter: burst out of the card, then roam and bounce around the whole screen ----------
  const party = $("#party"), G = $$(".g", party).map(el => ({ el, x: 0, y: 0, vx: 0, vy: 0, rot: 0, vr: 0, cr: 1, wait: 0 }));
  let pRaf = 0;
  const gw = g => g.el.offsetWidth || 140, gh = g => g.el.offsetHeight || 140;
  // grab a GIF and drag it around; letting go throws it
  G.forEach(g => {
    g.el.addEventListener("pointerdown", e => {
      if (g.wait > 0) return;
      g.held = true; g.vx = g.vy = g.pvx = g.pvy = 0; g.px = e.clientX; g.py = e.clientY; g.ox = e.clientX - g.x; g.oy = e.clientY - g.y;
      g.el.setPointerCapture(e.pointerId); g.el.classList.add("held"); e.preventDefault();
    });
    g.el.addEventListener("pointermove", e => {
      if (!g.held) return;
      g.pvx = g.pvx * .5 + (e.clientX - g.px) * .5; g.pvy = g.pvy * .5 + (e.clientY - g.py) * .5; g.px = e.clientX; g.py = e.clientY;
      g.x = Math.max(0, Math.min(innerWidth - gw(g), e.clientX - g.ox)); g.y = Math.max(0, Math.min(innerHeight - gh(g), e.clientY - g.oy));
    });
    const drop = () => {
      if (!g.held) return;
      g.held = false; g.el.classList.remove("held");
      const m = Math.hypot(g.pvx, g.pvy) || 1, k = Math.min(m, 38) / m; g.vx = g.pvx * k; g.vy = g.pvy * k;
    };
    g.el.addEventListener("pointerup", drop); g.el.addEventListener("pointercancel", drop);
  });
  function partyStart() {
    if (pRaf) return;
    party.classList.add("on");
    G.forEach((g, i) => {
      const a = (i / G.length) * Math.PI * 2 + rnd(-.3, .3), sp = rnd(16, 26);
      g.x = innerWidth / 2 - gw(g) / 2; g.y = innerHeight / 2 - gh(g) / 2;
      g.vx = Math.cos(a) * sp; g.vy = Math.sin(a) * sp;
      g.cr = rnd(.9, 2); g.rot = rnd(-14, 14); g.vr = rnd(-.5, .5); g.wait = i * 5;
    });
    pRaf = requestAnimationFrame(partyTick);
  }
  function partyStop() {
    cancelAnimationFrame(pRaf); pRaf = 0; party.classList.remove("on");
    G.forEach(g => g.el.style.opacity = 0);
  }
  function partyTick() {
    G.forEach(g => {
      g.el.style.opacity = g.wait > 0 ? 0 : 1;
      if (g.wait > 0) { g.wait--; return; }
      if (g.held) { g.pvx *= .8; g.pvy *= .8; g.el.style.transform = `translate3d(${g.x}px,${g.y}px,0) rotate(0deg) scale(1.08)`; return; }
      const sp = Math.hypot(g.vx, g.vy) || 1, ns = sp + (g.cr - sp) * .03, turn = rnd(-.03, .03);   // slow down to cruising speed, wander a little
      const vx = g.vx * Math.cos(turn) - g.vy * Math.sin(turn), vy = g.vx * Math.sin(turn) + g.vy * Math.cos(turn);
      g.vx = vx * ns / sp; g.vy = vy * ns / sp;
      g.x += g.vx; g.y += g.vy;
      const w = gw(g), h = gh(g);
      if (g.x < 0) { g.x = 0; g.vx = Math.abs(g.vx); } else if (g.x > innerWidth - w) { g.x = innerWidth - w; g.vx = -Math.abs(g.vx); }
      if (g.y < 0) { g.y = 0; g.vy = Math.abs(g.vy); } else if (g.y > innerHeight - h) { g.y = innerHeight - h; g.vy = -Math.abs(g.vy); }
      g.rot += g.vr; if (Math.abs(g.rot) > 14) g.vr *= -1;
      g.el.style.transform = `translate3d(${g.x}px,${g.y}px,0) rotate(${g.rot}deg)`;
    });
    pRaf = requestAnimationFrame(partyTick);
  }

  // ---------- boot ----------
  const valid = { landing: 1, date: 1, day: s.date, time: s.date && s.day, food: s.date && s.day && s.time, result: s.date && s.day && s.time && s.food };
  show(valid[s.step] ? s.step : "landing", false);
})();