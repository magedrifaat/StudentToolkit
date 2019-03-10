from flask import Flask, flash, redirect, render_template, request, url_for, jsonify
import requests
from urllib.parse import urlencode, quote_plus

# configure application
app = Flask(__name__)

# ensure responses aren't cached
if app.config["DEBUG"]:
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/spell")
def spell():
    return render_template("spell.html")

@app.route("/grammar")
def grammar():
    return render_template("grammar.html")

@app.route("/vocab")
def vocab():
    return render_template("vocab.html")

@app.route("/search")
def search():
    # forming the request to the Oxford Dicionary API
    if request.args.get("word"):
        word = request.args.get("word")
        app_id = "2e19467e"
        app_key = "c663a8f065bb1250d99d07419ba30612"
        url = "https://od-api.oxforddictionaries.com:443/api/v1/entries/en/" + word
        data = requests.get(url, headers = {'app_id': app_id, 'app_key': app_key})
        return jsonify(data.json())

@app.route("/eqsolver")
def eqsolver():
    return render_template("eqsolver.html")

@app.route("/graph")
def graph():
    return render_template("graph.html")

@app.route("/wolfram")
def wolfram():
    if request.args.get("input"):
        # parsing parameters in URL format
        parameters = urlencode(request.args, quote_via=quote_plus)
        addParam = ""
        # get all kinds of solutions for equation solver
        if request.args["includepodid"] == "Solution":
            addParam = "includepodid=ComplexSolution&includepodid=RealSolution&includepodid=IntegerSolution"

        url = "https://api.wolframalpha.com/v2/query?" + parameters + "&appid=7JY73K-2XYX4H2U8T&output=json&" + addParam
        data = requests.get(url)
        return jsonify(data.json())

@app.route("/sources")
def sources():
    return render_template("sources.html")
