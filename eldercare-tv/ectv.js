// Language switch (Italian / English) and the survey page's form and contact box.

// Google Forms links, one per language. Paste the "Send > link" URL of each form here.
var ECTV_FORMS = { it: "", en: "" };
var ECTV_EMAIL = "sasi.amodio98@gmail.com";
// Web3Forms access key: suggestions are sent to the inbox tied to it. Public by design.
// Empty: the form falls back to opening the visitor's email app.
var ECTV_WEB3FORMS_KEY = "964a38c7-bfce-4792-b695-560e3f77e31a";

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
    var status = document.getElementById("c-status");
    var button = document.getElementById("c-send");
    function say(it, en, ok) {
      status.textContent = root.getAttribute("data-lang") === "en" ? en : it;
      status.className = "form-status " + (ok ? "ok" : "error");
    }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var email = document.getElementById("c-email").value.trim();
      var msg = document.getElementById("c-msg").value.trim();
      if (!msg) return;
      if (!ECTV_WEB3FORMS_KEY) {
        window.location.href = "mailto:" + ECTV_EMAIL +
          "?subject=" + encodeURIComponent("Elder Care TV - suggerimento") +
          "&body=" + encodeURIComponent(msg);
        return;
      }
      button.disabled = true;
      say("Invio in corso…", "Sending…", true);
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: ECTV_WEB3FORMS_KEY,
          subject: "Elder Care TV - nuovo suggerimento",
          from_name: "Elder Care TV",
          email: email,
          replyto: email,
          message: msg,
          botcheck: document.getElementById("c-bot").checked
        })
      }).then(function (r) { return r.json(); }).then(function (data) {
        if (!data.success) throw new Error(data.message || "failed");
        form.reset();
        say("Grazie! Il tuo suggerimento è arrivato.", "Thank you! Your suggestion has been sent.", true);
      }).catch(function () {
        say("Il suggerimento non è partito. Controlla la connessione e riprova.", "Your suggestion was not sent. Check your connection and try again.", false);
      }).then(function () { button.disabled = false; });
    });
  }

  function start() {
    var lang = saved();
    if (lang !== "it" && lang !== "en") lang = "it";  // Italian unless the visitor chose English
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.dataset.set); remember(b.dataset.set); });
    });
    initContact();
    setLang(lang);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
