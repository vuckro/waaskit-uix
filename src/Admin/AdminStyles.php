<?php

namespace Waaskit\UIX\Admin;

class AdminStyles
{
    public function register(): void
    {
        add_action('admin_enqueue_scripts', [$this, 'enqueueStyles']);
    }

    public function enqueueStyles(): void
    {
        wp_enqueue_style(
            'waaskit-uix-admin',
            WKUIX_URL . 'assets/css/admin.css',
            [],
            WKUIX_VERSION
        );
    }
}
