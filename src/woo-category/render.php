<?php
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

// Base query
$args = [
    'taxonomy'   => 'product_cat',
    'number'     => $limit,
    'orderby'    => $order_by,
    'order'      => $order,
    'hide_empty' => true,
    'include'    => $include_ids,
    'exclude'    => $exclude_ids,
];

// Parent filter
if ($parent_filter === 'top-level') {
    $args['parent'] = 0;
} elseif ($parent_filter === 'sub-categories') {
    $args['parent__not_in'] = [0]; // valid way to get child categories
}

// Fetch categories
$categories = get_terms($args);

if (is_wp_error($categories) || empty($categories)) {
    return '<p class="woocommerce-no-categories">' . esc_html__('No product categories found.', 'your-textdomain') . '</p>';
}
?>

<div <?php echo get_block_wrapper_attributes([
            'class' => "product-categories-block layout-{$layout} columns-{$columns}"
        ]); ?>>
    <?php
    if (file_exists($templates . '/category-loop.php')) {
        include $templates . '/category-loop.php';
    }
    ?>
</div>