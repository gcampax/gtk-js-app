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
