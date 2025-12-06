<?php

declare(strict_types=1);

namespace App;

defined('ABSPATH') || exit;

class Notice
{
    private string $plugin_file;

    public function __construct(string $plugin_file)
    {
        // store plugin main file path
        $this->plugin_file = $plugin_file;
    }

    public function register()
    {
        add_action('admin_init', [$this, 'woo_builder_require_woocommerce']);
    }

    public function woo_builder_require_woocommerce()
    {
        if (! class_exists('WooCommerce')) {

            // Prevent "Plugin activated" success message
            if (isset($_GET['activate'])) {
                unset($_GET['activate']);
            }

            // Deactivate the plugin (using main plugin file)
            deactivate_plugins(plugin_basename($this->plugin_file));

            // Display admin notice
            add_action('admin_notices', [$this, 'woo_woocommerce_required_notice']);
        }
    }

    public function woo_woocommerce_required_notice()
    {
        ?>
        <div class="notice notice-error is-dismissible">
            <p><strong>This plugin requires WooCommerce to be installed and activated.</strong></p>
        </div>
        <?php
    }
}
