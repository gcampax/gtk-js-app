// -*- Mode: js; indent-tabs-mode: nil; c-basic-offset: 4; tab-width: 4 -*-
// SPDX-License-Identifier: BSD-3-Clause
// SPDX-FileCopyrightText: 2013 Giovanni Campagna <scampa.giovanni@gmail.com>

/* exported MainWindow */

const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;

const Util = imports.util;

var MainWindow = GObject.registerClass({
    Template: 'resource:///com/example/Gtk/JSApplication/main.ui',
    Children: ['main-grid', 'main-search-bar', 'main-search-entry',
        'search-active-button'],
    Properties: {'search-active': GObject.ParamSpec.boolean('search-active', '', '', GObject.ParamFlags.READABLE | GObject.ParamFlags.WRITABLE, false)},
}, class MainWindow extends Gtk.ApplicationWindow {
    _init(params) {
        super._init({
            title: GLib.get_application_name(),
            default_width: 640,
            default_height: 480,
            ...params,
        });

        this._searchActive = false;

        Util.initActions(this, [
            {
                name: 'new',
                activate: this._new,
            },
            {
                name: 'about',
                activate: this._about,
            },
            {
                name: 'search-active',
                activate: this._toggleSearch,
                parameter_type: new GLib.VariantType('b'),
                state: new GLib.Variant('b', false),
            },
        ]);

        this.bind_property('search-active', this.search_active_button, 'active',
            GObject.BindingFlags.SYNC_CREATE |
                           GObject.BindingFlags.BIDIRECTIONAL);
        this.bind_property('search-active', this.main_search_bar, 'search-mode-enabled',
            GObject.BindingFlags.SYNC_CREATE |
                           GObject.BindingFlags.BIDIRECTIONAL);
        this.main_search_bar.connect_entry(this.main_search_entry);

        this._view = new MainView();
        this._view.visible_child_name = Math.random() <= 0.5 ? 'one' : 'two';
        this.main_grid.add(this._view);
        this.main_grid.show_all();

        // Due to limitations of gobject-introspection wrt GdkEvent and GdkEventKey,
        // this needs to be a signal handler
        this.connect('key-press-event', this._handleKeyPress.bind(this));
    }

    get search_active() {
        return this._searchActive;
    }

    set search_active(v) {
        if (this._searchActive === v)
            return;

        this._searchActive = v;
        // do something with v
        this.notify('search-active');
    }

    _handleKeyPress(self, event) {
        return this.main_search_bar.handle_event(event);
    }

    _new() {
        log(_("New something"));
    }

    _about() {
        let aboutDialog = new Gtk.AboutDialog({
            authors: ['Giovanni Campagna <gcampagna@src.gnome.org>'],
            translator_credits: _("translator-credits"),
            program_name: _("JS Application"),
            comments: _("Demo JS Application and template"),
            copyright: 'Copyright 2013 The gjs developers',
            license_type: Gtk.License.GPL_2_0,
            logo_icon_name: 'com.example.Gtk.JSApplication',
            version: pkg.version,
            website: 'http://www.example.com/gtk-js-app/',
            wrap_license: true,
            modal: true,
            transient_for: this,
        });

        aboutDialog.show();
        aboutDialog.connect('response', function () {
            aboutDialog.destroy();
        });
    }
});

const MainView = GObject.registerClass(class MainView extends Gtk.Stack {
    _init(params) {
        super._init({
            hexpand: true,
            vexpand: true,
            ...params,
        });

        this._settings = Util.getSettings(pkg.name);

        this._buttonOne = this._addPage('one', _("First page"), '');
        this._buttonOne.connect('clicked', () => {
            this.visible_child_name = 'two';
        });
        this._syncLabel();
        this._settings.connect('changed::show-exclamation-mark', this._syncLabel.bind(this));

        let two = this._addPage('two', _("Second page"), _("What did you expect?"));
        two.connect('clicked', () => {
            this.visible_child_name = 'one';
        });
    }

    _addPage(name, label, button) {
        let labelWidget = new Gtk.Label({label});
        labelWidget.get_style_context().add_class('big-label');
        let buttonWidget = new Gtk.Button({label: button});

        let grid = new Gtk.Grid({
            orientation: Gtk.Orientation.VERTICAL,
            halign: Gtk.Align.CENTER,
            valign: Gtk.Align.CENTER,
        });
        grid.add(labelWidget);
        grid.add(buttonWidget);

        this.add_named(grid, name);
        return buttonWidget;
    }

    _syncLabel() {
        if (this._settings.get_boolean('show-exclamation-mark'))
            this._buttonOne.label = _("Hello, world!");
        else
            this._buttonOne.label = _("Hello world");
    }
});
