const pages=document.querySelectorAll('.app-page');
const navItems=document.querySelectorAll('.nav-item');

function showPage(name){
  pages.forEach(page=>page.classList.toggle('active',page.dataset.page===name));
  navItems.forEach(item=>item.classList.toggle('active',item.dataset.page===name));
  window.scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('[data-page]').forEach(item=>{
  if(item.classList.contains('app-page')) return;
  item.addEventListener('click',()=>showPage(item.dataset.page));
});

document.querySelectorAll('[data-open-page]').forEach(item=>item.addEventListener('click',()=>showPage(item.dataset.openPage)));

const fallbackNews=[
  {headline:'Socrates crowned 2026 champions',category:'FACTION CARNIVAL • 4 SEPTEMBER 2026',body:"Green has won Alkimos College's 2026 high-school faction carnival by around 300 points.",icon:'🏆'},
  {headline:'Aristotle athlete wins Champion Boy',category:'INDIVIDUAL',body:'A Year 7 Aristotle athlete collected a ribbon in every event.',icon:'🏅'},
  {headline:'Plato take team-games trophy',category:'TEAM GAMES',body:'Plato claimed the minor team-games trophy during the 2026 carnival.',icon:'🟡'}
];

function renderNews(items){
  const list=document.getElementById('news-list');
  list.innerHTML=items.map(item=>`<article class="card news-card"><div class="news-img">${item.icon||'📰'}</div><div class="news-copy"><div class="meta">${escapeHtml(item.category||'ACSAD NEWS')}</div><h2>${escapeHtml(item.headline)}</h2><p>${escapeHtml(item.body||'')}</p></div></article>`).join('');
}

function renderResults(){
  document.getElementById('results-list').innerHTML=`<article class="result-card"><div class="result-top"><span>FACTION CARNIVAL</span><span>4 SEP 2026</span></div><div class="result-score">🟢 Socrates — Champions 🏆</div><p class="result-note">2026 Alkimos College high-school faction carnival champions.</p></article><article class="result-card"><div class="result-top"><span>TEAM GAMES</span><span>2026 CARNIVAL</span></div><div class="result-score">🟡 Plato — Trophy</div><p class="result-note">Plato claimed the minor team-games trophy.</p></article>`;
}

function renderFixtures(){
  document.getElementById('fixtures-list').innerHTML='<div class="empty-card"><div class="empty-icon">📅</div><h2>No fixtures published yet</h2><p>Upcoming games and events will appear here when they are added to ACSAD.</p></div>';
}

function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

async function loadNews(){
  renderNews(fallbackNews);
  if(!window.supabaseClient) return;
  try{
    const {data,error}=await window.supabaseClient.from('articles').select('headline,category,body,image_url,published_at').order('published_at',{ascending:false}).limit(20);
    if(error) throw error;
    if(data&&data.length){
      renderNews(data.map(article=>({headline:article.headline,category:article.category,body:article.body,icon:article.image_url?'🖼️':'📰'})));
    }
  }catch(error){console.warn('ACSAD news sync unavailable:',error.message);}
}

renderResults();
renderFixtures();
loadNews();