
// === 댓글 기능 (Firestore: comments/{slug}/items) ===
(function(){
  function slugFromUrl(u){
    try {
      const url = new URL(u, location.origin);
      return url.pathname.replace(/\/$/, '');
    } catch(e){
      return (u || location.pathname).replace(/\/$/, '');
    }
  }
  async function ensureReady(){
    for(let i=0;i<200;i++){
      if (window.__db && window.__fs) return true;
      await new Promise(r=>setTimeout(r,25));
    }
    console.error("[Firebase] Firestore 초기화 대기 시간 초과");
    return false;
  }
  async function boot(){
    const box = document.getElementById("comments-box");
    if (!box) return;
    if (!await ensureReady()) return;
    const { collection, addDoc, serverTimestamp, query, orderBy, getDocs } = window.__fs;
    const db = window.__db;
    const slug = slugFromUrl(location.pathname) || "root";

    const form = document.getElementById("comment-form");
    const list = document.getElementById("comment-list");
    async function load(){
      // 최신순
      list.innerHTML = "<li>불러오는 중...</li>";
      const q = query(collection(db, "comments", slug, "items"), orderBy("createdAt","desc"));
      const snap = await getDocs(q);
      const rows = [];
      snap.forEach(d=>{
        const it = d.data();
        const name = (it.name||"익명").toString().slice(0,30);
        const body = (it.body||"").toString();
        const when = it.createdAt?.toDate ? it.createdAt.toDate() : new Date();
        rows.push(`<li style="border-bottom:1px solid #eee; padding:.6rem 0;">
          <div style="font-weight:600;">${name} <span style="font-weight:400; color:#777; font-size:.9em;">${when.toLocaleString()}</span></div>
          <div style="white-space:pre-wrap;">${escapeHtml(body)}</div>
        </li>`);
      });
      list.innerHTML = rows.join("") || "<li>첫 댓글을 남겨 보세요!</li>";
    }
    function escapeHtml(s){
      return s.replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",""":"&quot;","'":"&#39;" }[m]));
    }
    form?.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const name = (document.getElementById("comment-name").value||"").trim() || "익명";
      const body = (document.getElementById("comment-body").value||"").trim();
      if (!body) return alert("내용을 입력해 주세요.");
      try{
        await addDoc(collection(db, "comments", slug, "items"), {
          name, body, createdAt: serverTimestamp()
        });
        (document.getElementById("comment-body").value = "");
        await load();
      }catch(e){
        alert("댓글 저장 중 오류가 발생했습니다.");
        console.error(e);
      }
    });
    await load();
  }
  document.addEventListener("DOMContentLoaded", boot);
})();
