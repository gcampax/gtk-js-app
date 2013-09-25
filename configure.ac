AC_PREREQ(2.63)
AC_INIT([com.example.Gtk.JSApplication], [0.1],
        [bugs@js-app.example.com],
        [gtk-js-app],
        [http://www.example.com/gtk-js-app/])

AC_CONFIG_HEADERS([config.h])
AC_CONFIG_MACRO_DIR([m4])

AM_INIT_AUTOMAKE([1.11 dist-xz no-dist-gzip foreign tar-ustar no-define -Wno-portability])
# revert automake using PACKAGE_TARNAME instead of PACKAGE_NAME
AC_SUBST([PACKAGE], [$PACKAGE_NAME])

PACKAGE_DBUS_PATH=/`echo $PACKAGE_NAME | sed 's,\.,/,g'`
AC_SUBST([PACKAGE_DBUS_PATH], [$PACKAGE_DBUS_PATH])

m4_ifdef([AM_SILENT_RULES], [AM_SILENT_RULES([yes])])

GETTEXT_PACKAGE=$PACKAGE_NAME
AC_SUBST(GETTEXT_PACKAGE)
AC_DEFINE_UNQUOTED(GETTEXT_PACKAGE, "$GETTEXT_PACKAGE",
                   [The prefix for our gettext translation domains.])
IT_PROG_INTLTOOL([0.50.1])

AC_PROG_CC
AM_PROG_CC_C_O
LT_INIT([disable-static])

LIBGD_INIT([main-view gir])

PKG_PROG_PKG_CONFIG([0.22])

GLIB_GSETTINGS
GOBJECT_INTROSPECTION_REQUIRE([1.35.9])

PKG_CHECK_MODULES([DEPS], [gdk-3.0
                           gdk-pixbuf-2.0
                           gio-2.0
                           glib-2.0
                           gobject-2.0
                           gtk+-3.0])

AC_PATH_PROG([GJS],[gjs])

GLIB_COMPILE_RESOURCES=`$PKG_CONFIG --variable glib_compile_resources gio-2.0`
AC_SUBST(GLIB_COMPILE_RESOURCES)

AC_OUTPUT([
  Makefile
  data/Makefile
  data/icons/Makefile
  libgd/Makefile
  src/Makefile
  po/Makefile.in
])
