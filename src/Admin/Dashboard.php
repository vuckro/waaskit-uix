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
        echo '<div class="wrap wk-uix-wrap">';
        echo '<div id="wk-uix-dashboard-root" class="wk-uix-dashboard"></div>'; // header + contenu gérés en JS
        echo '</div>';
    }

    public function enqueueAssets(string $hook): void
    {
        if ($hook !== 'toplevel_page_waaskit-uix-dashboard') {
            return;
        }

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
    }
}
