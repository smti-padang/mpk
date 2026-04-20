/* ================================================================
   MPK SMK SMTI PADANG — MAIN.JS
   SPA Router, Scroll Reveal, Countdown, Animasi Interaktif
   ================================================================ */

'use strict';

/* ================================================================
   1. SPA ROUTER — ganti halaman tanpa reload
   ================================================================ */
var PAGES = [
  'beranda', 'tentang', 'struktur', 'pemiltos',
  'profil', 'keseruan', 'form-osis'
];

var currentPage = 'beranda';

function navigateTo(pageId, pushState) {
  if (!document.getElementById('page-' + pageId)) return;

  /* sembunyikan semua panel */
  PAGES.forEach(function (p) {
    var el = document.getElementById('page-' + p);
    if (el) el.classList.remove('page-aktif');
  });

  /* tampilkan panel tujuan */
  var target = document.getElementById('page-' + pageId);
  target.classList.add('page-aktif');
  currentPage = pageId;

  /* update URL hash */
  if (pushState !== false) {
    history.pushState({ page: pageId }, '', '#' + pageId);
  }

  /* scroll ke atas */
  window.scrollTo({ top: 0, behavior: 'smooth' });

  /* update nav aktif */
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(function (a) {
    a.classList.remove('aktif');
    if (a.getAttribute('data-page') === pageId) a.classList.add('aktif');
  });

  /* jalankan reveal untuk halaman ini */
  setTimeout(initReveal, 100);

  /* khusus halaman */
  if (pageId === 'beranda')  { initCountdown(); initStats(); }
  if (pageId === 'pemiltos') { initPemiltosCountdown(); initFormTabs(); }
  if (pageId === 'profil')   { initBpTabs(); }
}

/* ---- Tangkap klik tombol back/forward browser ---- */
window.addEventListener('popstate', function (e) {
  var page = (e.state && e.state.page) ? e.state.page : 'beranda';
  navigateTo(page, false);
});

/* ================================================================
   2. SCROLL REVEAL (IntersectionObserver)
   ================================================================ */
function initReveal() {
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children')
    .forEach(function (el) { obs.observe(el); });
}

/* ================================================================
   3. COUNTDOWN — Beranda (Pemiltos teaser)
   ================================================================ */
var countdownInterval = null;

function initCountdown() {
  var target = new Date('2025-10-01T08:00:00');
  var wrap   = document.getElementById('cd-beranda');
  if (!wrap) return;

  clearInterval(countdownInterval);
  countdownInterval = setInterval(function () {
    var now  = new Date();
    var diff = target - now;
    if (diff <= 0) { wrap.style.display = 'none'; clearInterval(countdownInterval); return; }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    var el = function(id){ return document.getElementById(id); };
    if (el('cd-b-hari'))   el('cd-b-hari').textContent   = pad(d);
    if (el('cd-b-jam'))    el('cd-b-jam').textContent    = pad(h);
    if (el('cd-b-menit'))  el('cd-b-menit').textContent  = pad(m);
    if (el('cd-b-detik'))  el('cd-b-detik').textContent  = pad(s);
  }, 1000);
}

/* ================================================================
   4. COUNTDOWN — Pemiltos
   ================================================================ */
var pemiltosInterval = null;

function initPemiltosCountdown() {
  var target = new Date('2025-10-01T08:00:00');
  var wrap   = document.getElementById('cd-pemiltos');
  if (!wrap) return;

  clearInterval(pemiltosInterval);
  pemiltosInterval = setInterval(function () {
    var now  = new Date();
    var diff = target - now;
    if (diff <= 0) { wrap.style.display = 'none'; clearInterval(pemiltosInterval); return; }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    var el = function(id){ return document.getElementById(id); };
    if (el('cd-p-hari'))  el('cd-p-hari').textContent  = pad(d);
    if (el('cd-p-jam'))   el('cd-p-jam').textContent   = pad(h);
    if (el('cd-p-menit')) el('cd-p-menit').textContent = pad(m);
    if (el('cd-p-detik')) el('cd-p-detik').textContent = pad(s);
  }, 1000);
}

function pad(n) { return String(n).padStart(2, '0'); }

/* ================================================================
   5. ANIMASI COUNTER STATS
   ================================================================ */
function initStats() {
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var dur    = 1600;
    var steps  = 60;
    var inc    = target / steps;
    var cur    = 0;
    var timer  = setInterval(function () {
      cur += inc;
      if (cur >= target) { cur = target; clearInterval(timer); }
      el.textContent = Math.floor(cur) + (el.getAttribute('data-suffix') || '');
    }, dur / steps);
  });
}

/* ================================================================
   6. PROFIL — TAB BP (Angkatan)
   ================================================================ */
function initBpTabs() {
  /* Default ke bp23 atau query param */
  var defaultBp = 'bp23';
  gantiTab(defaultBp);
}

function gantiTab(bp, event) {
  if (event) event.preventDefault();

  document.querySelectorAll('.bp-panel').forEach(function (p) { p.classList.remove('aktif'); });
  document.querySelectorAll('.bp-tab').forEach(function (t) { t.classList.remove('aktif'); });

  var panel = document.getElementById(bp);
  if (panel) panel.classList.add('aktif');

  document.querySelectorAll('[data-bp="' + bp + '"]').forEach(function (t) { t.classList.add('aktif'); });

  setTimeout(initReveal, 80);
}

/* ================================================================
   7. PEMILTOS — TAB FORMULIR
   ================================================================ */

/* Konfigurasi — ganti link ini dengan Google Form kalian */
var FORM_CONFIG = {
  caketos:   { embed: '', unduh: '' },
  cawaketos: { embed: '', unduh: '' }
};

function initFormTabs() {
  renderForm('caketos');
  renderForm('cawaketos');
}

function bukaFormulir(jenis) {
  document.querySelectorAll('.form-panel').forEach(function (p) { p.classList.remove('aktif'); });
  document.querySelectorAll('.formulir-tab').forEach(function (t) { t.classList.remove('aktif'); });

  var panel = document.getElementById('formulir-' + jenis);
  var tab   = document.getElementById('tab-' + jenis);
  if (panel) panel.classList.add('aktif');
  if (tab)   tab.classList.add('aktif', jenis);

  var sec = document.getElementById('formulir-section');
  if (sec) setTimeout(function(){ sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
}

function renderForm(jenis) {
  var wrap = document.getElementById('wrap-' + jenis);
  if (!wrap) return;
  var link = FORM_CONFIG[jenis] && FORM_CONFIG[jenis].embed;

  if (link && link.trim()) {
    wrap.innerHTML = '<iframe src="' + link + '" allowfullscreen loading="lazy" title="Formulir ' + jenis + '"></iframe>';
    var linkEl = document.getElementById('link-buka-' + jenis);
    if (linkEl) linkEl.href = link.replace('?embedded=true','').replace('&embedded=true','');
  } else {
    wrap.innerHTML = '<div class="form-placeholder"><div class="placeholder-icon">📋</div><h4>Formulir ' + (jenis==='caketos'?'Caketos':'Cawaketos') + '</h4><p>Link Google Form belum dikonfigurasi. Isi variabel FORM_CONFIG di <code>main.js</code>.</p><a href="https://forms.google.com" target="_blank" class="btn-outline" style="display:inline-flex;margin-top:0.5rem;">Buat Google Form →</a></div>';
  }
}

function unduhFormulir(jenis) {
  var link = FORM_CONFIG[jenis] && FORM_CONFIG[jenis].unduh;
  if (link && link.trim()) {
    window.open(link, '_blank', 'noopener');
  } else {
    var embed = FORM_CONFIG[jenis] && FORM_CONFIG[jenis].embed;
    if (embed && embed.trim()) {
      window.open(embed.replace('?embedded=true',''), '_blank', 'noopener');
    } else {
      alert('Link unduh belum dikonfigurasi.\nIsi variabel FORM_CONFIG.' + jenis + '.unduh di main.js');
    }
  }
}

/* ================================================================
   8. INIT — Jalankan saat DOM siap
   ================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* Tentukan halaman awal dari URL hash */
  var hash = window.location.hash.replace('#', '') || 'beranda';
  var startPage = PAGES.includes(hash) ? hash : 'beranda';
  navigateTo(startPage, false);

  /* Pasang event listener ke link nav */
  document.querySelectorAll('[data-page]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      navigateTo(el.getAttribute('data-page'));
    });
  });

  /* Scroll reveal global */
  initReveal();
});
