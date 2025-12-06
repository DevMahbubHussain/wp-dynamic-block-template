<?php
/**
 * Main render.php file
 * Variables available:
 *   $attributes
 *   $content
 *   $block
 */
$templates = __DIR__ . '/templates';
?>

<div <?php echo get_block_wrapper_attributes(); ?> class="example-block">

    <?php
    // Include smaller template files
    if ( file_exists( $templates . '/header.php' ) ) {
        include $templates . '/header.php';
    }

    // Add more templates if needed
    // include $templates . '/title.php';
    // include $templates . '/content.php';
    // include $templates . '/buttons.php';
    // include $templates . '/footer.php';
    ?>

</div>
