<?php

declare(strict_types=1);

namespace App;

defined('ABSPATH') || exit;

class Hooks{
    public function register(){
        add_action( 'init', [ $this, 'register_blocks' ] );
    }

    public function register_blocks(){
       $block_manager = new BlockManager();
       $block_manager->register_blocks();
       $block_category = new BlockCategory();
       $block_category->register();
       wbb_clear_category_transients();
    }
}