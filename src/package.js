// Copyright 2012 Giovanni Campagna
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

/**
 * This module provides a set of convenience APIs for building packaged
 * applications.
 */

const GLib = imports.gi.GLib;
const GIRepository = imports.gi.GIRepository;
const Gio = imports.gi.Gio;
const System = imports.system;

const Gettext = imports.gettext;

/*< public >*/
var name;
var version;
var appFlags;
var prefix;
var datadir;
var libdir;
var pkgdatadir;
var pkglibdir;
var moduledir;
var localedir;

/*< private >*/
let _base;
let _requires;

function _runningFromSource() {
    let fileName = System.programInvocationName;
    let prgName = GLib.path_get_basename(fileName);

    let binary = Gio.File.new_for_path(fileName);
    let sourceBinary = Gio.File.new_for_path('./src/' + prgName);
    return binary.equal(sourceBinary);
}

/**
 * init:
 * @params: package parameters
 *
 * Initialize directories and global variables. Must be called
 * before any of other API in Package is used.
 * @params must be an object with at least the following keys:
 *  - name: the package name ($(PACKAGE_NAME) in autotools)
 *  - version: the package version
 *  - prefix: the installation prefix
 *
 * init() will take care to check if the program is running from
 * the source directory or not, by looking for a 'src' directory.
 *
 * At the end, the global variable 'pkg' will contain the
 * Package module (imports.package). Additionally, the following
 * module variables will be available:
 *  - name, version: same as in @params
 *  - prefix: the installation prefix (as passed in @params)
 *  - datadir, libdir: the final datadir and libdir when installed;
 *                     usually, these would be prefix + '/share' and
 *                     and prefix + '/lib' (or '/lib64')
 *  - pkgdatadir: the directory to look for private data files, such as
 *                images, stylesheets and UI definitions;
 *                this will be datadir + name when installed and
 *                './data' when running from the source tree
 *  - pkglibdir: the directory to look for private typelibs and C
 *               libraries;
 *               this will be libdir + name when installed and
 *               './lib' when running from the source tree
 *  - moduledir: the directory to look for JS modules;
 *               this will be pkglibdir when installed and
 *               './src' when running from the source tree
 *  - localedir: the directory containing gettext translation files;
 *               this will be datadir + '/locale' when installed
 *               and './po' in the source tree
 *
 * All paths are absolute and will not end with '/'.
 *
 * As a side effect, init() calls GLib.set_prgname().
 */
function init(params) {
    window.pkg = imports.package;
    name = params.name;
    version = params.version;
    appFlags = params.flags;

    // Must call it first, because it can only be called
    // once, and other library calls might have it as a
    // side effect
    GLib.set_prgname(name);

    prefix = params.prefix;
    libdir = params.libdir;
    datadir = GLib.build_filenamev([prefix, 'share']);
    let libpath, girpath;

    if (_runningFromSource()) {
        log('Running from source tree, using local files');
        // Running from source directory
        _base = GLib.get_current_dir();
        pkglibdir = GLib.build_filenamev([_base, 'lib']);
        libpath = GLib.build_filenamev([pkglibdir, '.libs']);
        girpath = pkglibdir;
        pkgdatadir = GLib.build_filenamev([_base, 'data']);
        localedir = GLib.build_filenamev([_base, 'po']);
        moduledir = GLib.build_filenamev([_base, 'src']);
    } else {
	appFlags |= Gio.ApplicationFlags.IS_SERVICE;

        _base = prefix;
        pkglibdir = GLib.build_filenamev([libdir, name]);
        libpath = pkglibdir;
        girpath = GLib.build_filenamev([pkglibdir, 'girepository-1.0']);
        pkgdatadir = GLib.build_filenamev([datadir, name]);
        localedir = GLib.build_filenamev([datadir, 'locale']);
        moduledir = pkgdatadir;
    }

    imports.searchPath.unshift(moduledir);
    GIRepository.Repository.prepend_search_path(girpath);
    GIRepository.Repository.prepend_library_path(libpath);
}

/**
 * start:
 * @params: see init()
 *
 * This is a convenience function if your package has a
 * single entry point.
 * You must define a main(ARGV) function inside a main.js
 * module in moduledir.
 */
function start(params, args) {
    params.flags = params.flags || 0;
    args = args || ARGV;
    init(params);

    return imports.main.main(args);
}

function _checkVersion(required, current) {
    if (required == '') {
        // No requirement
        return true;
    }

    // Major version must match, it's used for API
    // incompatible changes.
    // The rest just needs to be less or equal to
    // current. The code is generic, but gjs modules
    // should use only [major, minor]
    if (required[0] != current[0])
        return false;

    for (let i = 1; i < Math.min(current.length, required.length); i++) {
        if (required[i] > current[i])
            return false;
        if (required[i] < current[i])
            return true;

        // else they're equal, go on
    }

    return true;
}

/**
 * require:
 * @libs: the external dependencies to import
 *
 * Mark a dependency on a specific version of one or more
 * external GI typelibs.
 * @libs must be an object whose keys are a typelib name,
 * and values are the respective version. The empty string
 * indicates any version.
 */
function require(libs) {
    _requires = libs;

    for (let l in libs) {
        let version = libs[l];

        if (version != '')
            imports.gi.versions[l] = version;

        try {
            imports.gi[l];
        } catch(e) {
            printerr('Unsatisfied dependency: ' + e.message);
            System.exit(1);
        }
    }
}

function dumpRequires() {
    print(JSON.stringify(_requires));
}

function initGettext() {
    Gettext.bindtextdomain(name, localedir);
    Gettext.textdomain(name);

    let gettext = imports.gettext;
    window._ = gettext.gettext;
    window.C_ = gettext.pgettext;
    window.N_ = function(x) { return x; }
}

function initFormat() {
    let format = imports.format;
    String.prototype.format = format.format;
}

function initSubmodule(name) {
    if (moduledir != pkgdatadir) {
        // Running from source tree, add './name' to search paths

        let submoduledir = GLib.build_filenamev([_base, name]);
        let libpath = GLib.build_filenamev([submoduledir, '.libs']);
        GIRepository.Repository.prepend_search_path(submoduledir);
        GIRepository.Repository.prepend_library_path(libpath);
    } else {
        // Running installed, submodule is in $(pkglibdir), nothing to do
    }
}

function initResources() {
    let resource = Gio.Resource.load(GLib.build_filenamev([pkg.pkgdatadir,
                                                           pkg.name + '.gresource']));
    resource._register();
}

// Launcher support

function _launcherUsage(flags) {
    print('Usage:');

    let name = GLib.path_get_basename(System.programInvocationName);
    if (flags & Gio.ApplicationFlags.HANDLES_OPEN)
	print('  ' + name + ' [OPTION...] [FILE...]\n');
    else
	print('  ' + name + ' [OPTION...]\n');

    print('Options:');
    print('  -h, --help   Show this help message');
    print('  --version    Show the application version');
}

function _parseLaunchArgs(args, params) {
    let newArgs = [];

    for (let i = 0; i < args.length; i++) {
	switch (args[i]) {
	case '--':
	    newArgs.concat(args.slice(i));
	    return newArgs;

	case '--help':
	case '-h':
	    _launcherUsage(params.flags);
	    System.exit(0);
	    break;

	case '--version':
	    print(params.name + ' ' + params.version);
	    System.exit(0);
	    break;

	default:
	    newArgs.push(args[i]);
	}
    }

    return newArgs;
}

function launch(params) {
    params.flags = params.flags || 0;
    let args = _parseLaunchArgs(ARGV, params);

    if (_runningFromSource()) {
	return start(params, args);
    } else {
	params.flags |= Gio.ApplicationFlags.IS_LAUNCHER;

	let app = new Gio.Application({ application_id: params.name,
					flags: params.flags });
	return app.run(args);
    }
}
