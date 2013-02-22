AC_INIT([my-js-app], [0.1])

AC_CONFIG_MACRO_DIR([m4])
AC_CONFIG_HEADERS([config.h])

AM_INIT_AUTOMAKE([1.11 foreign -Wno-portability tar-ustar dist-xz])
AM_SILENT_RULES([yes])

LT_INIT([disable-static])
IT_PROG_INTLTOOL([0.26])

LIBGD_INIT([header-bar notification revealer stack tagged-entry gir])

GLIB_GSETTINGS
GOBJECT_INTROSPECTION_REQUIRE([1.0])

AC_PATH_PROG(GJS, [gjs])

AC_OUTPUT([
Makefile
data/Makefile
data/my-js-app.desktop.in
libgd/Makefile
src/Makefile
src/my-js-app
po/Makefile.in
])
