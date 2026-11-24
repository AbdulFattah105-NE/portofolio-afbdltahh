/* =========================================================
   Abdul Fattah — Portfolio & Link Hub  (Security-Hardened JS)
   ========================================================= */
(() => {
  // Anti-clickjacking untuk produksi (izinkan localhost/127.0.0.1 untuk tool preview lokal)
  if (window.top !== window.self && !["127.0.0.1", "localhost", ""].includes(location.hostname)) {
    document.documentElement.hidden = true;
    try { window.top.location = window.self.location.href; } catch {}
    return;
  }

  const P = window.PROFILE;
  const PROJECTS = window.PROJECTS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Security helpers ---------- */
  // Escape karakter HTML berbahaya sebelum render ke innerHTML
  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // Hanya izinkan skema https:// untuk tautan eksternal (blokir javascript:, data:, vbscript:)
  const safeUrl = (u) => {
    try {
      const x = new URL(String(u), location.href);
      return x.protocol === "https:" ? x.href : "#";
    } catch {
      return "#";
    }
  };

  // Daftar domain yang boleh di-embed di Live Preview iframe
  const ALLOWED_PREVIEW_HOSTS = new Set(["abdulfattah105-ne.github.io"]);
  const safePreviewUrl = (u) => {
    try {
      const x = new URL(String(u));
      return x.protocol === "https:" && ALLOWED_PREVIEW_HOSTS.has(x.hostname) ? x.href : null;
    } catch {
      return null;
    }
  };

  const EXT = 'target="_blank" rel="noopener noreferrer"';
  const hasWa = Boolean(P.enableWhatsApp && Array.isArray(P.waBytes) && P.waBytes.length >= 10);
  const decodeWaNumber = () => {
    const num = P.waBytes.map((b) => String.fromCharCode((b ^ P.waKey) & 0xff)).join("");
    return /^\d{10,15}$/.test(num) ? num : "";
  };
  const shot = (p) => `assets/shots/${encodeURIComponent(p.id)}.png?v=2`;

  const ICON = {
    eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    ext: '<svg viewBox="0 0 24 24"><path d="M7 17L17 7 M8 7h9v9"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14 M13 6l6 6-6 6"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M3 21l1.65-4.8A8.5 8.5 0 1 1 7.8 19.4z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.4-1.8-1.2-2.2-2.2l1-1-1-2L9 9.5z"/></svg>',
    gh: '<svg viewBox="0 0 24 24"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
    cap: '<svg viewBox="0 0 24 24"><path d="M22 10L12 5 2 10l10 5 10-5z M6 12v5c3 2 9 2 12 0v-5"/></svg>',
  };

  // Tanpa inline onerror (patuh CSP script-src 'self') — tangkap error gambar di fase capture sebelum render
  document.addEventListener(
    "error",
    (e) => { if (e.target instanceof HTMLImageElement && e.target.classList.contains("shot")) e.target.remove(); },
    true
  );
  const imgTag = (p, eager = false) =>
    `<img class="shot" src="${shot(p)}" alt="Tampilan ${esc(p.title)}" loading="${eager ? "eager" : "lazy"}">`;
  const screen = (p, eager = false) =>
    `<div class="phone-screen"><div class="shot-fallback" style="background:hsl(${+p.hue || 0} 40% 14%)">${esc(p.emoji)}</div>${imgTag(p, eager)}</div>`;

  /* ---------------- Render: hero phones (Kiri: SDIT MK, Tengah: Politeknik, Kanan: Al-Wafa) ---------------- */
  const byId = (id) => PROJECTS.find((p) => p.id === id);
  const heroSlots = [
    { cls: "p2", p: byId("sdit") },   // Kiri: SDIT Menara Kuwait
    { cls: "p1", p: byId("pmb") },    // Tengah: Politeknik IDN
    { cls: "p3", p: byId("alwafa") }, // Kanan: Pesantren Al-Wafa
  ].filter((s) => s.p);
  $("#hero-phones").innerHTML = heroSlots
    .map((s) => `<div class="phone ${s.cls}">${screen(s.p, true)}</div>`)
    .join("");

  /* ---------------- Render: project cards ---------------- */
  $("#projects").innerHTML = PROJECTS.map((p, i) => {
    const canEmbed = p.embed !== false && Boolean(safePreviewUrl(p.url));
    const previewBtn = canEmbed
      ? `<button type="button" class="btn btn-soft" data-preview="${esc(p.id)}">${ICON.eye} Live Preview</button>`
      : p.previewUrl
        ? `<a class="btn btn-soft" href="${esc(safeUrl(p.previewUrl))}" ${EXT}>${ICON.eye} Link Preview</a>`
        : "";
    return `
    <article class="card reveal ${p.featured ? "featured" : ""}" style="--h:${+p.hue || 0}" data-id="${esc(p.id)}" data-cat="${esc(p.category.join(" "))}">
      <div class="card-media">
        <span class="card-badge">${esc(p.emoji)} ${esc(p.type)}</span>
        <span class="card-num">${String(i + 1).padStart(2, "0")}</span>
        <div class="mini-phone">${screen(p)}</div>
      </div>
      <div class="card-body">
        <span class="card-type">${esc(p.type)}</span>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.desc)}</p>
        <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        <div class="card-actions">
          ${previewBtn}
          <a class="btn btn-ghost" href="${esc(safeUrl(p.url))}" ${EXT}>Kunjungi ${ICON.ext}</a>
        </div>
      </div>
    </article>`;
  }).join("");

  /* ---------------- Render: contact ---------------- */
  $("#contact-actions").innerHTML = `
    ${hasWa ? `<button type="button" class="btn btn-primary" data-wa>${ICON.wa} Chat WhatsApp</button>` : ""}
    <a class="btn btn-ghost" href="${esc(safeUrl(P.github))}" ${EXT}>${ICON.gh} GitHub</a>
    <a class="btn btn-ghost" href="${esc(safeUrl(P.campus))}" ${EXT}>${ICON.cap} Portofolio Kampus</a>`;

  /* ---------------- Render: link hub ---------------- */
  $("#hub-socials").innerHTML = `
    ${hasWa ? `<button type="button" data-wa aria-label="WhatsApp">${ICON.wa}</button>` : ""}
    <a href="${esc(safeUrl(P.github))}" ${EXT} aria-label="GitHub">${ICON.gh}</a>
    <a href="${esc(safeUrl(P.campus))}" ${EXT} aria-label="Portofolio Kampus">${ICON.cap}</a>`;

  const hubLink = (p, extra = "") => {
    const searchKey = esc((p.title + " " + p.type + " " + p.tags.join(" ")).toLowerCase());
    const inner = `
      <span class="hub-ico">${esc(p.emoji)}${p.id ? imgTag(p) : ""}</span>
      <span class="hub-txt"><b>${esc(p.title)}</b><small>${esc(p.type)}</small></span>
      <span class="hub-arrow">${ICON.arrow}</span>`;
    if (p.wa) {
      return `<button type="button" class="hub-link ${extra}" data-wa style="--h:${+p.hue || 0}" data-search="${searchKey}">${inner}</button>`;
    }
    return `<a class="hub-link ${extra}" href="${esc(safeUrl(p.url))}" ${EXT} style="--h:${+p.hue || 0}" data-search="${searchKey}">${inner}</a>`;
  };

  const groups = [
    {
      title: "⭐ Portofolio Kampus",
      items: [
        byId("poltek"),
        {
          title: "Detail Karya — 1 Tahun Belajar TRKJ",
          type: "Dokumentasi 10 Bagian · MTCNA, MTCRE & CCNA",
          url: byId("poltek")?.previewUrl,
          emoji: "📘",
          hue: 220,
          tags: ["detail", "trkj", "mikrotik", "cisco"],
        },
      ],
      highlight: true,
    },
    { title: "🔗 Redesign Link Hub", items: ["pmb", "alwafa", "sdit", "bantu"].map(byId) },
    { title: "🌐 Website", items: [byId("jurusan")] },
    {
      title: "💬 Hubungi Saya",
      items: [
        ...(hasWa ? [{ title: "Chat via WhatsApp", type: "Diskusi proyek website / link hub", wa: true, emoji: "💬", hue: 142, tags: ["kontak", "wa", "whatsapp"] }] : []),
        { title: "GitHub — abdulfattah105-ne", type: "Lihat semua repositori", url: P.github, emoji: "🐙", hue: 250, tags: ["github", "kode"] },
      ],
    },
  ];
  $("#hub-links").innerHTML = groups.map((g) => `
    <section class="hub-group">
      <h2>${esc(g.title)}</h2>
      ${g.items.filter(Boolean).map((p) => hubLink(p, g.highlight ? "highlight" : "")).join("")}
    </section>`).join("");

  /* ---------------- WhatsApp Anti-Bot Gate ---------------- */
  const waModal = $("#wa-modal");
  const waMsg = $("#wa-msg");
  let waFocus = null;

  const openWaModal = () => {
    if (!hasWa) return;
    waFocus = document.activeElement;
    waModal.hidden = false;
    document.body.style.overflow = "hidden";
    $("#wa-go").focus();
  };
  const closeWaModal = () => {
    waModal.hidden = true;
    document.body.style.overflow = "";
    waFocus?.focus();
  };

  $$("#wa-topics .chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      $$("#wa-topics .chip").forEach((c) => c.classList.toggle("active", c === chip));
      waMsg.value = chip.dataset.topic || "";
    })
  );

  $("#wa-go").addEventListener("click", (e) => {
    // Blokir klik sintetis dari script bot otomatis
    if (!e.isTrusted || !hasWa) return;
    const phone = decodeWaNumber();
    if (!phone) return;
    const text = String(waMsg.value || "").trim().slice(0, 300);
    const url = `https://wa.me/${phone}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
    closeWaModal();
    window.open(url, "_blank", "noopener,noreferrer");
  });

  // Hub search
  $("#hub-search").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    let any = false;
    $$(".hub-group").forEach((g) => {
      let shown = 0;
      $$(".hub-link", g).forEach((a) => {
        const ok = !q || a.dataset.search.includes(q);
        a.hidden = !ok;
        if (ok) shown++;
      });
      g.hidden = shown === 0;
      if (shown) any = true;
    });
    $("#hub-empty").hidden = any;
  });

  /* ---------------- Mode switch (Portofolio <-> Link Hub) ---------------- */
  const pill = $(".mode-pill");
  const movePill = () => {
    const active = $('.mode-switch [aria-selected="true"]');
    if (!active) return;
    pill.style.width = active.offsetWidth + "px";
    pill.style.transform = `translateX(${active.offsetLeft - 4}px)`;
  };

  const applyMode = (rawMode) => {
    const mode = rawMode === "hub" ? "hub" : "portfolio";
    document.body.dataset.mode = mode;
    $("#portfolio-view").hidden = mode !== "portfolio";
    $("#hub-view").hidden = mode !== "hub";
    $$(".mode-switch button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.setMode === mode)));
    movePill();
    document.title = mode === "hub" ? "Abdul Fattah — Link Hub" : "Abdul Fattah — Portofolio & Link Hub";
    if (mode === "portfolio") requestAnimationFrame(observeReveals);
  };

  const setMode = (rawMode, push = true) => {
    const mode = rawMode === "hub" ? "hub" : "portfolio";
    if (document.body.dataset.mode === mode) return;
    const run = () => {
      applyMode(mode);
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(run);
    else run();
    if (push) history.replaceState(null, "", mode === "hub" ? "#hub" : location.pathname + location.search);
    try { localStorage.setItem("af-mode", mode); } catch {}
  };

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-set-mode]");
    if (b) setMode(b.dataset.setMode);
    if (e.target.closest("[data-wa]") && e.isTrusted) openWaModal();
    if (e.target.closest("[data-wa-close]")) closeWaModal();
  });

  // Keyboard shortcut: tekan "H" untuk ganti mode
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !waModal.hidden) { closeWaModal(); return; }
    if (e.target.matches("input, textarea") || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.toLowerCase() === "h") setMode(document.body.dataset.mode === "hub" ? "portfolio" : "hub");
  });

  // Initial mode: #hub atau ?mode=hub
  const initial =
    location.hash === "#hub" || new URLSearchParams(location.search).get("mode") === "hub" ? "hub" : "portfolio";
  applyMode(initial);
  addEventListener("resize", movePill);
  document.fonts?.ready.then(movePill);
  addEventListener("hashchange", () => { if (location.hash === "#hub") setMode("hub", false); });

  /* ---------------- Filter projects ---------------- */
  $$(".filters .chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      $$(".filters .chip").forEach((c) => c.classList.toggle("active", c === chip));
      const f = chip.dataset.filter;
      $$(".card").forEach((card) => {
        const show = f === "all" || card.dataset.cat.split(" ").includes(f);
        card.classList.toggle("hide", !show);
        card.classList.toggle("featured", f === "all" && Boolean(byId(card.dataset.id)?.featured));
      });
    })
  );

  /* ---------------- Reveal on scroll ---------------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  function observeReveals() { $$(".reveal:not(.in)").forEach((el) => io.observe(el)); }
  observeReveals();

  /* ---------------- Count-up stats ---------------- */
  const countIO = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count || 0, dur = 1400, t0 = performance.now();
    countIO.unobserve(el);
    if (reduceMotion) { el.textContent = end; return; }
    const isYear = end > 1900;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur), v = 1 - Math.pow(1 - k, 3);
      el.textContent = isYear ? Math.round(2000 + (end - 2000) * v) : Math.round(end * v);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: 0.6 });
  $$("[data-count]").forEach((el) => countIO.observe(el));

  /* ---------------- Typer ---------------- */
  const words = ["terasa hidup.", "rapi di HP.", "cepat & ringan.", "mudah dibagikan."];
  const typer = $("#typer");
  if (reduceMotion) typer.textContent = words[0];
  else {
    let wi = 0, ci = words[0].length, del = true;
    typer.textContent = words[0];
    const loop = () => {
      const w = words[wi];
      ci += del ? -1 : 1;
      typer.textContent = w.slice(0, ci);
      let wait = del ? 45 : 85;
      if (!del && ci === w.length) { del = true; wait = 2000; }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; wait = 300; }
      setTimeout(loop, wait);
    };
    setTimeout(loop, 2400);
  }

  /* ---------------- Nav: scrolled + active section ---------------- */
  const nav = $("#nav");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 20), { passive: true });
  const secIO = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) $$(".nav-links a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["proyek", "tentang", "kontak"].forEach((id) => secIO.observe(document.getElementById(id)));

  /* ---------------- Cursor glow + card tilt ---------------- */
  if (matchMedia("(hover: hover)").matches && !reduceMotion) {
    const glow = $(".cursor-glow");
    addEventListener("pointermove", (e) => { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; }, { passive: true });
    $$(".card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => (card.style.transform = ""));
    });
  }

  /* ---------------- Live preview modal ---------------- */
  const modal = $("#modal"), frame = $("#modal-frame"), wrap = $("#frame-wrap"), loader = $(".frame-loader");
  let lastFocus = null;
  const openPreview = (p) => {
    if (!p) return;
    const url = safePreviewUrl(p.url);
    if (!url) return;
    lastFocus = document.activeElement;
    $("#modal-url").textContent = url.replace(/^https?:\/\//, "");
    $("#modal-open").href = url;
    $("#modal-title").textContent = "Live preview — " + p.title;
    loader.hidden = false;
    frame.src = url;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $("[data-close].icon-btn", modal).focus();
  };
  const closePreview = () => {
    modal.hidden = true;
    frame.src = "about:blank";
    document.body.style.overflow = "";
    lastFocus?.focus();
  };
  frame.addEventListener("load", () => { if (frame.src !== "about:blank") loader.hidden = true; });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-preview]");
    if (b) openPreview(byId(b.dataset.preview));
    if (e.target.closest("[data-close]")) closePreview();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closePreview(); });
  $$(".device-toggle button").forEach((b) =>
    b.addEventListener("click", () => {
      const dev = b.dataset.device === "desktop" ? "desktop" : "mobile";
      $$(".device-toggle button").forEach((x) => x.classList.toggle("active", x === b));
      wrap.className = "frame-wrap " + dev;
    })
  );

  /* ---------------- Share + toast ---------------- */
  const toast = (msg) => {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  };
  $("#share-btn").addEventListener("click", async () => {
    const clean = new URL(location.href);
    clean.search = "";
    clean.hash = "hub";
    const url = clean.href;
    const data = { title: "Abdul Fattah — Link Hub", text: "Lihat link hub & portofolio Abdul Fattah", url };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(url); toast("Link berhasil disalin ✅"); }
    } catch (err) {
      if (err?.name !== "AbortError") toast("Gagal membagikan, salin manual dari address bar");
    }
  });

  /* ---------------- Misc ---------------- */
  const y = new Date().getFullYear();
  $("#year").textContent = y;
  $$(".year").forEach((el) => (el.textContent = y));
})();
