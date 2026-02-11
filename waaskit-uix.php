<?php
/**
 * Plugin Name:       Waaskit UIX
 * Description:       Modern, lightweight admin UI for WordPress. Uses a variable-based design system that adapts to your site's CSS framework (ACSS, Bricks, Core, or none).
 * Version:           0.1.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            Waaskit
 * Author URI:        https://waaskit.com
 * License:           GPLv2 or later
 * Text Domain:       waaskit-uix
 * Domain Path:       /languages
 */

if (! defined('ABSPATH')) {
    exit;
}

// Core constants.
define('WKUIX_FILE', __FILE__);
define('WKUIX_DIR', plugin_dir_path(__FILE__));
define('WKUIX_URL', plugin_dir_url(__FILE__));
define('WKUIX_VERSION', '0.1.0');

// Simple PSR-4 autoloader for the Waaskit\UIX namespace.
spl_autoload_register(function ($class) {
    if (strpos($class, 'Waaskit\\UIX\\') !== 0) {
        return;
    }

    $relative = str_replace('Waaskit\\UIX\\', '', $class);
    $relative = str_replace('\\', DIRECTORY_SEPARATOR, $relative);
    $file     = WKUIX_DIR . 'src/' . $relative . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

// Bootstrap.
add_action('plugins_loaded', function () {
    $plugin = new Waaskit\UIX\Plugin();
    $plugin->boot();
});
