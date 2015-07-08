var gulp = require("gulp"),
  wiredep = require('wiredep').stream,
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    useref = require('gulp-useref'),    
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    gulpif = require('gulp-if'),
    filter = require('gulp-filter'),
    size = require('gulp-size'),
    imagemin = require('gulp-imagemin'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
  gutil = require('gulp-util'),
  args = require ('yargs').argv,
  ftp = require('vinyl-ftp');



// +++++++++++++++++Локальная разработка проекта в APP+++++++++++++++++

// Подключаем ссыллки на bowercomponents
gulp.task('bower', function () {
  gulp.src('app/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('app'));
});


// Работа с scss
gulp.task('sass', function () {
    gulp.src('app/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());

});




gulp.task('browser-sync',['sass','bower'], function() {
    browserSync.init({
        server: {
            baseDir: "app"
        }
    });
});




// Работа с html
gulp.task('html', function () {
    gulp.src('app/*.html')
    .pipe(browserSync.stream());
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
    gulp.watch(['app/scss/*.scss'], ['sass'], browserSync.reload);
    gulp.watch(['app/*.html'], ['html'], browserSync.reload);
    gulp.watch(['app/css/*.css'], ['css'], browserSync.reload);
    gulp.watch(['app/js/*.js'], ['js']), browserSync.reload;    
});
// Задача по­умолчанию
gulp.task('default', ['watch','browser-sync']);



// +++++++++++++++++++Сборка проекта+++++++++++++++++++

// Переноска файлов APP в DIST

// Предварительная очистка папки DIST

gulp.task('clean',function(){
    return gulp.src('dist')
    .pipe(clean());
});


// Перенос файлов в DIST

gulp.task('useref',['sass'], function(){
    var assets = useref.assets();
    return gulp.src('app/*html')
    .pipe(assets)
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css',minifyCss({compatibility:'ie8'})))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

// Перенос шрифтов
gulp.task('fonts', function() {
  gulp.src('app/fonts/*')
    .pipe(filter(['*.eot','*.svg','*.ttf','*.woff','*.woff2']))
    .pipe(gulp.dest('dist/fonts/'))
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


// Остальные файлы, такие как favicon.ico и пр.
gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ]).pipe(gulp.dest('dist'));
});

// Сборка и вывод размера содержимого папки dist
gulp.task('dist', ['useref', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe(size({title: 'build'}));
});

// Собираем папку DIST
gulp.task('build', ['clean'], function () {
  gulp.start('dist');
});



gulp.task('browser-sync-dist', function() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
});


// ====================================================
// ====================================================
// ===================== Функции ======================

// Более наглядный вывод ошибок
var log = function (error) {
  console.log([
    '',
    "----------ERROR MESSAGE START----------",
    ("[" + error.name + " in " + error.plugin + "]"),
    error.message,
    "----------ERROR MESSAGE END----------",
    ''
  ].join('\n'));
  this.end();
}


// ====================================================
// ====================================================
// ===== Отправка проекта на сервер ===================

gulp.task( 'deploy', function() {

  var conn = ftp.create( {
      host:     'lshw2.kvasyuk.com',
      user:     'ch26175_ls',
      password: args.password,
      parallel: 10,
      log: gutil.log
  } );

  var globs = [
      'dist/**/*'
  ];

  return gulp.src(globs, { base: 'dist/', buffer: false })
    .pipe(conn.dest( 'lshw2/public_html/lshw3/'));

});