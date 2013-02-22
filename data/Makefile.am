# Process this file with automake to produce Makefile.in

uidir = $(pkgdatadir)
ui_DATA = main.ui

cssdir = $(pkgdatadir)
css_DATA = application.css

appsdir = $(datadir)/applications
apps_DATA = my-js-app.desktop

my-js-app.desktop.in: my-js-app.desktop.in.in
	$(AM_V_GEN) sed \
		-e "s|[@]GJS@|$(GJS)|g" \
		-e "s|[@]prefix@|$(prefix)|g" \
		-e "s|[@]PACKAGE_NAME@|$(PACKAGE_NAME)|g" \
		-e "s|[@]PACKAGE_VERSION@|$(PACKAGE_VERSION)|g" \
		$< > $@

@INTLTOOL_DESKTOP_RULE@

CLEANFILES = my-js-app.desktop my-js-app.desktop.in

include $(top_srcdir)/git.mk
