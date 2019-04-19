const gulp         = require('gulp');
const browserSync  = require('browser-sync').create();
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const tocbot       = require('tocbot');
const jquery       = require('jquery');


// Compile Sass & Inject Into Browser
gulp.task('sass', function() {
    return gulp.src(['app/scss/*.scss'])
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("build/css"))
        .pipe(browserSync.stream());
});


// Watch Sass & Serve
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "./build"  
    });

    gulp.watch(['app/scss/*.scss'], ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
    gulp.watch("app/*.js").on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['serve']);
