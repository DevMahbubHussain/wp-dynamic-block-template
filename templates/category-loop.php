<?php

/**
 * Variables: $categories, $attributes, $is_ajax
 */

if (empty($categories)) {
    return;
}
if (empty($is_ajax)) : ?>
<ul class="product-category-list">
<?php endif; ?>

    <?php foreach ($categories as $category) : 
        $category_name = esc_html($category->name);
        $category_link = esc_url(get_term_link($category));
        ?>
        
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
                    else{
                        echo get_woo_builder_get_placeholder_html( $behavior, $custom_url, $category_name );
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

if (empty($is_ajax)) : ?>
</ul>
<?php endif;

