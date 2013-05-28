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
      " */"

    coffee:
      options:
        bare: true
      compile:
        files:
          'dist/<%= pkg.name %>.js': 'src/<%= pkg.name %>.coffee'

    wrap: 
      dist: 
        src: ['dist/<%= pkg.name %>.js']
        dest: '.'
        wrapper: ["<%= banner %>\n(function(window,document,undefined) {\n","\n}(window,document));"]

    uglify:
      options: 
        stripBanners: true
        banner: '<%= banner %>' 
      
      dist:
        src: "dist/<%= pkg.name %>.js"
        dest: "dist/<%= pkg.name %>.min.js"

    watch:
      scripts:
        files: 'src/*.coffee'
        tasks: 'default'

  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadTasks "./node_modules/grunt-contrib-coffee/tasks"
  grunt.loadNpmTasks "grunt-wrap"

  # Default task.
  grunt.registerTask "default", "coffee wrap uglify".split(' ')
