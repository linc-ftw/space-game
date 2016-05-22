import gulp from 'gulp';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import runSequence from 'run-sequence';

gulp.task('lint', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError('fail'));
});

gulp.task('compile-js', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('build', function() {
    runSequence(
        'lint',
        'compile-js'
        );
});

gulp.task('default', ['build']);