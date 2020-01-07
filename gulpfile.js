var gulp = require ('gulp');
var merge = require ('gulp-merge-json');
var protractor = require ('gulp-protractor').protractor;
var exec = require ('child_process').exec;
var args = require ('yargs').argv;
var batchLocation = `${process.cwd ()}/helpers/closeBrowser.bat`;
var tag = args.tag || '@e2e_testing';

var url = args.url || 'http://hailuaairline.azurewebsites.net/';

// Run automation test
gulp.task ('test', function () {
  return gulp
    .src ([])
    .pipe (
      protractor ({
        configFile: 'config/protractor.conf.js',
        args: ['--cucumberOpts.tags', tag, '--baseUrl', url],
      })
    )
    .on ('error', function (e) {
      console.log (e);
    });
});

gulp.task ('mergeJson', function () {
  return gulp
    .src ('.tmp/json-output-folder/*.json')
    .pipe (
      merge ({
        startObj: [],
        concatArrays: true,
      })
    )
    .pipe (gulp.dest ('.tmp/json-output-folder/test_result'));
});

// Generate xml report from result test json file
gulp.task ('report', ['mergeJson'], function () {
  return gulp
    .src ('.tmp/json-output-folder/test_result/*.json')
    .pipe (cucumberXmlReport ({strict: true}))
    .pipe (gulp.dest ('.tmp/json-output-folder/test_result'));
});

function cucumberXmlReport (opts) {
  var gutil = require ('gulp-util'),
    through = require ('through2'),
    cucumberJunit = require ('./lib/cucumber_junit2');

  return through.obj (function (file, enc, cb) {
    // If tests are executed against multiple browsers/devices
    var suffix = file.path.match (/\/(.*)\.json/);
    if (suffix) {
      opts.prefix = suffix[1] + ';';
    }

    var xml = cucumberJunit (file.contents, opts);
    file.contents = new Buffer.from (xml);
    file.path = gutil.replaceExtension (file.path, '.xml');
    cb (null, file);
    console.log ('XML report has been generated at: ' + file.path);
  });
}

// Close browser drivers
gulp.task ('task', function (cb) {
  console.log ('file path at:' + batchLocation);
  exec (batchLocation, function (err, stdout, stderr) {
    console.log (stdout);
  });
});
