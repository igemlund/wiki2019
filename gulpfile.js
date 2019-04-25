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
    return gulp.src(['src/scss/*.scss'])
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

gulp.task('pages', function() {
    return gulp.src(['src/pages/*.html'])
        .pipe(gulp.dest("src/"))
        .pipe(browserSync.stream());
});

gulp.task('assets', () => {
  return gulp.src(['src/assets/*'])
    .pipe(gulp.dest('src/'))
});

gulp.task('scripts', () => {
  return gulp.src('src/bundle.js')
    .pipe(gulp.dest('src/'));
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

gulp.task('browser-sync', ['src'], () => {
  browserSync.init({
    //startPath: `/Team:${config.teamName}`,
    server: {
      baseDir: 'src/',
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

gulp.task('watch', ['src', 'browser-sync'], () => {
   gulp.watch('src/scss/*.scss', ['sass']);
   gulp.watch('src/assets', ['assts']);
 });

// Watch & Serve
gulp.task('serve', ['pages', 'assets', 'scripts','sass']);

// Default Task
gulp.task('src', ['pages', 'assets', 'scripts', 'sass']);

gulp.task('default', ['watch']);
