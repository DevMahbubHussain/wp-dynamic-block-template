<?php 
function get_woo_builder_get_placeholder_html( $behavior, $custom_url, $name ) {
    if ( $behavior === 'hide_placeholder' ) {
        return '';
    }

    if ( $behavior === 'custom_image' && ! empty( $custom_url ) ) {
        // Render the custom image
        return '<img src="' . esc_url( $custom_url ) . '" alt="' . esc_attr__( 'Placeholder', 'woo-builder' ) . '" class="category-placeholder custom-placeholder" />';
    }

    $icon_svg = '<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 6h16v12H4zm2 2v8h12V8z"/></svg>'; 
    
    return '<div class="category-placeholder default-icon">' . $icon_svg . '<span>' . esc_html__( 'No Image Available', 'woo-builder' ) . '</span></div>';
}