project('gtk-js-app', 'c',
  version: '1.0.0',
  meson_version: '>= 0.50.0',
)

app_id = 'com.example.Gtk.JSApplication'

gnome = import('gnome')
intl = import('i18n')

GETTEXT_PACKAGE = app_id

app_configuration = configuration_data()

app_configuration.set('GJS', find_program('gjs').path())
app_configuration.set('PACKAGE_NAME', app_id)
app_configuration.set('PACKAGE_VERSION', meson.project_version())
app_configuration.set('prefix', get_option('prefix'))

pkgdatadir = join_paths(get_option('datadir'), app_id)
app_configuration.set('libdir', join_paths(get_option('prefix'), get_option('libdir')))
app_configuration.set('pkgdatadir', pkgdatadir)


subdir('src')
subdir('data')
subdir('po')
meson.add_install_script('meson/meson_post_install.py')
