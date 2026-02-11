(function () {
  const { createElement: h, render, useState } = wp.element;

  const LOGO_URL = 'https://www.waaskit.com/wp-content/uploads/2025/05/WaasKit-logo.svg';

  function Header({ active, onChange }) {
    return h('div', { className: 'wk-uix-header' }, [
      h('div', { className: 'wk-uix-brand' }, [
        h('div', { className: 'wk-uix-logo' },
          h('img', { src: LOGO_URL, alt: 'Waaskit' })
        ),
        h('div', { className: 'wk-uix-brand-text' }, 'Waaskit UIX'),
        h('nav', { className: 'wk-uix-nav' }, [
          h('span', {
            className: 'wk-uix-nav-item ' + (active === 'dashboard' ? 'wk-uix-nav-item--active' : ''),
            onClick: function () { onChange('dashboard'); }
          }, 'Dashboard'),
          h('span', {
            className: 'wk-uix-nav-item ' + (active === 'settings' ? 'wk-uix-nav-item--active' : ''),
            onClick: function () { onChange('settings'); }
          }, 'Settings')
        ])
      ])
    ]);
  }

  function DashboardView() {
    const modules = [
      { key: 'admin-shell', label: 'Admin shell', status: 'Planned' },
      { key: 'dark-mode', label: 'Dark mode', status: 'Planned' },
      { key: 'plugin-theming', label: 'Plugin theming', status: 'Planned' }
    ];

    const frameworks = [
      { key: 'acss', label: 'Automatic CSS', detected: false },
      { key: 'core', label: 'Core Framework', detected: false },
      { key: 'bricks', label: 'Bricks', detected: true }
    ];

    return h('div', { className: 'wk-uix-grid' }, [
      h('section', { className: 'wk-uix-card' }, [
        h('h2', null, 'Overview'),
        h('p', null, 'High-level view of Waaskit UIX modules on this site.'),
        h('div', { className: 'wk-uix-pills' },
          modules.map(function (m) {
            return h('span', { key: m.key, className: 'wk-uix-pill' }, m.label + ' · ' + m.status);
          })
        ),
        h('div', { className: 'wk-uix-meta' }, 'Version: ' + (window.WKUIX && WKUIX.version ? WKUIX.version : '0.1.1'))
      ]),
      h('aside', { className: 'wk-uix-card' }, [
        h('h2', null, 'Frameworks'),
        h('p', null, 'Detected UI frameworks (read-only for now):'),
        h('ul', null,
          frameworks.map(function (f) {
            return h('li', { key: f.key }, f.label + ' · ' + (f.detected ? 'Detected' : 'Not detected'));
          })
        ),
        h('div', { className: 'wk-uix-meta' }, 'Later: choose which framework to use as design source.')
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
      h('div', { className: 'wk-uix-main' }, [
        activeView === 'dashboard' ? h(DashboardView) : h(SettingsView)
      ])
    ]);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('waaskit-uix-app');
    if (!root) return;

    if (!window.WKUIX) {
      window.WKUIX = {};
    }

    render(h(App), root);
  });
})();
