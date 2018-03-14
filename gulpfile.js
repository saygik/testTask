
var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    node;
var inject = require('gulp-inject');
var babel = require("gulp-babel");

var paths = {
    src: 'src/*',
    srcHTML: 'src/views/*.html',
    srcCSS: 'src/**/*.css',
    srcJS: 'src/js/*.js',
    dist: 'dist',
    distIndex: 'dist/views/index.html',
    distDetail: 'dist/views/details.html',
    distHTML: 'dist/views/',
    distCSS: 'dist/css/',
    distJS: 'dist/js/',
};
gulp.task('scripts', function() {
    return gulp.src([
        './node_modules/jquery/dist/jquery.min.js',
        './node_modules/moment/min/moment.min.js',
        './node_modules/fullcalendar/dist/fullcalendar.min.js',
        './node_modules/aws-sdk/dist/aws-sdk.min.js',
        './node_modules/react/umd/react.production.min.js',
        './node_modules/react-dom/umd/react-dom.production.min.js',

    ])
        .pipe(gulp.dest(paths.distJS));
});

gulp.task('html', function () {
    return gulp.src(paths.srcHTML)
        .pipe(gulp.dest(paths.distHTML));

});
gulp.task('js', function () {
    return gulp.src(paths.srcJS)
        .pipe(babel({
            presets: ['es2015','react']
        }))
        .pipe(gulp.dest(paths.distJS));
});
gulp.task('css', function () {
    return gulp.src('./node_modules/fullcalendar/dist/fullcalendar.css').pipe(gulp.dest(paths.distCSS));
});

gulp.task('copy', ['html', 'css', 'js','scripts']);


gulp.task('inject1',['copy'] , function () {
    var css = gulp.src([paths.distCSS +'*.css'], {read: false});
    var js = gulp.src([paths.distJS +'jquery.min.js',
        paths.distJS +'moment.min.js',
        paths.distJS +'fullcalendar.min.js',
        paths.distJS + 'aws-sdk.min.js'], {read: false});
    return gulp.src(paths.distIndex)
        .pipe(inject( css, { relative:false } ))
        .pipe(inject( js, { relative:false } ))
        .pipe(gulp.dest(paths.distHTML));
});

gulp.task('inject2',['inject1'], function () {
    var js = gulp.src([paths.distJS + 'react.production.min.js',
                       paths.distJS + 'react-dom.production.min.js',
                       paths.distJS + 'aws-sdk.min.js'], {read: false});
    return gulp.src(paths.distDetail)
        .pipe(inject( js, { relative:false } ))
        .pipe(gulp.dest(paths.distHTML));
});

gulp.task('inject', ['inject2']);

/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', function() {
    if (node) node.kill()
    node = spawn('node', ['./src/main.js'], {stdio: 'inherit'})
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
})

/**
 * $ gulp
 * description: start the development environment
 */
gulp.task('default', function() {
    gulp.run('server')

    gulp.watch(['./src/*.js', './lib/**/*.js'], function() {
        gulp.run('server')
    })

})

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill()
})
