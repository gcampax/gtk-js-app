NULL =

nodist_bin_SCRIPTS = $(PACKAGE_TARNAME)
nodist_pkgdata_SCRIPTS = $(PACKAGE_NAME)

resource_files = $(shell $(GLIB_COMPILE_RESOURCES) --sourcedir=$(srcdir) --generate-dependencies $(srcdir)/$(PACKAGE_NAME).src.gresource.xml)
$(PACKAGE_NAME).src.gresource: $(PACKAGE_NAME).src.gresource.xml $(resource_files)
	$(AM_V_GEN) $(GLIB_COMPILE_RESOURCES) --target=$@ --sourcedir=$(srcdir) $<

resourcedir = $(pkgdatadir)
resource_DATA = $(PACKAGE_NAME).src.gresource

EXTRA_SCRIPTS = com.example.Gtk.JSApplication gtk-js-app

# Legacy, until we can depend on package.js provided by gjs
jsdir = $(pkgdatadir)
dist_js_DATA = package.js

$(PACKAGE_TARNAME): $(PACKAGE_TARNAME).in
	$(AM_V_GEN) sed \
		-e "s|[@]GJS@|$(GJS)|g" \
		-e "s|[@]PACKAGE_NAME@|$(PACKAGE_NAME)|g" \
		-e "s|[@]PACKAGE_VERSION@|$(PACKAGE_VERSION)|g" \
		-e "s|[@]prefix@|$(prefix)|g" \
		-e "s|[@]libdir@|$(libdir)|g" \
		-e "s|[@]pkgdatadir@|$(pkgdatadir)|g" \
		$< > $@
	@chmod +x $@

$(PACKAGE_NAME): $(PACKAGE_NAME).in
	$(AM_V_GEN) sed \
		-e "s|[@]GJS@|$(GJS)|g" \
		-e "s|[@]PACKAGE_NAME@|$(PACKAGE_NAME)|g" \
		-e "s|[@]PACKAGE_VERSION@|$(PACKAGE_VERSION)|g" \
		-e "s|[@]prefix@|$(prefix)|g" \
		-e "s|[@]libdir@|$(libdir)|g" \
		-e "s|[@]pkgdatadir@|$(pkgdatadir)|g" \
		$< > $@
	@chmod +x $@

EXTRA_DIST = \
	$(PACKAGE_NAME).in \
	$(PACKAGE_TARNAME).in \
	$(PACKAGE_NAME).src.gresource.xml \
	$(resource_files) \
	$(NULL)

CLEANFILES = \
	$(PACKAGE_NAME) \
	$(PACKAGE_TARNAME) \
	$(PACKAGE_NAME).src.gresource \
	$(NULL)

-include $(top_srcdir)/git.mk
