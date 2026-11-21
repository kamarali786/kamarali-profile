/* =========================================================
   Kamarali Maknojiya — portfolio scripts (v2)
   ========================================================= */

// ---- EmailJS settings (from your EmailJS dashboard) ----
// The template should use: {{from_name}}, {{reply_to}}, {{subject}}, {{message}}
const EMAILJS = {
  publicKey: "ld7KH-e2_PdMCcmrE",
  serviceId: "service_4drocoa",
  templateId: "template_tncnn79",
};
const MY_EMAIL = "maknojiyakamarali504@gmail.com";
const ROLES = [
  "PHP & Laravel Developer",
  "REST API Builder",
  "Billing & Payments Backend",
  "MySQL Query Tuner",
];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- toast ---------- */
const toastEl = $("#toast");
let toastTimer;
function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
}

/* ---------- year ---------- */
$("#year").textContent = new Date().getFullYear();

/* ---------- live local time (IST) ---------- */
(function () {
  const el = $("#localTime");
  if (!el) return;
  const fmt = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true });
  const tick = () => {
    const now = new Date();
    const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false }).format(now));
    const awake = hour >= 9 && hour < 22;
    el.textContent = `${fmt.format(now)} IST · ${awake ? "online now" : "back in the morning"}`;
  };
  tick();
  setInterval(tick, 15000);
})();

/* ---------- theme toggle (dark default) ---------- */
(function () {
  const btn = $("#themeToggle");
  const root = document.documentElement;
  const icon = btn.querySelector("i");
  const isLight = () => root.dataset.theme === "light";
  const sync = () => {
    icon.className = isLight() ? "fa-solid fa-moon" : "fa-solid fa-sun";
    btn.setAttribute("aria-label", isLight() ? "Switch to dark theme" : "Switch to light theme");
    $('meta[name="theme-color"]').setAttribute("content", isLight() ? "#F5F7FB" : "#0A0F1E");
  };
  btn.addEventListener("click", () => {
    root.dataset.theme = isLight() ? "dark" : "light";
    try { localStorage.setItem("km-theme", root.dataset.theme); } catch (e) {}
    sync();
  });
  sync();
})();

/* ---------- nav: mobile menu, scrolled state, active link, progress ---------- */
(function () {
  const nav = $("#nav");
  const links = $("#navLinks");
  const burger = $("#menuToggle");
  const progress = $("#progress");
  const toTop = $("#toTop");

  const setOpen = (open) => {
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    burger.querySelector("i").className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  };
  burger.addEventListener("click", () => setOpen(!links.classList.contains("open")));
  $$("a", links).forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
  document.addEventListener("click", (e) => { if (!nav.contains(e.target)) setOpen(false); });

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 8);
    toTop.classList.toggle("show", y > 700);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  if ("IntersectionObserver" in window) {
    const map = new Map($$("a", links).map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) {
          $$("a", links).forEach((a) => a.classList.remove("is-active"));
          map.get(en.target.id)?.classList.add("is-active");
        }
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }
})();

/* ---------- typed role ---------- */
(function () {
  const el = $("#typed");
  if (!el || reduceMotion) return;
  let i = 0, j = ROLES[0].length, deleting = true;
  const step = () => {
    const word = ROLES[i];
    j += deleting ? -1 : 1;
    el.textContent = word.slice(0, j);
    let wait = deleting ? 35 : 70;
    if (!deleting && j === word.length) { deleting = true; wait = 2200; }
    else if (deleting && j === 0) { deleting = false; i = (i + 1) % ROLES.length; wait = 300; }
    setTimeout(step, wait);
  };
  setTimeout(step, 2600);
})();

/* ---------- reveal on scroll + counters ---------- */
(function () {
  const items = $$(".reveal");
  // stagger siblings a little
  items.forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--d", `${Math.min(sibs.indexOf(el), 5) * 0.07}s`);
  });

  const countUp = (el) => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = target.toFixed(dec) + suffix; return; }
    const start = performance.now(), dur = 1400;
    const frame = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    $$("[data-count]").forEach(countUp);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-in");
      const num = en.target.querySelector("[data-count]");
      if (num) countUp(num);
      io.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
})();

/* ---------- project filter + spotlight ---------- */
(function () {
  const buttons = $$(".filter");
  const cards = $$("#projectGrid .project");
  buttons.forEach((b) => b.addEventListener("click", () => {
    const f = b.dataset.filter;
    buttons.forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", String(x === b)); });
    cards.forEach((c) => c.classList.toggle("is-hidden", f !== "all" && !c.dataset.tags.split(" ").includes(f)));
  }));
  cards.forEach((c) => c.addEventListener("pointermove", (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", `${e.clientX - r.left}px`);
    c.style.setProperty("--my", `${e.clientY - r.top}px`);
  }));
})();

/* ---------- copy email ---------- */
(function () {
  const btn = $("#copyEmail");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const email = btn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = email; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (_) {}
      ta.remove();
    }
    btn.querySelector("span").textContent = "Copied";
    btn.querySelector("i").className = "fa-solid fa-check";
    toast("Email address copied");
    setTimeout(() => {
      btn.querySelector("span").textContent = "Copy";
      btn.querySelector("i").className = "fa-regular fa-copy";
    }, 2000);
  });
})();

/* ---------- resume download feedback ---------- */
$$('a[download][href$=".pdf"]').forEach((a) =>
  a.addEventListener("click", () => toast("Downloading resume…"))
);

/* ---------- contact form (EmailJS, live validation) ---------- */
(function () {
  const form = $("#contactForm");
  if (!form) return;
  const btn = $("#sendBtn");
  const status = $("#formStatus");
  const counter = $("#counter");
  const msg = $("#message");
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  if (window.emailjs) emailjs.init({ publicKey: EMAILJS.publicKey });

  const rules = {
    name: (v) => v.trim().length > 1,
    email: (v) => emailOk(v.trim()),
    message: (v) => v.trim().length >= 10,
  };
  const touched = new Set();

  function validate(id) {
    const input = document.getElementById(id);
    const ok = rules[id](input.value);
    const field = input.closest(".field");
    field.classList.toggle("is-invalid", !ok);
    field.classList.toggle("is-valid", ok);
    input.setAttribute("aria-invalid", String(!ok));
    return ok;
  }
  Object.keys(rules).forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener("blur", () => { if (input.value) { touched.add(id); validate(id); } });
    input.addEventListener("input", () => { if (touched.has(id)) validate(id); });
  });

  const updateCount = () => {
    const n = msg.value.length, max = msg.maxLength;
    counter.textContent = `${n} / ${max}`;
    counter.classList.toggle("is-near", n > max * 0.9);
  };
  msg.addEventListener("input", updateCount);
  updateCount();

  const topic = () => (form.querySelector('input[name="topic"]:checked') || {}).value || "Portfolio contact";

  function setStatus(type, html) {
    status.className = "form__status " + (type || "");
    status.innerHTML = html;
  }

  function fallbackLinks() {
    const subject = `${topic()} — from ${$("#name").value.trim() || "your portfolio"}`;
    const body = `${msg.value.trim()}\n\n— ${$("#name").value.trim()} (${$("#email").value.trim()})`;
    const q = `su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return {
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${MY_EMAIL}&${q}`,
      mailto: `mailto:${MY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    };
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.website.value) return; // honeypot caught a bot

    Object.keys(rules).forEach((id) => touched.add(id));
    const valid = Object.keys(rules).map(validate).every(Boolean);
    if (!valid) {
      setStatus("err", "Check the highlighted fields and try again.");
      form.querySelector(".is-invalid input, .is-invalid textarea")?.focus();
      return;
    }

    const label = btn.querySelector("span");
    const icon = btn.querySelector("i");
    btn.disabled = true;
    label.textContent = "Sending…";
    icon.className = "fa-solid fa-circle-notch fa-spin";
    setStatus("", "");

    try {
      if (!window.emailjs) throw new Error("EmailJS not loaded");
      await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
        from_name: $("#name").value.trim(),
        reply_to: $("#email").value.trim(),
        subject: topic(),
        message: msg.value.trim(),
      });
      form.reset();
      touched.clear();
      $$(".field", form).forEach((f) => f.classList.remove("is-valid", "is-invalid"));
      updateCount();
      setStatus("ok", '<i class="fa-solid fa-circle-check"></i> Message sent! I\'ll reply to your email within a day.');
      toast("Message sent ✓");
    } catch (err) {
      const l = fallbackLinks();
      setStatus("err", `The message couldn't be sent from this page. Send it with <a href="${l.gmail}" target="_blank" rel="noopener">Gmail</a> or your <a href="${l.mailto}">mail app</a> instead. Your text is already filled in.`);
    } finally {
      btn.disabled = false;
      label.textContent = "Send message";
      icon.className = "fa-solid fa-paper-plane";
    }
  });
})();
