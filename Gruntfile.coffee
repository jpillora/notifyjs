fs = require("fs")

#global module:false
module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    banner: 
      "/** <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"yyyy/mm/dd\") %>\n"+
      " * <%= pkg.homepage %>\n" +
      " * Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %> - MIT\n"+
      " */\n"

    coffee:
      options:
        bare: true
      compile:
        expand: true,
        flatten: false,
        cwd: 'src',
        src: ['**/*.coffee'],
        dest: 'dist/',
        ext: '.js'

    wrap: 
      dist: 
        src: 'dist/<%= pkg.name %>.js'
        dest: '.'
        wrapper: [
          "<%= banner %>(function(window,document,$,undefined) {\n"
          "\n}(window,document,jQuery));"
        ]

    concat:
      combined:
        src: ['dist/<%= pkg.name %>.js', 'dist/styles/bootstrap/<%= pkg.name %>-bootstrap.js']
        dest: 'dist/<%= pkg.name %>-combined.js'

    uglify:
      options: 
        stripBanners: true
        banner: '<%= banner %>' 
      
      dist:
        src: "dist/<%= pkg.name %>.js"
        dest: "dist/<%= pkg.name %>.min.js"

      combined:
        src: "dist/<%= pkg.name %>-combined.js"
        dest: "dist/<%= pkg.name %>-combined.min.js"

    watch:
      scripts:
        files: 'src/**/*.coffee'
        tasks: 'default'

  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-wrap"

  # Default task.
  grunt.registerTask "default", "coffee wrap concat uglify".split(' ')
