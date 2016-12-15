var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    minifyJs = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    minifyHTML = require('gulp-minify-html'),
    htmlmin = require('gulp-htmlmin'),
    nodemon = require('gulp-nodemon'),
    cssmin = require('gulp-cssmin'),
    minifyCss = require('gulp-minify-css'),
    jshint = require('gulp-jshint');
    localtunnel = require('localtunnel'),
    psi = require('psi'),
    ngrok = require('ngrok'),
    portLocal = 80,
    browserSync = require('browser-sync').create();

var paths = {
    scripts: 'public/js/**/*.*',
    styles: 'public/css/**/*.*',
    images: 'public/img/**/*.*',
    pages: 'public/views/**/*.ejs',
    index: 'public/index.ejs',
    bower_fonts: 'lib/**/*.{ttf,woff,eof,svg,woff2,eot}'
};

gulp.task('copy-images', function() {
    return gulp.src(paths.images)
      .pipe(gulp.dest('dist/img'));
});

gulp.task('copy-bower_fonts', function() {
    return gulp.src(paths.bower_fonts)
      .pipe(rename({
          dirname: '/fonts'
      }))
      .pipe(gulp.dest('dist/lib'));
});

gulp.task('min_html', function() {
  return gulp.src(paths.pages)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/views'));
});

gulp.task('lint', function() {
    gulp.src(paths.scripts)
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('min_js', function() {
    return gulp.src(paths.scripts)
        .pipe(minifyJs())
        .pipe(concat('package_angular.min.js'))
        .pipe(gulp.dest('dist/lib/js'));
});

gulp.task('usemin', function() {
    return gulp.src(paths.index)
        .pipe(usemin({
            assetsDir:'.',
            html: [minifyHTML(),'concat'],
            js: [minifyJs(), 'concat'],
            css: [minifyCss({keepSpecialComments: 0}), 'concat']
          }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-data', ['copy-bower_fonts','copy-images']);

gulp.task('build', ['copy-data','lint','min_js','usemin','min_html']);

gulp.task('watch', function() {
    gulp.watch([paths.images], ['copy-images']);
    gulp.watch([paths.styles], ['min_css']);
    gulp.watch([paths.index], ['usemin']);
    gulp.watch([paths.pages], ['min_html']);
    gulp.watch([paths.scripts], ['lint','min_js']);
});

gulp.task('min_css', function () {
    gulp.src(paths.styles)
      .pipe(cssmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('dist/css'));
});

gulp.task('nodemon', function() {
    // gulp.task('default');
    nodemon({
      script: 'server.js',
      env: {
        'NODE_ENV': 'development'
      }
    }).on('restart');
});

gulp.task('default', ['build','watch','nodemon']);
