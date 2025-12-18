const NAV_OPEN_ATTR = "data-open";
const WHATSAPP_NUMBER = "972524640456"; // מספר וואטסאפ של דור ניב

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

setupNav();
setupYear();
setupLeadForm();
