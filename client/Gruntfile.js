module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    hostname: '*',
                    port: 8080,
                    base: '.',
                    open: {
                        target: '127.0.0.1:8080'
                    }
                }
            }
        },      
        uglify: {
            dist: {
                files: { 
                    'app.js': ['app/**/*.module.js', 'app/**/*.js'] }
            },
            options: {
                beautify: false,
                mangle: true
            }
        },
        watch: {
            scripts: {
                files: ['app/**/*.js'],
                tasks: ['uglify']
            }
        }
    });

    grunt.registerTask('default', ['uglify', 'watch']);
    grunt.registerTask('serve', ['connect:server', 'uglify', 'watch']);
};
