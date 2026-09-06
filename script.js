const $=id=>document.getElementById(id);
const pages=[...document.querySelectorAll(".page")];
function showPage(id){pages.forEach(p=>p.classList.toggle("active",p.id===id)); document.querySelector("#nav")?.classList.remove("open");}
document.querySelectorAll("nav a,.brand").forEach(a=>a.addEventListener("click",e=>{const id=(a.getAttribute("href")||"#home").slice(1);showPage(id)}));
$("menuBtn").onclick=()=>$("nav").classList.toggle("open");

function loadProfile(){
  try{
    const p=JSON.parse(localStorage.getItem("rajaProfile")||"{}");
    $("pNick").value=p.nick||"";$("pUid").value=p.uid||"";$("pRegion").value=p.region||"";
    $("cardNick").textContent=p.nick||"Guest Player";$("cardUid").textContent=p.uid||"—";$("cardRegion").textContent=p.region||"—";
  }catch(e){}
}
$("saveProfile").onclick=()=>{const p={nick:$("pNick").value.trim(),uid:$("pUid").value.trim(),region:$("pRegion").value.trim()};localStorage.setItem("rajaProfile",JSON.stringify(p));loadProfile();alert("Saved on this device.");};
$("clearProfile").onclick=()=>{localStorage.removeItem("rajaProfile");loadProfile()};
loadProfile();

$("lookupBtn").onclick=()=>{
 const uid=$("lookupUid").value.trim(),nick=$("lookupNick").value.trim(),level=$("lookupLevel").value.trim();
 if(!uid){$("lookupResult").classList.remove("hidden");$("lookupResult").textContent="Enter a UID first.";return}
 $("lookupResult").classList.remove("hidden");
 $("lookupResult").innerHTML=`<h3>${escapeHtml(nick||"Public Profile")}</h3><p>UID: ${escapeHtml(uid)}</p><p>Level: ${escapeHtml(level||"Not provided")}</p><p class="muted">This is user-provided/public demo data. No private Garena account data was accessed.</p>`;
};

function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

$("suggest").onclick=()=>{
 const phone=$("phone").value.trim()||"your phone",style=$("style").value;
 const ranges={Balanced:"90–110",Smooth:"80–100",Fast:"100–120"};
 $("suggestion").classList.remove("hidden");
 $("suggestion").innerHTML=`<strong>${escapeHtml(phone)}</strong><br>Suggested starting range for ${style}: <strong>${ranges[style]}</strong>.<br><span class="muted">Adjust gradually based on your own control and comfort; this does not modify the game.</span>`;
};
$("calc").onclick=()=>{
 let b=Math.max(0,Math.min(200,Number($("base").value)||0));
 $("calcResult").classList.remove("hidden");
 $("calcResult").innerHTML=`Starting values: <strong>${Math.round(b*0.9)}</strong> / <strong>${Math.round(b)}</strong> / <strong>${Math.min(200,Math.round(b*1.1))}</strong>`;
};

const replies=[
 {keys:["uid","lookup","search"],text:"The UID tool on this site is a public-profile demo. It can display information entered by the user. A genuine live Garena lookup needs a legitimate authorized data source; this site does not bypass login or access private data."},
 {keys:["sensitivity","setting","phone"],text:"Open Tools, enter your phone name and choose Balanced, Smooth or Fast. The site gives a simple starting range. It does not modify the game or guarantee a performance boost."},
 {keys:["password","otp","token","security","protect"],text:"Never share your password, OTP, recovery codes or private session tokens. For account problems, use official Garena support."},
 {keys:["website","use","page","how"],text:"Use the top menu: Profile saves a local player card, UID Lookup shows public/user-provided data, Chatbot answers common questions, Tools gives local suggestions, and Support links to official help."},
 {keys:["hello","hi","hey"],text:"Hello! I'm RAJA Bot. Ask me about UID lookup, profile setup, sensitivity suggestions, account safety or website features."}
];
function botReply(q){
 const x=q.toLowerCase();
 const hit=replies.find(r=>r.keys.some(k=>x.includes(k)));
 return hit?hit.text:"I can help with the RAJA website, public-profile demo, sensitivity suggestions, account safety and official support. I can't access private accounts or passwords.";
}
function sendChat(text){
 text=(text||$("chatInput").value).trim();if(!text)return;
 $("chatLog").insertAdjacentHTML("beforeend",`<div class="user">${escapeHtml(text)}</div><div class="bot">RAJA Bot: ${escapeHtml(botReply(text))}</div>`);
 $("chatInput").value="";$("chatLog").scrollTop=$("chatLog").scrollHeight;
}
$("sendChat").onclick=()=>sendChat();
$("chatInput").addEventListener("keydown",e=>{if(e.key==="Enter")sendChat()});
document.querySelectorAll(".quick button").forEach(b=>b.onclick=()=>sendChat(b.dataset.q));

window.addEventListener("hashchange",()=>showPage(location.hash.slice(1)||"home"));
showPage(location.hash.slice(1)||"home");
