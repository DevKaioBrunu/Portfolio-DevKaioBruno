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
   PARALLAX EFFECT
   ────────────────────────────────────────────── */
(function() {
  const heroSection = qs('#sobre');
  if (!heroSection) return;
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      const blobs = heroSection.querySelectorAll('::before, ::after');
      heroSection.style.backgroundPosition = `0 ${scrollY * 0.5}px`;
    }
  }, { passive: true });
})();

/* ──────────────────────────────────────────────
   CURSOR TRACKING
   ────────────────────────────────────────────── */
(function() {
  const cards = qsa('.bio-card, .project-card, .diploma-card, .contact-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ──────────────────────────────────────────────
   SMOOTH SCROLL WITH EASING
   ────────────────────────────────────────────── */
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ──────────────────────────────────────────────
   GLOW PULSE ON HOVER
   ────────────────────────────────────────────── */
(function() {
  const primaryButtons = qsa('.btn-primary');
  const badges = qsa('.skill-badge');
  
  [...primaryButtons, ...badges].forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.animation = 'pulse-glow 0.6s ease-in-out';
    });
  });
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
    'JavaScript', 'React', 'Node.js',
    'HTML / CSS', 'Tailwind CSS', 'Vite', 'Git & GitHub',
    'REST APIs', 'Java', 'Spring Boot',
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
     { title: 'FlexFuel',  
      description: 'FlexFuel é um app frontend para comparar gasolina e etanol com base na autonomia real do veículo cadastrado.', 
      image: 'img/projeto-flex-fuel.png',
      tags: ['Next.js', 'Tailwind',], 
      demoUrl: 'https://flex-fuel-six.vercel.app/', 
      codeUrl: 'https://github.com/DevKaioBrunu/FlexFuel.git' },

    { title: 'Biblioteca Universitária', 
      description: 'Aplicação web full-stack com autenticação, dashboard em tempo real e integração com API externa.', 
      image: 'img/projeto-biblioteca-universitaria.jpg',
      tags: ['React', 'Node.js', 'PostgreSQL'], 
      demoUrl: 'https://www.bibliotecauni.space/', 
      codeUrl: 'https://github.com/app-biblioteca-ads-unifor-grupo-35-N697/biblioteca-emprestimos-cloud.git' },
    
   

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

/* ──────────────────────────────────────────────
   ELEMENT STAGGER ANIMATION
   ────────────────────────────────────────────── */
(function() {
  const bioName = qs('.bio-name');
  const bioRole = qs('.bio-role');
  const bioDesc = qs('.bio-description');
  
  if (bioName && bioRole && bioDesc) {
    setTimeout(() => {
      bioName.style.animation = 'slideInLeft 0.8s ease';
      bioRole.style.animation = 'fadeInUp 0.8s ease 0.1s backwards';
      bioDesc.style.animation = 'fadeInUp 0.8s ease 0.2s backwards';
    }, 100);
  }
})();

/* ──────────────────────────────────────────────
   ACTIVE LINK HIGHLIGHT IN NAVBAR
   ────────────────────────────────────────────── */
(function() {
  const navLinks = qsa('.nav-links a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = qsa('section[id]');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
})();

/* ──────────────────────────────────────────────
   PARTICLE GLOW ON MOUSE MOVE
   ────────────────────────────────────────────── */
(function() {
  const canvas = qs('#particles-canvas');
  if (!canvas) return;
  
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });
})();

/* ──────────────────────────────────────────────
   SCROLL PROGRESS BAR
   ────────────────────────────────────────────── */
(function() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 64px;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #1d4ed8, #2563eb);
    z-index: 99;
    transition: width 100ms ease;
    box-shadow: 0 0 10px rgba(29, 78, 216, 0.6);
  `;
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / docHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
})();

/* ──────────────────────────────────────────────
   NAVBAR ACTIVE LINK STYLE
   ────────────────────────────────────────────── */
(function() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-links a.active {
      color: var(--color-text) !important;
      background: rgba(29, 78, 216, 0.15) !important;
      border-color: rgba(29, 78, 216, 0.5) !important;
    }
  `;
  document.head.appendChild(style);
})();
