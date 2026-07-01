/* ============================================
   SOPHIA GUO — CASE STUDY INTERACTIONS
   Cursor · Nav scroll · Scroll reveals
   ============================================ */

/* ── Custom Cursor ── */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('[data-cursor="link"]').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

/* ── Nav Scroll ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Magnetic Nav Links ── */
document.querySelectorAll('.nav-link, .nav-logo').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s, background 0.2s';
  });
});

/* ── Scroll Reveals ── */
const revealEls = document.querySelectorAll('.cs-reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = '0ms';
      entry.target.classList.add('in-view');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

revealEls.forEach(el => revealObs.observe(el));

/* ── Back to Top ── */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 500);
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
backTop.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
backTop.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
