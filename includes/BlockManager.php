<?php

declare(strict_types=1);

namespace App;

defined('ABSPATH') || exit;


class BlockManager
{
    public function register_blocks()
    {
        $build_dir      = plugin_dir_path(__DIR__) . 'build';
        $manifest_file  = $build_dir . '/blocks-manifest.php';

        if (function_exists('wp_register_block_types_from_metadata_collection')) {
            wp_register_block_types_from_metadata_collection($build_dir, $manifest_file);
            return;
        }

        if (function_exists('wp_register_block_metadata_collection')) {
            wp_register_block_metadata_collection($build_dir, $manifest_file);
            return;
        }

        if ( file_exists( $manifest_file ) ) {
			$manifest_data = require $manifest_file;
			foreach ( array_keys( $manifest_data ) as $block_type ) {
				register_block_type( $build_dir . "/{$block_type}" );
			}
		}
    }
}
