// -*- Mode: js; indent-tabs-mode: nil; c-basic-offset: 4; tab-width: 4 -*-
// SPDX-License-Identifier: BSD-3-Clause
// SPDX-FileCopyrightText: 2013 Giovanni Campagna <scampa.giovanni@gmail.com>

/* exported arrayEqual, getSettings, initActions, loadStyleSheet, loadIcon,
    loadUI */

const Gdk = imports.gi.Gdk;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const System = imports.system;

function loadUI(resourcePath, objects) {
    let ui = new Gtk.Builder();

    if (objects) {
        for (let o in objects)
            ui.expose_object(o, objects[o]);
    }

    ui.add_from_resource(resourcePath);
    return ui;
}

function loadStyleSheet(resource) {
    let provider = new Gtk.CssProvider();
    provider.load_from_file(Gio.File.new_for_uri(`resource://${resource}`));
    Gtk.StyleContext.add_provider_for_screen(Gdk.Screen.get_default(),
        provider,
        Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);
}

function initActions(actionMap, simpleActionEntries, defaultContext = actionMap) {
    simpleActionEntries.forEach(function (entry) {
        const {
            activate = null,
            change_state = null,
            context = defaultContext,
            ...params
        } = entry;
        const action = new Gio.SimpleAction(params);

        if (activate)
            action.connect('activate', activate.bind(context));
        if (change_state)
            action.connect('change-state', change_state.bind(context));

        actionMap.add_action(action);
    });
}

function arrayEqual(one, two) {
    if (one.length !== two.length)
        return false;

    for (let i = 0; i < one.length; i++) {
        if (one[i] !== two[i])
            return false;
    }

    return true;
}

function getSettings(schemaId, path) {
    const GioSSS = Gio.SettingsSchemaSource;
    let schemaSource;

    if (!pkg.moduledir.startsWith('resource://')) {
        // Running from the source tree
        schemaSource = GioSSS.new_from_directory(pkg.pkgdatadir,
            GioSSS.get_default(),
            false);
    } else {
        schemaSource = GioSSS.get_default();
    }

    let schemaObj = schemaSource.lookup(schemaId, true);
    if (!schemaObj) {
        log(`Missing GSettings schema ${schemaId}`);
        System.exit(1);
    }

    if (path === undefined) {
        return new Gio.Settings({settings_schema: schemaObj});
    } else {
        return new Gio.Settings({
            settings_schema: schemaObj,
            path,
        });
    }
}

function loadIcon(iconName, size) {
    let theme = Gtk.IconTheme.get_default();

    return theme.load_icon(iconName,
        size,
        Gtk.IconLookupFlags.GENERIC_FALLBACK);
}
