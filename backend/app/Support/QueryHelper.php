<?php

namespace App\Support;

class QueryHelper
{
    /**
     * Escapes characters that have special meaning in a LIKE clause.
     *
     * @param string|null $value
     * @param string $char
     * @return string
     */
    public static function escapeLike(?string $value, string $char = '\\'): string
    {
        return str_replace(
            [$char, '%', '_'],
            [$char.$char, $char.'%', $char.'_'],
            (string) $value
        );
    }
}
