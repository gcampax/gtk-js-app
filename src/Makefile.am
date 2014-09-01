NULL =

appdir = $(pkgdatadir)
nodist_app_SCRIPTS = com.example.Gtk.JSApplication

app_resource_files = $(shell $(GLIB_COMPILE_RESOURCES) --sourcedir=$(srcdir) --generate-dependencies $(srcdir)/com.example.Gtk.JSApplication.src.gresource.xml)
com.example.Gtk.JSApplication.src.gresource: com.example.Gtk.JSApplication.src.gresource.xml $(app_resource_files)
	$(AM_V_GEN) $(GLIB_COMPILE_RESOURCES) --target=$@ --sourcedir=$(srcdir) $<

resourcedir = $(pkgdatadir)
resource_DATA = com.example.Gtk.JSApplication.src.gresource

com.example.Gtk.JSApplication: com.example.Gtk.JSApplication.in
	$(AM_V_GEN) sed \
		-e "s|[@]GJS@|$(GJS)|g" \
		-e "s|[@]PACKAGE_VERSION@|$(PACKAGE_VERSION)|g" \
		-e "s|[@]prefix@|$(prefix)|g" \
		-e "s|[@]libdir@|$(libdir)|g" \
		-e "s|[@]pkgdatadir@|$(pkgdatadir)|g" \
		$< > $@
	@chmod +x $@

EXTRA_DIST = \
	com.example.Gtk.JSApplication.in \
	com.example.Gtk.JSApplication.src.gresource.xml \
	$(app_resource_files) \
	$(service_resource_files) \
	$(NULL)

CLEANFILES = \
	com.example.Gtk.JSApplication \
	com.example.Gtk.JSApplication.src.gresource \
	$(NULL)

install-exec-hook:
	$(MKDIR_P) $(DESTDIR)$(bindir)
	ln -sf $(appdir)/com.example.Gtk.JSApplication $(DESTDIR)$(bindir)/$(PACKAGE_TARNAME)
uninstall-hook:
	-rm -f $(DESTDIR)$(bindir)/$(PACKAGE_TARNAME)

-include $(top_srcdir)/git.mk
