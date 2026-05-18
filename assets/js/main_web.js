function toggleTheme(){document.documentElement.setAttribute('data-theme',document.documentElement.getAttribute('data-theme')==='light'?'dark':'light')}

const cursor=document.getElementById('cursor'),ring=document.getElementById('cursorRing');
const customCursorEnabled=false;
if(customCursorEnabled){
let rx=0,ry=0,cx=0,cy=0;
document.addEventListener('mousemove',e=>{cx=e.clientX;cy=e.clientY;cursor.style.left=cx+'px';cursor.style.top=cy+'px'});
document.addEventListener('mousedown',()=>cursor.classList.add('clicked'));
document.addEventListener('mouseup',()=>cursor.classList.remove('clicked'));
document.querySelectorAll('a,button,.menu-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('hovered'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('hovered'));
});
function animRing(){rx+=(cx-rx)*.12;ry+=(cy-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)}
animRing();
}

const heroScene=document.querySelector('.hero-parallax');
const parallaxGalon=document.querySelector('.parallax-galon');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(heroScene&&parallaxGalon&&!reduceMotion){
  heroScene.addEventListener('mousemove',e=>{
    const r=heroScene.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    parallaxGalon.style.setProperty('--px',(x*34).toFixed(1)+'px');
    parallaxGalon.style.setProperty('--py',(y*24).toFixed(1)+'px');
    parallaxGalon.style.setProperty('--rot',(x*5).toFixed(2)+'deg');
  });
  heroScene.addEventListener('mouseleave',()=>{
    parallaxGalon.style.setProperty('--px','0px');
    parallaxGalon.style.setProperty('--py','0px');
    parallaxGalon.style.setProperty('--rot','0deg');
  });
  window.addEventListener('scroll',()=>{
    const shift=Math.min(window.scrollY*.11,64);
    parallaxGalon.style.setProperty('--sy',shift+'px');
  },{passive:true});
}

let sidebarOpen=false;
function toggleSidebar(){sidebarOpen?closeSidebar():openSidebar()}
function openSidebar(){
  sidebarOpen=true;
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
  document.getElementById('hamburger').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeSidebar(){
  sidebarOpen=false;
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
  document.body.style.overflow='';
}

const navbar=document.getElementById('navbar');
let lastY=0,navVisible=true;
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  navbar.classList.toggle('nav-scrolled',y>60);
  if(y<80){if(!navVisible){navbar.classList.remove('nav-hide');navVisible=true}}
  else if(y>lastY+8){if(navVisible){navbar.classList.add('nav-hide');navVisible=false}}
  else if(y<lastY-8){if(!navVisible){navbar.classList.remove('nav-hide');navVisible=true}}
  lastY=y;
},{passive:true});

const productSlides=[...document.querySelectorAll('.product-visual')];
const productTabs=[...document.querySelectorAll('.slider-tab')];
const sliderTitle=document.getElementById('sliderTitle');
const sliderDesc=document.getElementById('sliderDesc');
const unitPrice=document.getElementById('unitPrice');
const productQty=document.getElementById('productQty');
const productTotal=document.getElementById('productTotal');
const productWa=document.getElementById('productWa');
const qtyMinus=document.getElementById('qtyMinus');
const qtyPlus=document.getElementById('qtyPlus');
const colorBlock=document.querySelector('.slider-color-block');
const slideColors=[
  'linear-gradient(135deg,#00a9ff,#0ed2a2)',
  'linear-gradient(135deg,#22c55e,#0ea5e9)',
  'linear-gradient(135deg,#38bdf8,#2563eb)'
];
let activeProduct=0;
function rupiah(value){return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(value)}
function qtyValue(){return Math.max(1,Math.min(99,parseInt(productQty?.value||'1',10)||1))}
function updateProductOrder(){
  if(!productSlides.length||!productQty)return;
  const slide=productSlides[activeProduct];
  const qty=qtyValue();
  productQty.value=qty;
  const price=Number(slide.dataset.price||0);
  const total=price*qty;
  unitPrice.textContent=rupiah(price);
  productTotal.textContent=rupiah(total);
  const text=`Halo Depot Air 165! Saya mau pesan ${slide.dataset.name}, jumlah ${qty} galon. Total perkiraan ${rupiah(total)}.`;
  productWa.href=`https://wa.me/628988261519?text=${encodeURIComponent(text)}`;
}
function setProductSlide(index){
  if(!productSlides.length)return;
  const next=(index+productSlides.length)%productSlides.length;
  if(next===activeProduct){updateProductOrder();return}
  productSlides[activeProduct].classList.add('leaving');
  productSlides[activeProduct].classList.remove('active');
  setTimeout(()=>productSlides.forEach(slide=>slide.classList.remove('leaving')),520);
  activeProduct=next;
  const active=productSlides[activeProduct];
  active.classList.add('active');
  productTabs.forEach((tab,i)=>{
    tab.classList.toggle('active',i===activeProduct);
    tab.setAttribute('aria-selected',i===activeProduct?'true':'false');
  });
  sliderTitle.textContent=active.dataset.title;
  sliderDesc.textContent=active.dataset.desc;
  sliderTitle.style.animation='none';
  void sliderTitle.offsetWidth;
  sliderTitle.style.animation='';
  if(colorBlock)colorBlock.style.background=slideColors[activeProduct]||slideColors[0];
  updateProductOrder();
}
productTabs.forEach(tab=>tab.addEventListener('click',()=>setProductSlide(Number(tab.dataset.target||0))));
qtyMinus?.addEventListener('click',()=>{productQty.value=qtyValue()-1;updateProductOrder()});
qtyPlus?.addEventListener('click',()=>{productQty.value=qtyValue()+1;updateProductOrder()});
productQty?.addEventListener('input',updateProductOrder);
updateProductOrder();

function openPopup(id){document.getElementById('popup-'+id).classList.add('active');document.body.style.overflow='hidden'}
function closePopup(id){document.getElementById('popup-'+id).classList.remove('active');document.body.style.overflow=''}
document.querySelectorAll('.popup-overlay').forEach(o=>{o.addEventListener('click',e=>{if(e.target===o){o.classList.remove('active');document.body.style.overflow=''}})});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.popup-overlay.active').forEach(p=>{p.classList.remove('active')});document.body.style.overflow=''}});

const hero=document.querySelector('.hero');
for(let i=0;i<12;i++){const b=document.createElement('div');b.className='bubble';const s=Math.random()*18+7;b.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;bottom:-40px;animation-duration:${Math.random()*8+6}s;animation-delay:${Math.random()*8}s`;hero.appendChild(b)}

const revealObs=new IntersectionObserver((entries)=>{entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*70)}else{e.target.classList.remove('visible')}})},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

function countUp(el,target,suffix=''){let c=0;const step=target/55;const t=setInterval(()=>{c=Math.min(c+step,target);el.textContent=Math.floor(c)+suffix;if(c>=target)clearInterval(t)},20)}
const statsObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('[data-count]').forEach(el=>{countUp(el,+el.dataset.count,el.dataset.count==='99'?'%+':'+')});statsObs.disconnect()}})},{threshold:.3});
statsObs.observe(document.querySelector('.stats-bar'));

document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}})});

const waWrap=document.getElementById('waFloatWrap');
let waDismissed=false,waShown=false;
window.addEventListener('scroll',()=>{if(waDismissed)return;if(window.scrollY>300&&!waShown){waWrap.classList.add('visible');waShown=true}else if(window.scrollY<=300&&waShown){waWrap.classList.remove('visible');waShown=false}});
function dismissWa(){waDismissed=true;waWrap.classList.add('dismissed')}
