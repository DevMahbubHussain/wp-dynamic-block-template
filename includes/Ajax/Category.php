<?php

declare(strict_types=1);

namespace App\Ajax;

use App\TemplateLoader;

defined('ABSPATH') || exit;

class Category
{
    public function register()
    {
        add_action('wp_ajax_load_more_categories', [$this, 'handle_request']);
        add_action('wp_ajax_nopriv_load_more_categories', [$this, 'handle_request']);
    }

    public function handle_request()
    {
        // Retrieve raw data
        $query_args_json = isset($_POST['query_args']) ? stripslashes($_POST['query_args']) : '{}';
        $current_page     = absint($_POST['current_page'] ?? 1);

        // Decode/sanitize arguments
        $args = $this->sanitize_args(json_decode(stripslashes($query_args_json), true));
        $posts_per_page = absint($args['number'] ?? 9);
        $next_page      = $current_page + 1;
        $offset         = ($next_page - 1) * $posts_per_page;
        $args['offset'] = $offset;

        // Fetch categories
        $categories = get_terms($args);
        $display_attributes_json = isset($_POST['display_attributes']) ? stripslashes($_POST['display_attributes']) : '{}';
        if (! is_wp_error($categories) && ! empty($categories)) {

            $html = $this->render_categories($categories,$display_attributes_json);

            wp_send_json_success(['html' => $html]);
        } else {
            wp_send_json_error(['message' => 'No more categories.']);
        }

        wp_die();
    }

    /**
     * Render the categories using the template file.
     */
    private function render_categories($categories,$display_attributes_json)
    {

        $attributes = [];
        if (!isset($_POST['security']) || !wp_verify_nonce($_POST['security'], 'load_more_nonce')) {
            wp_send_json_error(['message' => 'Invalid nonce']);
        }
        if (isset($_POST['attributes']) && is_array($_POST['attributes'])) {
            $attributes = array_map('sanitize_text_field', $_POST['attributes']);
        }
        $attributes = json_decode($display_attributes_json, true);


        // Load template
        return TemplateLoader::get('category-loop.php', [
            'categories' => $categories,
            'attributes' => $attributes,
            'is_ajax'    => true,
        ]);

        // include MH_ACADEMY_PLUGIN_ROOT_DIR`Q . 'templates/category-loop.php';
    }

    /**
     * Sanitize query args array.
     */
    private function sanitize_args($args)
    {
        if (!is_array($args)) {
            return [];
        }
        return array_map('sanitize_text_field', $args);
    }
}
