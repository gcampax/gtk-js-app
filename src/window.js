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
// with this program.  If not, see <http://www.gnu.org/licenses/>

// Look ma, no imports!

const MainWindow = new Lang.Class({
    Name: 'MainWindow',
    Extends: Gtk.ApplicationWindow,

    _init: function(params) {
        params = Params.fill(params, { title: GLib.get_application_name(),
                                       default_width: 640,
                                       default_height: 480 });
        this.parent(params);

        let grid = new Gtk.Grid({ orientation: Gtk.Orientation.VERTICAL });
        let header = new Gd.HeaderBar({ title: _("Current page"),
                                        hexpand: true });
        this._search = new Gd.HeaderToggleButton({ symbolic_icon_name: 'edit-find-symbolic' });
        header.pack_end(this._search);
        grid.add(header);

        let searchbar = new SearchBar();
        this._searchEntry = searchbar.entry;
        let revealer = new Gd.Revealer({ child: searchbar,
                                         reveal_child: false,
                                         hexpand: true });
        this._search.bind_property('active',
                                   revealer, 'reveal-child',
                                   GObject.BindingFlags.DEFAULT);
        grid.add(revealer);

        this._view = new MainView();
        this._view.visible_child_name = (Math.random() <= 0.5) ? 'one' : 'two';
        grid.add(this._view);

        this.add(grid);
        grid.show_all();
    }
});

const SearchBar = new Lang.Class({
    Name: 'SearchBar',
    Extends: Gtk.Toolbar,

    _init: function(params) {
        this.parent(params);
        this.get_style_context().add_class(Gtk.STYLE_CLASS_PRIMARY_TOOLBAR);

        this.entry = new Gd.TaggedEntry({ width_request: 500,
                                          halign: Gtk.Align.CENTER });

        let item = new Gtk.ToolItem();
        item.set_expand(true);
        item.add(this.entry);
        this.insert(item, 0);
    }
});

const MainView = new Lang.Class({
    Name: 'MainView',
    Extends: Gd.Stack,

    _init: function(params) {
        params = Params.fill(params, { hexpand: true,
                                       vexpand: true });
        this.parent(params);

        let one = this._addPage('one', _("First page"), _("Nothing here"));
        one.connect('clicked', Lang.bind(this, function() {
            this.visible_child_name = 'two';
        }));

        let two = this._addPage('two', _("Second page"), _("What did you expect?"));
        two.connect('clicked', Lang.bind(this, function() {
            this.visible_child_name = 'one';
        }));
    },

    _addPage: function(name, label, button) {
        let labelWidget = new Gtk.Label({ label: label });
        labelWidget.get_style_context().add_class('big-label');
        let buttonWidget = new Gtk.Button({ label: button });

        let grid = new Gtk.Grid({ orientation: Gtk.Orientation.VERTICAL,
                                  halign: Gtk.Align.CENTER,
                                  valign: Gtk.Align.CENTER });
        grid.add(labelWidget);
        grid.add(buttonWidget);

        this.add_named(grid, name);
        return buttonWidget;
    }
});
