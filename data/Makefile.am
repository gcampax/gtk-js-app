# Process this file with automake to produce Makefile.in

uidir = $(pkgdatadir)
ui_DATA = main.ui

cssdir = $(pkgdatadir)
css_DATA = application.css

appsdir = $(datadir)/applications
apps_DATA = my-js-app.desktop

@INTLTOOL_DESKTOP_RULE@

CLEANFILES = my-js-app.desktop
DISTCLEANFILES = my-js-app.desktop.in

include $(top_srcdir)/git.mk
