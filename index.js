'use strict';

/*jshint node: true */
/*global process*/
/**
 * Recipe:
 *
 * Ingredients:
 *
 * References:
 * 	Generating a file per folder
 * 	https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
 *
 */
function eachdir(done) {
	// lazy loading required modules.
	var fs = require('fs'),
		path = require('path'),
		each = require('configurable-gulp-recipe-each');

	var verify = require('configurable-gulp-helper').verifyConfiguration,
		PluginError = require('gulp-util').PluginError;

	var context = this,
		config = context.config;

	var cwd, folders, inject, values, dir;

	if (context.upstream) {
		throw new PluginError('eachdir', 'eachdir stream-processor do not accept up-stream');
	}
	verify(eachdir.schema, config);

	dir = config.dir;
	cwd = process.cwd();
	folders = getFolders(dir);
	if (folders.length === 0) {
		throw new PluginError('eachdir', 'no sub folders found in ' + dir);
	}

	values = folders.map(function (folder) {
		return {
			dir: folder,
			path: path.join(cwd, dir, folder)
		};
	});

	inject = {
		values: values
	};

	context.config = inject;
	return each.call(context, done);

	function getFolders(dir) {
		try {
			return fs.readdirSync(dir).filter(function (file) {
				return fs.statSync(path.join(dir, file)).isDirectory();
			});
		} catch (ex) {
			return [];
		}
	}
}

eachdir.expose = ['dir', 'path'];

eachdir.schema = {
	"title": "eachdir",
	"description": "Performs actions on each sub folder of the specified folder",
	"properties": {
		"dir": {
			"description": ""
		}
	},
	"required": ["dir"]
};

eachdir.type = 'stream';

module.exports = eachdir;