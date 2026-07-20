const html = document.documentElement;
const contactDialog = document.querySelector("#contact-dialog");
const privacyDialog = document.querySelector("#privacy-dialog");
const accessibilityDialog = document.querySelector("#accessibility-dialog");
const accessibilityMenu = document.querySelector("#accessibility-menu");
const accessibilityTrigger = document.querySelector("[data-toggle-accessibility]");
const form = document.querySelector("#contact-form");

document.querySelector("#year").textContent = new Date().getFullYear();

function openDialog(dialog) {
  if (dialog && !dialog.open) dialog.showModal();
}

document.querySelectorAll("[data-open-contact]").forEach((button) => button.addEventListener("click", () => openDialog(contactDialog)));
document.querySelectorAll("[data-open-privacy]").forEach((button) => button.addEventListener("click", () => openDialog(privacyDialog)));
document.querySelectorAll("[data-open-accessibility]").forEach((button) => button.addEventListener("click", () => {
  accessibilityMenu.hidden = true;
  accessibilityTrigger.setAttribute("aria-expanded", "false");
  openDialog(accessibilityDialog);
}));
document.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
}));

function setMenu(open) {
  accessibilityMenu.hidden = !open;
  accessibilityTrigger.setAttribute("aria-expanded", String(open));
  if (open) accessibilityMenu.querySelector("button").focus();
}

accessibilityTrigger.addEventListener("click", () => setMenu(accessibilityMenu.hidden));
document.querySelector("[data-close-accessibility]").addEventListener("click", () => setMenu(false));

const classByAction = { font: "a11y-large", contrast: "a11y-contrast", links: "a11y-links" };
document.querySelectorAll("[data-accessibility-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.accessibilityAction;
    if (action === "reset") {
      Object.values(classByAction).forEach((className) => html.classList.remove(className));
      localStorage.removeItem("accessibilityPreferences");
    } else {
      html.classList.toggle(classByAction[action]);
      const active = Object.entries(classByAction).filter(([, className]) => html.classList.contains(className)).map(([key]) => key);
      localStorage.setItem("accessibilityPreferences", JSON.stringify(active));
    }
  });
});

try {
  JSON.parse(localStorage.getItem("accessibilityPreferences") || "[]").forEach((action) => {
    if (classByAction[action]) html.classList.add(classByAction[action]);
  });
} catch (_) {
  localStorage.removeItem("accessibilityPreferences");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("name").trim();
  const phone = data.get("phone").trim();
  const message = data.get("message").trim();
  const isEnglish = html.lang === "en";
  const text = isEnglish
    ? `Hi Tomer, my name is ${name}.\nPhone: ${phone}\n\n${message}`
    : `שלום תומר, שמי ${name}.\nטלפון לחזרה: ${phone}\n\n${message}`;
  window.open(`https://wa.me/972555707035?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
});
