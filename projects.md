---
bg: "me_flipped_simplified.jpg"
layout: page
title: "Projects"
crawlertitle: "Projects"
permalink: /projects/
summary: "Projects I lead or am a part of."
active: projects
---


{% for proj in site.projects %}

  <p><a href="{{proj.url}}" target="_blank" style="font-weight:bold;">{{proj.name}}</a> {{proj.description}}</p>
  <ul>
    <li>
      You can find it on <a href="{{proj.code-url}}" target="_blank">GitHub</a>
    </li>
  </ul>

{% endfor %}
