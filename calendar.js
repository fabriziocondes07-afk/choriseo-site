'use strict';
(() => {
  const target = window.OFICIO_CONTACT?.calendarUrl;
  // Publish only a verified 20-minute event-type link. A Cal.com public Event
  // registration URL is NOT a time-slot scheduler and must not be activated here.
  let url;
  try { url = new URL(target); } catch { return; }
  if (url.origin !== 'https://cal.com' || url.pathname.split('/').filter(Boolean).length < 2) return;
  const live = document.getElementById('calendar-live');
  const status = document.getElementById('calendar-status');
  const backup = document.getElementById('calendar-external');
  if (!live || !backup) return;
  document.getElementById('calendar-unavailable').hidden = true;
  live.hidden = false;
  backup.href = url.href;
  // Official Cal.com inline embed loader. No contact details in the URL.
  (function(C,A,L){let p=function(a,ar){a.q.push(ar);};let d=C.document;C.Cal=C.Cal||function(){let cal=C.Cal;let ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement('script')).src=A;cal.loaded=true;}if(ar[0]===L){const api=function(){p(api,arguments);};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==='string'){cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,['initNamespace',namespace]);}else p(cal,ar);return;}p(cal,ar);};})(window,'https://app.cal.com/embed/embed.js','init');
  window.Cal('init', 'choriseo', {origin:'https://cal.com'});
  const cal = window.Cal.ns.choriseo;
  cal('on', {action:'linkReady', callback:() => {status.hidden = true;}});
  cal('on', {action:'linkFailed', callback:() => {status.hidden = false;status.textContent = 'No pudimos cargar los horarios. Abre la agenda con el enlace de abajo.';}});
  cal('inline', {elementOrSelector:'#cal-inline',calLink:url.pathname.replace(/^\//,'').replace(/\/$/,''),config:{layout:'month_view',theme:'light'}});
  cal('ui', {hideEventTypeDetails:false,layout:'month_view'});
  setTimeout(() => {if(!status.hidden)status.textContent='Si los horarios no aparecen, abre la agenda con el enlace de abajo.';},12000);
  // Leave booking confirmation, date/time, Meet and cancellation links to Cal.com.
  // A page view or unconfirmed booking event never becomes a confirmed appointment.
})();
