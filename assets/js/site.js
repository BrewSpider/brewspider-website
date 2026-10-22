// Phone menu, Netlify forms sent with fetch, and one observer that starts
// a section's animations when it scrolls into view.
(function () {
  var d = document, t = d.querySelector(".nav-toggle");
  if (t) {
    var m = d.getElementById(t.getAttribute("aria-controls"));
    var set = function (o) { t.setAttribute("aria-expanded", o); m.classList.toggle("is-open", o); };
    t.onclick = function () { set(!m.classList.contains("is-open")); };
    m.onclick = function (e) { if (e.target.closest("a")) set(false); };
    d.addEventListener("keydown", function (e) {
      if (e.key == "Escape" && m.classList.contains("is-open")) { set(false); t.focus(); }
    });
  }

  d.querySelectorAll("form[data-netlify]").forEach(function (f) {
    var s = f.querySelector(".form-status"), b = f.querySelector("[type=submit]");
    var say = function (ok) {
      s.textContent = ok ? s.dataset.sent : s.dataset.failed;
      s.className = "form-status is-" + (ok ? "ok" : "error");
    };
    f.onsubmit = function (e) {
      e.preventDefault();
      if (!f.reportValidity()) return;
      b.disabled = true; // no double sends
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(f)).toString()
      }).then(function (r) {
        if (!r.ok) throw r;
        say(true);
        f.reset();
      }).catch(function () { say(false); }) // keeps the typed text for a retry
        .finally(function () { b.disabled = false; });
    };
  });

  var a = d.querySelectorAll("[data-animate]"), show = function (el) { el.classList.add("is-visible"); };
  if (!window.IntersectionObserver) return a.forEach(show);
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  a.forEach(function (el) { io.observe(el); });
})();
