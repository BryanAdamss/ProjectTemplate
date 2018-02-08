//导入工具包 require('node_modules里对应模块')
//本地安装gulp所用到的地方
var gulp = require('gulp'),
    //编译sass
    sass = require('gulp-sass'),
    // 编译less
    less = require('gulp-less'),
    //postcss和autoprefixer
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    //js压缩
    uglify = require('gulp-uglify'),
    //css压缩
    cssmin = require('gulp-clean-css'),
    //图片压缩
    tinypng = require('gulp-tinypng'),
    //用来只压缩修改过的图片
    cache = require('gulp-cache'),
    //自动刷新
    browserSync = require('browser-sync').create(),
    //雪碧图
    Emilia = require('emilia'),
    sprite = new Emilia({
        src: ['src/css/**/*.css'],
        dest: 'dist/css/',
        output: 'dist/img/',
        cssPath: '../img/',
        prefix: 'sprite-',
        algorithm: 'top-down',
        padding: 2,
        unit: 'px'
    }),
    //按顺序执行gulp任务,默认gulp的任务是异步执行的
    gulpSequence = require('gulp-sequence'),
    //html引入
    htmlImport = require('gulp-html-import');

// 定义一个编译sass任务,编译完成并传给browser-sync
gulp.task('sass-c', function() {
    //编译src/sass下的.scss,不编译子文件夹内的.scss；**代表搜索当前路径下的所有文件夹(包括子孙文件夹)，*代表只搜索子文件夹
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css')).pipe(browserSync.stream());
});

// 定义一个编译less任务,编译完成并传给browser-sync
gulp.task('less-c', function() {
    //编译src/less下一级目录中的.less,不编译子文件夹内的.less
    return gulp.src('src/less/*/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css')).pipe(browserSync.stream());
});

// css-prefix
gulp.task('css-prefix', function() {
    //autoprefixer
    var processors = [autoprefixer({
        browsers: ['android>=4.0', 'ios>=7.0', 'ie>=8', '> 1% in CN']
    })];
    return gulp.src('src/css/**/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('src/css'));
});

//雪碧图,只合并css中bg和bg-image中图片带?__icon的
gulp.task('css-sprite', function() {
    return sprite.run();
});

//压缩css
gulp.task('css-min', function() {
    return gulp.src('dist/css/**/*.css')
        .pipe(cssmin({ compatibility: 'ie8' }))
        .pipe(gulp.dest('dist/css'));
});

//压缩图片,压缩dist中的sprite-*.png雪碧图和src中非雪碧图,带有_sp的为雪碧图,不带_sp的为非雪碧图,非雪碧图需压缩并保存到dist/img中
gulp.task('img-min', function() {
    return gulp.src(['dist/img/sprite-*.{jpg,png}', 'src/img/*.{jpg,png}', '!src/img/*_sp.{jpg,png}'])
    //参数为tinypng的授权key,利用cache压缩只修改过的图片
        .pipe(cache(tinypng('vEMkpXIEqlJaMsh8xgi0D3VnaFxIobA8')))
        .pipe(gulp.dest('dist/img'));
});

//压缩js
gulp.task('js-min', function() {
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

//导入html
gulp.task('html-import', function() {
    return gulp.src('src/html/*.html')
        .pipe(htmlImport('src/html/include/'))
        .pipe(gulp.dest('src/'));
});

//拷贝src下的.html到dist下
gulp.task('html-copy', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist/'))
});

//定义一个sass监视任务
gulp.task('watch-sass', function() {
    gulp.watch('src/sass/**/*.scss', ['sass-c']);
});

//定义一个less监视任务
gulp.task('watch-less', function() {
    gulp.watch('src/less/*/*.less', ['less-c']);
});

//定义一个htmlImport监视任务
gulp.task('watch-htmlImport', function() {
    gulp.watch('src/html/**/*.html', ['html-import']);
});

//发布css任务,编译->加前缀->雪碧图->压缩
gulp.task('public-css', gulpSequence('sass-c','less-c', 'css-prefix', 'css-sprite', 'css-min'));

//发布html,先导入,再拷贝
gulp.task('public-html', gulpSequence('html-import', 'html-copy'));

//统一发布
gulp.task('public-all', gulpSequence('js-min', 'public-css', 'img-min', 'public-html'));

//自动刷新
gulp.task('serve', ['sass-c','less-c'], function() {
    browserSync.init({
        proxy: {
            target: "localhost:2332",
        },
        ui: false,
        port: 2333
    });
    //启动服务后，监视sass、less、html变动
    gulp.watch("src/sass/**/*.scss", ['sass-c']);
    gulp.watch("src/less/*/*.less", ['less-c']);
    gulp.watch('src/html/**/*.html', ['html-import']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});
