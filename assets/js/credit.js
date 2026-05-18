function toggleTheme(){
  document.documentElement.setAttribute(
    'data-theme',
    document.documentElement.getAttribute('data-theme')==='light'?'dark':'light'
  );
}

const memberPopup=document.getElementById('memberPopup');
const memberPopupImage=document.getElementById('memberPopupImage');
const memberPopupTitle=document.getElementById('memberPopupTitle');

function openMemberPopup(trigger){
  memberPopupImage.src=trigger.dataset.image;
  memberPopupImage.alt=trigger.dataset.alt;
  memberPopupTitle.textContent=trigger.dataset.title;
  memberPopup.classList.add('active');
  memberPopup.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}

function closeMemberPopup(){
  memberPopup.classList.remove('active');
  memberPopup.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}

document.querySelectorAll('.photo-trigger').forEach(trigger=>{
  trigger.addEventListener('click',()=>openMemberPopup(trigger));
});

memberPopup.addEventListener('click',event=>{
  if(event.target===memberPopup){
    closeMemberPopup();
  }
});

document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&memberPopup.classList.contains('active')){
    closeMemberPopup();
  }
});
