## Process this file with automake to produce Makefile.in

## Created by Anjuta

jsdir = $(pkgdatadir)
dist_js_DATA = \
	main.js \
	util.js	\
	window.js

nodist_bin_SCRIPTS = my-js-app

EXTRA_DIST = my-js-app.in

uninstall-local:
	-rm -r $(jsdir)

DISTCLEANFILES = my-js-app

include $(top_srcdir)/git.mk
