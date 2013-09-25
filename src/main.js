// -*- Mode: js; indent-tabs-mode: nil; c-basic-offset: 4; tab-width: 4 -*-
//
// Copyright (c) 2013 Giovanni Campagna <scampa.giovanni@gmail.com>
//
// Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//   * Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//   * Neither the name of the GNOME Foundation nor the
//     names of its contributors may be used to endorse or promote products
//     derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

pkg.initSubmodule('libgd');
pkg.initGettext();
pkg.initFormat();
pkg.initResources();
pkg.require({ 'Gd': '1.0',
              'Gdk': '3.0',
              'Gio': '2.0',
              'GLib': '2.0',
              'GObject': '2.0',
              'Gtk': '3.0' });

const Gd = imports.gi.Gd;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

const Util = imports.util;
const Window = imports.window;

function initEnvironment() {
    window.getApp = function() {
        return Gio.Application.get_default();
    };
}

const MyApplication = new Lang.Class({
    Name: 'MyApplication',
    Extends: Gtk.Application,

    _init: function() {
        this.parent({ application_id: pkg.name,
                      flags: pkg.appFlags });
        if (this.flags & Gio.ApplicationFlags.IS_SERVICE)
            this.inactivity_timeout = 60000;

        GLib.set_application_name(_("My JS Application"));
    },

    _onQuit: function() {
        this.quit();
    },

    _initAppMenu: function() {
        let builder = new Gtk.Builder();
        builder.add_from_resource('/com/example/Gtk/JSApplication/app-menu.ui');

        let menu = builder.get_object('app-menu');
        this.set_app_menu(menu);
    },

    vfunc_startup: function() {
        this.parent();
        Gd.ensure_types();

        Util.loadStyleSheet('/com/example/Gtk/JSApplication/application.css');

        Util.initActions(this,
                         [{ name: 'quit',
                            activate: this._onQuit }]);
        this._initAppMenu();

        log(_("My JS Application started"));
    },

    vfunc_activate: function() {
        (new Window.MainWindow({ application: this })).show();
    },

    vfunc_shutdown: function() {
        log(_("My JS Application exiting"));

        this.parent();
    }
});

function main(argv) {
    initEnvironment();

    return (new MyApplication()).run(argv);
}
