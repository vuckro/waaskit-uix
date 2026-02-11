(function () {
  const { createElement: h, render, useState } = wp.element;

  const LOGO_URL = 'https://www.waaskit.com/wp-content/uploads/2025/05/WaasKit-logo.svg';

  function Header({ active, onChange }) {
    const [navOpen, setNavOpen] = useState(false);

    function toggleNav() {
      setNavOpen(function (open) { return !open; });
    }

    function handleChange(view) {
      onChange(view);
      setNavOpen(false);
    }

    return h('header', { className: 'wk2-header' }, [
      h('div', { className: 'wk2-header-left' }, [
        h('div', { className: 'wk2-logo' }, h('img', { src: LOGO_URL, alt: 'Waaskit' }))
      ]),
      h('div', { className: 'wk2-header-right' }, [
        h('button', {
          type: 'button',
          className: 'wk2-theme-toggle',
          'aria-label': 'Toggle dark mode (placeholder)'
        }, '☀︎'),
        h('button', {
          type: 'button',
          className: 'wk2-nav-toggle',
          'aria-label': 'Toggle navigation',
          onClick: toggleNav
        }, '☰'),
        h('nav', {
          className: 'wk2-nav' + (navOpen ? ' wk2-nav--open' : '')
        }, [
          h('button', {
            type: 'button',
            className: 'wk2-nav-item' + (active === 'dashboard' ? ' wk2-nav-item--active' : ''),
            onClick: function () { handleChange('dashboard'); }
          }, 'Dashboard'),
          h('button', {
            type: 'button',
            className: 'wk2-nav-item' + (active === 'settings' ? ' wk2-nav-item--active' : ''),
            onClick: function () { handleChange('settings'); }
          }, 'Settings')
        ])
      ])
    ]);
  }

  function shadeColor(hex, percent) {
    if (!hex || hex[0] !== '#') return hex;
    const num = parseInt(hex.slice(1), 16);
    const r = (num >> 16) + percent;
    const g = ((num >> 8) & 0x00ff) + percent;
    const b = (num & 0x0000ff) + percent;
    const clamp = v => Math.max(0, Math.min(255, v));
    return '#' + ((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1);
  }

  function DashboardView() {
    const modules = [
      { key: 'admin-shell', label: 'Admin shell', status: 'Planned' },
      { key: 'dark-mode', label: 'Dark mode', status: 'Planned' },
      { key: 'plugin-theming', label: 'Plugin theming', status: 'Planned' }
    ];

    const frameworksFlags = (window.WKUIX && window.WKUIX.frameworks) || {};

    const frameworks = [
      { key: 'acss', label: 'Automatic CSS', detected: !!frameworksFlags.acss },
      { key: 'core', label: 'Core Framework', detected: !!frameworksFlags.core },
      { key: 'bricks', label: 'Bricks', detected: !!frameworksFlags.bricks }
    ];

    const [primaryColor, setPrimaryColor] = useState('#111827');
    const palette = [
      primaryColor,
      shadeColor(primaryColor, 20),
      shadeColor(primaryColor, -20),
      shadeColor(primaryColor, 40),
      shadeColor(primaryColor, -40)
    ];

    return h('main', { className: 'wk2-main' }, [
      h('section', { className: 'wk2-row' }, [
        h('div', { className: 'wk2-card' }, [
          h('div', { className: 'wk2-card-section' }, [
            h('div', { className: 'wk2-card-label' }, 'Modules'),
            h('div', { className: 'wk2-card-body' }, [
              h('div', { className: 'wk2-pills' },
                modules.map(function (m) {
                  return h('span', { key: m.key, className: 'wk2-pill' }, m.label + ' · ' + m.status);
                })
              )
            ])
          ]),
          h('div', { className: 'wk2-card-footer' },
            h('div', { className: 'wk2-meta' }, 'Version ' + (window.WKUIX && window.WKUIX.version ? window.WKUIX.version : '0.1.1'))
          )
        ]),
        h('div', { className: 'wk2-card' }, [
          h('div', { className: 'wk2-card-section' }, [
            h('div', { className: 'wk2-card-label' }, 'Frameworks'),
            h('div', { className: 'wk2-card-body' }, [
              h('ul', { className: 'wk2-list' },
                frameworks.map(function (f) {
                  return h('li', { key: f.key }, [
                    h('span', null, f.label),
                    h('span', { className: 'wk2-tag' }, f.detected ? 'Detected' : 'Not detected')
                  ]);
                })
              )
            ])
          ]),
          h('div', { className: 'wk2-card-footer' })
        ]),
        h('div', { className: 'wk2-card' }, [
          h('div', { className: 'wk2-card-section' }, [
            h('div', { className: 'wk2-card-label' }, 'Design (color & typography)'),
            h('div', { className: 'wk2-card-body' }, [
              h('div', { className: 'wk2-design-row' }, [
                h('div', { className: 'wk2-design-group' }, [
                  h('label', null, 'Primary color'),
                  h('input', {
                    type: 'color',
                    value: primaryColor,
                    onChange: function (e) { setPrimaryColor(e.target.value); }
                  })
                ]),
                h('div', { className: 'wk2-design-group' }, [
                  h('label', null, 'Typography'),
                  h('div', { className: 'wk2-typo-preview' }, [
                    h('div', { className: 'wk2-typo-heading' }, 'Heading preview'),
                    h('div', { className: 'wk2-typo-body' }, 'Body text preview')
                  ])
                ])
              ]),
              h('div', { className: 'wk2-palette' },
                palette.map(function (c, idx) {
                  return h('div', {
                    key: idx,
                    className: 'wk2-swatch',
                    style: { backgroundColor: c }
                  });
                })
              )
            ])
          ]),
          h('div', { className: 'wk2-card-footer' },
            h('div', { className: 'wk2-meta' }, 'This section will later sync with framework imports and saved settings.')
          )
        ])
      ])
    ]);
  }

  function SettingsView() {
    return h('main', { className: 'wk2-main' }, [
      h('section', { className: 'wk2-row' }, [
        h('div', { className: 'wk2-card' }, [
          h('div', { className: 'wk2-card-section' }, [
            h('div', { className: 'wk2-card-label' }, 'Settings'),
            h('div', { className: 'wk2-card-body' },
              h('p', null, 'Settings will live here (modules, integrations, etc.). For now, this is just a placeholder.')
            )
          ]),
          h('div', { className: 'wk2-card-footer' })
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
      window.WKUIX = window.WKUIX || {};
    }

    render(h(App), root);
  });
})();
