module.exports = function(grunt) {
        'use strict';

        // Project configuration.
        grunt.initConfig({
                concat: {
                        options: {
                                separator: "\n",
                        },
                        dist: {
                                src: ['src/biomart_visualization.js', 'src/graph.js'],
                                dest: 'dist/biomart_network.js'
                        }
                }
        })


        grunt.loadNpmTasks('grunt-contrib-concat');
};