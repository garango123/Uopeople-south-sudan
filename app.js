// Firebase setup: create a project at https://console.firebase.google.com and paste its web config below.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  
  <script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCZeYO5I9HEHYpKpPtGNXvWL3H8Ye5aaFc",
    authDomain: "uopeople-south-sudan.firebaseapp.com",
    projectId: "uopeople-south-sudan",
    storageBucket: "uopeople-south-sudan.firebasestorage.app",
    messagingSenderId: "671959173986",
    appId: "1:671959173986:web:0220fff3dddf6bb1813a3b",
    measurementId: "G-37SFR1EJ71"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
  
 
};
const configured = !Object.values(firebaseConfig).some(v => v.startsWith("YOUR_"));
const $ = id => document.getElementById(id);
let auth, db, currentUser, profile, jitsiApi, stopSpeakerWatch;

function message(text){ $("auth-message").textContent = text; }
function show(id){ $(id).classList.remove("hidden"); }
function hide(id){ $(id).classList.add("hidden"); }
function initials(name="Student"){return name.trim().split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()||"").join("")}
function updatePreview(){
  $("preview-name").textContent=profile.fullName;
  $("preview-detail").textContent=[profile.department,profile.level,profile.year].filter(Boolean).join(" · ");
  $("preview-region").textContent=profile.region||"South Sudan";
  $("profile-initials").textContent=initials(profile.fullName);
}
async function authAction(fn){try{message("");await fn()}catch(e){message(e.message.replace("Firebase:","").trim())}}
$("email-signin").onclick=()=>authAction(()=>signInWithEmailAndPassword(auth,$("email").value,$("password").value));
$("email-signup").onclick=()=>authAction(()=>createUserWithEmailAndPassword(auth,$("email").value,$("password").value));
$("google-signin").onclick=()=>authAction(()=>signInWithPopup(auth,new GoogleAuthProvider()));
$("signout").onclick=()=>signOut(auth);
$("save-profile").onclick=async()=>{
  const fullName=$("full-name").value.trim();
  if(!fullName){message("Please enter your display name.");return}
  profile={fullName,department:$("department").value.trim(),level:$("level").value.trim(),year:$("year").value.trim(),region:$("region").value.trim()};
  await setDoc(doc(db,"students",currentUser.uid),{...profile,email:currentUser.email,updatedAt:serverTimestamp()},{merge:true});
  updatePreview();hide("profile-panel");show("ready-panel");
};
$("join-meeting").onclick=()=>{
  hide("ready-panel");show("live-room");$("live-room").scrollIntoView({behavior:"smooth"});
  if(!window.JitsiMeetExternalAPI){alert("The meeting service did not load. Please refresh and try again.");return}
  const room="UoPeopleSouthSudanCommunityRoom";
  jitsiApi=new JitsiMeetExternalAPI("meet.jit.si",{roomName:room,parentNode:$("jitsi-container"),width:"100%",height:480, userInfo:{displayName:profile.fullName,email:currentUser.email},configOverwrite:{prejoinPageEnabled:true},interfaceConfigOverwrite:{SHOW_JITSI_WATERMARK:false,SHOW_BRAND_WATERMARK:false,DEFAULT_BACKGROUND:"#102a43"}});
  jitsiApi.addEventListener("readyToClose",leaveRoom);
};
$("leave-meeting").onclick=leaveRoom;
function leaveRoom(){if(jitsiApi){jitsiApi.dispose();jitsiApi=null}$("jitsi-container").innerHTML="";hide("live-room");show("ready-panel");if(stopSpeakerWatch)stopSpeakerWatch()}
$("take-floor").onclick=async()=>{
  if(!profile)return;
  await setDoc(doc(db,"meeting","currentSpeaker"),{...profile,uid:currentUser.uid,updatedAt:serverTimestamp()});
};
$("release-floor").onclick=async()=>{
  const ref=doc(db,"meeting","currentSpeaker");const snap=await getDoc(ref);
  if(snap.exists()&&snap.data().uid===currentUser.uid)await setDoc(ref,{uid:null,fullName:"",updatedAt:serverTimestamp()});
};
function watchSpeaker(){
  stopSpeakerWatch=onSnapshot(doc(db,"meeting","currentSpeaker"),snap=>{
    const s=snap.exists()?snap.data():null;
    if(!s||!s.fullName){$("speaker-card").innerHTML='<div class="avatar avatar-large">?</div><h3>Waiting for a speaker</h3><p>When someone takes the floor, their student profile will appear here.</p>';return}
    $("speaker-card").innerHTML=`<div class="avatar avatar-large">${initials(s.fullName)}</div><h3 class="speaker-name">${escapeHtml(s.fullName)}</h3><p>${escapeHtml([s.department,s.level,s.year,s.region].filter(Boolean).join(" · ")||"UoPeople student")}</p>`;
  });
}
function escapeHtml(s=""){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function watchEvents(){
  onSnapshot(query(collection(db,"events"),orderBy("date","asc")),snap=>{
    if(snap.empty){$("events-status").textContent="No events have been posted yet. Check back soon.";return}
    $("events-list").innerHTML=snap.docs.map(d=>{
      const e=d.data(), date=e.date?.toDate?e.date.toDate():new Date(e.date||Date.now());
      return `<article class="event-card"><div class="event-date"><b>${String(date.getDate()).padStart(2,"0")}</b><span>${date.toLocaleString("en",{month:"short"}).toUpperCase()}</span></div><div><span class="tag">${escapeHtml(e.category||"COMMUNITY")}</span><h3>${escapeHtml(e.title||"Community event")}</h3><p>${escapeHtml(e.description||"")}</p><small>${escapeHtml(e.agenda||"See event details")}</small></div></article>`;
    }).join("");$("events-status").textContent="Live community events and agendas.";
  },err=>$("events-status").textContent="Events are not available yet.");
}
if(!configured){
  message("Setup required: add your Firebase web app configuration in app.js to enable sign-in, profiles and live events.");
  ["email-signin","email-signup","google-signin","save-profile","join-meeting","take-floor","release-floor"].forEach(id=>$(id).disabled=true);
  $("events-status").textContent="Connect Firebase to enable live events and student accounts. Sample event cards are shown above.";
}else{
  const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);watchEvents();
  onAuthStateChanged(auth,async user=>{
    currentUser=user;
    if(!user){$("user-label").textContent="Not signed in";hide("signout");show("auth-panel");hide("profile-panel");hide("ready-panel");return}
    $("user-label").textContent=user.displayName||user.email;show("signout");hide("auth-panel");
    const snap=await getDoc(doc(db,"students",user.uid));
    if(snap.exists()){profile=snap.data();updatePreview();show("ready-panel");hide("profile-panel")}
    else{$("full-name").value=user.displayName||"";show("profile-panel");hide("ready-panel")}
    watchSpeaker();
  });
}
