'use strict';

var packageFile = require('./package.json');
var gulp = require('gulp');

var $ = require('gulp-load-plugins')();
var dir = 'src/js/';

gulp.task('clean', function () { 
    return gulp.src(['dist','build'], { read: false }).pipe($.clean());
}); 

gulp.task('scripts', ['clean'], function() {
  return gulp.src([
               dir + "intro.js",
               dir + "app.js",
               dir + "config/whitelist.js",
               dir + "utils/stringUtils.js",
               dir + "utils/properNoun.js",
               dir + "utils/srt.js",
               dir + "components/ngCaption.js",
               dir + "components/ngProperNoun.js",
               dir + "components/VideoCaption.js",
               dir + "components/ChapterProgress.js",
               dir + "components/ControlBarCaptionBtn.js",
               dir + "components/ngVideoJs.js",
               dir + "outro.js"
             ])
             .pipe($.concat('ngVideoJs.js'))
             .pipe($.uglify())
             .pipe(gulp.dest('dist/' + packageFile.name ));
});

gulp.task('copy', ['clean'],function(){
  return gulp.src('bower.json')
             .pipe(gulp.dest('dist/' + packageFile.name ));
});

gulp.task('default', ['scripts','copy'], function () { 
  return gulp.src("dist/**")
             .pipe($.zip(packageFile.version + '.zip'))
             .pipe(gulp.dest('build/'));
}); 

