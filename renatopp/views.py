import os
import json
import collections
from flask import abort
from flask import render_template
from flask import url_for
from flask import request
from flask import Response
from renatopp import app



def open_file(name):
    filename = os.path.join(os.path.dirname(__file__), name) 
    return open(filename)


@app.route("/")
def home():
    return render_template('m_home.jinja')

@app.route("/research")
def research():
    return render_template('m_research.jinja')
    
@app.route("/programming")
def programming():
    c = json.load(open_file('collections.json'), object_pairs_hook=collections.OrderedDict)
    
    return render_template('m_programming.jinja', 
        games=c['games'],
        projects=c['projects'],
        others=c['others']
    )

@app.route("/project/<name>")
def project(name=None):
    c = json.load(open_file('collections.json'))

    if name in c['games']:
        p = c['games'][name]
    elif name in c['projects']:
        p = c['projects'][name]
    elif name in c['others']:
        p = c['others'][name]
    else:
        abort(404)

    return render_template('m_project.jinja', project=p)


@app.route("/contact")
def contact():
    return render_template('m_contact.jinja')
