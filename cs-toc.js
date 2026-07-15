/* Sticky case-study table of contents:
   click a link to smooth-scroll to its section (offset for the fixed nav),
   and highlight the section currently in view via IntersectionObserver. */
(function () {
  "use strict";
  var links = Array.prototype.slice.call(document.querySelectorAll(".cs-toc-link"));
  if (!links.length) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pairs = [];
  links.forEach(function (link) {
    var sec = document.getElementById(link.getAttribute("href").slice(1));
    if (sec) pairs.push({ link: link, sec: sec });
  });

  function setActive(link) {
    links.forEach(function (l) { l.classList.toggle("active", l === link); });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var sec = document.getElementById(link.getAttribute("href").slice(1));
      if (!sec) return;
      e.preventDefault();
      var y = sec.getBoundingClientRect().top + window.pageYOffset - 96;
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
      setActive(link);
      if (history.replaceState) history.replaceState(null, "", link.getAttribute("href"));
    });
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      for (var i = 0; i < pairs.length; i++) {
        if (pairs[i].sec === en.target) { setActive(pairs[i].link); break; }
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  pairs.forEach(function (p) { io.observe(p.sec); });
})();
