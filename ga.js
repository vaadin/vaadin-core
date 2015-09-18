// Analytics for Vaadin Components

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-658457-6', 'auto');

function locationHashChanged() {
  if(/vaadin/.test(window.location.hostname)) {
    var pageViewUrl = (window.location.pathname + window.location.hash)
      .replace(/vaadin-components\/latest\/(.+)\/demo/, 'components-examples/$1')
      .replace('#', '/');
    ga('send', 'pageview', pageViewUrl)
  }
}

window.onhashchange = locationHashChanged;
locationHashChanged();
