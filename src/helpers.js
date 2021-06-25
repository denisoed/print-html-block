export function importStyleToHead(head) {
  document.querySelectorAll('style').forEach(style => {
    const s = document.createElement('style')
    s.innerHTML = style.innerText
    head.appendChild(s);
  });
};

export function setTitleToHead(head, pageTitle) {
  const title = document.createElement('title');
  title.innerText = pageTitle;
  head.appendChild(title);
};

export function importCssToHead(head) {
  document.querySelectorAll('link[rel=stylesheet]').forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const media = link.getAttribute('media') || 'all';
      const l = document.createElement('link');
      l.type = 'text/css'
      l.rel = 'stylesheet'
      l.href = href
      l.media = media
      head.appendChild(l);
    }
  });
};

export function appendBody(body, element, options) {
  // Clone for safety and convenience
  // Calls clone(withDataAndEvents = true) to copy form values.
  var content = element.cloneNode(options.formValues);

  if (options.formValues) {
    // Copy original select and textarea values to their cloned counterpart
    // Makes up for inability to clone select and textarea values with clone(true)
    copyValues(element, content, 'select, textarea');
  }

  if (options.removeScripts) {
    content.querySelectorAll('script').forEach(e => e.parentNode.removeChild(e));
  }

  if (options.printContainer) {
    // grab $.selector as container
    body.appendChild(content);
  } else {
    // otherwise just print interior elements of container
  }
};

// Copies values from origin to clone for passed in elementSelector
export function copyValues(origin, clone, elementSelector) {
  var $originalElements = origin.querySelectorAll(elementSelector);

  clone.querySelectorAll(elementSelector).forEach(function (index, item) {
    $(item).val($originalElements.eq(index).val());
  });
};

export function appendContent(el, content) {
  if (!content) return;

  el.appendChild(content);
};

export function loadCssToHead(head, cssLink) {
  if (Array.isArray(cssLink)) {
    cssLink.forEach(link => {
      const tagLink = document.createElement('link');
      tagLink.type = 'text/css';
      tagLink.rel = 'stylesheet';
      tagLink.href = link;
      head.appendChild(tagLink);
    });
  } else {
    const tagLink = document.createElement('link');
    tagLink.type = 'text/css';
    tagLink.rel = 'stylesheet';
    tagLink.href = cssLink;
    head.appendChild(tagLink);
  }
};

export function setDocType(iframe, doctype) {
  let win, doc;
  win = iframe;
  win = win.contentWindow || win.contentDocument || win;
  doc = win.document || win.contentDocument || win;
  doc.open();
  doc.write(doctype);
  doc.close();
};

export function attachOnBeforePrintEvent(iframe, beforePrintHandler) {
  let win = iframe;
  win = win.contentWindow || win.contentDocument || win;

  if (typeof beforePrintHandler === 'function') {
    if ('matchMedia' in win) {
      win.matchMedia('print').addListener(mql => {
        if (mql.matches) beforePrintHandler();
      });
    } else {
      win.onbeforeprint = beforePrintHandler;
    }
  }
};

export function removeInline(body, removeInlineSelector) {
  // Ensure there is a selector, even if it's been mistakenly removed
  const selector = removeInlineSelector || '*';
  body.querySelectorAll(selector).forEach(el => {
    el.removeAttribute('style');
  });
};
