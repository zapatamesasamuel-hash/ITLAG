(function () {
  'use strict';

  const slides = Array.from(document.querySelectorAll('.slide'));
  const navItems = Array.from(document.querySelectorAll('.nav-item'));
  const dotsContainer = document.getElementById('dots');
  const slideCountEl = document.getElementById('slideCount');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const loader = document.getElementById('loader');

  const total = slides.length;
  let current = 0;

  const careers = {
    admin: {
      label: 'ADMINISTRACIÓN',
      title: 'Técnico Laboral en Auxiliar Administrativo y Contable',
      text: 'Formación enfocada en procesos administrativos, contables y de apoyo empresarial, orientada a desarrollar competencias para el desempeño en oficinas, áreas contables y de gestión.'
    },
    vet: {
      label: 'VETERINARIA',
      title: 'Técnico Laboral en Auxiliar en Clínica Veterinaria',
      text: 'Preparación para apoyar actividades relacionadas con la atención, cuidado y procedimientos básicos en una clínica veterinaria.'
    },
    safety: {
      label: 'SEGURIDAD',
      title: 'Técnico Laboral en Seguridad Ocupacional y Laboral',
      text: 'Formación enfocada en la prevención de riesgos y el fortalecimiento de la seguridad dentro de los entornos laborales.'
    }
  };

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Ir a la sección ' + (i + 1));
      if (i === current) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function updateUI() {
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    navItems.forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.slide) === current);
    });
    Array.from(dotsContainer.children).forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
    slideCountEl.textContent = pad(current + 1) + ' / ' + pad(total);
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  function goTo(index) {
    if (index < 0 || index >= total || index === current) return;
    current = index;
    updateUI();
    closeSidebar();
  }

  function next() {
    if (current < total - 1) goTo(current + 1);
  }

  function prev() {
    if (current > 0) goTo(current - 1);
  }

  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('visible');
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('visible');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleSidebar() {
    if (sidebar.classList.contains('open')) closeSidebar();
    else openSidebar();
  }

  function openModal(key) {
    const data = careers[key];
    if (!data) return;
    document.getElementById('modalLabel').textContent = data.label;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalText').textContent = data.text;
    document.getElementById('careerModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('careerModal').classList.remove('open');
    document.body.style.overflow = '';
  }

  navItems.forEach((btn) => {
    btn.addEventListener('click', () => goTo(Number(btn.dataset.slide)));
  });

  document.querySelectorAll('[data-go]').forEach((btn) => {
    btn.addEventListener('click', () => goTo(Number(btn.dataset.go)));
  });

  document.querySelectorAll('[data-career]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.career));
  });

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  menuBtn.addEventListener('click', toggleSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('careerModal').addEventListener('click', (e) => {
    if (e.target.id === 'careerModal') closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeSidebar();
    }
    if (document.getElementById('careerModal').classList.contains('open')) return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  let touchStartX = 0;
  const main = document.getElementById('presentation');
  main.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  main.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 50) {
      if (delta < 0) next(); else prev();
    }
  }, { passive: true });

  buildDots();
  updateUI();

  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });

  if (document.readyState === 'complete') {
    loader.classList.add('hidden');
  }
})();
