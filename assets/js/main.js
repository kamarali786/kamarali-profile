/* =========================================================
   Kamarali Maknojiya — portfolio scripts
   ========================================================= */

// ---- EmailJS settings (from your EmailJS dashboard) ----
const EMAILJS = {
  publicKey: "ld7KH-e2_PdMCcmrE",
  serviceId: "service_4drocoa",
  templateId: "template_tncnn79",
};
const MY_EMAIL = "maknojiyakamarali504@gmail.com";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

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

/* ---------- theme toggle ---------- */
(function () {
  const btn = $("#themeToggle");
  const root = document.documentElement;
  const icon = btn.querySelector("i");
  const isDark = () =>
    root.dataset.theme
      ? root.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  const sync = () => {
    icon.className = isDark() ? "fa-solid fa-sun" : "fa-solid fa-moon";
    btn.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme");
  };
  btn.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    try { localStorage.setItem("km-theme", root.dataset.theme); } catch (e) {}
    sync();
  });
  sync();
})();

/* ---------- nav: mobile menu, scrolled state, active link ---------- */
(function () {
  const nav = $("#nav");
  const links = $("#navLinks");
  const burger = $("#menuToggle");

  const setOpen = (open) => {
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.querySelector("i").className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  };
  burger.addEventListener("click", () => setOpen(!links.classList.contains("open")));
  $$("a", links).forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if ("IntersectionObserver" in window) {
    const map = new Map($$("a", links).map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            $$("a", links).forEach((a) => a.classList.remove("is-active"));
            map.get(en.target.id)?.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }
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
      btn.querySelector("span").textContent = "Copy address";
      btn.querySelector("i").className = "fa-regular fa-copy";
    }, 2000);
  });
})();

/* ---------- resume download feedback ---------- */
$$('a[download][href$=".pdf"]').forEach((a) =>
  a.addEventListener("click", () => toast("Downloading resume…"))
);

/* ---------- contact form (EmailJS) ---------- */
(function () {
  const form = $("#contactForm");
  if (!form) return;
  const btn = $("#sendBtn");
  const status = $("#formStatus");
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  if (window.emailjs) emailjs.init({ publicKey: EMAILJS.publicKey });

  const rules = {
    name: (v) => v.trim().length > 1,
    email: (v) => emailOk(v.trim()),
    message: (v) => v.trim().length >= 10,
  };

  function validate(id) {
    const input = document.getElementById(id);
    const ok = rules[id](input.value);
    input.closest(".field").classList.toggle("is-invalid", !ok);
    input.setAttribute("aria-invalid", String(!ok));
    return ok;
  }
  Object.keys(rules).forEach((id) =>
    document.getElementById(id).addEventListener("blur", () => {
      if (document.getElementById(id).value) validate(id);
    })
  );

  function setStatus(type, html) {
    status.className = "form__status " + (type || "");
    status.innerHTML = html;
  }

  function mailtoLink() {
    const subject = $("#subject").value.trim() || "Message from your portfolio";
    const body = `${$("#message").value.trim()}\n\n— ${$("#name").value.trim()} (${$("#email").value.trim()})`;
    return `mailto:${MY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.website.value) return; // honeypot caught a bot

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
        subject: $("#subject").value.trim() || "Portfolio contact",
        message: $("#message").value.trim(),
      });
      form.reset();
      setStatus("ok", '<i class="fa-solid fa-circle-check"></i> Message sent. I\'ll reply to your email within a day.');
      toast("Message sent");
    } catch (err) {
      setStatus(
        "err",
        `The message couldn't be sent from this page. <a href="${mailtoLink()}">Send it from your mail app instead</a>.`
      );
    } finally {
      btn.disabled = false;
      label.textContent = "Send message";
      icon.className = "fa-solid fa-paper-plane";
    }
  });
})();
