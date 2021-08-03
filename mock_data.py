#%%
import sqlite3
import pandas as pd
import random
from datetime import datetime, timedelta
from config import CONFIG

#%%

def generate_mock_data(days_in_past = 60, initial_weight = 200, initial_cal = 2100):
    ''' Generate mock data for CalorieCounter 
    '''

    # Set the date range
    today = datetime.today()
    beginning = today - timedelta(days=days_in_past)
    df_index = pd.date_range(start=beginning,
                    end=datetime.today(), freq='D')

    # Generate semi random data for weight and calories
    weights = [initial_weight - weight*0.5 + random.randint(-5, 5) 
                for weight in range(days_in_past + 1)]

    cals = [initial_cal - cal*5 + random.randint(-200, 100) 
                for cal in range(days_in_past+ 1)]

    # put it all together into a dataframe
    data = {'weight': weights, 'calories': cals}

    df = (pd.DataFrame(index=df_index, data=data)
            .reset_index()
            .rename(columns={'index': 'timestamp'}))

    df['timestamp'] = df['timestamp'].apply(pd.Timestamp.date).astype(str)

    return df

def load_data(row, cursor):
    ''' Loads a row into the tables for CalorieCounter  
    '''

    cursor.execute(
    "INSERT INTO meals (timestamp, name, calories) VALUES (?, ?, ?);",
    (datetime.strptime(row['timestamp'], '%Y-%m-%d').isoformat(),
        'SPAM', row['calories']))
    cursor.execute(
    "INSERT INTO weights (timestamp, weight) VALUES (?, ?);",
    (datetime.strptime(row['timestamp'],
                        '%Y-%m-%d').isoformat(), row['weight']))

    return True

#%% Connect to Sqlite
conn = sqlite3.connect(CONFIG['db']['file'])

c = conn.cursor()

#%%

mock_data = generate_mock_data()
mock_data.apply(func = load_data, cursor=c, axis = 1)


#%% Commit database

conn.commit()
