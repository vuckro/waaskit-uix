<?php

namespace Waaskit\UIX;

use Waaskit\UIX\Admin\AdminStyles;

class Plugin
{
    public function boot(): void
    {
        // Admin only for now.
        if (is_admin()) {
            $this->bootAdmin();
        }
    }

    protected function bootAdmin(): void
    {
        $admin = new AdminStyles();
        $admin->register();
    }
}
