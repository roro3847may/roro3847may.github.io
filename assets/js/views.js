
// === 조회수 처리 & TOP3 추천 ===
(function(){
  // slug 생성: /yyyy/mm/dd/title/ 또는 /path/ 형태를 간단히 키로 사용
  function slugFromUrl(u){
    try {
      const url = new URL(u, location.origin);
      return url.pathname.replace(/\/$/, ''); // 뒤 슬래시 제거
    } catch(e){
      return (u || location.pathname).replace(/\/$/, '');
    }
  }
  async function ensureReady(){
    // Firestore 모듈이 로드될 때까지 대기
    for(let i=0;i<200;i++){
      if (window.__db && window.__fs) return true;
      await new Promise(r=>setTimeout(r,25));
    }
    console.error("[Firebase] Firestore 초기화 대기 시간 초과");
    return false;
  }

  // 1) 게시글 페이지: 조회수 1 증가 + 표시
  async function bumpAndShow(){
    if (!document.querySelector('article.post')) return;
    if (!await ensureReady()) return;
    const { doc, getDoc, setDoc, updateDoc, increment } = window.__fs;
    const db = window.__db;
    const slug = slugFromUrl(location.pathname) || "/";
    const ref = doc(db, "views", slug || "root");
    try {
      const snap = await getDoc(ref);
      if (!snap.exists()){
        await setDoc(ref, { viewCount: 1, title: document.title, lastSeen: Date.now() });
        setCount(1);
      } else {
        await updateDoc(ref, { viewCount: increment(1), lastSeen: Date.now() });
        const n = (snap.data().viewCount || 0) + 1;
        setCount(n);
      }
    } catch(e){
      console.warn("[Firebase] bump error", e);
    }
  }
  function setCount(n){
    const target = document.getElementById("view-count");
    if (target) target.textContent = String(n);
  }

  // 2) 홈: TOP3 섹션 채우기
  async function fillTop3(){
    const wrap = document.getElementById("top3-views");
    if (!wrap) return;
    if (!await ensureReady()) return;
    const { collection, query, orderBy, limit, getDocs } = window.__fs;
    const db = window.__db;
    const q = query(collection(db, "views"), orderBy("viewCount","desc"), limit(3));
    const snap = await getDocs(q);
    const items = [];
    snap.forEach(d=> items.push({ slug:d.id, ...d.data() }));
    // DOM에서 같은 slug의 링크를 찾아 제목/URL 보정
    const map = new Map();
    document.querySelectorAll("a[href]").forEach(a=>{
      map.set(slugFromUrl(a.getAttribute("href")), { title: a.textContent.trim(), href: a.getAttribute("href") });
    });
    wrap.innerHTML = items.map((it,i)=>{
      const m = map.get(it.slug) || {};
      const title = m.title || it.title || it.slug;
      const href = m.href || it.slug;
      return `<li style="border:1px solid #eee; padding:.75rem;">
        <a href="${href}">${title}</a>
        <div style="font-size:.9rem; color:#666;">조회수 ${it.viewCount||0}</div>
      </li>`;
    }).join("");
  }

  // 3) 카테고리/전체 페이지: "조회수순" 정렬
  async function enableSortByViews(){
    const container = document.querySelector(".sort-buttons");
    const listNew = document.getElementById("list-new");
    if (!container || !listNew) return;
    // 버튼 추가
    const btn = document.createElement("button");
    btn.id = "sort-views";
    btn.textContent = "조회수순";
    btn.style.marginLeft = ".5rem";
    container.appendChild(btn);

    // 각 항목의 링크를 모아서 viewCount를 채운 뒤 정렬
    btn.addEventListener("click", async ()=>{
      if (!await ensureReady()) return;
      const { doc, getDoc } = window.__fs;
      const db = window.__db;
      const items = Array.from(listNew.querySelectorAll("li")).map(li=>{
        const a = li.querySelector("a[href]");
        const href = a ? a.getAttribute("href") : "";
        const slug = slugFromUrl(href);
        return { li, slug, title: a?.textContent?.trim() || href };
      });
      // 병렬 조회
      const results = await Promise.all(items.map(async it=>{
        try{
          const ref = window.__fs.doc(db,"views", it.slug||"root");
          const snap = await getDoc(ref);
          const n = snap.exists()? (snap.data().viewCount||0) : 0;
          return { ...it, views:n };
        }catch(e){ return { ...it, views:0 };}
      }));
      // 정렬
      results.sort((a,b)=> b.views - a.views);
      // 렌더
      listNew.innerHTML = "";
      results.forEach(it=>{
        it.li.querySelector(".view-chip")?.remove();
        const chip = document.createElement("span");
        chip.className = "view-chip";
        chip.style.cssText = "margin-left:.5rem; font-size:.85rem; color:#666;";
        chip.textContent = `(조회수 ${it.views})`;
        it.li.querySelector("a")?.after(chip);
        listNew.appendChild(it.li);
      });
      // 버튼 강조 표시 조정
      const btnNew = document.getElementById("sort-new");
      const btnOld = document.getElementById("sort-old");
      if (btnNew && btnOld){
        btnNew.style.fontWeight = "400";
        btnOld.style.fontWeight = "400";
      }
      btn.style.fontWeight = "700";
    });
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    bumpAndShow();
    fillTop3();
    enableSortByViews();
  });
})();
