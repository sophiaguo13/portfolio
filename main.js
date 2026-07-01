/* ============================================
   SOPHIA GUO PORTFOLIO — INTERACTIONS
   Custom cursor · Scroll reveals · Animations
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

// Smooth cursor follow
function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor states on interactive elements
document.querySelectorAll('[data-cursor="link"]').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});
document.querySelectorAll('[data-cursor="view"]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('view-cursor');
    cursorDot.style.opacity = '0';
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('view-cursor');
    cursorDot.style.opacity = '1';
  });
});

/* ── Nav Scroll Effect ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Hero Title Spotlight Effect ── */
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const overlay = document.createElement('div');
  overlay.className = 'hero-title-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  heroTitle.appendChild(overlay);

  let overlayReady = false;

  heroTitle.addEventListener('mousemove', (e) => {
    // Lazily build overlay on first hover — animation is guaranteed finished by then
    if (!overlayReady) {
      overlay.innerHTML = heroTitle.innerHTML;
      // Remove nested overlay if it got cloned into itself
      overlay.querySelectorAll('.hero-title-overlay').forEach(el => el.remove());
      // Snap all spans to their final revealed state
      overlay.querySelectorAll('.reveal-word, .reveal-fade').forEach(el => {
        el.style.transition = 'none';
        el.style.animation = 'none';
        el.classList.add('revealed');
      });
      overlayReady = true;
    }
    const rect = heroTitle.getBoundingClientRect();
    overlay.style.setProperty('--hero-mx', (e.clientX - rect.left) + 'px');
    overlay.style.setProperty('--hero-my', (e.clientY - rect.top) + 'px');
  });

  heroTitle.addEventListener('mouseleave', () => {
    overlay.style.setProperty('--hero-mx', '-9999px');
    overlay.style.setProperty('--hero-my', '-9999px');
  });
}

/* ── Hero Staggered Reveals ── */
function runHeroReveal() {
  const words = document.querySelectorAll('.reveal-word');
  const fades = document.querySelectorAll('.reveal-fade');

  words.forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), 100 + i * 140);
  });
  fades.forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), 500 + i * 120);
  });
}

window.addEventListener('load', runHeroReveal);

/* ── Scroll-triggered Reveals ── */
const revealTargets = document.querySelectorAll(
  '.project-card, .play-card, .timeline-item, .fun-fact, .section-header, .play-intro, .about-para'
);

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach((el, i) => {
  // Stagger siblings within same parent
  const siblings = Array.from(el.parentElement.children);
  const idx = siblings.indexOf(el);
  el.style.transitionDelay = (idx * 80) + 'ms';
  revealObs.observe(el);
});

// Section headers use a simpler reveal
document.querySelectorAll('.section-header, .play-intro, .about-para').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      obs.unobserve(entry.target);
    }
  }, { threshold: 0.1 });
  obs.observe(el);
});

/* ── Tilt effect on project cards ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) scale(1.01) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    card.style.transition = 'transform 0.1s ease, box-shadow 0.4s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s';
  });
  // Make the whole card clickable (navigates to its case study)
  const cardLink = card.querySelector('.project-cta');
  if (cardLink) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // let real links handle their own clicks
      window.location.href = cardLink.getAttribute('href');
    });
  }
});


/* ── Wave emoji click ── */
const waveEmoji = document.getElementById('waveEmoji');
if (waveEmoji) {
  let waving = false;
  waveEmoji.addEventListener('click', () => {
    if (waving) return;
    waving = true;
    waveEmoji.style.animation = 'none';
    void waveEmoji.offsetWidth;
    waveEmoji.style.animation = 'wave 2.5s ease-in-out';
    setTimeout(() => { waving = false; }, 2500);
  });
}

/* ── Magnetic effect on nav links ── */
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

/* ── Skills marquee — pause on hover (handled in CSS) + speed control ── */
const marqueeTrack = document.getElementById('marqueeTrack');
marqueeTrack.addEventListener('mouseenter', () => {
  marqueeTrack.style.animationPlayState = 'paused';
});
marqueeTrack.addEventListener('mouseleave', () => {
  marqueeTrack.style.animationPlayState = 'running';
});

/* ── Smooth active nav highlighting ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--fg)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObs.observe(s));

/* ── Fun fact hover jiggle ── */
document.querySelectorAll('.fun-fact').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.animation = 'jiggle 0.4s ease';
  });
  el.addEventListener('animationend', () => {
    el.style.animation = '';
  });
});

// Add jiggle keyframes dynamically
const jiggleStyle = document.createElement('style');
jiggleStyle.textContent = `
  @keyframes jiggle {
    0%,100% { transform: rotate(0deg) scale(1.05); }
    25% { transform: rotate(-4deg) scale(1.07); }
    50% { transform: rotate(4deg) scale(1.06); }
    75% { transform: rotate(-2deg) scale(1.05); }
  }
`;
document.head.appendChild(jiggleStyle);

/* ── Tag hover colors cycling ── */
const tagColors = ['var(--accent)', 'var(--accent2)', 'var(--accent3)'];
document.querySelectorAll('.tag').forEach((tag, i) => {
  tag.addEventListener('mouseenter', () => {
    tag.style.borderColor = tagColors[i % 3];
    tag.style.color = tagColors[i % 3];
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.borderColor = '';
    tag.style.color = '';
  });
});

/* ── Page load fade-in (CSS handles this via animation) ── */

/* ── Back to top ── */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 500);
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
backTop.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
backTop.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));

/* ── Parallax on hero blobs ── */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  document.querySelector('.blob-1').style.transform = `translate(${y * 0.06}px, ${y * -0.08}px)`;
  document.querySelector('.blob-2').style.transform = `translate(${y * -0.05}px, ${y * 0.06}px)`;
  document.querySelector('.blob-3').style.transform = `translate(${y * 0.04}px, ${y * 0.04}px)`;
});
