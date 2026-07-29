const storageKey = 'speak-up-papar-progress';
const state = JSON.parse(localStorage.getItem(storageKey) || '{"complete":[],"checks":{},"notes":{}}');
const views = [...document.querySelectorAll('.view')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const nav = document.querySelector('.side-nav');
const menuButton = document.querySelector('.menu-button');

function save(){ localStorage.setItem(storageKey, JSON.stringify(state)); updateProgress(); }
function showView(id){
  views.forEach(v => v.classList.toggle('active-view', v.id === id));
  navLinks.forEach(link => link.classList.toggle('active', link.dataset.view === id));
  nav.classList.remove('open'); menuButton.setAttribute('aria-expanded','false');
  updateProgress();
  window.location.hash = id; document.querySelector('#main').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'smooth'});
}
function updateProgress(){
  const items = ['module-1','module-2','module-3','module-4','practice','challenge'];
  const value = Math.round((state.complete.length / items.length) * 100);
  document.querySelector('#progress-bar').style.width = value + '%';
  document.querySelector('#progress-label').textContent = value + '% lengkap';
  document.querySelectorAll('[data-complete]').forEach(btn => {
    const done = state.complete.includes(btn.dataset.complete);
    btn.textContent = done ? '✓ Selesai - teruskan!' : btn.dataset.complete === 'practice' ? '✓ Saya telah pilih aktiviti untuk dicuba' : btn.textContent.replace('Selesai - teruskan!','');
    btn.classList.toggle('is-done',done);
  });
}
navLinks.forEach(link => link.addEventListener('click', e => {e.preventDefault();showView(link.dataset.view)}));
document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.go)));
menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('[data-complete]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.complete;if(!state.complete.includes(id))state.complete.push(id);save();}));
document.querySelectorAll('.save-note').forEach(btn=>{const field=document.getElementById(btn.dataset.note);field.value=state.notes[btn.dataset.note]||'';btn.addEventListener('click',()=>{state.notes[btn.dataset.note]=field.value;save();btn.textContent='Nota disimpan ✓';setTimeout(()=>btn.textContent='Simpan nota',1500)});});
document.querySelectorAll('[data-choice]').forEach(btn=>btn.addEventListener('click',()=>{const out=document.querySelector('#choice-feedback');if(btn.dataset.choice==='assertive'){out.textContent='Bagus! Anda mengakui permintaan, menerangkan realiti, dan menawarkan pilihan.';out.style.color='#007c82'}else{out.textContent='Cuba lagi. Respons yang baik tetap menghormati orang lain sambil menyatakan kekangan dan pilihan.';out.style.color='#c1295d'}}));
document.querySelectorAll('[data-quiz]').forEach(btn=>btn.addEventListener('click',()=>{const out=document.querySelector('#quiz-feedback');const ok=btn.dataset.quiz==='right';out.textContent=ok?'Betul! Pitch yang baik membuka pintu kepada perbualan seterusnya.':'Belum tepat. Pitch bukan cerita penuh - pilih mesej yang ringkas dan bernilai.';out.style.color=ok?'#007c82':'#c1295d'}));
document.querySelectorAll('[data-check]').forEach(box=>{box.checked=!!state.checks[box.dataset.check];box.addEventListener('change',()=>{state.checks[box.dataset.check]=box.checked;save();})});
document.querySelector('#finish-course').addEventListener('click',()=>{const all=[...document.querySelectorAll('[data-check]')].every(x=>x.checked);const message=document.querySelector('#finish-message');if(all){if(!state.complete.includes('challenge'))state.complete.push('challenge');save();message.textContent='Tahniah! Anda sudah merancang perbualan berani anda. Cuba lakukan dalam minggu ini.';}else{message.textContent='Tandakan semua empat persediaan sebelum menamatkan cabaran.';message.style.color='#c1295d'}});
const initial = location.hash.replace('#',''); if(initial && document.getElementById(initial)) showView(initial); else updateProgress();
