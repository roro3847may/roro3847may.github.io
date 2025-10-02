
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXAQvRcy_Euogf9_ogOZsTcjuNaKOy1nA",
  authDomain: "gitblog-7504d.firebaseapp.com",
  projectId: "gitblog-7504d",
  storageBucket: "gitblog-7504d.firebasestorage.app",
  messagingSenderId: "844477554595",
  appId: "1:844477554595:web:082b5ccafd1c54dbca4416",
  measurementId: "G-YJL8JRJFCX"
};

(function(){
  if (!window.__FIREBASE_CONFIG__ || window.__FIREBASE_CONFIG__.apiKey === "YOUR_API_KEY") {
    console.warn("[Firebase] firebase-init.js: 설정이 비어 있습니다. Firebase 콘솔의 웹 앱 설정 값을 넣어 주세요.");
  }
  // Firebase v10 Modular CDN
  const script = document.createElement("script");
  script.type = "module";
  script.textContent = `
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
    import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, collection, addDoc, query, orderBy, limit, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
    const app = initializeApp(window.__FIREBASE_CONFIG__);
    const db = getFirestore(app);
    // 전역으로 노출
    window.__db = db;
    window.__fs = { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, collection, addDoc, query, orderBy, limit, getDocs };
  `;
  document.head.appendChild(script);
})();
