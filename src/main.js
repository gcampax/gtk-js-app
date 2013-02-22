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

pkg.require({ 'GLib': '2.0',
              'Gtk': '3.0',
              'Lang': '1.0',
              'Mainloop': '1.0' });

const Util = imports.util;

const MyApplication = new Lang.Class({
    Name: 'MyApplication',
    Extends: Gtk.Application,

    _init: function() {
        this.parent({ application_id: 'org.example.MyJSApp' });
    },

    vfunc_startup: function() {
        this.parent();

        log(_("My JS Application started"));
    },

    vfunc_activate: function() {
        let builder = Util.loadUI('main.ui');

        let win = builder.get_object('main-window');
        win.application = this;

        win.show();
    },
});

function main(argv) {
    pkg.initGettext();
    pkg.initFormat();

    return (new MyApplication()).run(argv);
}
