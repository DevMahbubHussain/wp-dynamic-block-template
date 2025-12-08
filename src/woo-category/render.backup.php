<?php

use App\TemplateLoader;

if (! class_exists('WooCommerce')) {
    return '<p class="woocommerce-missing">' . esc_html__('WooCommerce is not installed or activated.', 'your-textdomain') . '</p>';
}

$templates = __DIR__ . '/templates';

// Sanitize attributes
$limit      = absint($attributes['categoriesToShow'] ?? 9);
$layout     = sanitize_key($attributes['layoutStyle'] ?? 'grid');
$order_by   = sanitize_key($attributes['orderBy'] ?? 'name');
$order      = sanitize_key($attributes['order'] ?? 'asc');
$columns    = absint($attributes['columns'] ?? 3);
$include_ids = $attributes['selectedCategories'] ?? [];
$exclude_ids = $attributes['excludeCategories'] ?? [];
$parent_filter = sanitize_key($attributes['parentFilter'] ?? 'all');
$pagination_type = sanitize_key($attributes['paginationType'] ?? 'loadmore');
$scroll_threshold = absint($attributes['scrollThreshold'] ?? 100);

// Construct $args
$args = [
    'taxonomy'   => 'product_cat',
    'number'     => $limit,
    'orderby'    => $order_by,
    'order'      => $order,
    'hide_empty' => true,
    'include'    => $include_ids,
    'exclude'    => $exclude_ids,
];

// Set up pagination parameters
$categories_per_page = $args['number'];
$paged = 1;
$args['offset'] = 0;



// Parent filter
if ($parent_filter === 'top-level') {
    $args['parent'] = 0;
} elseif ($parent_filter === 'sub-categories') {
    $args['parent__not_in'] = [0]; // valid way to get child categories
}

// Fetch categories
// $categories = get_terms($args);

$categories = get_terms(array_merge($args, ['number' => 99999, 'offset' => 0]));
$total_count    = count($categories);
$max_pages      = ceil($total_count / $categories_per_page);
$args['number'] = $categories_per_page;
$categories     = array_slice($categories, 0, $categories_per_page);



if (is_wp_error($categories) || empty($categories)) {
    return '<p class="woocommerce-no-categories">' . esc_html__('No product categories found.', 'your-textdomain') . '</p>';
}


?>

<div <?php echo get_block_wrapper_attributes([
            'class' => "product-categories-block layout-{$layout} columns-{$columns}"
        ]); ?>>

    <div class="category-listing-container">
        <?php
        echo TemplateLoader::get('category-loop.php', [
            'categories' => $categories,
            'attributes' => $attributes,
            'is_ajax'    => false,
        ]);
        ?>

    </div>
    <?php
    if (file_exists($templates . '/load-more-button.php')) {
        include $templates . '/load-more-button.php';
    }
    ?>
</div>
