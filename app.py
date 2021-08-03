from flask import Flask, Response, request
import json
import sqlite3
import pandas as pd
from datetime import datetime, date
from config import CONFIG

app = Flask(__name__)

conn = sqlite3.connect(CONFIG['db']['file'])
c = conn.cursor()
c.execute("CREATE TABLE IF NOT EXISTS meals (timestamp datetime, name text, calories int);")
c.execute("CREATE TABLE IF NOT EXISTS weights (timestamp datetime, weight int);")
conn.commit()

@app.route("/")
def index():
    return Response(open("index.html").read(), content_type="text/html")

@app.route("/analytics.html")
def analytics():
    return Response(open("analytics.html").read(), content_type="text/html")

@app.route("/css/<file>")
def css(file):
    return Response(open(f"css/{file}").read(), content_type="text/css")

@app.route("/js/<file>")
def js(file):
    return Response(open(f"js/{file}").read(), content_type="text/javascript")

@app.route("/favicon.svg")
def favicon():
    return Response(open("favicon.svg").read(), content_type="image/svg+xml")

@app.route("/api/meal", methods=['POST'])
def addMeal():
    req_dict = json.loads(request.data)
    if req_dict['calories'] == "":
        return ""
    conn = sqlite3.connect("data.sqlite3")
    c = conn.cursor()
    c.execute("INSERT INTO meals (timestamp, name, calories) VALUES (?, ?, ?);", (datetime.now().isoformat(), req_dict['name'], req_dict['calories']))
    conn.commit()
    return ""

@app.route("/api/weight", methods=["POST"])
def addWeight():
    req_dict = json.loads(request.data)
    conn = sqlite3.connect("data.sqlite3")
    c = conn.cursor()
    c.execute("INSERT INTO weights (timestamp, weight) VALUES (?, ?);", (datetime.now().isoformat(), req_dict['weight']))
    conn.commit()
    return ""

@app.route("/api/meal", methods=['GET'])
def getMeals():
    conn = sqlite3.connect("data.sqlite3")
    df = pd.read_sql("SELECT * FROM meals;", conn)
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df.set_index("timestamp")
    df = df.resample('D').sum()
    df["timestamp"] = df.index
    resp_text = df.to_json(orient="records")
    return Response(resp_text, content_type="application/json")

@app.route("/api/weight", methods=['GET'])
def getWeights():
    conn = sqlite3.connect("data.sqlite3")
    df = pd.read_sql("SELECT * FROM weights;", conn)
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df.set_index("timestamp")
    df = df.resample('D').mean()
    df["timestamp"] = df.index
    resp_text = df.to_json(orient="records")
    return Response(resp_text, content_type="application/json")

app.run(debug=True, host="0.0.0.0")