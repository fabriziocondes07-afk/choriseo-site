"use strict";
// Only campaign attribution is transferred. Business/contact answers stay in Tally.
const sourceKeys=['utm_source','utm_medium','utm_campaign'];
function withAttribution(target,search){const u=new URL(target,window.location.origin);const params=new URLSearchParams(search);for(const key of sourceKeys){const value=params.get(key);if(value&&value.length<=500)u.searchParams.set(key,value);}return u.href;}
const frame=document.getElementById('application-frame');
if(frame){
 let submitted=false;
 frame.src=withAttribution(frame.src,window.location.search);
 const link=document.getElementById('application-external');
 if(link)link.href=withAttribution(link.href,window.location.search);
 // Accept completion only from this embedded Tally frame, never a click/page view.
 window.addEventListener('message',event=>{
  if(event.origin!=='https://tally.so'||event.source!==frame.contentWindow)return;
  let data=event.data;try{if(typeof data==='string')data=JSON.parse(data);}catch{return;}
  if(data?.event==='Tally.FormSubmitted'&&!submitted){
   const panel=document.getElementById('inline-booking');
   if(!panel)return;
   submitted=true;
   document.getElementById('application-live').hidden=true;
   panel.hidden=false;
   const layout=frame.closest('.contact-grid, .application-layout');
   if(layout)layout.classList.add('booking-active');
   const heading=document.getElementById('inline-booking-title');
   heading.focus({preventScroll:true});
   panel.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
   const script=document.createElement('script');
   script.src='/calendar.js';
   script.onerror=()=>{document.getElementById('calendar-unavailable').hidden=false;};
   document.head.appendChild(script);
  }
  if(data?.event==='Tally.FormLoaded'&&data.payload?.height){const height=Number(data.payload.height);if(Number.isFinite(height)&&height>=300&&height<=5000)frame.style.height=height+'px';}
 });
}
