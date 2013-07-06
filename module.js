/*jslint maxlen: 140 */

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
                'tasks': ['copy:refinery_styles']
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
                        'summary_detail_level': 3,
                        'output_wrapper': '"(function(window, $, refinery){%output%}(window, jQuery, window.refinery));"'
                    }
                },
                'src': [
                    'scripts/admin/*.js',
                    'scripts/admin/dialogs/dialog.js',
                    'scripts/admin/pickers/picker.js',
                    'scripts/admin/*/*.js'
                ],
                'dest': '.tmp/assets/javascripts/refinery/admin/admin.min.js'
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
                'dest': '.tmp/assets/javascripts/refinery/admin/admin.all.js'
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
                    'cwd': styles_dir + '/',
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
                    'cwd': scripts_dir + '/i18n/',
                    'dest': build_dir + '/javascripts/refinery/i18n/',
                    'src': [
                        '**'
                    ]
                }]
            }
        }]
    };

exports.grunt = grunt;
