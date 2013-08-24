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
                'tasks': ['closureCompiler:refinery_base_js',
                            'concat:refinery_base_js',
                            'copy:refinery_js']
            },
            'admin_js' : {
                'files': [scripts_dir + '/admin/{,*/}*.js'],
                'tasks': ['closureCompiler:refinery_admin_js',
                            'concat:refinery_admin_js',
                            'copy:refinery_js',
                            'livereload']
            },
            'styles' : {
                'files': [styles_dir + '/{,*/}*.css', styles_dir + '/{,*/}*.css.scss'],
                'tasks': ['assetUrl:refinery_styles', 'copy:refinery_styles']
            }
        }],
        'closureCompiler': [{
            'base_js' : {
                'options': {
                    'checkModified': true,
                    'compilerOpts': {
                        'compilation_level': 'ADVANCED_OPTIMIZATIONS',
                        'warning_level': 'verbose',
                        'externs': ['externs/jquery-1.9.js', 'externs/custom.js'],
                        'language_in': 'ECMASCRIPT5_STRICT',
                        'summary_detail_level': 3,
                        //'formatting': 'PRETTY_PRINT',
                        'output_wrapper': '"(function(window, $){%output%}(window, jQuery));"'
                    }
                },
                'src': [
                    'scripts/refinery.js',
                    'scripts/object_state.js',
                    'scripts/*.js'
                ],
                'dest': '.tmp/assets/javascripts/refinery/refinery.min.js'
            }
        }, {
            'admin_js': {
                'options': {
                    'checkModified': true,
                    'compilerOpts': {
                        'compilation_level': 'ADVANCED_OPTIMIZATIONS',
                        'warning_level': 'verbose',
                        'externs': ['externs/jquery-1.9.js', 'externs/custom.js', 'externs/refinery.js'],
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
                'dest': '.tmp/assets/javascripts/refinery/refinery-admin.min.js'
            }
        }],
        'concat': [{
            'base_js' : {
                'src': [
                    'scripts/refinery.js',
                    'scripts/object_state.js',
                    'scripts/*.js'
                ],
                'dest': '.tmp/assets/javascripts/refinery/refinery.all.js'
            }
        }, {
            'admin_js' : {
                'src': [
                    'scripts/admin/*.js',
                    'scripts/admin/dialogs/dialog.js',
                    'scripts/admin/pickers/picker.js',
                    'scripts/admin/*/*.js'
                ],
                'dest': '.tmp/assets/javascripts/refinery/refinery-admin.all.js'
            }
        }],

        'copy': [{
            'js': {
                'files': [{
                    'expand': true,
                    'dot': true,
                    'cwd': dir + '/.tmp/assets/javascripts/',
                    'dest': build_dir + '/javascripts/',
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
                    'dest': build_dir + '/stylesheets/',
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
