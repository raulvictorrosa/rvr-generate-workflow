/*globals module, require*/
/*jslint devel: true*/
module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    /*
     * Project:   <%= pkg.name %>
     * Homepage:  <%= pkg.homepage %>
     * Autor:     <%= pkg.author.nome %> <<%= pkg.author.email %>>
     * Autor URL: <%= pkg.author.url %>
     * Version:   <%= pkg.version %>
     * License    <%= pkg.license %>
     */


    // wp config variables
    dbname:   'manos_site', // Name from Data Base
    dbuser:   'root', // User from Data Base
    dbpass:   '', // Pass from Data Base
    dbhost:   'localhost', // Host from Data Base
    dbprefix: 'mt_', // Prefix from Data Base

    // Installation variables
    urlToInstall:   'http://localhost/edsa-supermercadomanos.com.br',
    project_name:   'Supermercado Manos', // Name of the Site
    admin_user:     'mutech',
    admin_password: 'P3A7w$)K(xs&3wS$fl',
    admin_email:    'desenvolvimento@mutech.com.br',

    // Directories
    dir: {
      node_modules:     'node_modules', // Path folder node_modules
      mainFolder:       'www', // Path main folder
      content:          '<%= dir.mainFolder %>/wp-content', // Path folder wp-content
      themes:           '<%= dir.content %>/themes', // Path folder themes
    },

    // Run some commands on terminal
    shell: {
      wpCli: { //Download wp-cli.phar
        command: [
          'curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar',
          'php wp-cli.phar --info'
        ].join('&&')
      },
      wpCoreDownload: { // Uses wp-cli.phar to download wordpres's archives.
        command: 'php wp-cli.phar core download --locale=pt_BR --path=<%= dir.mainFolder %>',
        options: {
          failOnError: false,
        }
      },
      wpCleanUp: { // Delete some archives and folder from wordpress that will not be used.
        command: [
          //'rm -rf <%= dir.content %>/languages/themes/twenty*',
          'rm -rf <%= dir.content %>/plugins/hello.php',
          'rm -rf <%= dir.themes %>/twenty*',
          'rm -rf <%= dir.mainFolder %>/readme.html'
        ].join('&&')
      },
      wpPlugins: { // Delete some archives and folder from wordpress that will not be used.
        command: [
          'cd www',
          'php ../wp-cli.phar plugin install admin-menu-editor',
          'php ../wp-cli.phar plugin install advanced-custom-fields',
          'php ../wp-cli.phar plugin install contact-form-7',
          'php ../wp-cli.phar plugin install duplicate-post',
          'php ../wp-cli.phar plugin install facebook-comments-plugin',
          'php ../wp-cli.phar plugin install google-analytics-dashboard-for-wp',
          'php ../wp-cli.phar plugin install jetpack',
          'php ../wp-cli.phar plugin install really-simple-captcha',
          'php ../wp-cli.phar plugin install theme-check',
          'php ../wp-cli.phar plugin install tinymce-advanced',
          'php ../wp-cli.phar plugin install wordpress-seo',
          'php ../wp-cli.phar plugin install wp-migrate-db',
          'cd ..',
        ].join('&&'),
        options: {
          failOnError: false,
        }
      },
      wpConfig: { // Delete some archives and folder from wordpress that will not be used.
        command: [
          'cd www',
          'php ../wp-cli.phar core config --dbname=<%= dbname %> --dbuser=<%= dbuser %> --dbpass=<%= dbpass %> --dbhost=<%= dbhost %> --dbprefix=<%= dbprefix %>',

          'php ../wp-cli.phar core install --url="<%= urlToInstall %>" --title="<%= project_name %>" --admin_user="<%= admin_user %>" --admin_password="<%= admin_password %>" --admin_email="<%= admin_email %>"',
          'cd ..',
        ].join('&&'),
        options: {
          failOnError: false,
        }
      },
      folders: { // Some useful folders
        command: [
          'mkdir archives',

          'mkdir data_base',
          'cd data_base',
          'mkdir Live_Site_to_Offline Offline_Site_to_Live_Site'
        ].join('&'),
        options: {
          failOnError: false,
        }
      }
    },

    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5, // maximum number of notifications from jshint output
        title: '<%= project_name %>' // defaults to the name in package.json, or will use project directory's name
      }
    },
    notify: {
      wpInstall: { // Notify when wordpress is installed.
        options: {
          title: '<%= project_name %>:wordpress',
          message: 'Wordpress instalado com sucesso.'
        }
      },
    },
  });

  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('wpCli',          ['shell:wpCli']);
  grunt.registerTask('wpCoreDownload', ['shell:wpCoreDownload']);
  grunt.registerTask('wpCleanUp',      ['shell:wpCleanUp']);
  grunt.registerTask('wpConfig',       ['shell:wpConfig']);
  grunt.registerTask('wpPlugins',      ['shell:wpPlugins']);
  grunt.registerTask('folders',        ['shell:folders']);

  grunt.registerTask('wpInstall',      ['wpCli', 'wpCoreDownload', 'wpCleanUp', 'wpConfig', 'wpPlugins', 'folders', 'notify:wpInstall']);

  grunt.registerTask('default',        ['wpInstall']);
};
