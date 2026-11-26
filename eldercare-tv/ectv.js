// Language switch (Italian / English) and the survey page's form and contact box.

// Google Forms links, one per language. Paste the "Send > link" URL of each form here.
var ECTV_FORMS = { it: "", en: "" };
var ECTV_EMAIL = "sasi.amodio98@gmail.com";

(function () {
  var KEY = "ectv-lang";
  var root = document.documentElement;

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function remember(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* private mode: ignore */ }
  }

  function setLang(lang) {
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.set === lang));
    });
    var t = document.querySelector('meta[name="ectv-title-' + lang + '"]');
    if (t) document.title = t.content;
    showForm(lang);
  }

  function showForm(lang) {
    var box = document.getElementById("form-box");
    if (!box) return;
    var url = ECTV_FORMS[lang] || ECTV_FORMS.it || ECTV_FORMS.en;
    var frame = document.getElementById("form-frame");
    var empty = document.getElementById("form-empty");
    var link = document.getElementById("form-link");
    if (!url) { frame.hidden = true; empty.hidden = false; link.hidden = true; return; }
    var embed = url + (url.indexOf("?") < 0 ? "?" : "&") + "embedded=true";
    if (frame.getAttribute("src") !== embed) frame.setAttribute("src", embed);
    frame.hidden = false; empty.hidden = true; link.hidden = false;
    link.querySelector("a").href = url;
  }

  function initContact() {
    var form = document.getElementById("contact");
    if (!form) return;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var en = root.getAttribute("data-lang") === "en";
      var name = document.getElementById("c-name").value.trim();
      var msg = document.getElementById("c-msg").value.trim();
      var subject = "Elder Care TV" + (name ? (en ? " - from " : " - da ") + name : "");
      window.location.href = "mailto:" + ECTV_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(msg);
    });
  }

  function start() {
    var lang = saved();
    if (lang !== "it" && lang !== "en") {
      lang = (navigator.language || "it").toLowerCase().indexOf("it") === 0 ? "it" : "en";
    }
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.dataset.set); remember(b.dataset.set); });
    });
    document.querySelectorAll("[data-email]").forEach(function (el) { el.textContent = ECTV_EMAIL; });
    initContact();
    setLang(lang);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
