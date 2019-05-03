
import os

import pandas as pd

import sqlalchemy
from sqlalchemy import create_engine


from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import psycopg2


app = Flask(__name__)


#################################################
# Route Setup
#################################################


@app.route("/")
def index():
    """Return the homepage."""
    print("Server received request for 'Home' page...")
    return render_template("index.html")


# @app.route("/enrollment")
# def enrollment():
#     conn = psycopg2.connect(host="localhost",database="schools_db", user="postgres", password="postgres")
#     cur = conn.cursor()

#     enroll_data = []
    
#     cur.execute("SELECT * FROM district_enrollment")
#     for row in cur:
#         print(row)
#         enroll_data.append(row)

#     cur.close()
#     conn.close()

#     return jsonify(enroll_data)

@app.route("/enrollment/<district_id>")
def enrollment(district_id):
    conn = psycopg2.connect(host="localhost",database="schools_db", user="postgres", password="postgres")
    cur = conn.cursor()

    enroll_data = {}
    
    cur.execute("SELECT * FROM district_enrollment")
    ELL_percent = []
    IEP_percent = []
    teacher_ratio = []

    for row in cur:
        print(row)

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


@app.route("/district_ids")
def names():
    conn = psycopg2.connect(host="localhost",database="schools_db", user="postgres", password="postgres")
    cur = conn.cursor()

    district_ids = {}

    cur.execute("SELECT * FROM district_enrollment")

    district_name = []

    for row in cur:
        print(row[0])
        district_name.append(row[0])

    district_ids["district_ids"] = district_name

    return jsonify(district_ids)


if __name__ == "__main__":
    app.run(debug=True)
