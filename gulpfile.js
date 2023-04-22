const { src, dest, watch, parallel, series } = require('gulp');


// Plugins connection
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');



// JS Task
function scripts() {
    return src([
        'src/scripts/index.js',
    ])
        .pipe(concat('index.min.js'))
        .pipe(uglify())
        .pipe(dest('src/scripts'))
        .pipe(browserSync.stream())
}

// CSS Task
function styles() {
    return src('src/scss/styles.scss')
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
        .pipe(concat('styles.min.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(dest('src/css'))
        .pipe(browserSync.stream())
};

// Task to monitor changes
function watching() {
    watch(['src/scss/styles.scss'], styles)
    watch(['src/scripts/index.js'], scripts)
    watch(['src/**/*.html']).on('change', browserSync.reload)
}

// Browser window update task
function browsersync() {
    browserSync.init({
        server: {
            baseDir: "src/"
        }
    });
}

// Collecting files in the dist folder
function building() {
    return src([
        'src/css/styles.min.css',
        'src/scripts/index.min.js',
        'src/**/*.html'
    ], { base: 'app' })
        .pipe(dest('dist'))
}

// Delete dir task
function cleanDist() {
    return src('dist')
        .pipe(clean())
}

// Task export
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;

exports.build = series(cleanDist, building);
// Task default export
exports.default = parallel(styles, scripts, browsersync, watching);