#!/bin/sh

rm -rf /app/include
rm -rf /app/lib/pkgconfig
rm -rf /app/share/pkgconfig
rm -rf /app/share/aclocal
rm -rf /app/share/gtk-doc
rm -rf /app/share/man
rm -rf /app/share/info
rm -rf /app/share/devhelp
rm -rf /app/share/vala/vapi
find /app/lib -name *.a | xargs -r rm
find /app -name *.la | xargs -r rm
find /app -name *.pyo | xargs -r rm
find /app -name *.pyc | xargs -r rm

find /app -type f | xargs file | grep ELF | grep 'not stripped' | cut -d: -f1 | xargs -r -n 1 strip

