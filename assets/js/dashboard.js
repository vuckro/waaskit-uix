(function () {
  const { createElement: h, render, useState } = wp.element;

  function Dashboard() {
    const [modules] = useState([
      { key: 'admin-shell', label: 'Admin shell', status: 'Planned' },
      { key: 'dark-mode', label: 'Dark mode', status: 'Planned' },
      { key: 'plugin-theming', label: 'Plugin theming', status: 'Planned' },
    ]);

    return h('div', { className: 'wk-uix-grid' }, [
      h('section', { className: 'wk-uix-card' }, [
        h('h2', null, 'Waaskit UIX overview'),
        h(
          'p',
          null,
          'This dashboard will become the unified entry point for all Waaskit UI modules (admin shell, dark mode, plugin theming, etc.).'
        ),
        h('div', { className: 'wk-uix-pills' },
          modules.map(function (m) {
            return h('span', { key: m.key, className: 'wk-uix-pill' }, m.label + ' · ' + m.status);
          })
        ),
        h('div', { className: 'wk-uix-meta' }, 'Version: ' + (window.WKUIX && WKUIX.version ? WKUIX.version : '0.1.0')),
      ]),
      h('aside', { className: 'wk-uix-card' }, [
        h('h2', null, 'Design system'),
        h(
          'p',
          null,
          'Waaskit UIX uses a variable-based design system (--wk-*) that can map to ACSS, Core Framework, Bricks or a plain CSS stack.'
        ),
        h('div', { className: 'wk-uix-meta' }, 'Goal: no hard-coded colors, minimal CSS, high maintainability.'),
      ]),
    ]);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('wk-uix-dashboard-root');
    if (!root) return;

    if (!window.WKUIX) {
      window.WKUIX = {}; // reserved for future config.
    }

    render(h(Dashboard), root);
  });
})();
