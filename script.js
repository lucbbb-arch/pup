
document.addEventListener('DOMContentLoaded', ()=>{
  const header = document.querySelector('.header');
  const nav = document.querySelector('.nav');
  document.querySelector('.menu-btn')?.addEventListener('click',()=> nav.classList.toggle('open'));
  const setScroll = () => { if (window.scrollY > 40) header?.classList.add('scrolled'); else header?.classList.remove('scrolled'); };
  setScroll(); window.addEventListener('scroll', setScroll);
  const v = document.getElementById('heroVideo');
  const params = new URLSearchParams(location.search);
  if (params.get('debug') === '1' && v) v.setAttribute('controls','controls');
  if (v){ const p = v.play(); if (p && typeof p.then==='function'){ p.catch(()=> v.setAttribute('controls','controls')); } }
});
