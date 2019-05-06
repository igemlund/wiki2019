const gulp         = require('gulp');
const browserSync  = require('browser-sync');
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const jquery       = require('jquery');
const nunjucksRender = require('gulp-nunjucks-render');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const middleware = require('middleware');


// Build Tasks
gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('app/pages/**/*.+(html|nunjucks)')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['app/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('build/'))
});

gulp.task('sass', function() {
    return gulp.src(['app/scss/*.scss'])
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("build/css"))
        .pipe(browserSync.stream());
});

gulp.task('assets', () => {
  return gulp.src(['app/assets/*'])
    .pipe(gulp.dest('build/'))
});

gulp.task('scripts', function() {
  return browserify('./app/scripts/tocbot.js')
    .bundle()
    .pipe(source('bundle.js')) 
    .pipe(buffer()) 
    .pipe(uglify()) 
    .pipe(gulp.dest('./build/'));
});


// Watch Tasks
gulp.task('sync-pages', ['nunjucks'], (done) => {
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
    startPath: `/Team:Lund`,
    server: {
      baseDir: 'build/',
      serveStaticOptions: {
        extensions: ['html', 'css', 'min.css', 'js', 'min.js']
      },
        middleware: (req,res,next) => {
            // Reroute wiki url to directory in dist
            req.url = req.url.replace(/^\/Team:[^/]+/, '/');
            req.url = req.url.replace(/^\/File:/, `/`);
            return next();
          },

    },
    ghostMode: false,
  });
});

gulp.task('watch', ['build', 'browser-sync'], () => {
   gulp.watch('app/pages/*.html', ['sync-pages']);
   gulp.watch('app/templates/**/*.+(html|nunjucks)', ['sync-pages'])
   gulp.watch('app/*.js', ['sync-scripts']);
   gulp.watch('app/assets/*', ['sync-assets']);
   gulp.watch('app/scss/*.scss', ['sass']);
 });

// Watch & Serve
gulp.task('serve', ['nunjucks', 'assets', 'scripts','sass']);

// Default Task
gulp.task('build', ['nunjucks', 'assets', 'scripts', 'sass']);

gulp.task('default', ['serve', 'watch']);
