<?php

namespace Waaskit\UIX\Admin;

class Dashboard
{
    public function register(): void
    {
        add_action('admin_menu', [$this, 'registerMenu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueAssets']);
    }

    public function registerMenu(): void
    {
        add_menu_page(
            __('Waaskit UIX', 'waaskit-uix'),
            __('Waaskit UIX', 'waaskit-uix'),
            'manage_options',
            'waaskit-uix-dashboard',
            [$this, 'render'],
            'dashicons-layout',
            3
        );
    }

    public function render(): void
    {
        // On suit le pattern Fluent: un root div pour l'app JS, sans markup WP imposé.
        echo '<div class="waaskit-uix" id="waaskit-uix-app"></div>';
    }

    public function enqueueAssets(string $hook): void
    {
        if ($hook !== 'toplevel_page_waaskit-uix-dashboard') {
            return;
        }

        // Détection des frameworks (ACSS/Core/Bricks) côté PHP pour exposer à JS.
        require_once ABSPATH . 'wp-admin/includes/plugin.php';

        $frameworks = [
            'acss'   => is_plugin_active('automaticcss-plugin/automaticcss-plugin.php'),
            'core'   => is_plugin_active('core-framework/core-framework.php'),
            // Bricks est considéré comme présent si le plugin OU le thème est actif.
            'bricks' => is_plugin_active('bricks/bricks.php') || wp_get_theme()->get_template() === 'bricks' || wp_get_theme()->get_stylesheet() === 'bricks',
        ];

        $css_path = WKUIX_DIR . 'assets/css/dashboard.css';
        $js_path  = WKUIX_DIR . 'assets/js/dashboard.js';

        wp_enqueue_style(
            'waaskit-uix-dashboard',
            WKUIX_URL . 'assets/css/dashboard.css',
            [],
            file_exists($css_path) ? filemtime($css_path) : WKUIX_VERSION
        );

        wp_enqueue_script(
            'waaskit-uix-dashboard',
            WKUIX_URL . 'assets/js/dashboard.js',
            ['wp-element'],
            file_exists($js_path) ? filemtime($js_path) : WKUIX_VERSION,
            true
        );

        wp_localize_script(
            'waaskit-uix-dashboard',
            'WKUIX',
            [
                'version'    => WKUIX_VERSION,
                'frameworks' => $frameworks,
            ]
        );
    }
}
