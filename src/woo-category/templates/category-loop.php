<?php
/**
 * Template part for displaying the product categories loop.
 * Variables: $categories, $attributes (passed from render.php)
 */

if ( empty( $categories ) ) {
    return;
}

// echo "<pre>";
// print_r($categories);
// echo "</pre>";
?>

<ul class="product-category-list">
    <?php foreach ( $categories as $category ) : ?>
        <li class="product-category-item">
            <a href="<?php echo esc_url( get_term_link( $category ) ); ?>">

                <?php 
                if ( ! empty( $attributes['showImage'] ) ) :
                    
                    // Get WooCommerce category image
                    $thumbnail_id = get_term_meta( $category->term_id, 'thumbnail_id', true );

                    if ( $thumbnail_id ) {
                        echo wp_get_attachment_image( 
                            $thumbnail_id, 
                            $attributes['imageSize'] ?? 'thumbnail' 
                        );
                    }
                endif; 
                ?>

                <span class="category-name"><?php echo esc_html( $category->name ); ?></span>
                
                <?php if ( $attributes['showCount'] ) : ?>
                    <span class="product-count">(<?php echo absint( $category->count ); ?>)</span>
                <?php endif; ?>

                <?php if ( $attributes['showDescription'] && ! empty( $category->description ) ) : ?>
                    <p class="category-description"><?php echo esc_html( $category->description ); ?></p>
                <?php endif; ?>

            </a>
        </li>
    <?php endforeach; ?>
</ul>
