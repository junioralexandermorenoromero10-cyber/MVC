const CONFIG = {
  brand: "Mariachi Voces de Colombia",
  location: "Acacías, Meta, Colombia",
  whatsapp: "573103000805",
  standardOffer: "10 canciones completas + obsequio musical",
  deposit: { percentage: 20, minimum: 70000, maximum: 400000 },
  contacts: [
    { label: "Línea 1", phone: "+57 310 300 0805", tel: "573103000805" },
    { label: "Línea 2", phone: "+57 310 231 3888", tel: "573102313888" }
  ],
  rates: [
    { id: "acacias", name: "Casco Urbano Acacías", shortName: "Acacías", price: 400000, featured: true },
    { id: "guamal", name: "Guamal", shortName: "Guamal", price: 450000 },
    { id: "castilla", name: "Castilla La Nueva", shortName: "Castilla La Nueva", price: 500000 },
    { id: "other", name: "Otros municipios / veredas", shortName: "Otra ubicación", price: 550000, from: true, detail: "Desde $550.000 COP · +$50.000 según distancia" }
  ],
  services: [
    { id: "standard", label: "Serenata estándar (10 canciones completas + obsequio musical)", priceByZone: true },
    { id: "hours", label: "Presentación por 1 o 2 horas" },
    { id: "special", label: "Evento especial (boda / quince años)" },
    { id: "carranguera", label: "Carranguera", price: 700000 },
    { id: "vallenato", label: "Vallenato", price: 700000 },
    { id: "papayera", label: "Papayera", price: 600000 },
    { id: "vaquero", label: "Baile exótico vaquero" },
    { id: "orchestra", label: "Orquesta", price: 1000000 }
  ],
  musicAddonIds: ["standard", "carranguera", "vallenato", "papayera", "vaquero", "orchestra"],
  extraServices: [
    { id: "pyrotechnics", name: "Pirotecnia (fuegos artificiales)", minimum: 80000, maximum: 500000 },
    { id: "flowers", name: "Ramos florales", minimum: 50000, maximum: 500000 }
  ],
  occasions: ["Cumpleaños", "Aniversario", "Romántica", "Fecha especial", "Otro"],
  events: [
    { title: "Cumpleaños", icon: "♕" },
    { title: "Aniversarios", icon: "♡" },
    { title: "Serenatas sorpresa", icon: "✦" },
    { title: "Bodas", icon: "∞" },
    { title: "Quince años", icon: "✧" },
    { title: "Grados", icon: "⌑" },
    { title: "Eventos empresariales", icon: "♧" }
  ],
  videos: [
    { title: "Serenata en vivo", subtitle: "La emoción de una gran sorpresa", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/results?search_query=mariachi+serenata+en+vivo" },
    { title: "Música para celebrar", subtitle: "Tradición que se siente", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/results?search_query=mariachi+musica+en+vivo" },
    { title: "Momentos inolvidables", subtitle: "Alegría para compartir", image: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/results?search_query=mariachi+presentacion+en+vivo" }
  ],
  photos: [
    { alt: "Músicos en una presentación en vivo", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1100&q=85" },
    { alt: "Público disfrutando de la música en vivo", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=85" },
    { alt: "Celebración con música y luces", image: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=900&q=85" },
    { alt: "Artista interpretando una canción", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1100&q=85&sat=-20" },
    { alt: "Escenario iluminado durante un concierto", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=85" },
    { alt: "Celebración musical al aire libre", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85" }
  ]
};

const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const whatsappUrl = (message) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
const standardNote = CONFIG.standardOffer;

function calculateMusicEstimate(service, zone, addons) {
  const selectedMusic = [service, ...addons];
  const subtotal = selectedMusic.reduce((total, item) => {
    if (item.priceByZone) return total + zone.price;
    return total + (item.price || 0);
  }, 0);
  const needsQuote = selectedMusic.some((item) => !item.priceByZone && !item.price);
  const needsDistanceQuote = zone.from && selectedMusic.some((item) => item.priceByZone);
  const value = subtotal
    ? `${needsDistanceQuote ? "Desde " : ""}${money.format(subtotal)} COP${needsDistanceQuote ? " (+$50.000 según distancia)" : ""}${needsQuote ? " + servicios por cotizar" : ""}`
    : "Por cotizar";
  return { subtotal, value, requiresQuote: needsQuote || needsDistanceQuote };
}

function calculateDeposit(estimate, hasUnpricedExtras) {
  const { percentage, minimum, maximum } = CONFIG.deposit;
  if (!estimate.subtotal || estimate.requiresQuote || hasUnpricedExtras) {
    return `Por cotizar (${percentage}% del valor final; mínimo ${money.format(minimum)} y máximo ${money.format(maximum)})`;
  }
  const amount = Math.min(maximum, Math.max(minimum, Math.round(estimate.subtotal * percentage / 100)));
  return `${money.format(amount)} COP (${percentage}% del total musical)`;
}

function renderRates() {
  const grid = document.querySelector("#price-grid");
  document.querySelector("#standard-description").textContent = CONFIG.standardOffer;
  document.querySelector("#standard-offer").textContent = `Serenata estándar: ${CONFIG.standardOffer}`;
  grid.innerHTML = CONFIG.rates.map((rate, index) => `
    <article class="price-card${rate.featured ? " featured" : ""}">
      <span class="price-label">${index === 0 ? "La favorita" : index === 3 ? "A tu medida" : "Serenata estándar"}</span>
      <h3>${rate.name}</h3>
      <span class="price-subtitle">${rate.detail || CONFIG.standardOffer}</span>
      <strong class="price-amount">${rate.from ? "Desde " : ""}${money.format(rate.price)}<small>${rate.from ? "COP · Cotizar según distancia" : "COP · " + standardNote}</small></strong>
      <button class="button" type="button" data-select-zone="${rate.id}">Pedir esta serenata <span aria-hidden="true">↗</span></button>
    </article>
  `).join("");
}

function renderEvents() {
  document.querySelector("#occasion-grid").innerHTML = CONFIG.events.map((event) => `
    <div class="occasion-card"><span class="occasion-icon" aria-hidden="true">${event.icon}</span><span>${event.title}</span></div>
  `).join("");
}

function renderVideos() {
  document.querySelector("#video-grid").innerHTML = CONFIG.videos.map((video) => `
    <article class="video-card">
      <a href="${video.url}" target="_blank" rel="noopener noreferrer" aria-label="Ver ${video.title} en YouTube">
        <div class="video-poster"><img src="${video.image}" alt="" loading="lazy"><span class="video-play" aria-hidden="true">▶</span></div>
      </a>
      <div class="video-info"><strong>${video.title}</strong><span>${video.subtitle}</span></div>
    </article>
  `).join("");
}

function renderGallery() {
  document.querySelector("#gallery-grid").innerHTML = CONFIG.photos.map((photo, index) => `
    <button class="gallery-item" type="button" data-photo-index="${index}" aria-label="Ampliar foto: ${photo.alt}">
      <img src="${photo.image}" alt="${photo.alt}" loading="lazy">
    </button>
  `).join("");
}

function renderContacts() {
  document.querySelector("#contact-lines").innerHTML = CONFIG.contacts.map((contact) => `
    <article class="contact-card">
      <span>${contact.label}</span><strong>${contact.phone}</strong>
      <div class="contact-actions">
        <a href="tel:+${contact.tel}">Llamar</a>
        <a href="https://wa.me/${contact.tel}" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
      </div>
    </article>
  `).join("");
}

function setupForm() {
  const serviceSelect = document.querySelector("#service-type");
  const zoneSelect = document.querySelector("#service-zone");
  const occasionSelect = document.querySelector("#occasion");
  serviceSelect.innerHTML = CONFIG.services.map((service) => {
    const price = service.price ? ` · ${money.format(service.price)} COP` : service.priceByZone ? " · Tarifa según zona" : "";
    return `<option value="${service.id}">${service.label}${price}</option>`;
  }).join("");
  zoneSelect.innerHTML = CONFIG.rates.map((rate) => `<option value="${rate.id}">${rate.shortName}${rate.price ? " · " + (rate.from ? "Desde " : "") + money.format(rate.price) : " · Por cotizar"}</option>`).join("");
  occasionSelect.innerHTML = CONFIG.occasions.map((occasion) => `<option value="${occasion}">${occasion}</option>`).join("");
  const musicAddons = document.querySelector("#music-addons");
  const musicSummary = document.querySelector("#music-summary");
  const depositSummary = document.querySelector("#deposit-summary");
  const updateMusicSummary = () => {
    const service = CONFIG.services.find((item) => item.id === serviceSelect.value);
    const zone = CONFIG.rates.find((item) => item.id === zoneSelect.value);
    const addons = [...musicAddons.querySelectorAll('input[name="musicAddons"]:checked')]
      .map((input) => CONFIG.services.find((item) => item.id === input.value));
    const estimate = calculateMusicEstimate(service, zone, addons);
    musicSummary.textContent = `Estimado musical (sin pirotecnia ni ramos): ${estimate.value}`;
    const hasUnpricedExtras = document.querySelector('#extra-services input[name="extras"]:checked') !== null;
    depositSummary.textContent = `Abono para agendar (${CONFIG.deposit.percentage}%): ${calculateDeposit(estimate, hasUnpricedExtras)}`;
  };
  const renderMusicAddons = () => {
    const primaryServiceId = serviceSelect.value;
    const zone = CONFIG.rates.find((rate) => rate.id === zoneSelect.value);
    const selectedIds = new Set([...musicAddons.querySelectorAll('input[name="musicAddons"]:checked')].map((input) => input.value));
    musicAddons.innerHTML = CONFIG.musicAddonIds
      .filter((id) => id !== primaryServiceId)
      .map((id) => CONFIG.services.find((service) => service.id === id))
      .map((service) => {
        const priceText = service.priceByZone
          ? `Tarifa ${zone.from ? "desde " : ""}${money.format(zone.price)} COP por zona`
          : service.price
            ? `${money.format(service.price)} COP`
            : "Por cotizar";
        return `
          <label class="extra-option" for="music-${service.id}">
            <input id="music-${service.id}" name="musicAddons" type="checkbox" value="${service.id}"${selectedIds.has(service.id) ? " checked" : ""}>
            <span class="extra-copy"><strong>${service.label}</strong><small>${priceText}</small></span>
            <span class="extra-check" aria-hidden="true">+</span>
          </label>
        `;
      }).join("");
    updateMusicSummary();
  };
  renderMusicAddons();
  serviceSelect.addEventListener("change", renderMusicAddons);
  zoneSelect.addEventListener("change", renderMusicAddons);
  musicAddons.addEventListener("change", updateMusicSummary);
  document.querySelector("#extra-services").innerHTML = CONFIG.extraServices.map((extra) => `
    <label class="extra-option" for="extra-${extra.id}">
      <input id="extra-${extra.id}" name="extras" type="checkbox" value="${extra.id}">
      <span class="extra-copy"><strong>${extra.name}</strong><small>Desde ${money.format(extra.minimum)} hasta ${money.format(extra.maximum)} COP</small></span>
      <span class="extra-check" aria-hidden="true">+</span>
    </label>
  `).join("");
  document.querySelector("#extra-services").addEventListener("change", updateMusicSummary);

  document.querySelector("#booking-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const service = CONFIG.services.find((item) => item.id === values.get("service"));
    const zone = CONFIG.rates.find((item) => item.id === values.get("zone"));
    const selectedMusicAddons = CONFIG.musicAddonIds
      .filter((id) => values.getAll("musicAddons").includes(id))
      .map((id) => CONFIG.services.find((item) => item.id === id));
    const selectedExtras = CONFIG.extraServices.filter((extra) => values.getAll("extras").includes(extra.id));
    const musicEstimate = calculateMusicEstimate(service, zone, selectedMusicAddons);
    const estimate = musicEstimate.value;
    const deposit = calculateDeposit(musicEstimate, selectedExtras.length > 0);
    const musicDetails = selectedMusicAddons.length
      ? selectedMusicAddons.map((item) => {
        const price = item.priceByZone
          ? `${zone.from ? "Desde " : ""}${money.format(zone.price)} COP${zone.from ? " (+$50.000 según distancia)" : ""}`
          : item.price ? `${money.format(item.price)} COP` : "Por cotizar";
        return `- ${item.label}: ${price}`;
      }).join("\n")
      : "Ninguno";
    const extraDetails = selectedExtras.length
      ? selectedExtras.map((extra) => `- ${extra.name}: desde ${money.format(extra.minimum)} hasta ${money.format(extra.maximum)} COP (por cotizar)`).join("\n")
      : "Ninguno";
    const date = new Date(`${values.get("date")}T00:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
    const message = [
      `Hola, quiero reservar con ${CONFIG.brand}.`,
      "",
      `*Tipo de servicio:* ${service.label}`,
      `*Zona:* ${zone.name}`,
      `*Valor estimado:* ${estimate}`,
      `*Abono para agendar (${CONFIG.deposit.percentage}%):* ${deposit}`,
      `*Grupos musicales adicionales:*\n${musicDetails}`,
      `*Motivo:* ${values.get("occasion")}`,
      `*Fecha:* ${date}`,
      `*Hora aproximada:* ${values.get("time")}`,
      `*Dirección o barrio:* ${values.get("address")}`,
      `*Quién contrata y dedica:* ${values.get("customer")}`,
      `*Serenata dedicada a:* ${values.get("recipient")}`,
      `*Servicios adicionales:*\n${extraDetails}`
    ].join("\n");
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  });
}

function setupWhatsAppLinks() {
  const messages = {
    hero: "Hola, quiero información y disponibilidad para reservar una serenata con Mariachi Voces de Colombia.",
    event: "Hola, quiero cotizar un evento o una presentación por 1 hora, 2 horas o evento completo con Mariachi Voces de Colombia.",
    float: "Hola, quiero información sobre serenatas y presentaciones de Mariachi Voces de Colombia."
  };
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = whatsappUrl(messages[link.dataset.whatsapp]);
  });
  const primary = CONFIG.contacts[0];
  document.querySelector("[data-call='primary']").href = `tel:+${primary.tel}`;
}

function setupRateButtons() {
  document.querySelector("#price-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-select-zone]");
    if (!button) return;
    document.querySelector("#service-zone").value = button.dataset.selectZone;
    document.querySelector("#service-type").value = "standard";
    document.querySelector("#reserva").scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => document.querySelector("#customer-name").focus({ preventScroll: true }), 550);
  });
}

function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    toggle.setAttribute("aria-label", expanded ? "Abrir menú" : "Cerrar menú");
    nav.classList.toggle("is-open", !expanded);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
      nav.classList.remove("is-open");
    }
  });
}

function setupLogoFallback() {
  const logo = document.querySelector(".hero-logo");
  const wrapper = document.querySelector(".hero-logo-wrap");
  logo.addEventListener("load", () => {
    logo.hidden = false;
    wrapper.classList.add("logo-ready");
  });
  logo.addEventListener("error", () => {
    logo.hidden = true;
    wrapper.classList.remove("logo-ready");
  });
  if (logo.complete && logo.naturalWidth > 0) wrapper.classList.add("logo-ready");
}

function setupLightbox() {
  const lightbox = document.querySelector("#lightbox");
  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector("figcaption");
  let activeIndex = 0;
  let previousFocus = null;
  const showPhoto = (index) => {
    activeIndex = (index + CONFIG.photos.length) % CONFIG.photos.length;
    const photo = CONFIG.photos[activeIndex];
    image.src = photo.image;
    image.alt = photo.alt;
    caption.textContent = photo.alt;
  };
  const close = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (previousFocus) previousFocus.focus();
  };
  document.querySelector("#gallery-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-photo-index]");
    if (!button) return;
    previousFocus = button;
    showPhoto(Number(button.dataset.photoIndex));
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    lightbox.querySelector(".lightbox-close").focus();
  });
  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showPhoto(activeIndex - 1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => showPhoto(activeIndex + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") showPhoto(activeIndex - 1);
    if (event.key === "ArrowRight") showPhoto(activeIndex + 1);
  });
}

renderRates();
renderEvents();
renderVideos();
renderGallery();
renderContacts();
setupForm();
setupWhatsAppLinks();
setupRateButtons();
setupMenu();
setupLogoFallback();
setupLightbox();
