/* ================================================================
   MPK SMK SMTI PADANG — NAV.JS
   Navigasi: toggle drawer, aktif link, scroll shrink
   ================================================================ */

'use strict';

/* ---- Toggle mobile nav drawer ---- */
function toggleNav() {
  const drawer  = document.querySelector('.nav-drawer');
  const overlay = document.querySelector('.nav-overlay');
  if (!drawer) return;
  const isOpen = drawer.classList.toggle('aktif');
  overlay.classList.toggle('aktif', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

/* ---- Tutup drawer saat link diklik ---- */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.nav-drawer a').forEach(function (a) {
    a.addEventListener('click', function () {
      const drawer  = document.querySelector('.nav-drawer');
      const overlay = document.querySelector('.nav-overlay');
      drawer.classList.remove('aktif');
      overlay.classList.remove('aktif');
      document.body.style.overflow = '';
    });
  });

  /* ---- Tandai link aktif berdasarkan URL ---- */
  const page = window.location.hash
    ? '' // halaman tunggal (SPA), biarkan JS main.js yang atur
    : (window.location.pathname.split('/').pop() || 'index.html');

  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(function (a) {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === 'index.html' && href === 'index.html')) {
      a.classList.add('aktif');
    }
  });

  /* ---- Smooth scroll untuk anchor dalam halaman ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- Progress bar scroll ---- */
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      const scrollTop  = document.documentElement.scrollTop;
      const scrollMax  = document.documentElement.scrollHeight - window.innerHeight;
      const pct        = scrollMax > 0 ? (scrollTop / scrollMax) * 100 : 0;
      progressBar.style.width = pct + '%';
    });
  }
});
