const page = document.body.dataset.page;

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function initials(name) {
  return name.split(' ').map(n => n[0]).join('');
}

function projectCardHtml(p) {
  const active = p.status === 'In Progress';
  return `
    <div class="project-card" data-type="${escHtml(p.type)}">
      <div class="project-card__img" aria-hidden="true">
        <div class="project-card__img-hatch"></div>
        <div class="project-card__img-icon"><img src="/assets/icon-black-bg.png" alt=""></div>
      </div>
      <div class="project-card__meta">
        <div>
          <span class="label project-card__type">${escHtml(p.type)} &middot; ${escHtml(p.year)}</span>
          <div class="project-card__title">${escHtml(p.title)}</div>
          <div class="project-card__location">${escHtml(p.location)} &middot; ${escHtml(p.size)}</div>
        </div>
        <span class="project-card__status${active ? ' project-card__status--active' : ''}">${escHtml(p.status)}</span>
      </div>
    </div>`;
}

async function loadSettings() {
  const s = await fetch('/data/settings.json').then(r => r.json());

  // Hero
  const eyebrow = document.getElementById('hero-eyebrow');
  if (eyebrow) eyebrow.textContent = s.hero.eyebrow;
  const h1 = document.getElementById('hero-headline');
  if (h1) h1.innerHTML = `${escHtml(s.hero.line1)}<br><span class="hero__headline-dim">${escHtml(s.hero.line2)}</span><br>${escHtml(s.hero.line3)}`;

  // Stats
  const statsEl = document.getElementById('hero-stats');
  if (statsEl && s.stats) {
    statsEl.innerHTML = s.stats.map((st, i) => `
      <div class="hero__stat">
        <div class="hero__stat-num">${escHtml(st.number)}</div>
        <span class="label hero__stat-label">${escHtml(st.label)}</span>
      </div>`).join('');
  }

  // Contact info
  ['phone', 'email', 'address'].forEach(k => {
    const el = document.getElementById(`contact-${k}`);
    if (el) el.textContent = s.contact[k];
  });

  // Footer
  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = s.company.founded;
  const footerLoc = document.getElementById('footer-location');
  if (footerLoc) footerLoc.textContent = `${s.company.location} · Licensed & Bonded · ${s.company.license}`;

  // About story
  const storyEl = document.getElementById('about-story');
  if (storyEl) {
    storyEl.innerHTML = s.about.story
      .split('\n\n')
      .map(p => `<p>${escHtml(p)}</p>`)
      .join('<br><br>');
  }
}

async function loadProjects(limit) {
  const data = await fetch('/data/projects.json').then(r => r.json());
  const projects = limit ? data.projects.slice(0, limit) : data.projects;

  const container = document.getElementById('projects-container');
  if (container) container.innerHTML = projects.map(projectCardHtml).join('');

  // Re-init filter if on projects page
  if (page === 'projects') initFilter();
}

function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = () => document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cards().forEach(card => {
        card.hidden = filter !== 'all' && card.dataset.type !== filter;
      });
    });
  });
}

async function loadServices() {
  const data = await fetch('/data/services.json').then(r => r.json());
  const container = document.getElementById('services-container');
  if (!container) return;
  container.innerHTML = data.services.map((s, i) => `
    <div class="services-list__item">
      <div class="services-list__item-inner">
        <div>
          <span class="label service-num">0${i + 1}</span>
          <div class="service-title">${escHtml(s.title)}</div>
        </div>
        <p class="service-desc">${escHtml(s.description)}</p>
        <ul class="service-items">
          ${s.items.map(item => `
            <li class="service-item">
              <div class="service-item-dash"></div>
              <span class="label">${escHtml(item)}</span>
            </li>`).join('')}
        </ul>
      </div>
    </div>`).join('');
}

async function loadTeam() {
  const data = await fetch('/data/team.json').then(r => r.json());
  const container = document.getElementById('team-container');
  if (!container) return;
  container.innerHTML = data.team.map(m => `
    <div class="leader-card">
      <div class="leader-avatar" aria-hidden="true">${escHtml(initials(m.name))}</div>
      <div class="leader-name">${escHtml(m.name)}</div>
      <span class="label leader-role">${escHtml(m.role)}</span>
      <p class="leader-bio">${escHtml(m.bio)}</p>
    </div>`).join('');
}

// Load content for current page
loadSettings();
if (page === 'home')     loadProjects(3);
if (page === 'projects') loadProjects(null);
if (page === 'services') loadServices();
if (page === 'about')    loadTeam();
