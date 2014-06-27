#! /usr/bin/python

from testutil import *

from gi.repository import Gio, GLib

import os, sys
import pyatspi
from dogtail import tree
from dogtail import utils
from dogtail.procedural import *

def active(widget):
    return widget.getState().contains(pyatspi.STATE_ARMED)
def visible(widget):
    return widget.getState().contains(pyatspi.STATE_VISIBLE)

init()
try:
    app = start()
    print "app started"
    assert app is not None

    # test something
finally:
    print "tearing down"
    fini()
