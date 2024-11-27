import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import math

import warnings
warnings.simplefilter("ignore", UserWarning)

import numpy as np
import pandas as pd

from tensorflow import keras
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

data = pd.read_csv("data1.csv")

input_features = ['batting_team', 'bowling_team', 'venue']
encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
encoded_categorical = encoder.fit_transform(data[input_features])

xfeats = ['over', 'ball']
scalerx = StandardScaler()
scaled_x = scalerx.fit_transform(data[xfeats])

yfeats = ['runs', 'wickets']
scalery = StandardScaler()
scaled_y = scalery.fit_transform(data[yfeats])

model = keras.models.load_model("lstm1.keras")

team = {1: 'Chennai Super Kings', 2: 'Delhi Capitals', 3: 'Gujarat Titans', 5: 'Kolkata Knight Riders', 6: 'Lucknow Super Giants', 7: 'Mumbai Indians', 9: 'Punjab Kings', 10: 'Rajasthan Royals', 12: 'Royal Challengers Bengaluru', 13: 'Sunrisers Hyderabad'}
venue = {1: 'Arun Jaitley Stadium', 3: 'Barsapara Cricket Stadium', 7: 'Dr DY Patil Sports Academy', 10: 'Eden Gardens', 11: 'Ekana Cricket Stadium', 12: 'Feroz Shah Kotla', 18: 'M Chinnaswamy Stadium', 19: 'MA Chidambaram Stadium', 20: 'Maharaja Yadavindra Singh International Cricket Stadium', 22: 'Narendra Modi Stadium', 27: 'Punjab Cricket Association IS Bindra Stadium', 28: 'Punjab Cricket Association Stadium', 29: 'Rajiv Gandhi International Stadium', 30: 'Sardar Patel Stadium', 31: 'Saurashtra Cricket Association Stadium', 32: 'Sawai Mansingh Stadium', 35: 'Sheikh Zayed Stadium', 37: 'Subrata Roy Sahara Stadium', 39: 'Vidarbha Cricket Association Stadium', 40: 'Wankhede Stadium'}
steam = {str(key): value for key, value in team.items()}
svenue = {str(key): value for key, value in venue.items()}

@app.route('/api/predict', methods=['POST'])
def predict_match():
    data = request.json
    teamA = data.get('teamA')
    teamB = data.get('teamB')
    venue1 = data.get('venue')

    if teamA not in steam.keys() or teamB not in steam.keys() or venue1 not in svenue.keys():
        return jsonify({'error': 'Invalid team or venue code.'}), 400

    teamA = int(teamA)
    teamB = int(teamB)
    venue1 = int(venue1)

    Input1 = [[teamA, teamB, venue1]]
    Input2 = [[teamB, teamA, venue1]]

    scaled_input1 = encoder.transform(Input1)
    scaled_input2 = encoder.transform(Input2)

    Extrainput = [[19, 6]]
    scaled_extrainput = scalerx.transform(Extrainput)

    X_give1 = np.hstack((scaled_input1, scaled_extrainput))
    X_give1 = X_give1.reshape(X_give1.shape[0], 1, X_give1.shape[1])

    X_give2 = np.hstack((scaled_input2, scaled_extrainput))
    X_give2 = X_give2.reshape(X_give2.shape[0], 1, X_give2.shape[1])

    pred1 = model.predict(X_give1, verbose=0)
    pred1 = scalery.inverse_transform(pred1)

    pred2 = model.predict(X_give2, verbose=0)
    pred2 = scalery.inverse_transform(pred2)

    result = {}

    for key1, value1 in team.items():
        if teamA == key1:
            teamA_score = round(pred1[0, 0])
            teamA_wickets = round(pred1[0, 1])
            teamA_run_rate = teamA_score / 20
            result['teamA'] = {
                'score': teamA_score,
                'wickets': teamA_wickets,
                'run_rate': round(teamA_run_rate, 2)
            }
            break

    for key2, value2 in team.items():
        if teamB == key2:
            teamB_score = round(pred2[0, 0])
            teamB_wickets = round(pred2[0, 1])
            teamB_run_rate = teamB_score / 20
            if teamB_score < teamA_score:
                result['teamB'] = {
                    'score': teamB_score,
                    'wickets': teamB_wickets,
                    'run_rate': round(teamB_run_rate, 2),
                    'match_result': f"{value1} won by {teamA_score - teamB_score} runs"
                }
            else:
                teamB_scored = math.ceil(round(teamA_score / teamB_run_rate, 1) * teamB_run_rate)
                ballsfaced = int((teamA_score / teamB_run_rate) * 6)
                oversface = int(ballsfaced // 6)
                remaining_balls = ballsfaced % 6
                if teamA_score == teamB_scored:
                    teamB_scored += 1
                result['teamB'] = {
                    'score': teamB_scored,
                    'wickets': teamB_wickets,
                    'run_rate': round(teamB_run_rate, 2),
                    'match_result': f"{value2} chased down the score in {oversface}.{remaining_balls} overs"
                }
            break

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=3000)