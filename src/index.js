import {
  importStyleToHead,
  setTitleToHead,
  importCssToHead,
  appendBody,
  appendContent,
  loadCssToHead
} from './helpers';

// defaults
const defaults = {
  debug: false, // show the iframe for debugging
  importCSS: true, // import parent page css
  importStyle: false, // import style tags
  printContainer: true, // print outer container/$.selector
  loadCSS: '', // path to additional css file - use an array [] for multiple
  pageTitle: '', // add title to print page
  removeInline: false, // remove inline styles from print elements
  removeInlineSelector: '*', // custom selectors to filter inline styles. removeInline must be true
  printDelay: 333, // variable print delay
  header: null, // prefix to html
  footer: null, // postfix to html
  base: false, // preserve the BASE tag or accept a string for the URL
  formValues: true, // preserve input/form values
  canvas: false, // copy canvas content
  doctypeString: '<!DOCTYPE html>', // enter a different doctype for older markup
  removeScripts: false, // remove script tags from print content
  copyTagClasses: false, // copy classes from the html & body tag
  beforePrintEvent: null, // callback function for printEvent in iframe
  beforePrint: null, // function called before iframe is filled
  afterPrint: null, // function called before iframe is removed
};

export default function printHtmlBlock (selector, options) {
  const allOptions = { ...defaults, ...options };

  const $element = document.querySelector(selector);

  var strFrameName = `printHtmlBlock-${new Date().getTime()}`;

  if (
    window.location.hostname !== document.domain &&
    navigator.userAgent.match(/msie/i)
  ) {
    // Ugly IE hacks due to IE not inheriting document.domain from parent
    // checks if document.domain is set by comparing the host name against document.domain
    const iframeSrc = `
      javascript:document.write("<head><script>document.domain="${document.domain}";</script></head><body></body>")
    `;
    const printI = document.createElement('iframe');
    printI.name = 'printIframe';
    printI.id = strFrameName;
    printI.className = 'MSIE';
    document.body.appendChild(printI);
    printI.src = iframeSrc;
  } else {
    // other browsers inherit document.domain, and IE works if document.domain is not explicitly set
    var frame = document.createElement('iframe');
    frame.id = strFrameName;
    frame.name = 'printIframe';
    document.body.appendChild(frame);
  }

  var $iframe = document.getElementById(strFrameName);

  // show frame if in debug mode
  if (!allOptions.debug) { 
    $iframe.style.position = 'absolute';
    $iframe.style.width = '0px';
    $iframe.style.height = '0px';
    $iframe.style.left = '-600px';
    $iframe.style.top = '-600px';
  }

  // before print callback
  if (typeof allOptions.beforePrint === 'function') {
    allOptions.beforePrint();
  }

  // $iframe.ready() and $iframe.load were inconsistent between browsers
  setTimeout(function () {
    // Add doctype to fix the style difference between printing and render
    function setDocType($iframe, doctype) {
      var win, doc;
      win = $iframe;
      win = win.contentWindow || win.contentDocument || win;
      doc = win.document || win.contentDocument || win;
      doc.open();
      doc.write(doctype);
      doc.close();
    }

    if (allOptions.doctypeString) {
      setDocType($iframe, allOptions.doctypeString);
    }

    var $doc = $iframe.contentDocument || $iframe.contentWindow.document,
      $head = $doc.querySelector('head'),
      $body = $doc.querySelector('body'),
      $base = document.querySelector('base'),
      baseURL;

    // add base tag to ensure elements use the parent domain
    if (allOptions.base === true && $base) {
      // take the base tag from the original page
      baseURL = $base.getAttribute('href');
    } else if (typeof allOptions.base === 'string') {
      // An exact base string is provided
      baseURL = allOptions.base;
    } else {
      // Use the page URL as the base
      baseURL = `${document.location.protocol}//${document.location.host}`;
    }

    $head.innerHTML = `<base href="${baseURL}">`;

    // import page stylesheets
    if (allOptions.importCSS) importCssToHead($head);

    // import style tags
    if (allOptions.importStyle) importStyleToHead($head)

    // add title of the page
    if (allOptions.pageTitle) setTitleToHead($head, allOptions.pageTitle);

    // import additional stylesheet(s)
    if (allOptions.loadCSS) loadCssToHead($head, allOptions.loadCSS);

    const pageHtml = document.querySelector('html');

    // CSS VAR in html tag when dynamic apply e.g.  document.documentElement.style.setProperty('--foo', bar);
    $doc.querySelector('html').setAttribute('style', pageHtml.style.cssText);

    // copy 'root' tag classes
    var tag = allOptions.copyTagClasses;
    if (tag) {
      tag = tag === true ? 'bh' : tag;
      if (tag.indexOf('b') !== -1) {
        $body.classList.add(document.querySelector('body').className);
      }
      if (tag.indexOf('h') !== -1) {
        $doc.querySelector('html').classList.add(pageHtml.className);
      }
    }

    // print header
    appendContent($body, allOptions.header);

    if (allOptions.canvas) {
      // add canvas data-ids for easy access after cloning.
      var canvasId = 0;
      // .addBack('canvas') adds the top-level element if it is a canvas.
      $element
        .find("canvas")
        .addBack("canvas")
        .each(function () {
          $(this).attr("data-printhtmlblock", canvasId++);
        });
    }

    appendBody($body, $element, allOptions);

    if (allOptions.canvas) {
      // Re-draw new canvases by referencing the originals
      $body.find("canvas").each(function () {
        var cid = $(this).data("printhtmlblock"),
          $src = $('[data-printhtmlblock="' + cid + '"]');

        this.getContext("2d").drawImage($src[0], 0, 0);

        // Remove the markup from the original
        if ($.isFunction($.fn.removeAttr)) {
          $src.removeAttr("data-printhtmlblock");
        } else {
          $.each($src, function (i, el) {
            el.removeAttribute("data-printhtmlblock");
          });
        }
      });
    }

    // remove inline styles
    if (allOptions.removeInline) {
      // Ensure there is a selector, even if it's been mistakenly removed
      var selector = allOptions.removeInlineSelector || "*";
      // $.removeAttr available jQuery 1.7+
      if ($.isFunction($.removeAttr)) {
        $body.find(selector).removeAttr("style");
      } else {
        $body.find(selector).attr("style", "");
      }
    }

    // print "footer"
    appendContent($body, allOptions.footer);

    // attach event handler function to beforePrint event
    function attachOnBeforePrintEvent($iframe, beforePrintHandler) {
      var win = $iframe;
      win = win.contentWindow || win.contentDocument || win;

      if (typeof beforePrintHandler === "function") {
        if ("matchMedia" in win) {
          win.matchMedia("print").addListener(function (mql) {
            if (mql.matches) beforePrintHandler();
          });
        } else {
          win.onbeforeprint = beforePrintHandler;
        }
      }
    }
    attachOnBeforePrintEvent($iframe, allOptions.beforePrintEvent);

    setTimeout(function () {
      if ($iframe.classList.contains('MSIE')) {
        // check if the iframe was created with the ugly hack
        // and perform another ugly hack out of neccessity
        window.frames["printIframe"].focus();
        $head.append("<script>  window.print(); </s" + "cript>");
      } else {
        // proper method
        if (document.queryCommandSupported("print")) {
          $iframe.contentWindow.document.execCommand(
            "print",
            false,
            null
          );
        } else {
          $iframe.contentWindow.focus();
          $iframe.contentWindow.print();
        }
      }

      // remove iframe after print
      if (!allOptions.debug) {
        setTimeout(function () {
          $iframe.remove();
        }, 1000);
      }


      // after print callback
      if (typeof allOptions.afterPrint === "function") {
        allOptions.afterPrint();
      }
    }, allOptions.printDelay);
  }, 333);
};
