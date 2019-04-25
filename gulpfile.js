var gulp 	= require('gulp'),
  	sass 	= require('gulp-sass'),
  	concat 	= require('gulp-concat'),
  	uglify 	= require('gulp-uglify'),
  	rename 	= require('gulp-rename');

var paths = {
  styles: {
    src: './src/scss/*.scss',
    dest: './src/css/'
  },
};

function styles() {
  return gulp
  	.src(paths.styles.src, {
      sourcemaps: true
    })
	.pipe(sass())
	.pipe(rename({
	  basename: 'main',
	  suffix: '.min'
	}))
.pipe(gulp.dest(paths.styles.dest));
}


function watch() {
  gulp
  	.watch(paths.styles.src, styles);
}

var build = gulp.parallel(styles,  watch);

gulp
  .task(build);
gulp
  .task('default', build);
