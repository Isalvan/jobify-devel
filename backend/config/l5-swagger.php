<?php

return [
    'default' => 'default',
    'documentations' => [
        'default' => [
            'api' => [
                'title' => 'L5 Swagger UI',
            ],

            'routes' => [
                /*
                 * Route for accessing api documentation interface
                */
                'api' => 'api/documentation',
                
                /*
                 * Route for accessing parsed swagger annotations
                */
                'docs' => 'docs',
            ],
            'paths' => [
                /*
                 * Edit to include full URL in ui for assets
                */
                'use_absolute_path' => env('L5_SWAGGER_USE_ABSOLUTE_PATH', true),

                /*
                 * File name of the generated json documentation file
                */
                'docs_json' => 'api-docs.json',

                /*
                 * File name of the generated YAML documentation file
                */
                'docs_yaml' => 'api-docs.yaml',

                /*
                * Set this to `json` or `yaml` to determine which documentation file to use in UI
                */
                'format_to_use_for_docs' => env('L5_FORMAT_TO_USE_FOR_DOCS', 'json'),

                /*
                 * Absolute paths to directory containing the swagger annotations are stored.
                */
                'annotations' => [
                    base_path('app'),
                ],

                /*
                 * Absolute path to directory where to export views
                */
                'views' => base_path('resources/views/vendor/l5-swagger'),

                /*
                 * Edit to include full URL in ui for assets
                */
                'base' => env('L5_SWAGGER_BASE_PATH', null),

                /*
                 * Absolute path to directories that should be excluded from scanning
                */
                'excludes' => [],
            ],

            /*
             * Persist authorization data
            */
            'persist_authorization' => env('L5_SWAGGER_UI_PERSIST_AUTHORIZATION', false),
        ],
    ],
    'defaults' => [
        'routes' => [
            /*
             * Route for accessing api documentation interface
            */
            'docs' => 'docs',

            /*
             * Route for Oauth2 authentication callback
            */
            'oauth2_callback' => 'api/oauth2-callback',

            /*
             * Middleware allows to prevent access to docs for unauthorized users
            */
            'middleware' => [
                'api' => [],
                'asset' => [],
                'docs' => [],
                'oauth2_callback' => [],
            ],

            /*
             * Route Group options
            */
            'group_options' => [],
        ],

        'paths' => [
            /*
             * Absolute path to location where parsed annotations will be stored
            */
            'docs' => storage_path('api-docs'),

            /*
             * Absolute path to directory where to export views
            */
            'views' => base_path('resources/views/vendor/l5-swagger'),

            /*
             * Edit to include full URL in ui for assets
            */
            'base' => env('L5_SWAGGER_BASE_PATH', null),

            /*
             * Absolute path to directories that should be excluded from scanning
             * @deprecated Please use `scanOptions.exclude`
             * @see https://github.com/zircote/swagger-php/blob/master/docs/scanning.md#common-options
            */
            'excludes' => [],
        ],

        'scanOptions' => [
            /**
             * analyser: defaults to \OpenApi\Analyser
             * @see https://github.com/zircote/swagger-php/blob/master/docs/scanning.md#common-options
             */
            'analyser' => null,

            /**
             * analysis: defaults to \OpenApi\Analysis
             * @see https://github.com/zircote/swagger-php/blob/master/docs/scanning.md#common-options
             */
            'analysis' => null,

            /**
             * Custom query path processors classes.
             *
             * @link https://github.com/zircote/swagger-php/tree/master/Examples/processors/schema-query-parameter
             * @see https://github.com/zircote/swagger-php/blob/master/src/Processors/Concerns/Placeholders.php
             */
            'processors' => [
                // new \App\SwaggerProcessors\SchemaQueryParameter(),
            ],

            /**
             * pattern: string|array
             * @see https://github.com/zircote/swagger-php/blob/master/docs/scanning.md#common-options
             */
            'pattern' => null,

            /**
             * exclude: string|array
             * @see https://github.com/zircote/swagger-php/blob/master/docs/scanning.md#common-options
             */
            'exclude' => [],

            /**
             * open_api_spec_version: string
             * @see https://github.com/zircote/swagger-php/blob/master/docs/scanning.md#common-options
             */
            'open_api_spec_version' => '3.0.0',
        ],

        /*
         * API security definitions. Will be generated in the documentation file.
        */
        'securityDefinitions' => [
            'sanctum' => [ // Unique name of security
                'type' => 'apiKey', // The type of the security scheme. Valid values are "basic", "apiKey" or "oauth2".
                'description' => 'Enter token in format (Bearer <token>)',
                'name' => 'Authorization', // The name of the header or query parameter to be used.
                'in' => 'header', // The location of the API key. Valid values are "query" or "header".
            ],
        ],
        
        'security' => [
            /*
             * Examples of Security schemes
            */
            [
                'sanctum' => []
            ],
        ],

        /*
         * Sort operations by method
        */
        'operations_sort' => env('L5_SWAGGER_OPERATIONS_SORT', null),

        /*
         * Pass the validatorUrl parameter to SwaggerUi init on the JS side
        */
        'validator_url' => null,

        /*
         * Swagger UI configuration parameters
        */
        'ui' => [
            'display' => [
                /*
                 * Controls the default expansion setting for the operations and tags. It can be :
                 * 'list' (expands only the tags),
                 * 'full' (expands the tags and operations),
                 * 'none' (expands nothing).
                 */
                'doc_expansion' => env('L5_SWAGGER_UI_DOC_EXPANSION', 'none'),

                /**
                 * If set, enables filtering. The top bar will show an edit box that
                 * you can use to filter the tagged operations that are shown. Can be
                 * Boolean to enable or disable, or a string, in which case filtering
                 * will be enabled using that string as the filter expression. Filtering
                 * is case-sensitive matching the filter expression anywhere inside the tag.
                 */
                'filter' => env('L5_SWAGGER_UI_FILTERS', true),
            ],

            'authorization' => [
                /*
                 * If set to true, it persists authorization data, and it would not be lost on browser close/refresh
                 */
                'persist_authorization' => env('L5_SWAGGER_UI_PERSIST_AUTHORIZATION', false),

                'oauth2' => [
                    /*
                    * If set to true, adds PKCE to AuthorizationCodeGrant flow
                    */
                    'use_pkce_with_authorization_code_grant' => false,
                ],
            ],
        ],

        /*
         * Constants which can be used in annotations
         */
        'constants' => [
            'L5_SWAGGER_CONST_HOST' => env('L5_SWAGGER_CONST_HOST', 'http://localhost'),
        ],

        /*
         * Uncomment to add constants which can be used in annotations
         */
        'additional_config_url' => null,

        /*
         * Proxy configuration
        */
        'proxy' => false,
    ],
];
