---
layout: page
title: You're on the list
permalink: /confirmed/
description: "Your BrewSpider launch-list signup is confirmed."
sitemap: false
---
{%- assign c = site.data.sitetext[site.locale].launch.confirmed -%}
<h1>{{ c.title }}</h1>
<p class="lead">{{ c.text }}</p>
<p><a class="button" href="{{ '/' | relative_url }}">{{ c.home }}</a></p>
