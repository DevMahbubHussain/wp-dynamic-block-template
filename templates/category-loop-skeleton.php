<?php

/**
 * Variables: $categories, $attributes, $is_ajax, $layout, $columns
 */

if (!isset($categories)) {
    return;
}

$is_loading = empty($categories) && empty($is_ajax); 

if ($is_loading) {
    $skeleton_count = $attributes['categoriesToShow'] ?? 6; 

    echo '<ul class="product-category-list">';
    for ($i = 0; $i < $skeleton_count; $i++) {
        echo '<li class="category-skeleton-item">';

        if ($layout === 'grid') {
            echo '<div class="skeleton-box-img"></div>';
            echo '<div class="skeleton-box-title"></div>';
            echo '<div class="skeleton-box-count"></div>';
        } else {
            echo '<div style="display: flex; align-items: center; padding: 10px;">';
            echo '<div class="skeleton-box-img" style="width: 60px; height: 60px; margin-right: 15px;"></div>';
            echo '<div style="flex-grow: 1;">';
            echo '<div class="skeleton-box-title" style="width: 80%; margin: 0 0 5px 0;"></div>';
            echo '<div class="skeleton-box-count" style="width: 50%; margin: 0;"></div>';
            echo '</div>';
            echo '</div>';
        }
        echo '</li>';
    }

    echo '</ul>';
    return; 
} 

// --------------------------------------------------------------------------------
// 2. CATEGORY RENDER (Runs for initial data or AJAX)
// --------------------------------------------------------------------------------

// Only start the <ul> if this is NOT an AJAX call (i.e., initial page load render)
if (empty($is_ajax)) : ?>
    <ul class="product-category-list">
<?php endif; ?>

<?php foreach ($categories as $category) : ?>
    <li class="product-category-item">
        <a href="<?php echo esc_url(get_term_link($category)); ?>">

            <?php if (!empty($attributes['showImage'])) :
                $thumbnail_id = get_term_meta($category->term_id, 'thumbnail_id', true);
                if ($thumbnail_id) {
                    echo wp_get_attachment_image(
                        $thumbnail_id,
                        $attributes['imageSize'] ?? 'medium',
                        false,
                        ['class' => 'category-image']
                    );
                }
            endif; ?>

            <span class="category-name"><?php echo esc_html($category->name); ?></span>

            <?php if (!empty($attributes['showCount'])) : ?>
                <span class="product-count">(<?php echo absint($category->count); ?>)</span>
            <?php endif; ?>

            <?php if (!empty($attributes['showDescription']) && !empty($category->description)) : ?>
                <p class="category-description"><?php echo esc_html($category->description); ?></p> 
            <?php endif; ?>

        </a>
    </li>
<?php endforeach; ?>

<?php
// Only close the <ul> if this is NOT an AJAX call
if (empty($is_ajax)) : ?>
    </ul>
<?php endif; ?>