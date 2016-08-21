'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const sources = ['*.js', 'app/**/*.js', 'app/*.js', 'config/passport.js', '!gulpfile.js', '!node_modules/'];
const jscs = require('gulp-jscs');

//code style checker to prevent mess
gulp.task('jscs', () => {
  return gulp.src(sources)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('default', ['jscs'], () => {
  nodemon({
    script: 'server.js', ext: 'js html', env: { NODE_ENV: 'development' },
  });
});
