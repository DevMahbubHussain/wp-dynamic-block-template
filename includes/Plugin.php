<?php

declare(strict_types=1);

namespace App;

use App\Ajax\Category;
use App\Assets\Manager;

defined('ABSPATH') || exit;

final class Plugin
{
    const VERSION = '1.0';

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
        define('MH_ACADEMY_VERSION', self::VERSION);
        define('MH_ACADEMY_PLUGIN_DIR', plugin_dir_path(__FILE__));
        define('MH_ACADEMY_PLUGIN_URL', plugin_dir_url(__FILE__));
        define('MH_ACADEMY_PLUGIN_ROOT_DIR', plugin_dir_path(dirname(__FILE__)));

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
        $notice = new Notice(__FILE__);
        $notice->register();
        $category = new Category();
        $category->register();
        $manager = new Manager();
        $manager->register();

    }
}
