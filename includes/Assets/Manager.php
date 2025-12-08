<?php

declare(strict_types=1);

namespace App\Assets;

defined('ABSPATH') || exit;

class Manager
{

    public function register()
    {
        add_action('init', array($this, 'register_all_scripts'));
        add_action('wp_enqueue_scripts', array($this, 'woo_builder_wp_register_assets'));
        add_action('admin_enqueue_scripts', array($this, 'woo_builder_admin_register_assets'));
    }

    public function register_all_scripts()
    {
        $this->register_styles($this->get_styles());
        $this->register_scripts($this->get_scripts());
    }


    public function get_styles()
    {
        return [
            'category-load-more-css' => [
                'src' => MH_ACADEMY_PLUGIN_URL  . 'Assets/css/frontend.css',
                'version' => MH_ACADEMY_VERSION,
                'deps' => []
            ],
        ];
    }


    public function get_scripts()
    {
        return [
            'category-load-more-js' => [
                'src' => MH_ACADEMY_PLUGIN_URL . 'Assets/js/category-load-more.js',
                'version' => MH_ACADEMY_VERSION,
                'deps' =>  ['jquery'],
                'in_footer' => true,
            ],

            'infinite-scroll-js' => [
                'src' => MH_ACADEMY_PLUGIN_URL . 'Assets/js/infinite-scroll.js',
                'version' => MH_ACADEMY_VERSION,
                'deps' =>  ['jquery'],
                'in_footer' => true,
            ],

            'load-more-and-infinite-scroll' => [
                'src' => MH_ACADEMY_PLUGIN_URL . 'Assets/js/load-more-and-infinite-scroll.js',
                'version' => MH_ACADEMY_VERSION,
                'deps' =>  ['jquery'],
                'in_footer' => true,
            ],
        ];
    }

    public function register_styles(array $styles)
    {
        foreach ($styles as $handle => $style) {
            wp_register_style($handle, $style['src'], $style['deps'], $style['version']);
        }
    }

    public function register_scripts(array $scripts)
    {
        foreach ($scripts as $handle => $script) {
            wp_register_script($handle, $script['src'], $script['deps'], $script['version'], $script['in_footer']);
        }
    }

    /**
     *  Enqueues styles and scripts (FrontEnd)
     */
    public function woo_builder_wp_register_assets()
    {
        wp_enqueue_style('category-load-more-css');
        wp_enqueue_script('category-load-more-js');
        wp_enqueue_script('infinite-scroll-js');
        wp_enqueue_script('load-more-and-infinite-scroll');

        wp_localize_script('category-load-more-js', 'loadmore_params', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'action_hook' => 'load_more_categories',
            'nonce' => wp_create_nonce('load_more_nonce')
        ]);
    }

    /**
     *  Enqueues styles and scripts (Admin)
     */
    public function woo_builder_admin_register_assets()
    {
        // wp_enqueue_style('category-load-more-css');
        // wp_enqueue_script('category-load-more-js');
    }
}
