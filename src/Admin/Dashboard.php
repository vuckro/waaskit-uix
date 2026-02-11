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
            'waaskit-uix',
            [$this, 'render'],
            'dashicons-layout',
            3
        );
    }

    public function render(): void
    {
        echo '<div class="wrap wk-uix-wrap">';
        echo '<h1 class="wk-uix-title">Waaskit UIX</h1>';
        echo '<div id="wk-uix-dashboard-root" class="wk-uix-dashboard"></div>';
        echo '</div>';
    }

    public function enqueueAssets(string $hook): void
    {
        if ($hook !== 'toplevel_page_waaskit-uix') {
            return;
        }

        // Styles scoped to our dashboard only.
        wp_enqueue_style(
            'waaskit-uix-dashboard',
            WKUIX_URL . 'assets/css/dashboard.css',
            [],
            WKUIX_VERSION
        );

        // JS app (React-like via wp.element).
        wp_enqueue_script(
            'waaskit-uix-dashboard',
            WKUIX_URL . 'assets/js/dashboard.js',
            ['wp-element'],
            WKUIX_VERSION,
            true
        );
    }
}
