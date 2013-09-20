/*jslint maxlen: 140, unused: false */

var dir = __dirname,
    scripts_dir = dir + '/scripts',
    styles_dir = dir + '/styles',
    // images_dir = dir + '/images',
    // tests_dir = dir + '/test',
    build_dir = '../refinerycms/core/app/assets',
    grunt = {
        'watch' : [{
            'base_js' : {
                'files': [scripts_dir + '/*.js'],
                'tasks': ['closureCompiler:refinerycms-clientside_base_js',
                            'concat:refinerycms-clientside_base_js',
                            'copy:refinerycms-clientside_js']
            },
            'admin_js' : {
                'files': [scripts_dir + '/admin/{,*/}*.js'],
                'tasks': ['closureCompiler:refinerycms-clientside_admin_js',
                            'concat:refinerycms-clientside_admin_js',
                            'copy:refinerycms-clientside_js',
                            'livereload']
            },
            'styles' : {
                'files': [styles_dir + '/{,*/}*.css', styles_dir + '/{,*/}*.css.scss'],
                'tasks': ['assetUrl:refinerycms-clientside_styles', 'copy:refinerycms-clientside_styles']
            }
        }],
        'closureCompiler': [{
            'base_js' : {
                'options': {
                    'checkModified': true,
                    'compilerOpts': {
                        'compilation_level': 'ADVANCED_OPTIMIZATIONS',
                        'warning_level': 'verbose',
                        'externs': ['externs/jquery-1.9.js', 'externs/custom.js', 'externs/refinery.js'],
                        'language_in': 'ECMASCRIPT5_STRICT',
                        'summary_detail_level': 3,
                        //'formatting': 'PRETTY_PRINT',
                        'output_wrapper': '"(function(window, $){%output%}(window, jQuery));"'
                    }
                },
                'src': [
                    'scripts/refinery.js',
                    'scripts/object_state.js',
                    'scripts/object.js',
                    'scripts/user_interface.js'
                ],
                'dest': '.tmp/assets/javascripts/refinery.min.js'
            }
        }, {
            'admin_js': {
                'options': {
                    'checkModified': true,
                    'compilerOpts': {
                        'compilation_level': 'ADVANCED_OPTIMIZATIONS',
                        'warning_level': 'verbose',
                        'externs': ['externs/jquery-1.9.js',
                                    'externs/custom.js',
                                    'externs/refinery.js',
                                    'externs/refinery_object.js',
                                    'externs/refinery-admin.js'
                                    ],
                        'language_in': 'ECMASCRIPT5_STRICT',
                        //'formatting': 'PRETTY_PRINT',
                        'summary_detail_level': 3,
                        'output_wrapper': '"(function(window, $){%output%}(window, jQuery));"'
                    }
                },
                'src': [
                    'scripts/admin/*.js',
                    'scripts/admin/dialogs/dialog.js',
                    'scripts/admin/pickers/picker.js',
                    'scripts/admin/*/*.js'
                ],
                'dest': '.tmp/assets/javascripts/admin.min.js'
            }
        }],
        'concat': [{
            'base_js' : {
                'src': [
                    'scripts/refinery.js',
                    'scripts/object_state.js',
                    'scripts/*.js'
                ],
                'dest': '.tmp/assets/javascripts/refinery.all.js'
            }
        }, {
            'admin_js' : {
                'src': [
                    'scripts/admin/*.js',
                    'scripts/admin/dialogs/dialog.js',
                    'scripts/admin/pickers/picker.js',
                    'scripts/admin/*/*.js'
                ],
                'dest': '.tmp/assets/javascripts/admin.all.js'
            }
        }],
        'copy': [{
            'js': {
                'files': [{
                    'expand': true,
                    'dot': true,
                    'cwd': dir + '/.tmp/assets/javascripts/',
                    'dest': build_dir + '/javascripts/refinery/',
                    'src': [
                        '**'
                    ]
                }]
            }
        }, {
            'styles': {
                'files': [{
                    'expand': true,
                    'dot': true,
                    'cwd': dir + '/.tmp/assets/stylesheets/',
                    'dest': build_dir + '/stylesheets/refinery/',
                    'src': [
                        '**'
                    ]
                }]
            }
        }, {
            'i18n': {
                'files': [{
                    'expand': true,
                    'dot': true,
                    'cwd': dir + '/i18n/',
                    'dest': build_dir + '/javascripts/refinery/i18n/',
                    'src': [
                        '**'
                    ]
                }]
            }
        }, {
            'jquery.iframe-transport': {
                'files': [{
                    'dest': build_dir + '/javascripts/vendor/jquery.iframe-transport.js',
                    'src': dir + '/components/jquery.iframe-transport.js'
                }]
            }
        }]
    };

exports.grunt = grunt;
