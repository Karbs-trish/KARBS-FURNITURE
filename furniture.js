const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector("#navToggle");
const navLinks = document.querySelector("#navLinks");
const navItems = [...document.querySelectorAll(".nav-links a")];
const heroImages = [...document.querySelectorAll(".hero-image")];
const revealItems = [...document.querySelectorAll(".reveal")];
const toTop = document.querySelector("#toTop");
const searchToggle = document.querySelector("#searchToggle");
const searchDialog = document.querySelector("#searchDialog");
const quoteDialog = document.querySelector("#quoteDialog");
const openQuote = document.querySelector("#openQuote");
const siteSearch = document.querySelector("#siteSearch");
const searchResults = document.querySelector("#searchResults");
const contactForm = document.querySelector("#contactForm");

const searchableSections = [
  { title: "Sofas and Lounges", url: "#collections", keywords: "sofa lounge couch ottoman living room" },
  { title: "Beds and Wardrobes", url: "#collections", keywords: "bed bedroom headboard wardrobe cupboard storage" },
  { title: "Dining Sets", url: "#collections", keywords: "dining table chairs bench kitchen" },
  { title: "Office Furniture", url: "#collections", keywords: "office desk chair reception filing shelves" },
  { title: "Custom Builds", url: "#services", keywords: "custom size finish fabric wood material" },
  { title: "Delivery Support", url: "#services", keywords: "delivery setup transport location" },
  { title: "Contact KARBS", url: "#contact", keywords: "phone whatsapp email quote order contact" }
];

let activeHeroImage = 0;
let activeDialog = null;

function elementExists(element) {
  return Boolean(element);
}

function setHeaderState() {
  if (!header || !toTop) {
    return;
  }

  const scrolled = window.scrollY > 20;
  header.classList.toggle("is-scrolled", scrolled);
  toTop.classList.toggle("is-visible", window.scrollY > 600);
}

function closeMenu() {
  body.classList.remove("menu-open");

  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
  }
}

function toggleMenu() {
  if (!navToggle) {
    return;
  }

  const isOpen = body.classList.toggle("menu-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
}

function rotateHeroImage() {
  if (heroImages.length < 2) {
    return;
  }

  heroImages[activeHeroImage].classList.remove("active");
  activeHeroImage = (activeHeroImage + 1) % heroImages.length;
  heroImages[activeHeroImage].classList.add("active");
}

function setActiveNav() {
  const currentSection = [...document.querySelectorAll("main section[id]")]
    .filter((section) => section.getBoundingClientRect().top <= 180)
    .pop();

  navItems.forEach((item) => {
    item.classList.toggle("is-active", currentSection && item.hash === `#${currentSection.id}`);
  });
}

let revealObserver = null;

if ("IntersectionObserver" in window) {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );
}

function openDialog(dialog) {
  if (!dialog) {
    return;
  }

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }

  activeDialog = dialog;
  body.classList.add("dialog-open");
}

function closeDialog(dialog) {
  if (!dialog) {
    return;
  }

  if (typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }

  if (activeDialog === dialog) {
    activeDialog = null;
  }

  body.classList.remove("dialog-open");
}

function renderSearchResults(query = "") {
  if (!searchResults) {
    return;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const matches = searchableSections.filter((item) => {
    const haystack = `${item.title} ${item.keywords}`.toLowerCase();
    return normalizedQuery === "" || haystack.includes(normalizedQuery);
  });

  searchResults.innerHTML = matches
    .map((item) => `<a href="${item.url}" data-search-result>${item.title}</a>`)
    .join("");
}

function prepareWhatsAppMessage(event) {
  event.preventDefault();

  if (!contactForm) {
    return;
  }

  const formData = new FormData(contactForm);
  const message = [
    "Hello KARBS Furniture, I would like a quote.",
    `Name: ${formData.get("name")}`,
    `Phone: ${formData.get("phone")}`,
    `Furniture: ${formData.get("product")}`,
    `Message: ${formData.get("message") || "No extra details yet."}`
  ].join("\n");

  window.open(`https://wa.me/263718871433?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}

if (elementExists(navToggle)) {
  navToggle.addEventListener("click", toggleMenu);
}

if (elementExists(navLinks)) {
  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });
}

window.addEventListener("scroll", () => {
  setHeaderState();
  setActiveNav();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1180) {
    closeMenu();
  }
});

if (elementExists(toTop)) {
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (elementExists(searchToggle)) {
  searchToggle.addEventListener("click", () => {
    renderSearchResults();
    openDialog(searchDialog);

    if (siteSearch) {
      siteSearch.focus();
    }
  });
}

if (elementExists(openQuote)) {
  openQuote.addEventListener("click", () => openDialog(quoteDialog));
}

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => closeDialog(button.closest("dialog")));
});

[searchDialog, quoteDialog].filter(Boolean).forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog(dialog);
    }
  });

  dialog.addEventListener("close", () => {
    if (activeDialog === dialog) {
      activeDialog = null;
    }

    body.classList.remove("dialog-open");
  });
});

if (elementExists(siteSearch)) {
  siteSearch.addEventListener("input", () => renderSearchResults(siteSearch.value));
}

if (elementExists(searchResults)) {
  searchResults.addEventListener("click", (event) => {
    if (event.target.closest("[data-search-result]")) {
      closeDialog(searchDialog);
    }
  });
}

if (elementExists(contactForm)) {
  contactForm.addEventListener("submit", prepareWhatsAppMessage);
}

if ("IntersectionObserver" in window) {
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeDialog) {
    closeDialog(activeDialog);
  }
});

setHeaderState();
setActiveNav();
renderSearchResults();
setInterval(rotateHeroImage, 5200);
