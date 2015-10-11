#!/bin/bash

set -x
set -e

XDG_SDK=org.gnome.Sdk
XDG_RUNTIME=org.gnome.Platform
XDG_SDK_VERSION=master
XDG_BRANCH=$(git name-rev HEAD --name-only)

AC_INIT=$(autoconf -t AC_INIT:'$%' configure.ac)
PACKAGE_NAME=$(echo $AC_INIT | cut -d':' -f1)
PACKAGE_TARNAME=$(echo $AC_INIT | cut -d':' -f4)
PACKAGE_VERSION=$(echo $AC_INIT | cut -d':' -f2)

# usage:
# xdg-app-bundle.sh --sdk org.gnome.Sdk/3.18 -e entrypoint -- --configure --args

args=$(getopt -n "$0" -o +e: -l sdk:,runtime:,entry: -- "$@")
eval set -- $args

while true ; do
    case "$1" in
        --sdk)
            XDG_SDK=$(echo $2 | cut -f1 -d'/')
            XDG_SDK_VERSION=$(echo $2 | cut -f2 -d'/')
            shift 2
            ;;

        --runtime)
            XDG_RUNTIME=$2
            shift 2
            ;;

        -e|--entry)
            XDG_ENTRY=$2
            shift 2
            ;;

        --)
            shift
            break
            ;;
    esac
done

XDG_COMMAND=/app/share/${PACKAGE_NAME}/${PACKAGE_NAME}${XDG_ENTRY:+.$XDG_ENTRY}

# everything else is a configure argument now

rm -fR ./_xdg-app
rm -fR ./_xdg-build
mkdir -p ./_xdg-build
test -d ./_xdg-repo || (mkdir -p ./_xdg-repo ; ostree init --mode=archive-z2 --repo=./_xdg-repo)
xdg-app build-init ./_xdg-app ${PACKAGE_NAME} ${XDG_SDK} ${XDG_RUNTIME} ${XDG_SDK_VERSION}
(cd ./_xdg-build ;
xdg-app build ../_xdg-app bash -c '../autogen.sh "$@" --prefix=/app' "$@" ;
xdg-app build ../_xdg-app make $MAKEFLAGS all ;
xdg-app build ../_xdg-app make install )
xdg-app build ./_xdg-app ./xdg-app-postprocess.sh
xdg-app build-finish --command=${XDG_COMMAND} --socket=wayland ${XDG_SHARE_OPTS} ./_xdg-app
xdg-app build-export --subject="Official build of ${PACKAGE_NAME}" --body "Generated at $(date)"$'\n'"${PACKAGE_TARNAME}: ${PACKAGE_VERSION}" ./_xdg-repo ./_xdg-app ${XDG_BRANCH}
test -n "$GPG_KEYID" && ostree --repo=./_xdg-repo gpg-sign app/${PACKAGE_NAME}/$(uname -m)/${XDG_BRANCH} ${GPG_KEYID}

echo "Success!"
