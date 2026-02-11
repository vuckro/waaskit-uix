(function () {
  const { createElement: h, render, useState } = wp.element;

  const LOGO_URL = 'https://www.waaskit.com/wp-content/uploads/2025/05/WaasKit-logo.svg';

  function Header({ active, onChange }) {
    return h('header', { className: 'wk2-header' }, [
      h('div', { className: 'wk2-header-left' }, [
        h('div', { className: 'wk2-logo' }, h('img', { src: LOGO_URL, alt: 'Waaskit' })),
        h('div', { className: 'wk2-header-text' }, [
          h('div', { className: 'wk2-header-title' }, 'Dashboard'),
          h('div', { className: 'wk2-header-subtitle' }, 'Admin UI for your WordPress stack')
        ])
      ]),
      h('nav', { className: 'wk2-nav' }, [
        h('button', {
          type: 'button',
          className: 'wk2-nav-item' + (active === 'dashboard' ? ' wk2-nav-item--active' : ''),
          onClick: function () { onChange('dashboard'); }
        }, 'Overview'),
        h('button', {
          type: 'button',
          className: 'wk2-nav-item' + (active === 'settings' ? ' wk2-nav-item--active' : ''),
          onClick: function () { onChange('settings'); }
        }, 'Settings')
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

    return h('main', { className: 'wk2-main' }, [
      h('section', { className: 'wk2-row' }, [
        h('div', { className: 'wk2-card' }, [
          h('div', { className: 'wk2-card-label' }, 'Modules'),
          h('div', { className: 'wk2-pills' },
            modules.map(function (m) {
              return h('span', { key: m.key, className: 'wk2-pill' }, m.label + ' · ' + m.status);
            })
          ),
          h('div', { className: 'wk2-meta' }, 'Version ' + (window.WKUIX && WKUIX.version ? WKUIX.version : '0.1.1'))
        ]),
        h('div', { className: 'wk2-card' }, [
          h('div', { className: 'wk2-card-label' }, 'Frameworks'),
          h('ul', { className: 'wk2-list' },
            frameworks.map(function (f) {
              return h('li', { key: f.key }, [
                h('span', null, f.label),
                h('span', { className: 'wk2-tag' }, f.detected ? 'Detected' : 'Not detected')
              ]);
            })
          )
        ]),
        h('div', { className: 'wk2-card' }, [
          h('div', { className: 'wk2-card-label' }, 'Next steps'),
          h('p', null, 'Define design tokens, then connect ACSS/Core/Bricks as design sources.'),
          h('p', { className: 'wk2-meta' }, 'This block can later show recent activity or tips.')
        ])
      ])
    ]);
  }

  function SettingsView() {
    return h('main', { className: 'wk2-main' }, [
      h('section', { className: 'wk2-row' }, [
        h('div', { className: 'wk2-card' }, [
          h('div', { className: 'wk2-card-label' }, 'Settings'),
          h('p', null, 'Settings will live here (modules, integrations, etc.). For now, this is just a placeholder.')
        ])
      ])
    ]);
  }

  function App() {
    const [activeView, setActiveView] = useState('dashboard');

    return h('div', { className: 'wk2-shell' }, [
      h(Header, { active: activeView, onChange: setActiveView }),
      activeView === 'dashboard' ? h(DashboardView) : h(SettingsView)
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
