'use strict';

const nodemon = require('gulp-nodemon');
const sources = ['*.js', 'app/**/*.js', 'app/*.js', 'config/passport.js', '!gulpfile.js', '!node_modules/'];
const jscs = require('gulp-jscs');
const jshint = require('gulp-jshint');
const gulp = require('gulp');

// code style checker to prevent mess
gulp.task('jscs', () => {
  return gulp.src(sources)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('lint', () => {
  return gulp.src(sources)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// precommit to prevent ugly, non functional code from being committed
gulp.task('precommit', ['jscs', 'lint'],() => {
    return;
});

gulp.task('default', ['jscs', 'lint'], () => {
  nodemon({
    script: 'server.js', ext: 'js html', env: { NODE_ENV: 'development' },
  });
});
