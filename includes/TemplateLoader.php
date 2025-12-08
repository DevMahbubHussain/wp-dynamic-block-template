<?php

declare(strict_types=1);

namespace App;

defined('ABSPATH') || exit;

class TemplateLoader
{
    public static function get($template_name, $variables = [])
    {
        $path = MH_ACADEMY_PLUGIN_ROOT_DIR . 'templates/' . $template_name;

        if (! file_exists($path)) {
            return '';
        }

        if (! empty($variables) && is_array($variables)) {
            extract($variables);
        }

        ob_start();
        include $path;
        return ob_get_clean();
    }
}
