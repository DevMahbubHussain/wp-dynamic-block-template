<?php
if ($max_pages > 1) {
    $display_attributes = [
        'showImage' => $attributes['showImage'] ?? false,
        'imageSize' => $attributes['imageSize'] ?? 'medium',
        'showCount' => $attributes['showCount'] ?? false,
        'showDescription' => $attributes['showDescription'] ?? false,
    ];
?>
    <button
        id="category-load-more-<?php echo esc_attr($attributes['id']); ?>"
        class="category-load-more-button"
        data-max-pages="<?php echo esc_attr($max_pages); ?>"
        data-current-page="1"
        data-query-args="<?php echo esc_attr(json_encode($args)); ?>"
        data-container-selector=".category-listing-container"
        data-display-attrs="<?php echo esc_attr( json_encode( $display_attributes ) ); ?>" 
        >
        <?php esc_html_e('Load More Categories', 'woo-builder'); ?>
    </button
        <?php
    }
