---
layout: default
title: 전체
permalink: /all/
---

<h1>전체 글</h1>

<div class="sort-buttons" style="margin-bottom:1rem;">
  <button id="sort-new" style="font-weight:700;">최신순</button>
  <button id="sort-old">오래된순</button>
</div>

{% assign all_posts = site.posts %}

<!-- 최신순 (기본: site.posts는 보통 최신순 정렬) -->
<ul id="list-new">
  {% if all_posts and all_posts.size > 0 %}
    {% for post in all_posts %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span style="color:#888;">({{ post.date | date: "%Y-%m-%d" }})</span>
        {% if post.categories and post.categories.size > 0 %}
          <span style="margin-left:.5rem; color:#666;">
            — {{ post.categories | join: ", " }}
          </span>
        {% endif %}
      </li>
    {% endfor %}
  {% else %}
    <li style="color:#888;">아직 발행된 글이 없어요.</li>
  {% endif %}
</ul>

<!-- 오래된순 (오름차순 정렬) -->
{% if all_posts and all_posts.size > 0 %}
  {% assign old_posts = all_posts | sort: "date" %}
  <ul id="list-old" style="display:none;">
    {% for post in old_posts %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span style="color:#888;">({{ post.date | date: "%Y-%m-%d" }})</span>
        {% if post.categories and post.categories.size > 0 %}
          <span style="margin-left:.5rem; color:#666;">
            — {{ post.categories | join: ", " }}
          </span>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
{% else %}
  <ul id="list-old" style="display:none;">
    <li style="color:#888;">아직 발행된 글이 없어요.</li>
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
