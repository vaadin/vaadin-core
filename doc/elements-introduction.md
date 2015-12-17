---
title: Introduction
order: 1
layout: page
---

# Introduction

## Vaadin Core Elements

Vaadin Core Elements is a free and open source set of high quality Web Components for building mobile and desktop web applications in modern browsers. It builds on top of Google’s Polymer library, and augments the Iron, Paper and other element sets of Polymer with elements that are needed in building business applications.

Although based on Polymer, Vaadin elements can be used together with any other web framework which has support for Web Components, including Angular 2, React, Ember, Meteor and GWT.

Current set of Vaadin Core Elements include:

 - [vaadin-grid](https://github.com/vaadin/vaadin-grid)
 - [vaadin-combo-box](https://github.com/vaadin/vaadin-combo-box)

Learn more about the benefits of using Vaadin elements from the [Vaadin elements page »](https://vaadin.com/elements)

## Background

### Web Components

Web Components is a collection of HTML standards (under development, Dec 2015), which together provide web developers the tools to extend the native web platform with similar tools as the browser vendors have been using for creating the built-in standard elements, such as `<video>`, `<input type="date">` and so on.

The four specifications that together form Web Components are:

- #### Template element
  “The HTML template element `<template>` is a mechanism for holding client-side content that is not to be rendered when a page is loaded but may subsequently be instantiated during runtime using JavaScript.”

- #### Shadow DOM
  “Shadow DOM provides encapsulation for the JavaScript, CSS, and templating in a Web Component. Shadow DOM makes it so these things remain separate from the DOM of the main document.”

  “Why would you want to keep some code separate from the rest of the page? One reason is that on a large site, for example, if the CSS is not carefully organized, the styling for the navigation can "leak" into the main content area where it was not intended to go, or vice-versa. As a site or an app scales, this kind of thing becomes difficult to avoid.”

- #### HTML Imports
  “HTML Imports is a way to include HTML documents in other HTML documents. You're not limited to markup either. An import can also include CSS, JavaScript, or anything else an .html file can contain. In other words, this makes imports a fantastic tool for loading related HTML/CSS/JS.”

- #### Custom Elements
  “Custom Elements allow web developers to define new types of HTML elements. It's quite possibly the most important as Web Components don't exist without the features unlocked by custom elements.”

Descriptions provided by [MDN](https://developer.mozilla.org/en-US/) and [HTML5 Rocks](http://www.html5rocks.com/en/).

[Learn more about Web Components »](http://webcomponents.org)

### Polymer

The Polymer library is designed to make it easier and faster for developers to create great, reusable components for the modern web.

It provides a declarative syntax that makes it simpler to define custom elements. And it adds features like templating, two-way data binding and property observation to help you build powerful, reusable elements with less code.

The Polymer team also builds and maintains a large collection of custom elements, and the most prominent one is the Paper collection. The Paper elements are Google’s reference implementation of Material Design for the web.

[Learn more about Polymer »](https://www.polymer-project.org)

[Browse Polymer Element Catalog »](https://elements.polymer-project.org)

## Browser compatibility

The standards of Web Components are on the cutting-edge of web technologies and as such they are not yet fully supported in all browsers. Vaadin elements rely on polyfills to fill the gap and can therefore support the latest versions of all major browsers.

The current set of supported browsers for Vaadin Core Elements is listed on the table below.

| IE / Edge | Firefox | Chrome | Safari | iOS Safari | Chrome Android |
| :---------: | :---------: | :---------: | :---------: | :---------: | :---------: |
| IE11, Edge| Latest | Latest | Latest | iOS 8 | Latest

See also

 - [Native Web Components support](http://webcomponents.org/)
 - [Browser support of webcomponents.js polyfill](https://github.com/WebComponents/webcomponentsjs#browser-support)
 - [Browser support of Polymer](https://www.polymer-project.org/1.0/resources/compatibility.html)


<!-- Assumes .w-arrow-button and .blue class names from vaadin.com theme. Will fallback to a plain link. -->
<a href="elements-getting-started.html" class="w-arrow-button blue" style="display: inline-block">
  Getting Started<br />
  <small>How to setup a Vaadin elements project</small>
</a>
