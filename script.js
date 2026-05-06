'use strict';

/* ──────────────────────────────────────────────
   UTILITIES
   ────────────────────────────────────────────── */
function qs(sel, parent) { return (parent || document).querySelector(sel); }
function qsa(sel, parent) { return [...(parent || document).querySelectorAll(sel)]; }

/* ──────────────────────────────────────────────
   FOOTER YEAR
   ────────────────────────────────────────────── */
qs('#footerYear').textContent = new Date().getFullYear();

/* ──────────────────────────────────────────────
   MOBILE HAMBURGER
   ────────────────────────────────────────────── */
(function() {
  const btn  = qs('#menuBtn');
  const list = qs('#navLinks');
  btn.addEventListener('click', () => {
    const open = list.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  // Close when a link is clicked
  list.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      list.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ──────────────────────────────────────────────
   SCROLL REVEAL
   ────────────────────────────────────────────── */
(function() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(el => {
      if (el.isIntersecting) { el.target.classList.add('visible'); io.unobserve(el.target); }
    });
  }, { threshold: 0.12 });
  qsa('.reveal').forEach(el => io.observe(el));
})();

/* ──────────────────────────────────────────────
   PARTICLES (lightweight canvas)
   ────────────────────────────────────────────── */
(function() {
  const canvas = qs('#particles-canvas');
  const ctx    = canvas.getContext('2d');
  const DOTS   = 55;
  let W, H, dots;

  function resize() {
    const parent = canvas.parentElement;
    W = canvas.width  = parent.offsetWidth;
    H = canvas.height = parent.offsetHeight;
  }

  function randomDot() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.5 + 0.1
    };
  }

  function init() { resize(); dots = Array.from({length: DOTS}, randomDot); }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach((d, i) => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(29,78,216,${d.o})`;
      ctx.fill();
      // Draw lines to nearby dots
      for (let j = i + 1; j < dots.length; j++) {
        const b = dots[j];
        const dx = d.x - b.x, dy = d.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(29,78,216,${0.08 * (1 - dist/130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(tick);
  }

  init();
  tick();
  window.addEventListener('resize', () => { resize(); });
})();

/* ──────────────────────────────────────────────
   CONTACT SECTION SYNC
   ────────────────────────────────────────────── */
/* ──────────────────────────────────────────────
   Contact Button
   ────────────────────────────────────────────── */
qs('#contactBtn').addEventListener('click', e => {
  e.preventDefault();
  const emailLink = qs('#linkEmail');
  if (emailLink && emailLink.href) {
    window.location.href = emailLink.href;
  }
});

/* ──────────────────────────────────────────────
   SKILLS
   ────────────────────────────────────────────── */
(function() {
  const skills = [
    'JavaScript', 'React', 'Next.js', 'Node.js',
    'HTML / CSS', 'Tailwind CSS', 'Git & GitHub',
    'REST APIs', 'Docker', 'PostgreSQL', 'MongoDB', 'Figma'
  ];
  const grid = qs('#skillsGrid');

  skills.forEach((name, i) => {
    const badge = document.createElement('span');
    badge.className = 'skill-badge reveal';
    badge.style.transitionDelay = (i * 0.04) + 's';
    badge.innerHTML = `<span class="skill-dot" aria-hidden="true"></span>${name}`;
    grid.appendChild(badge);
  });

  // Trigger scroll-reveal for dynamically added items
  const io = new IntersectionObserver(entries => {
    entries.forEach(el => {
      if (el.isIntersecting) { el.target.classList.add('visible'); io.unobserve(el.target); }
    });
  }, { threshold: 0.1 });
  qsa('.skill-badge').forEach(el => io.observe(el));
})();

/* ──────────────────────────────────────────────
   PROJECT CARD FACTORY
   ────────────────────────────────────────────── */
function createProjectCard(data) {
  data = data || {};
  const card = document.createElement('article');
  card.className = 'project-card';
  card.setAttribute('role', 'listitem');

  const tagsHtml = (data.tags || ['React', 'Node.js']).map(t =>
    `<span class="tag">${t}</span>`
  ).join('');

  const demoLink = data.demoUrl ? `<a href="${data.demoUrl}" class="btn-outline" target="_blank" rel="noopener noreferrer" aria-label="Ver demo">🔗 Ver Demo</a>` : '';
  const codeLink = data.codeUrl ? `<a href="${data.codeUrl}" class="btn-ghost" target="_blank" rel="noopener noreferrer" aria-label="Ver código">💻 Ver Código</a>` : '';

  card.innerHTML = `
    <div class="project-image-area">
      ${data.image ? `<img src="${data.image}" class="project-img" alt="${data.title}" />` : '<div class="project-img-placeholder">Sem imagem</div>'}
    </div>
    <div class="project-info">
      <h3 class="project-title">${data.title || 'Nome do Projeto'}</h3>
      <p class="project-description">${data.description || 'Descrição breve do projeto.'}</p>
      <div class="project-tags">
        ${tagsHtml}
      </div>
      <div class="project-links">
        ${demoLink}
        ${codeLink}
      </div>
    </div>
  `;

  return card;
}

/* ──────────────────────────────────────────────
   PROJECTS CAROUSEL
   ────────────────────────────────────────────── */
(function() {
  const track    = qs('#projectsTrack');
  const dotsWrap = qs('#carouselDots');
  const prevBtn  = qs('#prevBtn');
  const nextBtn  = qs('#nextBtn');

  // Seed with 3 demo cards
  const demos = [
    { title: 'App Biblioteca', 
      description: 'Aplicação web full-stack com autenticação, dashboard em tempo real e integração com API externa.', 
      image: 'img/projeto-biblioteca-universitaria.jpg',
      tags: ['React', 'Node.js', 'PostgreSQL'], 
      demoUrl: 'https://www.bibliotecauni.space/', 
      codeUrl: 'https://github.com/app-biblioteca-ads-unifor-grupo-35-N697/biblioteca-emprestimos-cloud.git' },
    
    //{ title: 'Projeto Beta',  description: 'E-commerce responsivo com carrinho de compras, checkout integrado e painel administrativo.', tags: ['Next.js', 'Tailwind', 'Stripe'], demoUrl: '#', codeUrl: 'https://github.com' },

    //{ title: 'Projeto Gamma', description: 'CLI tool para automação de deploys com Docker e integração contínua via GitHub Actions.', tags: ['Python', 'Docker', 'CI/CD'], demoUrl: '#', codeUrl: 'https://github.com' }
  ];

  demos.forEach(d => track.appendChild(createProjectCard(d)));

  updateDots();

  function getCards() { return qsa('.project-card', track); }

  function updateDots() {
    const cards = getCards();
    dotsWrap.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Projeto ${i + 1}`);
      dot.addEventListener('click', () => scrollToCard(i));
      dotsWrap.appendChild(dot);
    });
    highlightDot();
  }

  function highlightDot() {
    const cards = getCards();
    if (!cards.length) return;
    const scrollLeft  = track.scrollLeft;
    const cardWidth   = cards[0].offsetWidth + 24;
    const idx = Math.round(scrollLeft / cardWidth);
    qsa('.carousel-dot', dotsWrap).forEach((d, i) => {
      d.classList.toggle('active', i === idx);
      d.setAttribute('aria-selected', i === idx);
    });
  }

  function scrollToCard(idx) {
    const cards = getCards();
    if (!cards[idx]) return;
    const cardWidth = cards[0].offsetWidth + 24;
    track.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => {
    const cards    = getCards();
    if (!cards.length) return;
    const cardWidth = cards[0].offsetWidth + 24;
    track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    const cards    = getCards();
    if (!cards.length) return;
    const cardWidth = cards[0].offsetWidth + 24;
    track.scrollBy({ left: cardWidth, behavior: 'smooth' });
  });

  track.addEventListener('scroll', highlightDot, { passive: true });

  // Swipe support
  let startX = 0;
  track.addEventListener('pointerdown', e => { startX = e.clientX; });
  track.addEventListener('pointerup', e => {
    const dx = e.clientX - startX;
    const cards = getCards();
    if (!cards.length) return;
    const cardWidth = cards[0].offsetWidth + 24;
    if (Math.abs(dx) > 40) {
      track.scrollBy({ left: dx < 0 ? cardWidth : -cardWidth, behavior: 'smooth' });
    }
  });

  // Make updateDots available globally
  window.updateDots = updateDots;
})();
