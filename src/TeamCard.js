import React from 'react';
import './App.css';

const TeamCard = ({ team, selectedTeam, handleTeamChange, message, teamStats }) => {
  const teamOptions = [
    { value: '1', label: 'Chennai Super Kings' },
    { value: '2', label: 'Delhi Capitals' },
    { value: '3', label: 'Gujarat Titans' },
    { value: '5', label: 'Kolkata Knight Riders' },
    { value: '6', label: 'Lucknow Super Giants' },
    { value: '7', label: 'Mumbai Indians' },
    { value: '9', label: 'Punjab Kings' },
    { value: '10', label: 'Rajasthan Royals' },
    { value: '12', label: 'Royal Challengers Bangalore' },
    { value: '13', label: 'Sunrisers Hyderabad' },
  ];
  const selectedStats = teamStats[selectedTeam] || {};

  return (
    <div className="team-card">
      <h2>TEAM {team}</h2>
      <p className="error-message">{message}</p>
      <select
        value={selectedTeam}
        onChange={(e) => handleTeamChange(team, e.target.value)}
      >
        <option value="">Select a Team</option>
        {teamOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {selectedTeam && (
        <div className="team-stats">
          <p>Home Wins: {selectedStats.homeWins}</p>
          <p>Away Wins: {selectedStats.awayWins}</p>
          <p>Total Wins: {selectedStats.totalWins}</p>
          <p>Highest Score: {selectedStats.highestScore}</p>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
