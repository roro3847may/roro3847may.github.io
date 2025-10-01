---
layout: default
title: 음악
permalink: /categories/music/
---

<h1>음악 글</h1>

<div class="sort-buttons" style="margin-bottom:1rem;">
  <button id="sort-new" style="font-weight:700;">최신순</button>
  <button id="sort-old">오래된순</button>
</div>

<!-- 최신순 -->
{% assign music_posts = site.categories["음악"] %}
<ul id="list-new">
  {% if music_posts and music_posts.size > 0 %}
    {% for post in music_posts %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span style="color:#888;">({{ post.date | date: "%Y-%m-%d %H:%M" }})</span>
      </li>
    {% endfor %}
  {% else %}
    <li style="color:#888;">음악 카테고리에 글이 아직 없어요.</li>
  {% endif %}
</ul>

<!-- 오래된순 -->
{% if music_posts and music_posts.size > 0 %}
  {% assign old_posts = music_posts | sort: "date" %}
  <ul id="list-old" style="display:none;">
    {% for post in old_posts %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span style="color:#888;">({{ post.date | date: "%Y-%m-%d %H:%M" }})</span>
      </li>
    {% endfor %}
  </ul>
{% else %}
  <ul id="list-old" style="display:none;">
    <li style="color:#888;">음악 카테고리에 글이 아직 없어요.</li>
  </ul>
{% endif %}

<script>
document.addEventListener("DOMContentLoaded", () => {
  const btnNew = document.getElementById("sort-new");
  const btnOld = document.getElementById("sort-old");
  const listNew = document.getElementById("list-new");
  const listOld = document.getElementById("list-old");

  btnNew.addEventListener("click", () => {
    listNew.style.display = "block";
    listOld.style.display = "none";
    btnNew.style.fontWeight = "700";
    btnOld.style.fontWeight = "400";
  });

  btnOld.addEventListener("click", () => {
    listNew.style.display = "none";
    listOld.style.display = "block";
    btnNew.style.fontWeight = "400";
    btnOld.style.fontWeight = "700";
  });
});
</script>
