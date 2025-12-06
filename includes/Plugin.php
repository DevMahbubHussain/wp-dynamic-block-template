<?php

declare(strict_types=1);

namespace App;

defined('ABSPATH') || exit;

final class Plugin
{

    /**
     * SingleTone
     */
    private static $instance = null;

    public static function get_instance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    public function init()
    {
        $this->define_constants();
        $this->includes();
        $this->register_hooks();
    }


    private function define_constants()
    {
        define('MH_ACADEMY_VERSION', '0.1.0');
        define('MH_ACADEMY_PLUGIN_DIR', plugin_dir_path(__FILE__));
        define('MH_ACADEMY_PLUGIN_URL', plugin_dir_url(__FILE__));
    }

    private function includes()
    {
        require_once MH_ACADEMY_PLUGIN_DIR . 'Hooks.php';
        require_once MH_ACADEMY_PLUGIN_DIR . 'BlockManager.php';
    }

    private function register_hooks()
    {
        $hooks = new Hooks();
        $hooks->register_blocks();
    }
}
