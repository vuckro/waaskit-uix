(function () {
  const { createElement: h, render, useState } = wp.element;

  function Header({ active, onChange }) {
    return h('div', { className: 'wk-uix-header' }, [
      h('div', { className: 'wk-uix-brand' }, [
        h('div', { className: 'wk-uix-logo' }),
        h('div', { className: 'wk-uix-brand-text' }, 'Waaskit UIX')
      ]),
      h('nav', { className: 'wk-uix-nav' }, [
        h('span', {
          className: 'wk-uix-nav-item ' + (active === 'dashboard' ? 'wk-uix-nav-item--active' : ''),
          onClick: function () { onChange('dashboard'); }
        }, 'Dashboard'),
        h('span', {
          className: 'wk-uix-nav-item ' + (active === 'settings' ? 'wk-uix-nav-item--active' : ''),
          onClick: function () { onChange('settings'); }
        }, 'Settings')
      ]),
      h('div', { className: 'wk-uix-header-actions' }, [
        h('button', { type: 'button', className: 'wk-uix-icon-button', 'aria-label': 'Settings' }, '⚙')
      ])
    ]);
  }

  function DashboardView() {
    const [modules] = useState([
      { key: 'admin-shell', label: 'Admin shell', status: 'Planned' },
      { key: 'dark-mode', label: 'Dark mode', status: 'Planned' },
      { key: 'plugin-theming', label: 'Plugin theming', status: 'Planned' }
    ]);

    return h('div', { className: 'wk-uix-grid' }, [
      h('section', { className: 'wk-uix-card' }, [
        h('h2', null, 'Overview'),
        h('p', null, 'This dashboard will become the unified entry point for all Waaskit UI modules (admin shell, dark mode, plugin theming, etc.).'),
        h('div', { className: 'wk-uix-pills' },
          modules.map(function (m) {
            return h('span', { key: m.key, className: 'wk-uix-pill' }, m.label + ' · ' + m.status);
          })
        ),
        h('div', { className: 'wk-uix-meta' }, 'Version: ' + (window.WKUIX && WKUIX.version ? WKUIX.version : '0.1.0'))
      ]),
      h('aside', { className: 'wk-uix-card' }, [
        h('h2', null, 'Design system'),
        h('p', null, 'Waaskit UIX uses a variable-based design system (--wk-*) that can map to ACSS, Core Framework, Bricks or a plain CSS stack.'),
        h('div', { className: 'wk-uix-meta' }, 'Goal: no hard-coded colors, minimal CSS, high maintainability.')
      ])
    ]);
  }

  function SettingsView() {
    return h('div', { className: 'wk-uix-card' }, [
      h('h2', null, 'Settings'),
      h('p', null, 'Settings will live here (modules, integrations, etc.). For now, this is just a placeholder.')
    ]);
  }

  function App() {
    const [activeView, setActiveView] = useState('dashboard');

    return h('div', null, [
      h(Header, { active: activeView, onChange: setActiveView }),
      h('div', { className: 'wk-uix-dashboard' }, [
        activeView === 'dashboard' ? h(DashboardView) : h(SettingsView)
      ])
    ]);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('wk-uix-dashboard-root');
    if (!root) return;

    if (!window.WKUIX) {
      window.WKUIX = {};
    }

    render(h(App), root);
  });
})();
