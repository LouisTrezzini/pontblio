var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var mainBowerFiles = require('main-bower-files');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var webserver = require('gulp-webserver');
var replace = require('gulp-replace');

var production = !!gutil.env.production;

gulp.task('build-less', function() {
    var vendorsFiles = mainBowerFiles();
    var appFiles = [
        'resources/front/less/bootstrap.less',
        //'public/bower/bootstrap-css-only/css/bootstrap.css',
        'public/bower/quill/dist/quill.base.css',
        'public/bower/quill/dist/quill.snow.css',
    ];
    var files = vendorsFiles.concat(appFiles);
    return gulp
        .src(files)
        .pipe(filter(['**/*.css', '**/*.less']))
        .pipe(replace('screen\\0','screen'))
        .pipe(less())
        .pipe(concat('style.min.css'))
        //.pipe(gulpif(env === 'prod', uglifycss()))
        .pipe(gulp.dest('public/'))
    ;
});

gulp.task('build-js', function() {
    var vendorsFiles = mainBowerFiles();
    var appFiles = [
        production ? 'resources/front/const.heroku.js' : 'resources/front/const.js',
        'resources/front/js/app.js',
        'resources/front/js/*.js',
        'resources/front/js/**/*.js',
        'public/bower/fullcalendar/dist/lang/fr.js',
        'public/bower/textAngular/dist/textAngular-rangy.min.js',
        'public/bower/textAngular/dist/textAngular-sanitize.min.js'
    ];
    var files = ['public/bower/jquery/dist/jquery.js'].concat(vendorsFiles.concat(appFiles));
    return gulp
        .src(files)
        .pipe(filter(['**/*.js']))
        .pipe(concat('app.min.js'))
        //.pipe(gulpif(env === 'prod', uglify()))
        .pipe(gulp.dest('public/'))
    ;
});

gulp.task('lint-js', function() {
    var appFiles = [
        'resources/frontjs/app.js',
        'resources/frontjs/*.js',
        'resources/frontjs/**/*.js',
    ];
    return gulp
        .src(appFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
    ;
});

gulp.task('copy-fonts', function () {
    return gulp.src(mainBowerFiles().concat('public/bower/font-awesome/fonts/*'))
        .pipe(filter(['**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff', '**/*.woff2', '**/*.otf']))
        .pipe(gulp.dest('public/fonts/'));
});

gulp.task('watch', function() {
    gulp.watch(['resources/front/js/**/*.js', 'resources/frontjs/*.js'], ['lint-js', 'build-js']);
    gulp.watch('resources/front/less/*.less', ['build-less']);
});
gulp.task('build', ['build-js', 'build-less', 'copy-fonts']);
gulp.task('start', ['watch']);
gulp.task('default', ['build', 'start']);
