<?php

namespace Waaskit\UIX\Admin;

class Dashboard
{
    public function register(): void
    {
        add_action('admin_menu', [$this, 'registerMenu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueAssets']);
        add_action('wp_ajax_waaskit_uix_save_design', [$this, 'handleSaveDesign']);
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
        echo '<div class="waaskit-uix" id="waaskit-uix-app"></div>';
    }

    public function enqueueAssets(string $hook): void
    {
        if ($hook !== 'toplevel_page_waaskit-uix-dashboard') {
            return;
        }

        $settings = get_option('waaskit_uix_settings', []);
        $design   = $settings['design'] ?? [
            'primary'      => '#111827',
            'font_body'    => '',
            'font_heading' => '',
        ];

        // Dev board tasks + vibe state (hard-coded for now, will evolve).
        $tasks = $settings['tasks'] ?? [
            'now' => [
                ['id' => 't1', 'title' => 'Clarifier architecture dashboard', 'desc' => 'Header SPA + vues Dashboard/Design system'],
            ],
            'next' => [
                ['id' => 't2', 'title' => 'DesignSystem service PHP', 'desc' => 'getDesign/saveDesign/computePalette'],
                ['id' => 't3', 'title' => 'Palette primaire', 'desc' => 'ultra-light → ultra-dark + hover'],
            ],
            'planned' => [
                ['id' => 't4', 'title' => 'Import ACSS JSON', 'desc' => 'remplir design depuis export'],
                ['id' => 't5', 'title' => 'Automation CLR', 'desc' => 'cron 8min sur site 2'],
            ],
        ];

        $vibe = $settings['vibe'] ?? [
            'mode'         => 'manual',
            'current_task' => 'Setup dev board dashboard',
            'last_action'  => 'Dashboard SPA header + basic Vibe card',
            'next_step'    => 'Move tasks into DesignSystem service',
            'started_at'   => time() * 1000,
        ];

        $css_path = WKUIX_DIR . 'assets/css/dashboard.css';
        $js_path  = WKUIX_DIR . 'assets/js/dashboard.js';

        wp_enqueue_style(
            'waaskit-uix-dashboard',
            WKUIX_URL . 'assets/css/dashboard.css',
            [],
            file_exists($css_path) ? filemtime($css_path) : WKUIX_VERSION
        );

        // Apply design tokens (accent + fonts) if configured.
        $customCss = '';
        if (!empty($design['primary']) && preg_match('/^#[0-9a-fA-F]{6}$/', $design['primary'])) {
            $customCss .= sprintf(':root{--wk-accent:%s;}' . "\n", $design['primary']);
        }
        $fontBody    = $design['font_body'] ?? '';
        $fontHeading = $design['font_heading'] ?? '';
        if ($fontBody || $fontHeading) {
            $customCss .= ':root{';
            if ($fontBody) {
                $customCss .= sprintf('--wk-font-body:%s;', $fontBody);
            }
            if ($fontHeading) {
                $customCss .= sprintf('--wk-font-heading:%s;', $fontHeading);
            }
            $customCss .= "}\n";
        }
        if ($customCss) {
            wp_add_inline_style('waaskit-uix-dashboard', $customCss);
        }

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
                'version' => WKUIX_VERSION,
                'design'  => $design,
                'tasks'   => $tasks,
                'vibe'    => $vibe,
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce'   => wp_create_nonce('waaskit_uix_design'),
            ]
        );
    }

    public function handleSaveDesign(): void
    {
        if (! current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized'], 403);
        }

        check_ajax_referer('waaskit_uix_design', 'nonce');

        $primary      = isset($_POST['primary']) ? sanitize_text_field(wp_unslash($_POST['primary'])) : '';
        $font_body    = isset($_POST['font_body']) ? sanitize_text_field(wp_unslash($_POST['font_body'])) : '';
        $font_heading = isset($_POST['font_heading']) ? sanitize_text_field(wp_unslash($_POST['font_heading'])) : '';

        if (! preg_match('/^#[0-9a-fA-F]{6}$/', $primary)) {
            wp_send_json_error(['message' => 'Invalid primary color'], 400);
        }

        $settings           = get_option('waaskit_uix_settings', []);
        $settings['design'] = [
            'primary'      => $primary,
            'font_body'    => $font_body,
            'font_heading' => $font_heading,
        ];

        update_option('waaskit_uix_settings', $settings);

        wp_send_json_success(['message' => 'Design saved']);
    }
}
