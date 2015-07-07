var gulp        = require('gulp'),
    wiredep     = require('wiredep').stream;
    sass        = require('gulp-sass'),
    clean       = require('gulp-clean'),
    useref      = require('gulp-useref'),
    gulpif      = require('gulp-if'),
    uglify      = require('gulp-uglify'),
    concatCss   = require('gulp-concat-css'),
    minifyCss   = require('gulp-minify-css'),
    imagemin    = require('gulp-imagemin'),
    size        = require('gulp-size'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload;


// Default task
gulp.task('default', ['sass', 'server', 'watch']);

// Run server
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: './app'
        }
    });
});

// Watch
gulp.task('watch', function () {
    gulp.watch('./app/css/**/*.scss', ['sass', reload]);
    gulp.watch([
        './app/*.html',
        './app/js/*.js'
    ], reload);
    gulp.watch('bower.json', ['bower']);
});

// Sass
gulp.task('sass', function () {
  gulp.src('./app/css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'));
});

// Bower (wiredep)
gulp.task('bower', function () {
  gulp.src('./app/*.html')
    .pipe(wiredep({
      directory: "app/bower"
    }))
    .pipe(gulp.dest('./app'));
});


// ====================================================
// ================= Build dist ======================

// Clean dist
gulp.task('clean', function () {
    return gulp.src('dist')
        .pipe(clean({force: true}));
});

// Place optimized html, css and js to dist
gulp.task('useref', function () {
    var assets = useref.assets();
    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss({compatibility: 'ie8'})))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

// Place fonts to dist
gulp.task('fonts', function() {
    gulp.src('app/fonts/*')
        .pipe(gulp.dest('dist/fonts/'));
});

// Images
gulp.task('images', function () {
    return gulp.src('app/img/**/*')
    .pipe(imagemin({
        progressive: true,
        interlaced: true
    }))
    .pipe(gulp.dest('dist/img'));
});

// Other files from app root
gulp.task('extras', function () {
    return gulp.src([
        'app/*.*',
        '!app/*.html'
    ]).pipe(gulp.dest('dist'));
});

// Build dist
gulp.task('dist', ['useref', 'images', 'fonts', 'extras'], function () {
    return gulp.src('dist/**/*')
        .pipe(size({title: 'dist'}));
});

// Clean and build dist
gulp.task('build', ['clean'], function () {
    gulp.start('dist');
});

// Run server
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: './app'
        }
    });
});

// Run server to check dist
gulp.task('server-dist', function () {  
    browserSync.init({
        notify: false,
        port: 9000,
        server: {
          baseDir: './dist'
        }
    });
});
