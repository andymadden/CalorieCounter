import sqlite3
from datetime import datetime

data_weight = [{
    'timestamp': '2021-07-01',
    'weight': 167
}, {
    'timestamp': '2021-07-02',
    'weight': 169
}, {
    'timestamp': '2021-07-03',
    'weight': 166
}, {
    'timestamp': '2021-07-04',
    'weight': 167
}, {
    'timestamp': '2021-07-05',
    'weight': 165
}, {
    'timestamp': '2021-07-06',
    'weight': 164
}, {
    'timestamp': '2021-07-07',
    'weight': 164
}, {
    'timestamp': '2021-07-08',
    'weight': 162
}, {
    'timestamp': '2021-07-09',
    'weight': 161
}, {
    'timestamp': '2021-07-10',
    'weight': 160
}, {
    'timestamp': '2021-07-11',
    'weight': 160
}]

data_meal = [{
    'timestamp': '2021-07-01',
    'calories': 2100
}, {
    'timestamp': '2021-07-02',
    'calories': 2110
}, {
    'timestamp': '2021-07-03',
    'calories': 2140
}, {
    'timestamp': '2021-07-04',
    'calories': 2120
}, {
    'timestamp': '2021-07-05',
    'calories': 1900
}, {
    'timestamp': '2021-07-06',
    'calories': 1950
}, {
    'timestamp': '2021-07-07',
    'calories': 1900
}, {
    'timestamp': '2021-07-08',
    'calories': 1500
}, {
    'timestamp': '2021-07-09',
    'calories': 1800
}, {
    'timestamp': '2021-07-10',
    'calories': 1820
}, {
    'timestamp': '2021-07-11',
    'calories': 1830
}]
conn = sqlite3.connect("data.sqlite3")

c = conn.cursor()

for data_weight, data_meal in zip(data_weight, data_meal):
    c.execute(
        "INSERT INTO meals (timestamp, name, calories) VALUES (?, ?, ?);",
        (datetime.strptime(data_meal['timestamp'], '%Y-%m-%d').isoformat(),
         'SPAM', data_meal['calories']))
    c.execute(
        "INSERT INTO weights (timestamp, weight) VALUES (?, ?);",
        (datetime.strptime(data_weight['timestamp'],
                           '%Y-%m-%d').isoformat(), data_weight['weight']))

conn.commit()
