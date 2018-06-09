var gulp = require('gulp');
var server = require("gulp-webserver");
var fs = require('fs');
var path = require('path');
var sass = require('gulp-sass');
var md5 = require('gulp-rev');
var minhtml = require('gulp-htmlmin');
var rev = require('gulp-rev-collector');
var citydata = require('./mock/city');

gulp.task('server', function() {
    gulp.src('dist')
        .pipe(server({
            port: 6060,
            open: true,
            host: "localhost",
            livereload: true,
            middleware: function(req, res, next) {
                if (req.url === "/favicon.ico") {
                    return;
                }
                var pathname = require('url').parse(req.url, true).pathname;
                pathname = pathname === "/" ? "/index.html" : pathname;
                if (pathname === "/api/city") {
                    res.end(JSON.stringify(citydata));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, "src", pathname)))
                }
            }
        }))
});
gulp.task('sass', function() {
    gulp.watch('src/scss/style.scss', function() {
        gulp.src('src/scss/style.scss')
            .pipe(sass())
            .pipe(gulp.dest('src/css'))
    })
});
gulp.task('md5', function() {
    gulp.src('src/js/*.js')
        .pipe(md5())
        .pipe(gulp.dest('dist/js'))
        .pipe(md5.manifest())
        .pipe(gulp.dest('view/js'));
    gulp.src('src/css/*.css')
        .pipe(md5())
        .pipe(gulp.dest('dist/css'))
        .pipe(md5.manifest())
        .pipe(gulp.dest('view/css'))
    gulp.src('src/*.html')
        .pipe(minhtml({
            collapseWhitespace: true, //压缩HTML
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))
        .pipe(gulp.dest('dist'));
    gulp.src(['view/js/rev-manifest.json', 'dist/*.html'])
        .pipe(rev({
            replaceReved: true
        }))
        .pipe(gulp.dest('dist'));
    gulp.src(['view/css/rev-manifest.json', 'dist/*.html'])
        .pipe(rev({
            replaceReved: true
        }))
        .pipe(gulp.dest('dist'));
});
gulp.task('default', ['sass', 'server']);