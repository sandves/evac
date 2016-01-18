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
                    base: "client/wwwroot",
                    open: {
                        target: "127.0.0.1:8080"
                    }
                }
            }
        },      
        uglify: {
            dist: {
                files: { 'client/wwwroot/app.js': ['client/Scripts/**/*.js'] }
            },
            options: {
                beautify: true,
                mangle: false
            }
        },
        watch: {
            scripts: {
                files: ['client/Scripts/**/*.js'],
                tasks: ['uglify']
            }
        }
    });

    grunt.registerTask('default', ['connect:server', 'uglify', 'watch']);
};
