// -*- Mode: js; indent-tabs-mode: nil; c-basic-offset: 4; tab-width: 4 -*-
//
// Copyright 2013 Giovanni Campagna <scampa.giovanni@gmail.com>
//
// my-js-app is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// my-js-app is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program.  If not, see <http://www.gnu.org/licenses/>.

function loadUI(file) {
    file = file || 'main.ui';

    let ui = new Gtk.Builder();
    ui.add_from_file(GLib.build_filenamev([pkg.pkgdatadir,
                                           file]));
    return ui;
}

function loadStyleSheet(file) {
    file = file || 'application.css';

    let provider = new Gtk.CssProvider();
    provider.load_from_path(GLib.build_filenamev([pkg.pkgdatadir,
                                                  file]));
    Gtk.StyleContext.add_provider_for_screen(Gdk.Screen.get_default(),
                                             provider,
                                             Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);
}
