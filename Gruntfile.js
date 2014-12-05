

module.exports = function(grunt) {

    var _ = require("underscore");

    var shivfiles = [
        "bower_components/respond/dest/respond.src.js",
        "bower_components/html5shiv/dist/html5shiv.js",
    ];
    var libjsfiles = [
        "bower_components/underscore/underscore.js",
        "bower_components/jquery/dist/jquery.js",
        "bower_components/threejs/build/three.js",
    ];
    var templatesfiles = [
    ];
    var templatesjsfiles = _.map(templatesfiles, function(e) { return e.replace(".html", ".js") });
    var myjsfiles = [
        "src/js/app.js",
    ].concat(templatesjsfiles);
    var jsfiles = [].concat(libjsfiles).concat(myjsfiles);

    var libcssfiles = [
    ];
    var lessfiles = [
    ];
    var mycssfiles = _.map(lessfiles, function(e) { return e.replace(".less", ".css") });
    var cssfiles = [].concat(libcssfiles).concat(mycssfiles);

    grunt.initConfig({
        jshint: {
            files: myjsfiles,
            options: {
                sub: true,
                eqeqeq: true, // no == or !=
                immed: true, // forces () around directly called functions
                forin: true, // makes it harder to use for in
                latedef: "nofunc", // makes it impossible to use a variable before it is declared
                newcap: true, // force capitalized constructors
                strict: true, // enforce strict mode
                trailing: true, // trailing whitespaces are ugly
                camelcase: true, // force camelCase
            },
        },
        less: {
            dev: {
                options: {
                    paths: ["."]
                },
                files: _.object(mycssfiles, lessfiles),
            }
        },
        watch: {
            less: {
                files: "static/css/**.less",
                tasks: ['less'],
            },
            jiko: {
                files: "src/client_templates/**.html",
                tasks: ['shell:jiko'],
            },
        },
        cssmin: {
            dist: {
                files: {
                    'static/style.css': cssfiles,
                }
            },
        },
        clean: {
            tmp: {
                src: [].concat(mycssfiles),
            },
            all: {
                src: ["static", 'filesconfig.json'],
            },
            tmpjs: {
                src: ['tmp.js'],
            }
        },
        uglify: {
            shiv: {
                files: {
                    'static/shiv.js': shivfiles,
                }
            },
            dist: {
                files: {
                    'static/all.js': jsfiles,
                }
            },
        },
        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, cwd: 'bower_components/bootstrap/dist/fonts/', src: ['*'], dest: 'static/libs/bootstrap/'},
                ]
            }
        },
        shell: {
            jiko: {
                command: "node_modules/jiko/jiko_cli.js compile src/client_templates/templates.html",
            },
        },
        "file-creator": {
            dev_tmpjs: {
                files: [{
                    file: "tmp.js",
                    method: function(fs, fd, done) {
                        var files = _.map(cssfiles.concat(jsfiles), function(el) { return "" + el; });
                        fs.writeSync(fd, "window['$'] = head.ready;\n" +
                        "head.load.apply(head, " + JSON.stringify(files) + ");\n");
                        done();
                    }
                }],
            },
            dev_css: {
                files: [{
                    file: "static/style.css",
                    method: function(fs, fd, done) {
                        fs.writeSync(fd, "");
                        done();
                    }
                }],
            },
            dev_config: {
                files: [{
                    file: "filesconfig.json",
                    method: function(fs, fd, done) {
                        fs.writeSync(fd, JSON.stringify({"static_folders": ["bower_components", "src", "static"]}));
                        done();
                    }
                }],
            },
            dist_config: {
                files: [{
                    file: "filesconfig.json",
                    method: function(fs, fd, done) {
                        fs.writeSync(fd, JSON.stringify({"static_folders": ["static"]}));
                        done();
                    }
                }],
            },
        },
        concat: {
            dev: {
                src: ['bower_components/headjs/dist/1.0.0/head.load.js', 'tmp.js'],
                dest: 'static/all.js',
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-file-creator');

    grunt.registerTask('gen', ['uglify:shiv', 'shell:jiko', 'less', 'copy']);
    grunt.registerTask('dev', ['gen', 'file-creator:dev_tmpjs', 'file-creator:dev_css', "concat:dev", "clean:tmpjs", 'file-creator:dev_config']);
    grunt.registerTask('dist', ['gen', 'uglify:dist', 'cssmin', "clean:tmp", 'file-creator:dist_config']);
    grunt.registerTask('watcher', ['dev', 'watch']);

    grunt.registerTask('default', ['dev']);

};