// === Firebase 초기화 (수정된 버전) ===
// Firebase 콘솔에서 복사한 설정값을 아래에 그대로 둡니다.
window.__FIREBASE_CONFIG__ = {
  apiKey: "AIzaSyCXAQvRcy_Euogf9_ogOZsTcjuNaKOy1nA",
  authDomain: "gitblog-7504d.firebaseapp.com",
  projectId: "gitblog-7504d",
  storageBucket: "gitblog-7504d.appspot.com",
  messagingSenderId: "844477554595",
  appId: "1:844477554595:web:082b5ccafd1c54dbca4416",
  measurementId: "G-YJL8JRJFCX"
};

(function(){
  const cfg = window.__FIREBASE_CONFIG__;
  if (!cfg || !cfg.apiKey || cfg.apiKey==="YOUR_API_KEY"){
    console.error("[Firebase] firebase-init.js: Firebase config 값이 비어 있습니다.");
    return;
  }
  const script = document.createElement("script");
  script.type = "module";
  script.textContent = `
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
    import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, collection, addDoc, query, orderBy, limit, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
    const app = initializeApp(${JSON.stringify({
        "apiKey": "AIzaSyCXAQvRcy_Euogf9_ogOZsTcjuNaKOy1nA",
        "authDomain": "gitblog-7504d.firebaseapp.com",
        "projectId": "gitblog-7504d",
        "storageBucket": "gitblog-7504d.appspot.com",
        "messagingSenderId": "844477554595",
        "appId": "1:844477554595:web:082b5ccafd1c54dbca4416",
        "measurementId": "G-YJL8JRJFCX"
    })});
    const db = getFirestore(app);
    window.__db = db;
    window.__fs = { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, collection, addDoc, query, orderBy, limit, getDocs };
  `;
  document.head.appendChild(script);
})();