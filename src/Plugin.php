<?php

namespace Waaskit\UIX;

use Waaskit\UIX\Admin\Dashboard;

class Plugin
{
    public function boot(): void
    {
        if (is_admin()) {
            $this->bootAdmin();
        }
    }

    protected function bootAdmin(): void
    {
        $dashboard = new Dashboard();
        $dashboard->register();
    }
}
