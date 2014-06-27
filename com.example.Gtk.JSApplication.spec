Name:		%{_name}
Version:	%{_version}
Release:	1%{?dist}
Summary:	JS Application

License:	BSD
URL:		http://www.example.com/gtk-js-app
Source0:        %{_distdir}-%{version}.tar.xz
BuildArch:      noarch

%description
Demo JS Application and template

%prep
%setup -q -n %{_distdir}-%{version}

%build
%configure --disable-static
make %{?_smp_mflags}

%install
make install DESTDIR=$RPM_BUILD_ROOT
find $RPM_BUILD_ROOT -name '*.la' -exec rm -f {} ';'
rm -fR $RPM_BUILD_ROOT/%{_bindir}
desktop-file-edit $RPM_BUILD_ROOT/%{_datadir}/applications/%{name}.desktop \
    --set-key=X-AppInstall-Package --set-value=%{name}

%find_lang %{name}

%check
desktop-file-validate $RPM_BUILD_ROOT/%{_datadir}/applications/%{name}.desktop

%post
touch --no-create %{_datadir}/icons/hicolor &>/dev/null || :

%postun
if [ $1 -eq 0 ] ; then
    glib-compile-schemas %{_datadir}/glib-2.0/schemas &> /dev/null || :
    touch --no-create %{_datadir}/icons/hicolor &>/dev/null
    gtk-update-icon-cache %{_datadir}/icons/hicolor &>/dev/null || :
fi

%posttrans
glib-compile-schemas %{_datadir}/glib-2.0/schemas &> /dev/null || :
gtk-update-icon-cache %{_datadir}/icons/hicolor &>/dev/null || :

%files -f %{name}.lang
%doc NEWS COPYING
%{_datadir}/appstream/%{name}.appdata.xml
%{_datadir}/applications/%{name}.desktop
%{_datadir}/dbus-1/services/%{name}.service
%{_datadir}/glib-2.0/schemas/%{name}.gschema.xml
#%{_datadir}/icons/hicolor/*/apps/%{name}.png
%{_datadir}/%{name}/
#%{_libdir}/%{name}/
