# I chose to use recursive automake so I can use nobase_ and avoid
# 5 different directory declarations
SUBDIRS = icons

app_resource_files = $(shell $(GLIB_COMPILE_RESOURCES) --sourcedir=$(srcdir) --generate-dependencies $(srcdir)/com.example.Gtk.JSApplication.data.gresource.xml)
com.example.Gtk.JSApplication.data.gresource: com.example.Gtk.JSApplication.data.gresource.xml $(app_resource_files)
	$(AM_V_GEN) $(GLIB_COMPILE_RESOURCES) --target=$@ --sourcedir=$(srcdir) $<

resourcedir = $(pkgdatadir)
resource_DATA = com.example.Gtk.JSApplication.data.gresource 

appsdir = $(datadir)/applications
apps_DATA = com.example.Gtk.JSApplication.desktop

@INTLTOOL_DESKTOP_RULE@

gsettings_SCHEMAS = com.example.Gtk.JSApplication.gschema.xml

@GSETTINGS_RULES@

appstream_XML = com.example.Gtk.JSApplication.appdata.xml

@APPSTREAM_XML_RULES@
@INTLTOOL_XML_RULE@

com.example.Gtk.JSApplication.service: com.example.Gtk.JSApplication.service.in
	$(AM_V_GEN) sed \
		-e "s|[@]PACKAGE_NAME@|$(PACKAGE_NAME)|g" \
		-e "s|[@]pkgdatadir@|$(pkgdatadir)|g" \
		-e "s|[@]pkglibdir@|$(pkglibdir)|g" \
		$< > $@

servicedir = $(datadir)/dbus-1/services
service_DATA = com.example.Gtk.JSApplication.service

EXTRA_DIST = \
	com.example.Gtk.JSApplication.desktop.in \
	com.example.Gtk.JSApplication.service.in \
	com.example.Gtk.JSApplication.data.gresource.xml \
	$(gsettings_SCHEMAS) \
	com.example.Gtk.JSApplication.appdata.xml.in \
	$(app_resource_files) \
	$(NULL)

CLEANFILES = \
	com.example.Gtk.JSApplication.service \
	com.example.Gtk.JSApplication.data.gresource \
	com.example.Gtk.JSApplication.appdata.xml \
	com.example.Gtk.JSApplication.appdata.valid \
	$(apps_DATA) \
	*.valid \
	gschemas.compiled \
	$(NULL)

# For uninstalled use
all-local:
	$(GLIB_COMPILE_SCHEMAS) $(builddir)

-include $(top_srcdir)/git.mk
