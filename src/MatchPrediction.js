import React, { useState } from 'react';
import TeamCard from './TeamCard';

const teamStats = {
  '1': {
      headToHead: { '2': '19-11', '3': '3-4', '5': '19-10', '6': '1-3', '7': '17-20', '9': '16-13', '10': '16-13', '12': '21-11', '13': '15-6' },
      homeWins: 50,
      awayWins: 88,
      totalWins: 138,
      highestScore: 246
  },
  '2': {
      headToHead: { '1': '11-19', '3': '1-2', '5': '15-16', '6': '0-3', '7': '16-19', '9': '16-17', '10': '14-15', '12': '11-18', '13': '11-12' },
      homeWins: 35,
      awayWins: 77,
      totalWins: 112,
      highestScore: 257
  },
  '3': {
      headToHead: { '1': '4-3', '2': '2-1', '5': '2-1', '6': '4-1', '7': '3-2', '9': '2-4', '10': '5-1', '12': '2-3', '13': '3-1' },
      homeWins: 9,
      awayWins: 19,
      totalWins: 28,
      highestScore: 233
  },
  '5': {
      headToHead: { '1': '19-10', '2': '16-15', '3': '1-2', '6': '0-3', '7': '11-23', '9': '21-11', '10': '14-12', '12': '20-14', '13': '18-9' },
      homeWins: 52,
      awayWins: 78,
      totalWins: 130,
      highestScore: 272
  },
  '6': {
      headToHead: { '1': '3-1', '2': '3-0', '3': '1-4', '5': '3-0', '7': '5-1', '9': '3-1', '10': '1-4', '12': '2-3', '13': '3-1' },
      homeWins: 7,
      awayWins: 17,
      totalWins: 24,
      highestScore: 257
  },
  '7': {
      headToHead: { '1': '20-17', '2': '19-16', '3': '2-3', '5': '23-11', '6': '1-5', '9': '17-14', '10': '15-14', '12': '19-14', '13': '12-10' },
      homeWins: 51,
      awayWins: 91,
      totalWins: 142,
      highestScore: 247
  },
  '9': {
      headToHead: { '1': '13-16', '2': '17-16', '3': '4-2', '5': '11-21', '6': '1-3', '7': '14-17', '10': '11-16', '12': '17-16', '13': '7-16' },
      homeWins: 31,
      awayWins: 78,
      totalWins: 109,
      highestScore: 262
  },
  '10': {
      headToHead:  { '1': '13-16', '2': '15-14', '3': '1-5', '5': '12-14', '6': '4-1', '7': '14-15', '9': '16-11', '12': '14-15', '13': '9-11' },
      homeWins: 37,
      awayWins: 73,
      totalWins: 110,
      highestScore: 226
  },
  '12': {
      headToHead: { '1': '11-21', '2': '18-11', '3': '3-2', '5': '14-20', '6': '3-2', '7': '14-19', '9': '16-17', '10': '15-14', '13': '11-12' },
      homeWins: 43,
      awayWins: 78,
      totalWins: 121,
      highestScore: 263
  },
  '13': {
      headToHead: { '1': '6-15', '2': '12-11', '3': '1-3', '5': '9-18', '6': '1-3', '7': '10-12', '9': '16-7', '10': '9-11', '12': '12-11' },
      homeWins: 35,
      awayWins: 52,
      totalWins: 87,
      highestScore: 287
  },
};
const MatchPrediction = () => {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [venue, setVenue] = useState('1');
  const [headToHead, setHeadToHead] = useState('N/A');
  const [message, setMessage] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);

  const handleTeamChange = (team, value) => {
  if (team === 'A') setTeamA(value);
  else setTeamB(value);

  if (value === (team === 'A' ? teamB : teamA)) {
    setMessage('Team A and Team B cannot be the same!');
    setHeadToHead('N/A');
  } else {
    setMessage('');
    const headToHeadResult =
      teamStats[value]?.headToHead[team === 'A' ? teamB : teamA] || 
      'No head-to-head data available';
      
    if (teamB === '' || teamA === '') {
      setHeadToHead('N/A');
    } else {
      setHeadToHead(headToHeadResult);
    }
  }
};


  const predictMatch = () => {

    if (!teamA || !teamB || !venue) {
      alert('Please select both teams and a venue.');
      return;
    }
    console.log('Request data:', { teamA, teamB, venue });

    fetch('http://localhost:5000/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamA, teamB, venue }),
    })    
    .then((response) => {
      console.log('Response:', response);
      return response.json(); 
    })
    .then((result) => {
      console.log('Prediction Result:', result);
      if (result.error) {
        alert(result.error);
      } else {
        setPredictionResult(result);
      }
    })
    .catch((error) => alert('Error: ' + error.message));
  };

  return (
    <div className="center-container">
      <h1>MATCH PREDICTION</h1>

      <div className="venue-selection">
        <label htmlFor="venue-select">Select venue:</label>
        <select
          id="venue-select"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        >
          <option value="1">Arun Jaitley Stadium</option>
          <option value="3">Barsapara Cricket Stadium</option>
          <option value="7">Dr DY Patil Sports Academy</option>
          <option value="10">Eden Gardens</option>
          <option value="11">Ekana Cricket Stadium</option>
          <option value="12">Feroz Shah Kotla</option>
          <option value="18">M Chinnaswamy Stadium</option>
          <option value="19">MA Chidambaram Stadium</option>
          <option value="20">Maharaja Yadavindra Singh International Cricket Stadium</option>
          <option value="22">Narendra Modi Stadium</option>
          <option value="27">Punjab Cricket Association IS Bindra Stadium</option>
          <option value="28">Punjab Cricket Association Stadium</option>
          <option value="29">Rajiv Gandhi International Stadium</option>
          <option value="30">Sardar Patel Stadium</option>
          <option value="31">Saurashtra Cricket Association Stadium</option>
          <option value="32">Sawai Mansingh Stadium</option>
          <option value="35">Sheikh Zayed Stadium</option>
          <option value="37">Subrata Roy Sahara Stadium</option>
          <option value="39">Vidarbha Cricket Association Stadium</option>
          <option value="40">Wankhede Stadium</option>
        </select>
      </div>

      <div className="teams">
        <TeamCard
          team="A"
          selectedTeam={teamA}
          handleTeamChange={handleTeamChange}
          message={message}
          teamStats={teamStats}
        />
        <div className="vs">
          <h2>VS</h2>
        </div>
        <TeamCard
          team="B"
          selectedTeam={teamB}
          handleTeamChange={handleTeamChange}
          message={message}
          teamStats={teamStats}
        />
      </div>

      <h2>
        Head to Head: <span id="headToHeadResult">{headToHead}</span>
      </h2>
      <button className="btn predict-btn" onClick={predictMatch}>
        Predict
      </button>

      {predictionResult && (
        <div className="prediction-result">
          <h2>Prediction Result</h2>
          <pre>{JSON.stringify(predictionResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MatchPrediction;