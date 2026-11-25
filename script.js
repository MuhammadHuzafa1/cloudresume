(function(){
var d=document,r=d.documentElement;
function $(s,c){return(c||d).querySelector(s)}
function $$(s,c){return[].slice.call((c||d).querySelectorAll(s))}
var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* toast + copy */
var tt;
function toast(m){var t=$('#toast');if(!t){t=d.createElement('div');t.id='toast';t.setAttribute('role','status');d.body.appendChild(t)}
t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('show')},2200)}
function copy(txt,msg){
function ok(){toast(msg||'Copied!')}
function fb(){var a=d.createElement('textarea');a.value=txt;a.style.position='fixed';a.style.opacity=0;d.body.appendChild(a);a.select();try{d.execCommand('copy')}catch(e){}d.body.removeChild(a);ok()}
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(ok,fb)}else fb()}

/* ambient background: aurora + grid (CSS) and particle canvas */
var bg=d.createElement('div');bg.className='bg';bg.setAttribute('aria-hidden','true');
bg.innerHTML='<i class="aur a1"></i><i class="aur a2"></i><i class="aur a3"></i><i class="gr"></i><canvas id="fx"></canvas>';
d.body.insertBefore(bg,d.body.firstChild);
var cv=$('#fx'),cx=cv.getContext('2d'),W=0,H=0,P=[],col='6,182,212',dpr=Math.min(window.devicePixelRatio||1,1.5),raf;
function fxCol(){var v=getComputedStyle(r).getPropertyValue('--ac').trim(),m=/^#([0-9a-f]{6})$/i.exec(v);
col=m?[0,2,4].map(function(i){return parseInt(m[1].substr(i,2),16)}).join(','):'6,182,212'}
function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);
var n=Math.min(70,Math.round(W*H/24000));P=[];
for(var k=0;k<n;k++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25})}
function draw(){cx.clearRect(0,0,W,H);var a=r.dataset.theme==='light'?.35:.55;
for(var i=0;i<P.length;i++){var p=P[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
cx.fillStyle='rgba('+col+','+a+')';cx.beginPath();cx.arc(p.x,p.y,1.6,0,6.283);cx.fill();
for(var j=i+1;j<P.length;j++){var q=P[j],dx=p.x-q.x,dy=p.y-q.y,dd=dx*dx+dy*dy;
if(dd<14400){cx.strokeStyle='rgba('+col+','+(a*(1-dd/14400)*.6)+')';cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}}}}
function loop(){draw();raf=requestAnimationFrame(loop)}
fxCol();size();if(rm)draw();else loop();
addEventListener('resize',function(){size();if(rm)draw()});
d.addEventListener('visibilitychange',function(){if(rm)return;if(d.hidden)cancelAnimationFrame(raf);else loop()});

/* theme */
var th=$('#theme');
if(th)th.onclick=function(){var n=r.dataset.theme==='light'?'dark':'light';r.dataset.theme=n;try{localStorage.setItem('theme',n)}catch(e){}fxCol();if(rm)draw()};

/* mobile menu */
var m=$('#menu'),ul=$('#links');
if(m)m.onclick=function(){var o=ul.classList.toggle('open');m.setAttribute('aria-expanded',o)};

/* page transition on internal links */
addEventListener('pageshow',function(e){if(e.persisted)r.classList.remove('leaving')});
d.addEventListener('click',function(e){
var a=e.target.closest&&e.target.closest('a[href]');
if(!a||rm||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute('download'))return;
if(a.protocol!==location.protocol||a.host!==location.host||a.pathname===location.pathname)return;
e.preventDefault();r.classList.add('leaving');setTimeout(function(){location.href=a.href},320)});

/* typing effect */
var ty=$('#typed');
if(ty){var w=['CS Student','Cybersecurity Enthusiast','Ethical Hacking Learner'],i=0,c=0,del=false;
if(rm){ty.textContent=w[0]}else{(function tick(){var s=w[i];c+=del?-1:1;ty.textContent=s.slice(0,c);
var t=del?35:75;if(!del&&c===s.length){del=true;t=1400}else if(del&&c===0){del=false;i=(i+1)%w.length;t=300}setTimeout(tick,t)})()}}

/* word-by-word reveal for h1, h2 and the hero lead */
function split(el){
if(el.children.length){el.classList.add('sp');return}
var words=el.textContent.trim().split(/\s+/),st=el.classList.contains('lead')?20:55;
el.textContent='';
words.forEach(function(t,k){var s=d.createElement('span'),n=d.createElement('span');
s.className='w';n.className='wi';n.textContent=t;n.style.transitionDelay=Math.min(k,40)*st+'ms';
s.appendChild(n);el.appendChild(s);if(k<words.length-1)el.appendChild(d.createTextNode(' '))});
el.classList.add('sp')}
var sp=$$('h1,h2,.lead');sp.forEach(split);
if('IntersectionObserver' in window){var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('go');so.unobserve(e.target)}})},{threshold:.2});sp.forEach(function(el){so.observe(el)})}
else sp.forEach(function(el){el.classList.add('go')});

/* skill cards: count badges + staggered pills */
$$('.sk').forEach(function(card){var li=$$('.tags li',card),b=$('.cnt',card);
if(b)b.textContent=li.length+' skills';
li.forEach(function(x,k){x.style.transitionDelay=(k*45+250)+'ms'})});

/* scroll reveal (cards, timeline items, sections) */
var rv=$$('.rv');
function show(el,k){el.classList.add('in');
setTimeout(function(){el.classList.remove('rv');el.style.transitionDelay='';
if(el.classList.contains('sk'))$$('.tags li',el).forEach(function(x){x.style.transitionDelay='0s'})},1300+k)}
function idx(el){return[].indexOf.call(el.parentNode.children,el)%4*90}
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var k=idx(e.target);e.target.style.transitionDelay=k+'ms';show(e.target,k);io.unobserve(e.target)}})},{threshold:.12});
rv.forEach(function(el){io.observe(el)})}else rv.forEach(function(el){show(el,0)});

/* counters */
function count(el){var to=parseFloat(el.dataset.count),dec=+el.dataset.dec||0;
if(rm){el.textContent=to.toFixed(dec);return}
var t0=performance.now(),dur=1400;(function f(t){var p=Math.min((t-t0)/dur,1);el.textContent=(to*(1-Math.pow(1-p,3))).toFixed(dec);if(p<1)requestAnimationFrame(f)})(t0)}
var cn=$$('[data-count]');
if(cn.length){if('IntersectionObserver' in window){var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);co.unobserve(e.target)}})},{threshold:.5});cn.forEach(function(el){co.observe(el)})}else cn.forEach(count)}

/* copy student id */
var cb=$('#copyid');
if(cb)cb.onclick=function(){copy('F20242661336','Copied!')};

/* contact form */
var cf=$('#cform');
if(cf)cf.onsubmit=function(e){e.preventDefault();var f=new FormData(cf);
toast('Opening your email app…');
setTimeout(function(){location.href='mailto:huzafatahir0310@gmail.com?subject='+encodeURIComponent('Message from '+f.get('n'))+'&body='+encodeURIComponent(f.get('m')+'\n\n'+f.get('e'))},600)};

/* about page: scrollspy */
function initSpy(){
var box=$('#spy'),L=$$('a',box),S=L.map(function(a){return d.getElementById(a.hash.slice(1))}),px=$('#pillx'),fl=$('#fill'),act=-1,wrapEl=box.parentNode;
function mv(){if(act<0)return;var a=L[act];px.style.width=a.offsetWidth+'px';px.style.height=a.offsetHeight+'px';px.style.transform='translate('+a.offsetLeft+'px,'+a.offsetTop+'px)';
if(wrapEl.scrollWidth>wrapEl.clientWidth+4)wrapEl.scrollTo({left:a.offsetLeft-24,behavior:rm?'auto':'smooth'})}
function upd(){
var y=innerHeight*.35,k=0;
S.forEach(function(s,j){if(s.getBoundingClientRect().top<=y)k=j});
if(innerHeight+scrollY>=d.documentElement.scrollHeight-4)k=S.length-1;
if(k!==act){act=k;L.forEach(function(a,j){a.classList.toggle('on',j===k);a.classList.toggle('done',j<k);if(j===k)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});mv()}
var cs=L.map(function(a){return a.offsetTop+a.offsetHeight/2}),h=cs[k];
if(k<S.length-1){var t0=S[k].getBoundingClientRect().top,t1=S[k+1].getBoundingClientRect().top,f=Math.max(0,Math.min(1,(y-t0)/(t1-t0)));h=cs[k]+(cs[k+1]-cs[k])*f}
fl.style.height=h+'px'}
addEventListener('scroll',upd,{passive:true});
addEventListener('resize',function(){mv();upd()});
addEventListener('load',function(){mv();upd()});
upd()}
if($('#spy'))initSpy();

/* certificates */
var C=[
{t:'Foundations of Cybersecurity',i:'Google (Coursera)',id:'3UJWRHN9ACW9',d:'Jul 3, 2026',v:'coursera.org/verify/3UJWRHN9ACW9',u:'https://coursera.org/verify/3UJWRHN9ACW9',cat:'sec',img:'img/certs/google-foundations.jpg'},
{t:'Introduction to Cybersecurity',i:'Cisco Networking Academy',id:'ec6d5023-00d4-4b13-a218-398db3870488',d:'Aug 15, 2026',cat:'sec',img:'img/certs/cisco.jpg'},
{t:'Play It Safe: Manage Security Risks',i:'Google (Coursera)',id:'ZSLM8XXAX2F1',d:'Oct 1, 2026',v:'coursera.org/verify/ZSLM8XXAX2F1',u:'https://coursera.org/verify/ZSLM8XXAX2F1',cat:'sec',img:'img/certs/google-risks.jpg'},
{t:'6-Week Cyber Security Internship',i:'DevelopersHub Corporation',id:'DHC-2910',d:'Apr 13 – May 25, 2026',cat:'sec',a:'Best Award',img:'img/certs/developershub.jpg'},
{t:'Cyber Security Virtual Internship',i:'DecodeLabs',id:'CS075499',d:'Jun 22 – Jul 22, 2026',cat:'sec',img:'img/certs/decodelabs.jpg'},
{t:'Cyber Security Virtual Internship',i:'CodeAlpha',id:'CA/DF1/167943',d:'Jul 1 – Jul 30, 2026',cat:'sec',img:'img/certs/codealpha.jpg'},
{t:'Generative AI Application Developer, Cohort 3',i:'NCEAC–HEC & Pak Angels (USA)',id:'fae90b079a90418d',d:'May 30, 2026',cat:'ai',a:'Top Performer',img:'img/certs/genai3.jpg'},
{t:'Generative AI Application Developer, Cohort 1',i:'NCEAC–HEC & Pak Angels (USA)',id:'b3997b703d9d1075',d:'Dec 20, 2025',cat:'ai',a:'Top Performer',img:'img/certs/genai1.jpg'},
{t:'Volunteer Internship Certificate',i:'Waduha Welfare Organization (with UMT)',id:'Signed by Zuha Rashid, Founder',d:'Dec 23, 2025',cat:'vol',nc:1,img:'img/certs/waduha.jpg'}];

var B={
all:{t:'Executive overview',p:'Nine verified credentials from Google, Cisco, the Higher Education Commission (NCEAC–HEC) and hands-on cybersecurity internships. Together they show a steady build-up from security fundamentals to real engineering work, with Generative AI and community service alongside.',c:['Google','Cisco','HEC / Pak Angels','3 Internships']},
sec:{t:'Cybersecurity & Internships',p:'Practical experience across three internships plus Google and Cisco training. I have assessed web vulnerabilities (XSS, SQL injection), hardened Node.js apps, audited against the OWASP Top 10, fixed penetration-testing findings, secured containerized deployments and studied enterprise risk management.',c:['XSS & SQLi','Node.js hardening','OWASP Top 10','Docker security','Risk management']},
ai:{t:'Generative AI',p:'Two consecutive Top Performer awards in the NCEAC–HEC and Pak Angels (USA) Generative AI training programs. I built LLM-powered applications and AI-enhanced web workflows, which is the base for my next focus on AI security.',c:['Top Performer ×2','LLM apps','AI web workflows']},
vol:{t:'Volunteering & Community',p:'I care about community service and welfare work. Spending a day at Waduha Care Home with UMT, helping with the educational development of the children there, was one of the most meaningful things I have done, and I want to keep giving back.',c:['Waduha Care Home','Education','Community']}};

/* image fallback: verified credential badge card */
function badge(c){return'<div class="badge"><span class="vb">✔ Verified Digital Credential</span><strong>'+c.t+'</strong><span>'+c.i+'</span><dl><dt>Credential ID</dt><dd class="mono">'+c.id+'</dd><dt>Date</dt><dd class="mono">'+c.d+'</dd><dt>Verify</dt><dd class="mono">'+(c.v||'QR code on certificate')+'</dd></dl></div>'}
function bad(im){
if(im.dataset.i!==undefined){var c=C[im.dataset.i];if(!c)return;var wr=d.createElement('div');wr.innerHTML=badge(c);im.parentNode.replaceChild(wr.firstChild,im)}
else if(im.classList.contains('avatar')){var a=d.createElement('div');a.className='avatar ini';a.setAttribute('role','img');a.setAttribute('aria-label',im.alt);a.textContent='MH';im.parentNode.replaceChild(a,im)}}
d.addEventListener('error',function(e){if(e.target&&e.target.tagName==='IMG')bad(e.target)},true);
$$('img').forEach(function(im){if(im.complete&&im.getAttribute('src')&&im.naturalWidth===0)bad(im)});

function initCerts(){
var grid=$('#grid'),ban=$('#banner'),lb=$('#lb'),cur='all',last=null,ck=0;
function render(){
var b=B[cur];
ban.style.animation='none';ban.offsetHeight;ban.style.animation='';
ban.innerHTML='<h3>'+b.t+'</h3><p>'+b.p+'</p><ul class="tags c">'+b.c.map(function(x){return'<li>'+x+'</li>'}).join('')+'</ul>';
var n=0;
grid.innerHTML=C.map(function(c,k){if(cur!=='all'&&c.cat!==cur)return'';
return'<article class="cc" tabindex="0" role="button" data-k="'+k+'" aria-label="Open '+c.t+', '+c.i+'" style="animation-delay:'+(n++*60)+'ms"><div class="th"><img src="'+c.img+'" alt="'+c.t+' certificate from '+c.i+'" loading="lazy" data-i="'+k+'"></div><div class="cm"><h3>'+c.t+'</h3><p class="mut">'+c.i+'</p><div class="row"><span class="mono mut">'+c.d+'</span><span class="tag">✔ Verified</span>'+(c.a?'<span class="tag a">★ '+c.a+'</span>':'')+'</div></div></article>'}).join('')}
$$('.sb button').forEach(function(bt){bt.onclick=function(){cur=bt.dataset.f;$$('.sb button').forEach(function(x){x.classList.remove('on');x.setAttribute('aria-pressed','false')});bt.classList.add('on');bt.setAttribute('aria-pressed','true');render()}});
render();

function openLb(k){var c=C[k];ck=k;last=d.activeElement;
lb.innerHTML='<div class="lbx"><button class="icon lbc" aria-label="Close" id="lbclose">✕</button><div class="lbi" id="lbi"><img src="'+c.img+'" alt="'+c.t+' certificate" data-i="'+k+'"></div><div class="lbd"><span class="tag">✔ Verified</span>'+(c.a?' <span class="tag a">★ '+c.a+'</span>':'')+'<h3 style="margin-top:12px">'+c.t+'</h3><p class="mut">'+c.i+'</p><dl><dt>Date</dt><dd class="mono">'+c.d+'</dd><dt>Credential ID</dt><dd class="mono">'+c.id+'</dd>'+(c.v?'<dt>Verify</dt><dd class="mono"><a href="'+c.u+'" target="_blank" rel="noopener">'+c.v+'</a></dd>':'')+'</dl>'+(c.nc?'':'<button class="btn" id="lbcopy" type="button">Copy credential ID</button>')+'<p class="hint">Click the certificate to zoom. Press Esc or click outside to close.</p></div></div>';
lb.hidden=false;d.body.style.overflow='hidden';$('#lbclose').focus()}
function closeLb(){lb.hidden=true;lb.innerHTML='';d.body.style.overflow='';if(last)last.focus()}
grid.addEventListener('click',function(e){var a=e.target.closest('.cc');if(a)openLb(a.dataset.k)});
grid.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){var a=e.target.closest('.cc');if(a){e.preventDefault();openLb(a.dataset.k)}}});
lb.addEventListener('click',function(e){
if(e.target===lb||e.target.id==='lbclose')closeLb();
else if(e.target.closest('#lbi')&&e.target.tagName==='IMG')$('#lbi').classList.toggle('zoom');
else if(e.target.id==='lbcopy')copy(C[ck].id,'Credential ID copied!')});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!lb.hidden)closeLb()});
}
if($('#grid'))initCerts();
})();