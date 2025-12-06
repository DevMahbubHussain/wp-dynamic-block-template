<?php

declare(strict_types=1);

namespace App;

defined('ABSPATH') || exit;

class BlockCategory
{
    public function register()
    {
        // WordPress 5.8+
        if ( version_compare( get_bloginfo( 'version' ), '5.8', '>=' ) ) {
            add_filter('block_categories_all', [$this, 'add_category']);
        } else {
            add_filter('block_categories', [$this, 'add_category']);
        }
    }

    public function add_category($categories)
    {
        $new_category = [
            [
                'slug'  => 'woo-builder',
                'title' => __('Blocks by Mahbub', 'woo-builder')
            ]
        ];

        // Insert new category at position 2
        $position = 2;

        array_splice($categories, $position, 0, $new_category);

        return $categories;
    }
}
