export function importStyleToHead(head) {
  document.querySelectorAll('style').forEach(style => {
    const s = document.createElement('style')
    s.innerHTML = style.innerText
    head.appendChild(s);
  });
};

export function setTitleToHead(head, title) {
  const title = document.createElement('title');
  title.innerText = opt.pageTitle;
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
