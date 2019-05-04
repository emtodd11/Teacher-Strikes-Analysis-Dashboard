# dependencies

import os
import pandas as pd
from flask import Flask, jsonify, render_template
import psycopg2


app = Flask(__name__)


#################################################
# Route Setup
#################################################


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/district_ids")
def names():
    """Return list of district IDs to populate drop down selector"""
    conn = psycopg2.connect(host="localhost",database="teacher_strike_db", user="postgres", password="postgres")
    cur = conn.cursor()

    district_ids = {}

    cur.execute("SELECT * FROM district_enrollment")

    district_name = []

    for row in cur:
        print(row[0])
        district_name.append(row[0])

    district_ids["district_ids"] = district_name

    return jsonify(district_ids)


@app.route("/enrollment/<district_id>")
def enrollment(district_id):
    """Return enrollment data points for each district"""
    conn = psycopg2.connect(host="localhost",database="teacher_strike_db", user="postgres", password="postgres")
    cur = conn.cursor()

    enroll_data = {}
    
    cur.execute("SELECT * FROM district_enrollment")
    ELL_percent = []
    IEP_percent = []
    teacher_ratio = []

    for row in cur:

        if(row[0] == district_id):
            print(row[0])
            ELL_percent.append(row[5])
            IEP_percent.append(row[6])
            teacher_ratio.append(row[7])

    print(district_id)

    enroll_data["ELL Percent"] = ELL_percent
    enroll_data["IEP Percent"] = IEP_percent
    enroll_data["Student Teacher Ratio"] = teacher_ratio

    cur.close()
    conn.close()

    return jsonify(enroll_data)


@app.route("/funding/<district_id>")
def funding(district_id):
    """Return funding data points for each district"""
    conn = psycopg2.connect(host="localhost",database="teacher_strike_db", user="postgres", password="postgres")
    cur = conn.cursor()

    funding_data = {}
    
    cur.execute("SELECT * FROM district_funding")
    local = []
    state = []
    federal = []


    for row in cur:
        if(row[1] == district_id):
            print(row[4], row[5], row[6])
            local.append(row[4])
            state.append(row[5])
            federal.append(row[6])
    
    print(district_id)
        
    funding_data["local"] = local
    funding_data["state"] = state 
    funding_data["federal"] = federal

    cur.close()
    conn.close()

    return jsonify(funding_data)


@app.route("/testscores/<district_id>")
def testscores(district_id):
    """Return test score data points for each district"""
    conn = psycopg2.connect(host="localhost",database="teacher_strike_db", user="postgres", password="postgres")
    cur = conn.cursor()

    testscore_data = {}
    
    cur.execute("SELECT * FROM district_testscores")

    entity = []
    year = [] 
    test = []
    proficient = []

    for row in cur:
        if(row[0] == district_id):
            print(row[1], row[2], row[3], row[7])
            entity.append(row[1])
            year.append(row[2])
            test.append(row[3])
            proficient.append(row[7])

    print(district_id)

    testscore_data["entity"] = entity
    testscore_data["year"] = year
    testscore_data["test"] = test
    testscore_data["proficient"] = proficient
           
    cur.close()
    conn.close()

    return jsonify(testscore_data)


if __name__ == "__main__":
    app.run(debug=True)
