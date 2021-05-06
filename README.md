About My JS Application
=======================

My JS Application, as the name suggests, is nothing but an
application written in JS. It installs, and it runs.
It's meant as an example of the GNOME application platform,
and in particular Gtk and the Gjs package system.

It should also work as a template for developing a real
application, ie. one that does something, without spending
all the time doing build system configuration.

Features
========

My JS Application most of the familiar UI you'd expect
from a core application: it has a main window with a header
bar, it has a search bar and it has multiple page stack.

On the developer side, the most prominent feature is
that My JS Application runs uninstalled with a special
Meson target. You should be able to run
```
meson _build
meson compile -C _build devel
```
and everything should just work, without having to run `ninja install`.

Also, it features an util module, which deals with
GtkBuilder and GtkCssProvider, again providing
transparency between the installed and not installed cases.

License
=======

The package is under a 3-clause BSD license, to
make it suitable for inclusion in any application.
