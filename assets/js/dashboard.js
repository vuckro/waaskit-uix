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

  function DesignCard() {
    const initialDesign = (window.WKUIX && window.WKUIX.design) || {};
    const [primary, setPrimary] = useState(initialDesign.primary || '#111827');
    const [fontBody, setFontBody] = useState(initialDesign.font_body || '');
    const [fontHeading, setFontHeading] = useState(initialDesign.font_heading || '');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const palette = [
      primary,
      shadeColor(primary, 20),
      shadeColor(primary, -20),
      shadeColor(primary, 40),
      shadeColor(primary, -40)
    ];

    function handleSave() {
      if (!window.WKUIX || !window.WKUIX.ajaxUrl || !window.WKUIX.nonce) {
        setMessage('Missing AJAX configuration');
        return;
      }
      setSaving(true);
      setMessage('');
      const data = new window.FormData();
      data.append('action', 'waaskit_uix_save_design');
      data.append('nonce', window.WKUIX.nonce);
      data.append('primary', primary);
      data.append('font_body', fontBody);
      data.append('font_heading', fontHeading);

      window.fetch(window.WKUIX.ajaxUrl, {
        method: 'POST',
        credentials: 'same-origin',
        body: data
      }).then(function (res) {
        return res.json();
      }).then(function (json) {
        if (json && json.success) {
          setMessage('Design saved');
        } else {
          setMessage(json && json.data && json.data.message ? json.data.message : 'Error saving design');
        }
      }).catch(function () {
        setMessage('Network error while saving design');
      }).finally(function () {
        setSaving(false);
      });
    }

    return h('div', { className: 'wk2-card' }, [
      h('div', { className: 'wk2-card-section' }, [
        h('div', { className: 'wk2-card-label' }, 'Design (color & typography)'),
        h('div', { className: 'wk2-card-body' }, [
          h('div', { className: 'wk2-design-row' }, [
            h('div', { className: 'wk2-design-group' }, [
              h('label', null, 'Primary color'),
              h('input', {
                type: 'color',
                value: primary,
                onChange: function (e) { setPrimary(e.target.value); }
              })
            ]),
            h('div', { className: 'wk2-design-group' }, [
              h('label', null, 'Body font'),
              h('input', {
                type: 'text',
                className: 'wk2-input',
                placeholder: 'e.g. system-ui, Inter, Sora…',
                value: fontBody,
                onChange: function (e) { setFontBody(e.target.value); }
              })
            ]),
            h('div', { className: 'wk2-design-group' }, [
              h('label', null, 'Heading font'),
              h('input', {
                type: 'text',
                className: 'wk2-input',
                placeholder: 'e.g. inherit, Inter, Sora…',
                value: fontHeading,
                onChange: function (e) { setFontHeading(e.target.value); }
              })
            ])
          ]),
          h('div', { className: 'wk2-typo-preview' }, [
            h('div', { className: 'wk2-typo-heading', style: { fontFamily: fontHeading || undefined } }, 'Heading preview'),
            h('div', { className: 'wk2-typo-body', style: { fontFamily: fontBody || undefined } }, 'Body text preview')
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
      h('div', { className: 'wk2-card-footer' }, [
        h('button', {
          type: 'button',
          className: 'wk2-button',
          disabled: saving,
          onClick: handleSave
        }, saving ? 'Saving…' : 'Save design'),
        message && h('span', { className: 'wk2-meta wk2-meta-inline' }, message)
      ])
    ]);
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
        h(DesignCard)
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
