module.exports = function(grunt) {
        'use strict';

        // Project configuration.
        grunt.initConfig({
                concat: {
                        basic: {
                                options: {
                                        separator: "\n",
                                },
                                files: {
                                        'dist/biomart_network.js': ['src/biomart_visualization.js', 'src/graph.js'],
                                        'dist/biomart_network.d3.js': ['lib/d3.js', 'src/biomart_visualization.js', 'src/graph.js']
                                }
                        }
                }
        })

        grunt.loadNpmTasks('grunt-contrib-concat');

        // grunt.registerTask('concat:all', ['concat:'])
};