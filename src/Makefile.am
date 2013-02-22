## Process this file with automake to produce Makefile.in

## Created by Anjuta

jsdir = $(pkgdatadir)
dist_js_DATA = \
	main.js \
	util.js

nodist_bin_SCRIPTS = my-js-app

EXTRA_DIST = my-js-app.in

uninstall-local:
	-rm -r $(jsdir)

my-js-app: my-js-app.in
	$(AM_V_GEN) sed						\
		-e "s|[@]GJS@|$(GJS)|g"				\
		-e "s|[@]PACKAGE_NAME@|$(PACKAGE_NAME)|g"	\
		-e "s|[@]PACKAGE_VERSION@|$(PACKAGE_VERSION)|g" \
		-e "s|[@]prefix@|$(prefix)|g"			\
		$< > $@ ;
	@chmod +x $@

CLEANFILES = my-js-app

include $(top_srcdir)/git.mk
