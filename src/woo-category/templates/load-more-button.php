<?php
/**
 * Template part for outputting the pagination mechanism.
 * Variables: $max_pages, $args, $attributes, $pagination_type, $scroll_threshold
 */

// No pagination needed
if ($max_pages <= 1) {
    return;
}

$pagination_type = $attributes['paginationType'] ?? 'loadmore';

// Display attributes passed to AJAX
$display_attributes = [
    'showImage'       => $attributes['showImage'] ?? false,
    'imageSize'       => $attributes['imageSize'] ?? 'medium',
    'showCount'       => $attributes['showCount'] ?? false,
    'showDescription' => $attributes['showDescription'] ?? false,
];

if ($pagination_type === 'loadmore' || $pagination_type === 'infinite') :

    $button_class = 'category-load-more-button';
    $button_text  = esc_html__('Load More Categories', 'woo-builder');

    // Default empty threshold attribute
    $data_threshold = '';

    if ($pagination_type === 'infinite') {
        // Hide button visually & allow JS to auto-trigger
        $button_class .= ' infinite-scroll-trigger screen-reader-text';
        $button_text   = esc_html__('Loading more...', 'woo-builder');

        // Add scroll threshold for JS
        $threshold     = isset($scroll_threshold) ? absint($scroll_threshold) : 300;
        $data_threshold = 'data-scroll-threshold="' . esc_attr($threshold) . '"';
    }
    ?>

    <button
        id="category-load-more-<?php echo esc_attr($attributes['id'] ?? uniqid()); ?>"
        class="<?php echo esc_attr($button_class); ?>"
        data-max-pages="<?php echo esc_attr($max_pages); ?>"
        data-current-page="1"
        data-query-args="<?php echo esc_attr(json_encode($args)); ?>"
        data-container-selector=".category-listing-container"
        data-display-attrs="<?php echo esc_attr(json_encode($display_attributes)); ?>"
        <?php echo $data_threshold; ?>
    >
        <?php echo $button_text; ?>
    </button>

<?php
// END loadmore/infinite block

elseif ($pagination_type === 'number') :

    // Standard numbered pagination
    $current_page = $current_page ?? max(1, get_query_var('paged'));

    $pagination_args = [
        // Base link structure. Using 'add_query_arg' is often safer for complex URLs.
        'base'    => esc_url(add_query_arg('paged', '%#%')), 
        'format'  => '?paged=%#%',
        'current' => $current_page,
        'total'   => $max_pages,
        'prev_text' => __('&laquo; Previous', 'woo-builder'),
        'next_text' => __('Next &raquo;', 'woo-builder'),
        'type'    => 'list', // Output as an accessible <ul> list
    ];
    ?>

    <div class="category-pagination category-pagination-number">
        <?php 
        echo paginate_links($pagination_args); 
        ?>
    </div>

<?php endif; ?>
