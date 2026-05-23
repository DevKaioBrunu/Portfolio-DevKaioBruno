'use strict';

/*UTILITIES*/
function qs(sel, parent) { return (parent || document).querySelector(sel); }
function qsa(sel, parent) { return [...(parent || document).querySelectorAll(sel)]; }
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*FOOTER YEAR*/
qs('#footerYear').textContent = new Date().getFullYear();

/*MOBILE HAMBURGER*/
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

/*SCROLL REVEAL*/
(function() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(el => {
      if (el.isIntersecting) { el.target.classList.add('visible'); io.unobserve(el.target); }
    });
  }, { threshold: 0.12 });
  qsa('.reveal').forEach(el => io.observe(el));
})();

/*PARTICLES (lightweight canvas)*/
(function() {
  const canvas = qs('#particles-canvas');
  if (!canvas || prefersReducedMotion) return;
  const ctx    = canvas.getContext('2d');
  if (!ctx) return;
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

/*HERO 3D (Three.js progressive enhancement)*/
(function() {
  const canvas = qs('#hero-3d');
  if (!canvas || prefersReducedMotion) return;

  import('https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js')
    .then(THREE => {
      const section = qs('#sobre');
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      const group = new THREE.Group();
      const clock = new THREE.Clock();

      camera.position.set(0, 0, 9);
      scene.add(group);

      const primary = new THREE.Color('#2563eb');
      const accent = new THREE.Color('#14b8a6');

      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.55, 0.08, 140, 14),
        new THREE.MeshBasicMaterial({ color: primary, wireframe: true, transparent: true, opacity: 0.34 })
      );
      knot.position.set(3.1, -0.35, -1.2);
      group.add(knot);

      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.18, 2),
        new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.24 })
      );
      core.position.set(-3.4, 0.72, -1.8);
      group.add(core);

      const count = 180;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const radius = 2.4 + Math.random() * 3.6;
        const angle = Math.random() * Math.PI * 2;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 5.2;
        positions[i * 3 + 2] = Math.sin(angle) * radius - 2;
      }

      const stars = new THREE.Points(
        new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(positions, 3)),
        new THREE.PointsMaterial({ color: '#93c5fd', size: 0.035, transparent: true, opacity: 0.72 })
      );
      group.add(stars);

      function resize() {
        const rect = section.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }

      function tick() {
        const t = clock.getElapsedTime();
        knot.rotation.x = t * 0.18;
        knot.rotation.y = t * 0.28;
        core.rotation.x = -t * 0.14;
        core.rotation.y = t * 0.18;
        stars.rotation.y = t * 0.035;
        group.rotation.x = Math.sin(t * 0.35) * 0.04;
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
      }

      resize();
      tick();
      document.body.classList.add('hero-3d-ready');
      window.addEventListener('resize', resize, { passive: true });
    })
    .catch(() => {
      canvas.setAttribute('data-three-fallback', 'true');
    });
})();

/*SCROLL PROGRESS BAR*/
(function() {
  const navbar = qs('#navbar');
  if (!navbar) return;

  const progressBar = document.createElement('div');
  progressBar.className = 'nav-progress-bar';
  navbar.appendChild(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    const scrollPercent = Math.min(Math.max(progress * 100, 0), 100);
    const hue = 210 - (progress * 45);

    progressBar.style.width = scrollPercent + '%';
    navbar.style.setProperty('--nav-progress-hue', hue.toFixed(2));
  }

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
})();

/*NAVBAR SCROLL DETECTION*/
(function() {
  const navbar = qs('#navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
})();

/*PARALLAX EFFECT (HERO)*/
(function() {
  const bioCard = qs('.bio-card');
  const canvas = qs('#particles-canvas');

  if (!canvas || prefersReducedMotion) return;

  let rafId = null;

  function updateParallax() {
    const scrollY = window.scrollY;
    const parallaxIntensity = 0.5; // Adjust for more/less parallax

    if (bioCard) {
      bioCard.style.transform = 'translateY(0px)';
    }

    // Canvas particles also move slightly
    canvas.style.transform = `translateY(${scrollY * parallaxIntensity * -0.05}px)`;
  }

  window.addEventListener('scroll', () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateParallax);
  }, { passive: true });

  // Initial call
  updateParallax();
})();

/*FLOATING CARD (DIPLOMA)*/
(function() {
  const floatingCards = qsa('.diploma-card');
  if (prefersReducedMotion) return;

  floatingCards.forEach(card => {
    let rafId = null;

    // Intersection observer to trigger effect when visible
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const updateFloat = () => {
            const rect = card.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const centerX = rect.left + rect.width / 2;
            const windowCenterY = window.innerHeight / 2;
            const windowCenterX = window.innerWidth / 2;

            // Calculate rotation based on mouse position relative to element center
            const rotateX = (centerY - windowCenterY) / 500;
            const rotateY = (windowCenterX - centerX) / 500;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          };

          window.addEventListener('scroll', () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updateFloat);
          }, { passive: true });

          updateFloat(); // Initial call
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    io.observe(card);
  });
})();

/*STAGGER ANIMATION ENHANCEMENT*/
(function() {
  // Improve project cards stagger
  const projectCards = qsa('.project-card');
  projectCards.forEach((card, i) => {
    const style = card.getAttribute('style') || '';
    card.setAttribute('style', style + `transition-delay: ${i * 0.08}s;`);
  });
})();

/*COUNTER ANIMATION*/
function animateCounter(element, target, duration = 2000) {
  if (!element) return;

  const start = 0;
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out function for smooth deceleration
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeProgress);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Auto-start counters when they become visible
(function() {
  const counters = qsa('.counter');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target) || 0;
        animateCounter(entry.target, target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => io.observe(counter));
})();

(function() {
  const contactEmail = qs('#contactEmail');
  const emailLink = qs('#linkEmail');
  const socialWrap = qs('#contactSocial');
  const socialLinks = qsa('.bio-links .social-link');

  if (contactEmail && emailLink) {
    contactEmail.textContent = emailLink.href.replace('mailto:', '').trim();
  }

  if (socialWrap && socialLinks.length) {
    socialLinks.forEach(link => {
      const clone = link.cloneNode(true);
      clone.removeAttribute('id');
      socialWrap.appendChild(clone);
    });
  }
})();

/*SKILLS*/
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

/*PROJECT CARD FACTORY*/
function createProjectCard(data) {
  data = data || {};
  const card = document.createElement('article');
  card.className = 'project-card';
  card.setAttribute('role', 'listitem');

  const tagsHtml = (data.tags || ['React', 'Node.js']).map(t =>
    `<span class="tag">${t}</span>`
  ).join('');

  const outcomeHtml = data.outcome ? `<p class="project-outcome"><strong>Resultado:</strong> ${data.outcome}</p>` : '';
  const demoLink = data.demoUrl ? `<a href="${data.demoUrl}" class="btn-outline" target="_blank" rel="noopener noreferrer" aria-label="Ver demo de ${data.title}">Ver demo</a>` : '';
  const codeLink = data.codeUrl ? `<a href="${data.codeUrl}" class="btn-ghost" target="_blank" rel="noopener noreferrer" aria-label="Ver código de ${data.title}">Ver código</a>` : '';

  card.innerHTML = `
    <div class="project-image-area">
      ${data.image ? `<img src="${data.image}" class="project-img" alt="Preview do projeto ${data.title}" loading="lazy" decoding="async" />` : '<div class="project-img-placeholder">Sem imagem</div>'}
    </div>
    <div class="project-info">
      <h3 class="project-title">${data.title || 'Nome do Projeto'}</h3>
      <p class="project-description">${data.description || 'Descrição breve do projeto.'}</p>
      ${outcomeHtml}
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

/*PROJECTS CAROUSEL*/
(function() {
  const track    = qs('#projectsTrack');
  const dotsWrap = qs('#carouselDots');
  const prevBtn  = qs('#prevBtn');
  const nextBtn  = qs('#nextBtn');

  // Seed with portfolio projects
  const demos = [
    {
      title: 'FlexFuel',
      description: 'Aplicação para comparar gasolina e etanol com base na autonomia real do veículo cadastrado, priorizando clareza na decisão de abastecimento.',
      outcome: 'fluxo direto, interface responsiva e cálculo prático para uso rápido no posto.',
      image: 'img/projeto-flex-fuel.png',
      tags: ['JavaScript', 'HTML', 'CSS', 'UX/UI'],
      demoUrl: 'https://flex-fuel-eco.vercel.app/',
      codeUrl: 'https://github.com/DevKaioBrunu/FlexFuel.git'
    },

    {
      title: 'Biblioteca Universitária',
      description: 'Aplicação web full-stack para gerenciamento de empréstimos, autenticação de usuários e organização operacional de uma biblioteca acadêmica.',
      outcome: 'produto com autenticação, dashboard e integração entre front-end, API e banco de dados.',
      image: 'img/projeto-biblioteca-universitaria.jpg',
      tags: ['React', 'Node.js', 'PostgreSQL'],
      demoUrl: 'https://www.bibliotecauni.space/',
      codeUrl: 'https://github.com/app-biblioteca-ads-unifor-grupo-35-N697/biblioteca-emprestimos-cloud.git'
    },
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
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 24;
    const cardWidth   = cards[0].offsetWidth + gap;
    const idx = Math.round(scrollLeft / cardWidth);
    qsa('.carousel-dot', dotsWrap).forEach((d, i) => {
      d.classList.toggle('active', i === idx);
      d.setAttribute('aria-selected', i === idx);
    });
  }

  function scrollToCard(idx) {
    const cards = getCards();
    if (!cards[idx]) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 24;
    const cardWidth = cards[0].offsetWidth + gap;
    track.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => {
    const cards    = getCards();
    if (!cards.length) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 24;
    const cardWidth = cards[0].offsetWidth + gap;
    track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    const cards    = getCards();
    if (!cards.length) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 24;
    const cardWidth = cards[0].offsetWidth + gap;
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
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 24;
    const cardWidth = cards[0].offsetWidth + gap;
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

  function updateActiveLink() {
    let current = '';
    const sections = qsa('section[id]');

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 220) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink, { passive: true });
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
   CONTACT FORM HANDLER
   ────────────────────────────────────────────── */
(function() {
  const contactForm = qs('#contactForm');
  if (!contactForm) return;

  // Replace with actual email
  contactForm.action = 'https://formsubmit.co/k410bruno@gmail.com';
  
  // Add honeypot
  const honeypot = document.createElement('input');
  honeypot.type = 'hidden';
  honeypot.name = '_captcha';
  honeypot.value = 'false';
  contactForm.appendChild(honeypot);

  // Add success page redirect
  const successInput = document.createElement('input');
  successInput.type = 'hidden';
  successInput.name = '_next';
  successInput.value = window.location.href;
  contactForm.appendChild(successInput);

  // Handle form submission
  contactForm.addEventListener('submit', function(e) {
    const submitBtn = qs('#contactBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    submitBtn.style.opacity = '0.6';
    submitBtn.style.cursor = 'not-allowed';
  });
})();
