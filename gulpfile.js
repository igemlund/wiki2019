const gulp         = require('gulp');
const browserSync  = require('browser-sync');
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const jquery       = require('jquery');

const config = {
   teamName: 'Lund',
};


// Build Tasks
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

gulp.task('pages', function() {
    return gulp.src(['app/pages/*.html'])
        .pipe(gulp.dest("build/"))
        .pipe(browserSync.stream());
});

gulp.task('assets', () => {
  return gulp.src(['app/assets/*'])
    .pipe(gulp.dest('build/'))
});

gulp.task('scripts', () => {
  return gulp.src('app/bundle.js')
    .pipe(gulp.dest('build/'));
});

// Watch Tasks
gulp.task('sync-pages', ['pages'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('sync-scripts', ['scripts'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('sync-assets', ['assets'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('browser-sync', ['build'], () => {
  browserSync.init({
    //startPath: `/Team:${config.teamName}`,
    server: {
      baseDir: 'build/',
      serveStaticOptions: {
        extensions: ['html', 'css', 'min.css', 'js', 'min.js']
      },
     // middleware: (req,res,next) => {
     //   // Reroute wiki url to directory in dist
     //   req.url = req.url.replace(/^\/Team:[^/]+/, '/pages');
     //   req.url = req.url.replace(/^\/File:/, `/assets/`);
     //   return next();
     // },
    },
    ghostMode: false,
  });
});

gulp.task('watch', ['build', 'browser-sync'], () => {
   gulp.watch('app/pages/*.html', ['sync-pages']);
   gulp.watch('app/*.js', ['sync-scripts']);
   gulp.watch('app/assets/*', ['sync-assets']);
   gulp.watch('app/scss/*.scss', ['sass']);
 });

// Watch & Serve
gulp.task('serve', ['pages', 'assets', 'scripts','sass']);

// Default Task
gulp.task('build', ['pages', 'assets', 'scripts', 'sass']);

gulp.task('default', ['serve', 'watch']);
