<?php

use App\TemplateLoader;

if (! class_exists('WooCommerce')) {
    return '<p class="woocommerce-missing">' .
        esc_html__('WooCommerce is not installed or activated.', 'your-textdomain') .
        '</p>';
}

$templates = __DIR__ . '/templates';

/*
|--------------------------------------------------------------------------
| Sanitize and prepare block attributes
|--------------------------------------------------------------------------
*/
$limit      = absint($attributes['categoriesToShow'] ?? 9);
$layout     = sanitize_key($attributes['layoutStyle'] ?? 'grid');
$order_by   = sanitize_key($attributes['orderBy'] ?? 'name');
$order      = sanitize_key($attributes['order'] ?? 'asc');
$columns    = absint($attributes['columns'] ?? 3);

$include_ids     = $attributes['selectedCategories'] ?? [];
$exclude_ids     = $attributes['excludeCategories'] ?? [];
$parent_filter   = sanitize_key($attributes['parentFilter'] ?? 'all');
$pagination_type = sanitize_key($attributes['paginationType'] ?? 'loadmore');
$behavior   = $attributes['placeholderBehavior'] ?? 'default_icon';
$custom_url = $attributes['customPlaceholderUrl'] ?? '';


//  START OF CACHING LOGIC //
// Define a default cache lifetime (e.g., 1 hour)
$cache_lifetime = HOUR_IN_SECONDS;
// Define the base transient key
$transient_base = 'wbb_woo_categories_';


/*
|--------------------------------------------------------------------------
| Base get_terms() arguments
|--------------------------------------------------------------------------
*/
$args = [
    'taxonomy'   => 'product_cat',
    'number'     => $limit,
    'orderby'    => $order_by,
    'order'      => $order,
    'hide_empty' => true,
    'include'    => $include_ids,
    'exclude'    => $exclude_ids,
];

/*
|--------------------------------------------------------------------------
| Parent filter
|--------------------------------------------------------------------------
*/
if ($parent_filter === 'top-level') {
    $args['parent'] = 0;
} elseif ($parent_filter === 'sub-categories') {
    $args['parent__not_in'] = [0];
}

/*
|--------------------------------------------------------------------------
| Pagination Logic
|--------------------------------------------------------------------------
*/
$categories_per_page = $limit;
$current_page        = 1;
$offset              = 0;

// Numbered pagination uses URL paged= parameter
if ($pagination_type === 'number') {
    $current_page = max(1, get_query_var('paged'));
    $offset       = ($current_page - 1) * $categories_per_page;
}

$total_count_transient_key = $transient_base . 'total_count_for_args_' . md5(serialize($args));


/*
|--------------------------------------------------------------------------
| Get total count (must ignore offset and number)
|--------------------------------------------------------------------------
*/
$cached_data = get_transient($total_count_transient_key);

if (false === $cached_data) {
    // Data is NOT cached: Run the full query
    $all_categories_args = array_merge(
        $args,
        [
            'number' => 99999,
            'offset' => 0,
            'paged'  => false,
        ]
    );

    $all_categories = get_terms($all_categories_args);
    $total_count    = count($all_categories);
    $max_pages      = ceil($total_count / $categories_per_page);

    // Store the results in the cache
    $cached_data = [
        'total_count' => $total_count,
        'max_pages'   => $max_pages,
    ];
    set_transient($cache_key, $cached_data, $cache_lifetime);
} else {
    $total_count = $cached_data['total_count'];
    $max_pages   = $cached_data['max_pages'];
}
$args['offset'] = $offset;



/*
|--------------------------------------------------------------------------
| Fetch categories for current page
|--------------------------------------------------------------------------
*/
$categories = get_terms($args);

if (is_wp_error($categories) || empty($categories)) {
    if ($current_page > 1) {
        return '<p class="woocommerce-no-categories">' .
            esc_html__('No more categories found on this page.', 'your-textdomain') .
            '</p>';
    }

    return '<p class="woocommerce-no-categories">' .
        esc_html__('No product categories found.', 'your-textdomain') .
        '</p>';
}

?>


<div <?php echo get_block_wrapper_attributes(); ?>>
    <div class="product-categories-inner layout-control layout-<?php echo esc_attr($layout); ?> columns-<?php echo esc_attr($columns); ?>">
        <div class="category-listing-container">
            <?php
            echo TemplateLoader::get('category-loop.php', [
                'categories' => $categories,
                'attributes' => $attributes,
                'is_ajax'    => false,
                'behavior'   => $behavior,
                'custom_url' => $custom_url
            ]);
            ?>
        </div>

        <?php
        // Include pagination/load-more template if needed
        if (file_exists($templates . '/load-more-button.php')) {
            include $templates . '/load-more-button.php';
        }
        ?>
    </div>
</div>