// -*- Mode: js; indent-tabs-mode: nil; c-basic-offset: 4; tab-width: 4 -*-
// SPDX-License-Identifier: BSD-3-Clause
// SPDX-FileCopyrightText: 2013 Giovanni Campagna <scampa.giovanni@gmail.com>

/* exported main */

pkg.initGettext();
pkg.require({
    'Gdk': '3.0',
    'Gio': '2.0',
    'GLib': '2.0',
    'GObject': '2.0',
    'Gtk': '3.0',
});

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;

const Util = imports.util;
const Window = imports.window;

function initEnvironment() {
    globalThis.getApp = function () {
        return Gio.Application.get_default();
    };
}

const MyApplication = GObject.registerClass(class MyApplication extends Gtk.Application {
    _init() {
        super._init({application_id: pkg.name});

        GLib.set_application_name(_("My JS Application"));
    }

    _onQuit() {
        this.quit();
    }

    _initAppMenu() {
        let builder = new Gtk.Builder();
        builder.add_from_resource('/com/example/Gtk/JSApplication/app-menu.ui');

        let menu = builder.get_object('app-menu');
        this.set_app_menu(menu);
    }

    vfunc_startup() {
        super.vfunc_startup();

        Util.loadStyleSheet('/com/example/Gtk/JSApplication/application.css');

        Util.initActions(this, [{
            name: 'quit',
            activate: this._onQuit,
        }]);
        this._initAppMenu();

        log(_("My JS Application started"));
    }

    vfunc_activate() {
        new Window.MainWindow({application: this}).show();
    }

    vfunc_shutdown() {
        log(_("My JS Application exiting"));

        super.vfunc_shutdown();
    }
});

function main(argv) {
    initEnvironment();

    return new MyApplication().run(argv);
}
