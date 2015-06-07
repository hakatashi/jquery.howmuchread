'use strict';
module.exports = function (grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time at the end
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed MIT */\n',
    // Task configuration.
    clean: {
      build: ['build/*'],
      dist: ['dist/*']
    },
    coffee: {
      build: {
        options: {
          join: true
        },
        dest: 'build/jquery.<%= pkg.name %>.js',
        src: ['src/*.coffee']
      },
      dist: {
        options: {
          join: true
        },
        dest: 'dist/jquery.<%= pkg.name %>.js',
        src: ['src/*.coffee']
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        preserveComments: 'some'
      },
      dist: {
        src: '<%= coffee.dist.dest %>',
        dest: 'dist/jquery.<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      all: {
        options: {
          urls: ['http://localhost:9000/test/basic.html']
        }
      }
    },
    'saucelabs-qunit': {
      all: {
        options: {
          urls: ['http://localhost:9000/test/basic.html'],
          tunnelTimeout: 5,
          build: process.env.TRAVIS_JOB_ID,
          concurrency: 3,
          browsers: [
            ['Vista', 'internet explorer', 8],
            ['WIN8', 'internet explorer', 10],
            ['WIN8.1', 'internet explorer', 11],
            ['WIN7', 'firefox', ''],
            ['WIN7', 'chrome', ''],
            ['OS X 10.10', 'safari', 8],
          ],
          testname: 'jquery.howmuchread',
          tags: ['master']
        }
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      build: {
        files: 'src/*.coffee',
        tasks: ['build']
      }
    },
    connect: {
      server: {
        options: {
          hostname: '*',
          port: 9000
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['build', 'test']);
  grunt.registerTask('build', ['clean:build', 'coffee:build']);
  grunt.registerTask('dist', ['clean:dist', 'coffee:dist', 'uglify']);
  grunt.registerTask('serve', ['build', 'connect', 'watch']);
  grunt.registerTask('test', ['jshint', 'connect', 'qunit']);
  grunt.registerTask('saucelabs', ['build', 'test', 'saucelabs-qunit']);
};
