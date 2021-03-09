!function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function o(){return Object.create(null)}function l(t){t.forEach(n)}function r(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}const i="undefined"!=typeof window;let c=i?()=>window.performance.now():()=>Date.now(),a=i?t=>requestAnimationFrame(t):t;const u=new Set;function f(t){u.forEach((e=>{e.c(t)||(u.delete(e),e.f())})),0!==u.size&&a(f)}function d(t){let e;return 0===u.size&&a(f),{promise:new Promise((n=>{u.add(e={c:t,f:n})})),abort(){u.delete(e)}}}function m(t,e){t.appendChild(e)}function p(t,e,n){t.insertBefore(e,n||null)}function h(t){t.parentNode.removeChild(t)}function g(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function $(t){return document.createElement(t)}function y(t){return document.createTextNode(t)}function b(){return y(" ")}function v(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function _(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function w(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function x(t,e,n,o){t.style.setProperty(e,n,o?"important":"")}function k(t,e,n){t.classList[n?"add":"remove"](e)}const E=new Set;let C,S=0;function z(t,e,n,o,l,r,s,i=0){const c=16.666/o;let a="{\n";for(let t=0;t<=1;t+=c){const o=e+(n-e)*r(t);a+=100*t+`%{${s(o,1-o)}}\n`}const u=a+`100% {${s(n,1-n)}}\n}`,f=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(u)}_${i}`,d=t.ownerDocument;E.add(d);const m=d.__svelte_stylesheet||(d.__svelte_stylesheet=d.head.appendChild($("style")).sheet),p=d.__svelte_rules||(d.__svelte_rules={});p[f]||(p[f]=!0,m.insertRule(`@keyframes ${f} ${u}`,m.cssRules.length));const h=t.style.animation||"";return t.style.animation=`${h?`${h}, `:""}${f} ${o}ms linear ${l}ms 1 both`,S+=1,f}function A(t,e){const n=(t.style.animation||"").split(", "),o=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),l=n.length-o.length;l&&(t.style.animation=o.join(", "),S-=l,S||a((()=>{S||(E.forEach((t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}})),E.clear())})))}function R(t,e){const n=t.getBoundingClientRect();if(e.left!==n.left||e.top!==n.top){const o=getComputedStyle(t),l="none"===o.transform?"":o.transform;t.style.transform=`${l} translate(${e.left-n.left}px, ${e.top-n.top}px)`}}function j(t){C=t}function M(t){(function(){if(!C)throw new Error("Function called outside component initialization");return C})().$$.on_mount.push(t)}const B=[],N=[],O=[],P=[],T=Promise.resolve();let q=!1;function F(t){O.push(t)}let Z=!1;const D=new Set;function L(){if(!Z){Z=!0;do{for(let t=0;t<B.length;t+=1){const e=B[t];j(e),U(e.$$)}for(j(null),B.length=0;N.length;)N.pop()();for(let t=0;t<O.length;t+=1){const e=O[t];D.has(e)||(D.add(e),e())}O.length=0}while(B.length);for(;P.length;)P.pop()();q=!1,Z=!1,D.clear()}}function U(t){if(null!==t.fragment){t.update(),l(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(F)}}let W;function G(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const H=new Set;let I;function K(){I={r:0,c:[],p:I}}function J(){I.r||l(I.c),I=I.p}function Q(t,e){t&&t.i&&(H.delete(t),t.i(e))}function V(t,e,n,o){if(t&&t.o){if(H.has(t))return;H.add(t),I.c.push((()=>{H.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}const X={duration:0};function Y(n,o,s,i){let a=o(n,s),u=i?0:1,f=null,m=null,p=null;function h(){p&&A(n,p)}function g(t,e){const n=t.b-u;return e*=Math.abs(n),{a:u,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function $(o){const{delay:r=0,duration:s=300,easing:i=e,tick:$=t,css:y}=a||X,b={start:c()+r,b:o};o||(b.group=I,I.r+=1),f||m?m=b:(y&&(h(),p=z(n,u,o,s,r,i,y)),o&&$(0,1),f=g(b,s),F((()=>G(n,o,"start"))),d((t=>{if(m&&t>m.start&&(f=g(m,s),m=null,G(n,f.b,"start"),y&&(h(),p=z(n,u,f.b,f.duration,0,i,a.css))),f)if(t>=f.end)$(u=f.b,1-u),G(n,f.b,"end"),m||(f.b?h():--f.group.r||l(f.group.c)),f=null;else if(t>=f.start){const e=t-f.start;u=f.a+f.d*i(e/f.duration),$(u,1-u)}return!(!f&&!m)})))}return{run(t){r(a)?(W||(W=Promise.resolve(),W.then((()=>{W=null}))),W).then((()=>{a=a(),$(t)})):$(t)},end(){h(),f=m=null}}}function tt(t,e){t.f(),function(t,e){V(t,1,1,(()=>{e.delete(t.key)}))}(t,e)}function et(t){t&&t.c()}function nt(t,e,o){const{fragment:s,on_mount:i,on_destroy:c,after_update:a}=t.$$;s&&s.m(e,o),F((()=>{const e=i.map(n).filter(r);c?c.push(...e):l(e),t.$$.on_mount=[]})),a.forEach(F)}function ot(t,e){const n=t.$$;null!==n.fragment&&(l(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function lt(t,e){-1===t.$$.dirty[0]&&(B.push(t),q||(q=!0,T.then(L)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function rt(e,n,r,s,i,c,a=[-1]){const u=C;j(e);const f=n.props||{},d=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:i,bound:o(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:o(),dirty:a,skip_bound:!1};let m=!1;if(d.ctx=r?r(e,f,((t,n,...o)=>{const l=o.length?o[0]:n;return d.ctx&&i(d.ctx[t],d.ctx[t]=l)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](l),m&&lt(e,t)),n})):[],d.update(),m=!0,l(d.before_update),d.fragment=!!s&&s(d.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);d.fragment&&d.fragment.l(t),t.forEach(h)}else d.fragment&&d.fragment.c();n.intro&&Q(e.$$.fragment),nt(e,n.target,n.anchor),L()}j(u)}class st{$destroy(){ot(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function it(t){const e=t-1;return e*e*e+1}function ct(t,{delay:e=0,duration:n=400,easing:o=it,start:l=0,opacity:r=0}){const s=getComputedStyle(t),i=+s.opacity,c="none"===s.transform?"":s.transform,a=1-l,u=i*(1-r);return{delay:e,duration:n,easing:o,css:(t,e)=>`\n\t\t\ttransform: ${c} scale(${1-a*e});\n\t\t\topacity: ${i-u*e}\n\t\t`}}function at(t,e,n){const o=getComputedStyle(t),l="none"===o.transform?"":o.transform,s=e.from.width/t.clientWidth,i=e.from.height/t.clientHeight,c=(e.from.left-e.to.left)/s,a=(e.from.top-e.to.top)/i,u=Math.sqrt(c*c+a*a),{delay:f=0,duration:d=(t=>120*Math.sqrt(t)),easing:m=it}=n;return{delay:f,duration:r(d)?d(u):d,easing:m,css:(t,e)=>`transform: ${l} translate(${e*c}px, ${e*a}px);`}}const ut=/[a-zA-Z]/,ft=(t,e=0)=>[...Array(t).keys()].map((t=>t+e));function dt(t,e,n){const o=t.slice();return o[6]=e[n],o}function mt(t){let e;return{c(){e=$("div"),_(e,"class","dot svelte-14w6xk7"),x(e,"--dotSize",.25*t[0]+t[2]),x(e,"--color",t[1]),x(e,"animation-delay",t[6]*(t[5]/10)+t[4])},m(t,n){p(t,e,n)},p(t,n){5&n&&x(e,"--dotSize",.25*t[0]+t[2]),2&n&&x(e,"--color",t[1])},d(t){t&&h(e)}}}function pt(e){let n,o=ft(3,1),l=[];for(let t=0;t<o.length;t+=1)l[t]=mt(dt(e,o,t));return{c(){n=$("div");for(let t=0;t<l.length;t+=1)l[t].c();_(n,"class","wrapper svelte-14w6xk7"),x(n,"--size",e[0]+e[2]),x(n,"--duration",e[3])},m(t,e){p(t,n,e);for(let t=0;t<l.length;t+=1)l[t].m(n,null)},p(t,[e]){if(55&e){let r;for(o=ft(3,1),r=0;r<o.length;r+=1){const s=dt(t,o,r);l[r]?l[r].p(s,e):(l[r]=mt(s),l[r].c(),l[r].m(n,null))}for(;r<l.length;r+=1)l[r].d(1);l.length=o.length}5&e&&x(n,"--size",t[0]+t[2]),8&e&&x(n,"--duration",t[3])},i:t,o:t,d(t){t&&h(n),g(l,t)}}}function ht(t,e,n){let{size:o=60}=e,{color:l="#FF3E00"}=e,{unit:r="px"}=e,{duration:s="0.6s"}=e,i=s.match(ut)[0],c=s.replace(ut,"");return t.$$set=t=>{"size"in t&&n(0,o=t.size),"color"in t&&n(1,l=t.color),"unit"in t&&n(2,r=t.unit),"duration"in t&&n(3,s=t.duration)},[o,l,r,s,i,c]}class gt extends st{constructor(t){super(),rt(this,t,ht,pt,s,{size:0,color:1,unit:2,duration:3})}}function $t(t,e,n){const o=t.slice();return o[11]=e[n],o[13]=n,o}function yt(t,e,n){const o=t.slice();return o[14]=e[n],o}function bt(t){let e,n,o,l;return{c(){e=$("input"),_(e,"type","button"),_(e,"class","regionbutton svelte-5lsmlo"),e.value=n=t[14],k(e,"selected",t[1]===t[14])},m(n,r){var s;p(n,e,r),o||(l=v(e,"click",(s=t[5],function(t){return t.preventDefault(),s.call(this,t)})),o=!0)},p(t,n){18&n&&k(e,"selected",t[1]===t[14])},d(t){t&&h(e),o=!1,l()}}}function vt(t){let e,n,o;return{c(){e=y(" "),n=y("for "),o=y(t[0])},m(t,l){p(t,e,l),p(t,n,l),p(t,o,l)},p(t,e){1&e&&w(o,t[0])},d(t){t&&h(e),t&&h(n),t&&h(o)}}}function _t(t){let e,n=!t[3]&&wt();return{c(){n&&n.c(),e=y("")},m(t,o){n&&n.m(t,o),p(t,e,o)},p(t,o){t[3]?n&&(n.d(1),n=null):n||(n=wt(),n.c(),n.m(e.parentNode,e))},d(t){n&&n.d(t),t&&h(e)}}}function wt(t){let e;return{c(){e=$("p"),e.textContent="Keine Experten gefunden"},m(t,n){p(t,e,n)},d(t){t&&h(e)}}}function xt(t){let e,n,o=t[11].telnr+"";return{c(){e=$("div"),n=y(o),_(e,"class","telephone svelte-5lsmlo")},m(t,o){p(t,e,o),m(e,n)},p(t,e){4&e&&o!==(o=t[11].telnr+"")&&w(n,o)},d(t){t&&h(e)}}}function kt(t){let e,n,o,l,r=t[11].email+"";return{c(){e=$("div"),n=$("a"),o=y(r),_(n,"href",l="mailto:"+t[11].email),_(e,"class","email svelte-5lsmlo")},m(t,l){p(t,e,l),m(e,n),m(n,o)},p(t,e){4&e&&r!==(r=t[11].email+"")&&w(o,r),4&e&&l!==(l="mailto:"+t[11].email)&&_(n,"href",l)},d(t){t&&h(e)}}}function Et(t){let e,n,o=t[11].website+"";return{c(){e=$("div"),n=y(o),_(e,"class","website")},m(t,o){p(t,e,o),m(e,n)},p(t,e){4&e&&o!==(o=t[11].website+"")&&w(n,o)},d(t){t&&h(e)}}}function Ct(t){let e,n,o=t[11].organisation+"";return{c(){e=$("div"),n=y(o),_(e,"class","organisation svelte-5lsmlo")},m(t,o){p(t,e,o),m(e,n)},p(t,e){4&e&&o!==(o=t[11].organisation+"")&&w(n,o)},d(t){t&&h(e)}}}function St(t){let e,n,o=t[11].region+"";return{c(){e=$("div"),n=y(o),_(e,"class","region svelte-5lsmlo")},m(t,o){p(t,e,o),m(e,n)},p(t,e){4&e&&o!==(o=t[11].region+"")&&w(n,o)},d(t){t&&h(e)}}}function zt(t){let e,n,o=t[11].competence+"";return{c(){e=$("div"),n=y(o),_(e,"class","competence svelte-5lsmlo")},m(t,o){p(t,e,o),m(e,n)},p(t,e){4&e&&o!==(o=t[11].competence+"")&&w(n,o)},d(t){t&&h(e)}}}function At(n,o){let l,r,s,i,a,u,f,g,v,x,k,E,C,S,j,M,B,N,O,P,T,q,Z,D,L,U,W,G=o[11].first_name+"",H=o[11].last_name+"",I=t,K=o[11].telnr&&xt(o),J=o[11].email&&kt(o),Q=o[11].website&&Et(o),V=o[11].organisation&&Ct(o),X=o[11].region&&St(o),tt=o[11].competence&&zt(o);return{key:n,first:null,c(){l=$("div"),r=$("div"),s=$("div"),i=b(),a=$("a"),u=$("div"),f=$("img"),x=b(),k=$("div"),E=$("a"),C=$("div"),S=y(G),j=b(),M=y(H),N=b(),K&&K.c(),O=b(),J&&J.c(),P=b(),Q&&Q.c(),T=b(),q=$("div"),V&&V.c(),Z=b(),X&&X.c(),D=b(),tt&&tt.c(),_(s,"class","cardbgbox"),f.src!==(g=o[11].image?.download||"")&&_(f,"src",g),_(f,"alt","Portrait"),_(f,"class","svelte-5lsmlo"),_(u,"class","portrait svelte-5lsmlo"),_(a,"class","cardimagebox"),_(a,"href",v=o[11]["@id"]),_(C,"class","fullname svelte-5lsmlo"),_(E,"href",B=o[11]["@id"]),_(k,"class","cardtextbox"),_(q,"class","cardlabel"),_(r,"class","cardinner"),_(l,"class","card svelte-5lsmlo"),this.first=l},m(t,e){p(t,l,e),m(l,r),m(r,s),m(r,i),m(r,a),m(a,u),m(u,f),m(r,x),m(r,k),m(k,E),m(E,C),m(C,S),m(C,j),m(C,M),m(k,N),K&&K.m(k,null),m(k,O),J&&J.m(k,null),m(k,P),Q&&Q.m(k,null),m(r,T),m(r,q),V&&V.m(q,null),m(q,Z),X&&X.m(q,null),m(q,D),tt&&tt.m(q,null),W=!0},p(t,e){(!W||4&e&&f.src!==(g=t[11].image?.download||""))&&_(f,"src",g),(!W||4&e&&v!==(v=t[11]["@id"]))&&_(a,"href",v),(!W||4&e)&&G!==(G=t[11].first_name+"")&&w(S,G),(!W||4&e)&&H!==(H=t[11].last_name+"")&&w(M,H),(!W||4&e&&B!==(B=t[11]["@id"]))&&_(E,"href",B),t[11].telnr?K?K.p(t,e):(K=xt(t),K.c(),K.m(k,O)):K&&(K.d(1),K=null),t[11].email?J?J.p(t,e):(J=kt(t),J.c(),J.m(k,P)):J&&(J.d(1),J=null),t[11].website?Q?Q.p(t,e):(Q=Et(t),Q.c(),Q.m(k,null)):Q&&(Q.d(1),Q=null),t[11].organisation?V?V.p(t,e):(V=Ct(t),V.c(),V.m(q,Z)):V&&(V.d(1),V=null),t[11].region?X?X.p(t,e):(X=St(t),X.c(),X.m(q,D)):X&&(X.d(1),X=null),t[11].competence?tt?tt.p(t,e):(tt=zt(t),tt.c(),tt.m(q,null)):tt&&(tt.d(1),tt=null)},r(){U=l.getBoundingClientRect()},f(){!function(t){const e=getComputedStyle(t);if("absolute"!==e.position&&"fixed"!==e.position){const{width:n,height:o}=e,l=t.getBoundingClientRect();t.style.position="absolute",t.style.width=n,t.style.height=o,R(t,l)}}(l),I(),R(l,U)},a(){I(),I=function(n,o,l,r){if(!o)return t;const s=n.getBoundingClientRect();if(o.left===s.left&&o.right===s.right&&o.top===s.top&&o.bottom===s.bottom)return t;const{delay:i=0,duration:a=300,easing:u=e,start:f=c()+i,end:m=f+a,tick:p=t,css:h}=l(n,{from:o,to:s},r);let g,$=!0,y=!1;function b(){h&&A(n,g),$=!1}return d((t=>{if(!y&&t>=f&&(y=!0),y&&t>=m&&(p(1,0),b()),!$)return!1;if(y){const e=0+1*u((t-f)/a);p(e,1-e)}return!0})),h&&(g=z(n,0,1,a,i,u,h)),i||(y=!0),p(0,1),b}(l,U,at,{duration:300})},i(t){W||(F((()=>{L||(L=Y(l,ct,{},!0)),L.run(1)})),W=!0)},o(t){L||(L=Y(l,ct,{},!1)),L.run(0),W=!1},d(t){t&&h(l),K&&K.d(),J&&J.d(),Q&&Q.d(),V&&V.d(),X&&X.d(),tt&&tt.d(),t&&L&&L.end()}}}function Rt(t){let e,n,o;return n=new gt({props:{size:"30",color:"#007cbf",unit:"px",duration:"2s"}}),{c(){e=$("div"),et(n.$$.fragment),_(e,"class","spinner svelte-5lsmlo")},m(t,l){p(t,e,l),nt(n,e,null),o=!0},i(t){o||(Q(n.$$.fragment,t),o=!0)},o(t){V(n.$$.fragment,t),o=!1},d(t){t&&h(e),ot(n)}}}function jt(t){let e,n,o,l,r,s,i,c,a,u,f,d,x,k,E,C,S,z,A,R,j,M,B,N,O,P=[],T=new Map,q=t[4],F=[];for(let e=0;e<q.length;e+=1)F[e]=bt(yt(t,q,e));let Z=t[0]&&vt(t),D=t[2];const L=t=>t[11]["@id"];for(let e=0;e<D.length;e+=1){let n=$t(t,D,e),o=L(n);T.set(o,P[e]=At(o,n))}let U=null;D.length||(U=_t(t));let W=t[3]&&Rt();return{c(){e=$("form"),n=$("input"),o=b(),l=$("br"),r=b();for(let t=0;t<F.length;t+=1)F[t].c();s=b(),i=$("p"),c=$("i"),a=y("Search"),Z&&Z.c(),u=y(" in "),f=y(t[1]),d=b(),x=$("div"),k=y("searchstring: "),E=y(t[0]),C=$("br"),S=y("\n  region: "),z=y(t[1]),A=$("br"),R=b(),j=$("div");for(let t=0;t<P.length;t+=1)P[t].c();U&&U.c(),M=b(),W&&W.c(),_(n,"class","searchstring svelte-5lsmlo"),_(n,"placeholder","Suche"),_(e,"action",""),_(i,"class","debug svelte-5lsmlo"),_(x,"class","debug svelte-5lsmlo"),_(j,"class","cards svelte-5lsmlo")},m(h,g){p(h,e,g),m(e,n),m(e,o),m(e,l),m(e,r);for(let t=0;t<F.length;t+=1)F[t].m(e,null);p(h,s,g),p(h,i,g),m(i,c),m(c,a),Z&&Z.m(c,null),m(c,u),m(c,f),p(h,d,g),p(h,x,g),m(x,k),m(x,E),m(x,C),m(x,S),m(x,z),m(x,A),p(h,R,g),p(h,j,g);for(let t=0;t<P.length;t+=1)P[t].m(j,null);U&&U.m(j,null),m(j,M),W&&W.m(j,null),B=!0,N||(O=v(n,"keyup",t[6]),N=!0)},p(t,[n]){if(50&n){let o;for(q=t[4],o=0;o<q.length;o+=1){const l=yt(t,q,o);F[o]?F[o].p(l,n):(F[o]=bt(l),F[o].c(),F[o].m(e,null))}for(;o<F.length;o+=1)F[o].d(1);F.length=q.length}if(t[0]?Z?Z.p(t,n):(Z=vt(t),Z.c(),Z.m(c,u)):Z&&(Z.d(1),Z=null),(!B||2&n)&&w(f,t[1]),(!B||1&n)&&w(E,t[0]),(!B||2&n)&&w(z,t[1]),12&n){const e=t[2];K();for(let t=0;t<P.length;t+=1)P[t].r();P=function(t,e,n,o,l,r,s,i,c,a,u,f){let d=t.length,m=r.length,p=d;const h={};for(;p--;)h[t[p].key]=p;const g=[],$=new Map,y=new Map;for(p=m;p--;){const t=f(l,r,p),i=n(t);let c=s.get(i);c?o&&c.p(t,e):(c=a(i,t),c.c()),$.set(i,g[p]=c),i in h&&y.set(i,Math.abs(p-h[i]))}const b=new Set,v=new Set;function _(t){Q(t,1),t.m(i,u),s.set(t.key,t),u=t.first,m--}for(;d&&m;){const e=g[m-1],n=t[d-1],o=e.key,l=n.key;e===n?(u=e.first,d--,m--):$.has(l)?!s.has(o)||b.has(o)?_(e):v.has(l)?d--:y.get(o)>y.get(l)?(v.add(o),_(e)):(b.add(l),d--):(c(n,s),d--)}for(;d--;){const e=t[d];$.has(e.key)||c(e,s)}for(;m;)_(g[m-1]);return g}(P,n,L,1,t,e,T,j,tt,At,M,$t);for(let t=0;t<P.length;t+=1)P[t].a();J(),!e.length&&U?U.p(t,n):e.length?U&&(U.d(1),U=null):(U=_t(t),U.c(),U.m(j,M))}t[3]?W?8&n&&Q(W,1):(W=Rt(),W.c(),Q(W,1),W.m(j,null)):W&&(K(),V(W,1,1,(()=>{W=null})),J())},i(t){if(!B){for(let t=0;t<D.length;t+=1)Q(P[t]);Q(W),B=!0}},o(t){for(let t=0;t<P.length;t+=1)V(P[t]);V(W),B=!1},d(t){t&&h(e),g(F,t),t&&h(s),t&&h(i),Z&&Z.d(),t&&h(d),t&&h(x),t&&h(R),t&&h(j);for(let t=0;t<P.length;t+=1)P[t].d();U&&U.d(),W&&W.d(),N=!1,O()}}}function Mt(t,e,n){const o="http://localhost:8080/Plone/@search?portal_type=dexterity.membrane.member&fullobjects=1&sort_on=last_name&sort_order=ascending&b_size=60";let l="",r="Alle Regionen",s=o,i=[],c=!1;function a(t="Alle Regionen",e=""){s=("Alle Regionen"==t?o:o+"&region="+encodeURI(t))+(e?"&SearchableText="+e:"")}async function u(t=s){n(3,c=!0),fetch(t,{method:"GET",headers:{"Content-Type":"application/json",Accept:"application/json"}}).then((t=>{if(!t.ok)throw new Error("Network response was not ok");return t.json()})).then((t=>(n(2,i=t?.items||[]),n(2,i=i.length>0?i.filter((t=>t.is_expert)):[]),console.log("** Experts"),console.log(s),console.log("experts",i),i))).catch((t=>{console.error("There has been a problem with your fetch operation:",t)})).finally((()=>n(3,c=!1)))}M((()=>{u()}));return[l,r,i,c,["Alle Regionen","Zürich Stadt","Zürich Oberland","Zürich Unterland","Albis","Winterthur"],t=>{n(1,r=t.target.value),a(r,l),console.log("searchUrl",s),u(s)},t=>{n(0,l=t.target.value+(t.target.value?"*":"")),a(r,l),u(s)}]}class Bt extends st{constructor(t){super(),rt(this,t,Mt,jt,s,{})}}function Nt(e){let n,o;return n=new Bt({}),{c(){et(n.$$.fragment)},m(t,e){nt(n,t,e),o=!0},p:t,i(t){o||(Q(n.$$.fragment,t),o=!0)},o(t){V(n.$$.fragment,t),o=!1},d(t){ot(n,t)}}}class Ot extends st{constructor(t){super(),rt(this,t,null,Nt,s,{})}}let Pt=document.getElementsByClassName("my-svelte-app");for(let t=0;t<Pt.length;t++){new Ot({target:Pt[t],props:{}})}}();
//# sourceMappingURL=bundle.js.map
