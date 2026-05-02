import React from 'react';
import { Check, Lock } from 'lucide-react';

const EMPTY_TEAM = { id: null, name: 'TBD', flag: '❓' };

const MatchCard = ({ match, onSelectWinner, isLocked = false }) => {
  const team1 = match.team1 || EMPTY_TEAM;
  const team2 = match.team2 || EMPTY_TEAM;
  const isEmpty = !match.team1 && !match.team2;
  const interactive = !isLocked && !isEmpty;

  return (
    <div className={`match-card ${isEmpty ? 'match-empty' : ''} ${isLocked ? 'match-locked' : ''}`}>
      <div
        className={`match-team ${match.winner === team1.id ? 'winner' : ''}`}
        onClick={() => interactive && team1.id && onSelectWinner(match.id, team1.id)}
        style={{ cursor: interactive && team1.id ? 'pointer' : 'default' }}
      >
        <span className="team-flag">{team1.flag}</span>
        <span className={`team-name ${!team1.id ? 'tbd-text' : ''}`}>{team1.name}</span>
        {match.winner === team1.id && <Check size={16} className="winner-icon" />}
        {isLocked && !match.winner && <Lock size={12} className="lock-icon" />}
      </div>
      <div
        className={`match-team ${match.winner === team2.id ? 'winner' : ''}`}
        onClick={() => interactive && team2.id && onSelectWinner(match.id, team2.id)}
        style={{ cursor: interactive && team2.id ? 'pointer' : 'default' }}
      >
        <span className="team-flag">{team2.flag}</span>
        <span className={`team-name ${!team2.id ? 'tbd-text' : ''}`}>{team2.name}</span>
        {match.winner === team2.id && <Check size={16} className="winner-icon" />}
      </div>
    </div>
  );
};

export default MatchCard;

