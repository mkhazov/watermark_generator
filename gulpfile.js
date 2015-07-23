var gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    php = require('gulp-connect-php'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    gulpif = require('gulp-if'),
    filter = require('gulp-filter'),
    size = require('gulp-size'),
    imagemin = require('gulp-imagemin'),
    minifyCss = require('gulp-minify-css'),
    gutil = require('gulp-util'),
    args = require('yargs').argv,
    ftp = require('vinyl-ftp');


// Задача по умолчанию
gulp.task('default', ['server', 'watch']);

// Запуск сервера
gulp.task('server', ['php', 'sass', 'bower'], function () {
    browserSync.init({
        proxy: '127.0.0.1:8010',
        port: 3000,
        open: true,
        notify: false,
    });
});

// PHP
gulp.task('php', function() {
    php.server({
        base: 'app',
        port: 8010,
        keepalive: true
    });
});

// ==================== Локальная разработка проекта в app ====================

// Подключаем ссылки на bower components
gulp.task('bower', function () {
    gulp.src('app/index.php')
        .pipe(wiredep({
            directory: 'app/bower'
        }))
        .pipe(gulp.dest('app'));
});

// Работа с scss
gulp.task('sass', function () {
    gulp.src('app/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/css'));
});

// Работа с css
gulp.task('css', function () {
    gulp.src('app/css/*.css')
        .pipe(browserSync.stream());
});

// Работа с js
gulp.task('js', function () {
    gulp.src('app/js/*.js')
        .pipe(browserSync.stream());
});

// Слежка
gulp.task('watch', function () {
    gulp.watch('bower.json', ['bower']);
    gulp.watch(['app/*.php'], reload);
    gulp.watch(['app/scss/*.scss'], ['sass']);
    gulp.watch(['app/index.php']).on('change', reload);
    gulp.watch(['app/css/*.css'], ['css']);
    gulp.watch(['app/js/*.js'], ['js']);
});


// ==================== Сборка проекта ===================

// Предварительная очистка папки dist
gulp.task('clean', function () {
    return gulp.src('dist')
        .pipe(clean());
});

// Перенос файлов в dist
gulp.task('useref', function () {
    var assets = useref.assets();
    return gulp.src('app/index.php')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss({compatibility: 'ie8'})))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

// Перенос шрифтов
gulp.task('fonts', function () {
    return gulp.src('app/fonts/*')
        .pipe(filter(['*.eot', '*.svg', '*.ttf', '*.woff', '*.woff2']))
        .pipe(gulp.dest('dist/fonts/'));
});

// Перенос и оптимизация картинок
gulp.task('images', function () {
    return gulp.src('app/img/**/*')
        .pipe(imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/img'));
});

// php файлы
gulp.task('php-files', function () {
    gulp.src([
        'app/languages/**/*'
    ]).pipe(gulp.dest('dist/languages'));
    gulp.src([
        'app/vendor/**/*'
    ]).pipe(gulp.dest('dist/vendor'));
    gulp.src([
        'app/classes/**/*'
    ]).pipe(gulp.dest('dist/classes'));
});

// Остальные файлы, такие как favicon.ico и пр.
gulp.task('extras', function () {
    return gulp.src([
        'app/*.*',
        '!app/index.php'
    ]).pipe(gulp.dest('dist'));
});

// Сборка и вывод размера содержимого папки dist
gulp.task('dist', ['useref', 'images', 'fonts', 'php-files', 'extras'], function () {
    return gulp.src('dist/**/*')
        .pipe(size({title: 'build'}));
});

// Собираем папку DIST
gulp.task('build', ['clean'], function () {
    gulp.start('dist');
});

// PHP
gulp.task('php-dist', function() {
    php.server({
        base: 'dist',
        port: 8020,
        keepalive: true
    });
});

// Запуск сервера для проверки сборки
gulp.task('server-dist', ['php-dist'], function () {
    browserSync.init({
        proxy: '127.0.0.1:8020',
        port: 9000,
        open: true,
        notify: false,
    });
});


// ==================== Отправка проекта на сервер ====================

gulp.task('deploy', function () {
    var conn = ftp.create({
        host:     'lshw2.kvasyuk.com',
        user:     'ch26175_ls',
        password: args.password,
        parallel: 10,
        log: gutil.log
    });

    var globs = [
        'dist/**/*'
    ];

    return gulp.src(globs, { base: 'dist/', buffer: false })
        .pipe(conn.dest('lshw2/public_html/lshw3/'));
});


// ==================== Функции ====================

// Более наглядный вывод ошибок
var log = function (error) {
    console.log([
        '',
        '----------ERROR MESSAGE START----------',
        ('[' + error.name + ' in ' + error.plugin + ']'),
        error.message,
        '----------ERROR MESSAGE END----------',
        ''
    ].join('\n'));
    this.end();
};
