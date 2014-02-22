module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            bower_components: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'bower_components/snap.svg/dist/snap.svg.js',
                    dest: '/lib/'
                }]
            }
        },
        jshint: {
            client: ['src/**/*.js']
        },
        watch: {
            sass: {
                files: ['src/sass/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'src/flow/main.css': 'src/sass/main.scss'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['sass']);
}