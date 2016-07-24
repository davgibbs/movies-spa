////'use strict';

var gulp        = require('gulp');
var browserSync = require('browser-sync');

gulp.task('default', function() {
    browserSync.init({
        notify: false,
        proxy: "localhost:8000"
    });
    gulp.watch(['./**/*.{scss,css,html,py,js}'], browserSync.reload);
});

// https://dezoito.github.io/2016/01/06/django-automate-browsersync.html




