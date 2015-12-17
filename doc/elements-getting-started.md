---
title: Getting Started
order: 2
layout: page
---

# Getting Started

This page will guide you through the installation of Vaadin Core Elements bundle and help you get started with your first project using these elements.

## Installation

There are three ways to use Vaadin Core Elements in your project: Bower, CDN and a ZIP archive. The only difference between these options is the URL you will use to import the necessary files into your HTML page.

### 1. Create a new folder

Start by creating a new folder for your project and change into the newly created folder.

      $ mkdir my-project
      $ cd my-project

### 2. Install Vaadin Core Elements

#### Bower

Recommended way to manage your front-end dependencies is using [Bower](http://bower.io). Follow the [Bower installation instructions](http://bower.io/#install-bower), then run the following command inside your project folder to install the most recent stable release.


     $ bower install --save vaadin-core-elements


This will download Vaadin Core Elements bundle and its dependencies into the `bower_components` folder inside your project's folder.

----
>If you wish to use a development snapshot version of some element, you can install/update that separately. For example:


          $ bower install --save vaadin-grid#master

----

#### CDN

You can use Vaadin Core Elements from CDN (see example below). This is especially convenient for services like JSFiddle, Codepen.io, etc.

For example, to import vaadin-grid, use the following URL:

      https://cdn.vaadin.com/vaadin-core-elements/latest/vaadin-grid/vaadin-grid.html

To import all Vaadin Core Elements, use the following URL:

      https://cdn.vaadin.com/vaadin-core-elements/latest/vaadin-core-elements/vaadin-core-elements.html

----
> You can also use the nightly snapshot versions of any component, e.g. `https://cdn.vaadin.com/vaadin-core-elements/master/vaadin-grid/vaadin-grid.html`

----

#### Download ZIP

1. Download the latest ZIP archive from [vaadin.com/download](https://vaadin.com/download#elements).
2. Extract the archive under your project folder, for example `deps`.

### 3. Create a HTML file

Create a new HTML file (for example `index.html`) inside your project folder and copy the following code into it.

Pay attention to the following details:

 - HTML5 doctype (`<!doctype html>`) is required for everything to work smoothly.
 - You need to adjust how the `webcomponents-lite.min.js` polyfill and `vaadin-core-elements.html` are imported according to the installation option you selected.
 - Notice how the JavaScript logic waits for `WebComponentsReady` event before accessing the elements.

----
> **Serving the files during development**, when using Bower or the ZIP archive:
> Due to browser security restrictions, serving HTML imports from a `file:///` URL does not work. You need a web server to view pages where you use custom elements. One simple option is to use the [`serve`](https://www.npmjs.com/package/serve) NPM package.

----

    <!doctype html>
    <html>
     <head>
       <!-- Import Web Component polyfills and all Vaadin Core Elements. -->

       <!-- CDN -->
       <script src="https://cdn.vaadin.com/vaadin-core-elements/latest/webcomponentsjs/webcomponents-lite.min.js"></script>
       <link href="https://cdn.vaadin.com/vaadin-core-elements/latest/vaadin-core-elements/vaadin-core-elements.html" rel="import">

       <!-- Bower -->
       <!-- <script src="bower_components/webcomponentsjs/webcomponents-lite.min.js"></script>
       <link href="bower_components/vaadin-core-elements/vaadin-core-elements.html" rel="import"> -->

       <!-- ZIP archive -->
       <!-- <script src="deps/webcomponentsjs/webcomponents-lite.min.js"></script>
       <link href="deps/vaadin-core-elements/vaadin-core-elements.html" rel="import"> -->
     </head>
     <body>

       <vaadin-grid selection-mode="multi">
         <table>
           <!-- Define the columns and their mapping to data properties. -->
           <col name="firstName">
           <col name="lastName">
           <col name="email">

           <!-- Define the column headings. -->
           <thead>
             <tr>
               <th>First Name</th>
               <th>Last Name</th>
               <th>Email</th>
             </tr>
           </thead>
         </table>
       </vaadin-grid>

       <script>
         // The Web Components polyfill introduces a custom event we can
         // use to determine when the custom elements are ready to be used.
         document.addEventListener("WebComponentsReady", function () {

           // Reference to the grid element.
           var grid = document.querySelector("vaadin-grid");

           // Add some example data as an array.
           grid.items = [
             { "firstName": "Hugo", "lastName": "Romero", "email": "hugo.romero@example.com" },
             { "firstName": "Nieves", "lastName": "Diez", "email": "nieves.diez@example.com" },
             { "firstName": "Esteban", "lastName": "Vega", "email": "esteban.vega@example.com" },
             { "firstName": "Roxane", "lastName": "Diez", "email": "roxane.diez@example.com" }
           ];
         });
       </script>

     </body>
    </html>


After you have created the file and you have a local server serving the files, you should be able to open up the application in your browser at [http://localhost:3000/index.html](http://localhost:3000/index.html) (notice, that the port 3000 may vary depending on the server you use).

<!-- Assumes .w-arrow-button and .blue class names from vaadin.com theme. Will fallback to a plain link. -->
<a href="vaadin-grid/datasources.html" class="w-arrow-button blue" style="display: inline-block">
  Vaadin Grid<br />
  <small>Continue to Vaadin Grid documentation</small>
</a>
