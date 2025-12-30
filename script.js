const NAV_OPEN_ATTR = "data-open";
const WHATSAPP_NUMBER = "972524640456"; // מספר וואטסאפ של דור ניב

const A11Y_STORAGE_KEYS = {
  fontStep: "a11y_font_step",
  linksUnderline: "a11y_links_underline",
  reduceMotion: "a11y_reduce_motion",
};

function setExpanded(button, expanded) {
  button.setAttribute("aria-expanded", expanded ? "true" : "false");
  button.setAttribute("aria-label", expanded ? "סגור תפריט" : "פתח תפריט");
}

function getScrollBehavior() {
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  return prefersReducedMotion ? "auto" : "smooth";
}

function closeMenu({ button, nav }) {
  nav.removeAttribute(NAV_OPEN_ATTR);
  setExpanded(button, false);
}

function openMenu({ button, nav }) {
  nav.setAttribute(NAV_OPEN_ATTR, "true");
  setExpanded(button, true);

  const firstLink = nav.querySelector("a");
  if (firstLink instanceof HTMLElement) {
    requestAnimationFrame(() => firstLink.focus());
  }
}

function toggleMenu({ button, nav }) {
  const isOpen = nav.getAttribute(NAV_OPEN_ATTR) === "true";
  if (isOpen) closeMenu({ button, nav });
  else openMenu({ button, nav });
}

function setupNav() {
  const button = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!button || !nav) return;

  button.addEventListener("click", () => toggleMenu({ button, nav }));

  nav.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.tagName.toLowerCase() !== "a") return;
    closeMenu({ button, nav });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeMenu({ button, nav });
    button.focus();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (nav.contains(target) || button.contains(target)) return;
    closeMenu({ button, nav });
  });

  window.addEventListener("resize", () => {
    closeMenu({ button, nav });
  });
}

function setupYear() {
  const year = document.getElementById("year");
  if (!year) return;
  year.textContent = String(new Date().getFullYear());
}

function setupLeadForm() {
  const form = document.getElementById("leadForm");
  if (!(form instanceof HTMLFormElement)) return;

  const success = form.querySelector(".form-success");
  const scrollBehavior = getScrollBehavior();

  const hideSuccess = () => {
    if (success instanceof HTMLElement) success.hidden = true;
  };

  form.addEventListener("input", hideSuccess);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.elements.namedItem("name");
    const phone = form.elements.namedItem("phone");
    const goal = form.elements.namedItem("goal");

    if (!(name instanceof HTMLInputElement)) return;
    if (!(phone instanceof HTMLInputElement)) return;
    if (!(goal instanceof HTMLSelectElement)) return;

    const isValid = form.checkValidity();
    if (!isValid) {
      form.reportValidity();
      return;
    }

    const messageField = form.elements.namedItem("message");
    const messageValue = messageField instanceof HTMLTextAreaElement ? messageField.value.trim() : "";

    if (WHATSAPP_NUMBER.trim()) {
      const lines = [
        "היי דור! השארתי פרטים דרך האתר:",
        `שם: ${name.value.trim()}`,
        `טלפון: ${phone.value.trim()}`,
        `מטרה: ${goal.value}`,
      ];
      if (messageValue) lines.push(`הערה: ${messageValue}`);

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER.trim()}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }

    form.reset();
    if (success instanceof HTMLElement) {
      success.hidden = false;
      success.scrollIntoView({ block: "nearest", behavior: scrollBehavior });
    }
  });
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function readStoredNumber(key, fallback) {
  const raw = window.localStorage.getItem(key);
  if (raw == null) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readStoredBoolean(key, fallback) {
  const raw = window.localStorage.getItem(key);
  if (raw == null) return fallback;
  if (raw === "true") return true;
  if (raw === "false") return false;
  return fallback;
}

function applyA11yState({ fontStep, linksUnderline, reduceMotion }) {
  const root = document.documentElement;
  root.setAttribute("data-a11y-font", String(fontStep));
  root.setAttribute("data-a11y-reduce-motion", reduceMotion ? "true" : "false");
  document.body.setAttribute("data-a11y-links", linksUnderline ? "true" : "false");
}

function setupA11yWidget() {
  const widget = document.querySelector("[data-a11y-widget]");
  const toggle = document.querySelector("[data-a11y-toggle]");
  const panel = document.querySelector("[data-a11y-panel]");
  if (!(widget instanceof HTMLElement)) return;
  if (!(toggle instanceof HTMLButtonElement)) return;
  if (!(panel instanceof HTMLElement)) return;

  let fontStep = clampNumber(readStoredNumber(A11Y_STORAGE_KEYS.fontStep, 0), -1, 2);
  let linksUnderline = readStoredBoolean(A11Y_STORAGE_KEYS.linksUnderline, false);
  let reduceMotion = readStoredBoolean(A11Y_STORAGE_KEYS.reduceMotion, false);

  const linksInput = panel.querySelector("[data-a11y-links]");
  const motionInput = panel.querySelector("[data-a11y-reduce-motion]");
  if (linksInput instanceof HTMLInputElement) linksInput.checked = linksUnderline;
  if (motionInput instanceof HTMLInputElement) motionInput.checked = reduceMotion;

  applyA11yState({ fontStep, linksUnderline, reduceMotion });

  const setExpanded = (expanded) => {
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    panel.hidden = !expanded;
    toggle.setAttribute("aria-label", expanded ? "סגור אפשרויות נגישות" : "פתיחת אפשרויות נגישות");
  };

  const isOpen = () => !panel.hidden;

  const close = () => {
    if (!isOpen()) return;
    setExpanded(false);
    toggle.focus();
  };

  const open = () => {
    if (isOpen()) return;
    setExpanded(true);
    const firstFocusable = panel.querySelector("button, input, a");
    if (firstFocusable instanceof HTMLElement) requestAnimationFrame(() => firstFocusable.focus());
  };

  toggle.addEventListener("click", () => {
    if (isOpen()) close();
    else open();
  });

  panel.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const fontAction = target.getAttribute("data-a11y-font");
    if (fontAction === "increase") fontStep = clampNumber(fontStep + 1, -1, 2);
    else if (fontAction === "decrease") fontStep = clampNumber(fontStep - 1, -1, 2);
    else if (fontAction === "reset") fontStep = 0;
    else return;

    window.localStorage.setItem(A11Y_STORAGE_KEYS.fontStep, String(fontStep));
    applyA11yState({ fontStep, linksUnderline, reduceMotion });
  });

  if (linksInput instanceof HTMLInputElement) {
    linksInput.addEventListener("change", () => {
      linksUnderline = !!linksInput.checked;
      window.localStorage.setItem(A11Y_STORAGE_KEYS.linksUnderline, String(linksUnderline));
      applyA11yState({ fontStep, linksUnderline, reduceMotion });
    });
  }

  if (motionInput instanceof HTMLInputElement) {
    motionInput.addEventListener("change", () => {
      reduceMotion = !!motionInput.checked;
      window.localStorage.setItem(A11Y_STORAGE_KEYS.reduceMotion, String(reduceMotion));
      applyA11yState({ fontStep, linksUnderline, reduceMotion });
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    close();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!isOpen()) return;
    if (widget.contains(target)) return;
    setExpanded(false);
  });
}

setupNav();
setupYear();
setupLeadForm();
setupA11yWidget();
setupCookieBanner();
setupLeadPopup();

/* ========================================
   Lead Popup - מופיע אחרי 4 שניות
   ======================================== */
const POPUP_SHOWN_KEY = "lead_popup_shown";
const POPUP_DELAY = 4000; // 4 שניות

function hasPopupBeenShown() {
  return window.sessionStorage.getItem(POPUP_SHOWN_KEY) === "true";
}

function markPopupAsShown() {
  window.sessionStorage.setItem(POPUP_SHOWN_KEY, "true");
}

function setupLeadPopup() {
  const popup = document.getElementById("leadPopup");
  if (!(popup instanceof HTMLElement)) return;

  // אם הפופאפ כבר הוצג בסשן הזה, לא מציגים שוב
  if (hasPopupBeenShown()) return;

  // הצגת הפופאפ אחרי 4 שניות
  setTimeout(() => {
    if (hasPopupBeenShown()) return; // בדיקה נוספת
    openPopup(popup);
    markPopupAsShown();
  }, POPUP_DELAY);

  // כפתורי סגירה
  const closeButtons = popup.querySelectorAll("[data-popup-close]");
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => closePopup(popup));
  });

  // סגירה עם ESC
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !popup.hidden) {
      closePopup(popup);
    }
  });

  // טיפול בטופס בפופאפ
  const form = document.getElementById("popupLeadForm");
  if (!(form instanceof HTMLFormElement)) return;

  const success = form.querySelector(".form-success");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.elements.namedItem("name");
    const phone = form.elements.namedItem("phone");
    const goal = form.elements.namedItem("goal");

    if (!(name instanceof HTMLInputElement)) return;
    if (!(phone instanceof HTMLInputElement)) return;
    if (!(goal instanceof HTMLSelectElement)) return;

    if (!name.value.trim() || !phone.value.trim() || !goal.value) {
      alert("נא למלא את כל השדות החובה");
      return;
    }

    // הכנת הודעת וואטסאפ
    const message = `שלום, אני ${name.value.trim()}\nטלפון: ${phone.value.trim()}\nמטרה: ${goal.value}\n\nאשמח לשיחת ייעוץ חינם!`;
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // הצגת הודעת הצלחה
    if (success instanceof HTMLElement) {
      success.hidden = false;
      
      // פתיחת וואטסאפ אחרי שנייה
      setTimeout(() => {
        window.open(whatsappURL, "_blank", "noopener,noreferrer");
        
        // סגירת הפופאפ אחרי 2 שניות נוספות
        setTimeout(() => {
          closePopup(popup);
        }, 2000);
      }, 1000);
    } else {
      // אם אין אלמנט success, פותחים וואטסאפ מיד
      window.open(whatsappURL, "_blank", "noopener,noreferrer");
      closePopup(popup);
    }
  });
}

function openPopup(popup) {
  popup.hidden = false;
  document.body.style.overflow = "hidden"; // מניעת גלילה ברקע
  
  // פוקוס על האלמנט הראשון בטופס
  const firstInput = popup.querySelector("input, select");
  if (firstInput instanceof HTMLElement) {
    setTimeout(() => firstInput.focus(), 100);
  }
}

function closePopup(popup) {
  popup.hidden = true;
  document.body.style.overflow = ""; // החזרת גלילה
}

/* ========================================
   Cookie Consent Banner
   ======================================== */
const COOKIE_CONSENT_KEY = "cookie_consent";

function getCookieConsent() {
  return window.localStorage.getItem(COOKIE_CONSENT_KEY);
}

function setCookieConsent(value) {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
}

function setupCookieBanner() {
  const banner = document.getElementById("cookieBanner");
  if (!(banner instanceof HTMLElement)) return;

  const consent = getCookieConsent();

  // If user already made a choice, don't show banner
  if (consent === "accepted" || consent === "declined") {
    banner.hidden = true;
    if (consent === "accepted") {
      loadAnalytics();
    }
    return;
  }

  // Show the banner
  banner.hidden = false;

  const acceptBtn = banner.querySelector("[data-cookie-accept]");
  const declineBtn = banner.querySelector("[data-cookie-decline]");

  if (acceptBtn instanceof HTMLButtonElement) {
    acceptBtn.addEventListener("click", () => {
      setCookieConsent("accepted");
      banner.hidden = true;
      loadAnalytics();
    });
  }

  if (declineBtn instanceof HTMLButtonElement) {
    declineBtn.addEventListener("click", () => {
      setCookieConsent("declined");
      banner.hidden = true;
    });
  }
}

function loadAnalytics() {
  // Google Analytics 4 - Replace GA_MEASUREMENT_ID with your actual GA4 ID
  // Uncomment and configure when ready to use
  /*
  const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";
  
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
  */
  
  console.log("Analytics cookies accepted - ready to load tracking scripts");
}
