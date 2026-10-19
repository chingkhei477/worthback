/* Worthback — site behaviour. No tracking, no third-party scripts. */
(function () {
  "use strict";

  var SUPPORT_EMAIL = "support@worthback.in";

  /* ---------- Header: scroll state + mobile menu ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeNav() {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    nav.classList.remove("is-open");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      nav.classList.toggle("is-open", !open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1000) closeNav();
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Offers ---------- */
  function todayIST() {
    // Date string YYYY-MM-DD in India Standard Time
    var now = new Date(Date.now() + (5.5 * 60 + new Date().getTimezoneOffset()) * 60000);
    var m = String(now.getMonth() + 1).padStart(2, "0");
    var d = String(now.getDate()).padStart(2, "0");
    return now.getFullYear() + "-" + m + "-" + d;
  }

  function isValidOffer(o) {
    return o && typeof o.store === "string" && o.store.trim() &&
      typeof o.rate === "string" && o.rate.trim() &&
      typeof o.link === "string" && /^https:\/\//i.test(o.link);
  }

  function activeOffers() {
    var list = Array.isArray(window.WORTHBACK_OFFERS) ? window.WORTHBACK_OFFERS : [];
    var today = todayIST();
    return list.filter(function (o) {
      if (!isValidOffer(o)) return false;
      if (o.validTill && /^\d{4}-\d{2}-\d{2}$/.test(o.validTill) && o.validTill < today) return false;
      return true;
    });
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function formatDate(iso) {
    var p = iso.split("-");
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return Number(p[2]) + " " + months[Number(p[1]) - 1] + " " + p[0];
  }

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';

  function offerCard(o) {
    var art = el("article", "offer");
    art.dataset.category = (o.category || "Other").trim();
    art.dataset.search = [o.store, o.category, o.summary, o.rate].join(" ").toLowerCase();

    var top = el("div", "offer-top");
    var meta = el("div", "offer-meta");
    var store = el("div", "offer-store");
    store.appendChild(el("span", "offer-initial", o.store.trim().charAt(0).toUpperCase()));
    store.firstChild.setAttribute("aria-hidden", "true");
    store.appendChild(el("h3", null, o.store));
    meta.appendChild(store);
    if (o.category) meta.appendChild(el("span", "tag", o.category));
    top.appendChild(meta);

    var rate = el("p", "offer-rate");
    rate.appendChild(el("small", null, "Cashback"));
    rate.appendChild(document.createTextNode(o.rate));
    top.appendChild(rate);
    if (o.summary) top.appendChild(el("p", "offer-summary", o.summary));
    art.appendChild(top);

    var perf = el("div", "offer-perf");
    perf.setAttribute("aria-hidden", "true");
    art.appendChild(perf);

    var bottom = el("div", "offer-bottom");
    if (Array.isArray(o.conditions) && o.conditions.length) {
      var det = el("details");
      det.appendChild(el("summary", null, "Conditions"));
      var ul = el("ul");
      o.conditions.forEach(function (c) { if (c) ul.appendChild(el("li", null, String(c))); });
      det.appendChild(ul);
      bottom.appendChild(det);
    }
    bottom.appendChild(el("p", "offer-valid", o.validTill ? "Valid till " + formatDate(o.validTill) : "No fixed end date. May change without notice."));

    var a = el("a", "btn btn-clay");
    a.href = o.link;
    a.target = "_blank";
    a.rel = "sponsored nofollow noopener noreferrer";
    a.innerHTML = ARROW;
    a.insertBefore(document.createTextNode("Shop at " + o.store + " "), a.firstChild);
    a.setAttribute("aria-label", "Shop at " + o.store + " (opens the retailer's website in a new tab)");
    bottom.appendChild(a);
    art.appendChild(bottom);
    return art;
  }

  // Explore Offers page
  var grid = document.getElementById("offer-grid");
  if (grid) {
    var offers = activeOffers();
    var empty = document.getElementById("offers-empty");
    var tools = document.getElementById("offer-tools");
    var chipsWrap = document.getElementById("offer-chips");
    var searchInput = document.getElementById("offer-search");
    var noResults = document.getElementById("no-results");
    var count = document.getElementById("offer-count");

    if (!offers.length) {
      if (empty) empty.hidden = false;
      if (tools) tools.hidden = true;
    } else {
      offers.forEach(function (o) { grid.appendChild(offerCard(o)); });
      var cats = [];
      offers.forEach(function (o) {
        var c = (o.category || "Other").trim();
        if (cats.indexOf(c) === -1) cats.push(c);
      });
      cats.sort();
      var active = "All";
      ["All"].concat(cats).forEach(function (c) {
        var b = el("button", "chip", c);
        b.type = "button";
        b.setAttribute("aria-pressed", c === "All" ? "true" : "false");
        b.addEventListener("click", function () {
          active = c;
          chipsWrap.querySelectorAll(".chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
          applyFilter();
        });
        chipsWrap.appendChild(b);
      });
      if (cats.length < 2) chipsWrap.hidden = true;

      var applyFilter = function () {
        var q = (searchInput && searchInput.value || "").trim().toLowerCase();
        var shown = 0;
        grid.querySelectorAll(".offer").forEach(function (card) {
          var ok = (active === "All" || card.dataset.category === active) && (!q || card.dataset.search.indexOf(q) !== -1);
          card.hidden = !ok;
          if (ok) shown++;
        });
        if (noResults) noResults.style.display = shown ? "none" : "block";
        if (count) count.textContent = shown + (shown === 1 ? " offer" : " offers");
      };
      if (searchInput) searchInput.addEventListener("input", applyFilter);
      applyFilter();
    }
  }

  // Home page: featured offers (first three active)
  var featured = document.getElementById("featured-offers");
  if (featured) {
    var top3 = activeOffers().slice(0, 3);
    var featuredSection = document.getElementById("featured-section");
    if (top3.length && featuredSection) {
      top3.forEach(function (o) { featured.appendChild(offerCard(o)); });
      featuredSection.hidden = false;
    }
  }

  /* ---------- Contact form (composes an email to support) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var topic = form.elements.topic;
    var statusBox = document.getElementById("form-status");
    var groups = form.querySelectorAll(".conditional");

    var showFor = function () {
      var t = topic.value;
      groups.forEach(function (g) {
        var shown = g.getAttribute("data-topics").split(" ").indexOf(t) !== -1;
        g.hidden = !shown;
        g.querySelectorAll("input, select, textarea").forEach(function (f) {
          f.disabled = !shown;
          if (f.hasAttribute("data-required")) f.required = shown;
        });
      });
      // A message is required for open questions, optional when the structured fields say it all
      var needsMessage = ["general", "privacy", "partner"].indexOf(t) !== -1;
      form.elements.message.required = needsMessage;
      var opt = document.getElementById("message-optional");
      if (opt) opt.hidden = needsMessage;
    };

    // Allow links such as contact.html?topic=missing to preselect a topic
    try {
      var preset = new URLSearchParams(window.location.search).get("topic");
      if (preset && topic.querySelector('option[value="' + preset.replace(/[^a-z-]/g, "") + '"]')) topic.value = preset;
    } catch (e) { /* older browsers: ignore */ }
    topic.addEventListener("change", showFor);
    showFor();

    var setError = function (field, msg) {
      var wrap = field.closest(".field");
      if (!wrap) return;
      wrap.classList.toggle("has-error", !!msg);
      var m = wrap.querySelector(".error-msg");
      if (m) m.textContent = msg || "";
      if (msg) field.setAttribute("aria-invalid", "true"); else field.removeAttribute("aria-invalid");
    };

    var validate = function () {
      var firstBad = null;
      Array.prototype.forEach.call(form.elements, function (f) {
        if (!f.name || f.disabled || f.type === "submit" || f.name === "website") return;
        var msg = "";
        var v = (f.value || "").trim();
        if (f.type === "checkbox") {
          if (f.required && !f.checked) msg = "Please confirm to continue.";
        } else if (f.required && !v) {
          msg = "This field is required.";
        } else if (v && f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
          msg = "Please enter a valid email address.";
        } else if (v && f.name === "upi" && !/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z][a-zA-Z0-9.-]{1,64}$/.test(v)) {
          msg = "Please enter a valid UPI ID, for example name@bank.";
        } else if (v && f.name === "amount" && !(Number(v) >= 100)) {
          msg = "The minimum withdrawal is ₹100.";
        } else if (v && f.name === "message" && v.length > 1500) {
          msg = "Please keep your message under 1,500 characters.";
        }
        if (f.type !== "checkbox") setError(f, msg);
        else {
          var w = f.closest(".check");
          if (w) w.style.color = msg ? "var(--clay-dark)" : "";
        }
        if (msg && !firstBad) firstBad = f;
      });
      return firstBad;
    };

    var labelFor = function (f) {
      var l = form.querySelector('label[for="' + f.id + '"]');
      return l ? l.textContent.replace(/\s*\(optional\)\s*/i, "").trim() : f.name;
    };

    var compose = function () {
      var t = topic.options[topic.selectedIndex].text;
      var lines = [];
      Array.prototype.forEach.call(form.elements, function (f) {
        if (!f.name || f.disabled || f.type === "submit" || f.type === "checkbox" || f.name === "website" || f.name === "topic" || f.name === "message") return;
        var v = (f.value || "").trim();
        if (v) lines.push(labelFor(f) + ": " + v);
      });
      var msg = (form.elements.message.value || "").trim();
      var body = "Topic: " + t + "\n" + lines.join("\n") + (msg ? "\n\nMessage:\n" + msg : "") + "\n\n— Sent from the Worthback contact page";
      var subject = "[Worthback] " + t + " — " + (form.elements.name.value || "").trim();
      return { subject: subject, body: body };
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.elements.website && form.elements.website.value) return; // spam trap
      var bad = validate();
      statusBox.className = "form-status";
      statusBox.textContent = "";
      if (bad) {
        statusBox.className = "form-status err is-visible";
        statusBox.textContent = "Please check the highlighted fields.";
        bad.focus();
        return;
      }
      var mail = compose();
      var href = "mailto:" + SUPPORT_EMAIL + "?subject=" + encodeURIComponent(mail.subject) + "&body=" + encodeURIComponent(mail.body);
      window.location.href = href;

      statusBox.className = "form-status ok is-visible";
      var p1 = el("p", "mt-0", "Your email app should now open with your message addressed to " + SUPPORT_EMAIL + ". Press send there to reach us.");
      p1.style.margin = "0 0 6px";
      var p2 = el("p", null, "No email app opened? Copy the message and email it to " + SUPPORT_EMAIL + " from any inbox.");
      p2.style.margin = "0";
      var copyBtn = el("button", "btn btn-ghost", "Copy message");
      copyBtn.type = "button";
      copyBtn.addEventListener("click", function () {
        var text = "To: " + SUPPORT_EMAIL + "\nSubject: " + mail.subject + "\n\n" + mail.body;
        var done = function () { copyBtn.textContent = "Copied"; };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
        } else { fallbackCopy(text); done(); }
      });
      statusBox.appendChild(p1);
      statusBox.appendChild(p2);
      statusBox.appendChild(copyBtn);
    });

    form.addEventListener("input", function (e) {
      var f = e.target;
      if (f.closest && f.closest(".field.has-error")) setError(f, "");
    });
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }
})();
