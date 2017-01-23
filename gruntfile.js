'use strict';
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.initConfig({
        nodemon: {
            dev: {
                script: './index.js',
                callback: function(nodemon) {
                    nodemon.on('log', function(event) {
                        console.log(event.colour);
                    });
                },
                env: {},
                cwd: __dirname,
                ext: 'js',
                watch: [ 'routes', 'modules', 'app.js', 'index.js' ],
                delay: 1000,
                legacyWatch: true
            }
        }
    });
    grunt.registerTask('default', [ 'nodemon' ]);
};
