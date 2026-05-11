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

function setHeaderState() {
  const scrolled = window.scrollY > 20;
  header.classList.toggle("is-scrolled", scrolled);
  toTop.classList.toggle("is-visible", window.scrollY > 600);
}

function closeMenu() {
  body.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
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

const revealObserver = new IntersectionObserver(
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

function openDialog(dialog) {
  if (!dialog) {
    return;
  }

  dialog.showModal();
  body.classList.add("dialog-open");
}

function closeDialog(dialog) {
  if (!dialog) {
    return;
  }

  dialog.close();
  body.classList.remove("dialog-open");
}

function renderSearchResults(query = "") {
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

navToggle.addEventListener("click", toggleMenu);

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMenu();
  }
});

window.addEventListener("scroll", () => {
  setHeaderState();
  setActiveNav();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1180) {
    closeMenu();
  }
});

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

searchToggle.addEventListener("click", () => {
  renderSearchResults();
  openDialog(searchDialog);
  siteSearch.focus();
});

openQuote.addEventListener("click", () => openDialog(quoteDialog));

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => closeDialog(button.closest("dialog")));
});

[searchDialog, quoteDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog(dialog);
    }
  });

  dialog.addEventListener("close", () => {
    body.classList.remove("dialog-open");
  });
});

siteSearch.addEventListener("input", () => renderSearchResults(siteSearch.value));

searchResults.addEventListener("click", (event) => {
  if (event.target.closest("[data-search-result]")) {
    closeDialog(searchDialog);
  }
});

contactForm.addEventListener("submit", prepareWhatsAppMessage);

revealItems.forEach((item) => revealObserver.observe(item));
setHeaderState();
setActiveNav();
renderSearchResults();
setInterval(rotateHeroImage, 5200);
