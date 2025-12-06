<?php
/**
 * Plugin Name:       WooCommerce Block Builder
 * Description:       WooCommerce Block Builder
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Mahbub Hussain
 * License:           GPL-2.0-or-later
 * Text Domain:       woo-builder
 *
 * @package WooBuuilder
 */

use App\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

require_once __DIR__ .'/vendor/autoload.php';

Plugin::get_instance()->init();