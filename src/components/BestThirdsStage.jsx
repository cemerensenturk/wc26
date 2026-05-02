import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import logoImg from '../assets/2026_FIFA_World_Cup_emblem.png';


const BestThirdsStage = () => {
  const { groups, selectedThirdPlaces, toggleThirdPlaceSelection, setCurrentStep, initializeBracket } = useTournament();

  const thirdPlaceTeams = groups.map(group => ({
    groupName: group.name,
    team: group.teams[2]
  }));

  const selectedCount = selectedThirdPlaces.length;
  const isComplete = selectedCount === 8;

  return (
    <div className="app-container">
      <div className="header">
        <img src={logoImg} alt="FIFA World Cup 2026" className="header-logo" />
        <div className="header-eyebrow">FIFA World Cup 2026™</div>
        <h1>Best 3rd Place</h1>
        <p>Select exactly 8 third-placed teams to advance to the knockout stage</p>
        <div className={`selection-status ${isComplete ? 'complete' : ''}`}>
          {selectedCount} / 8 Teams Selected
        </div>
        <a href="https://cemeren.dev" target="_blank" rel="noopener noreferrer" className="header-watermark">
          cemeren.dev
        </a>
      </div>

      <div className="selection-grid">
        {thirdPlaceTeams.map(({ groupName, team }) => {
          const isSelected = selectedThirdPlaces.includes(team.id);
          const isDisabled = !isSelected && isComplete;
          return (
            <div
              key={team.id}
              className={`selectable-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => { if (!isDisabled) toggleThirdPlaceSelection(team.id); }}
            >
              <div className="card-content" style={{ flex: 1 }}>
                <div className="card-group-name">{groupName}</div>
                <div className="card-team-info">
                  <span className="team-flag">{team.flag}</span>
                  <span className="team-name" style={{ fontSize: '1.05rem' }}>{team.name}</span>
                </div>
              </div>
              {isSelected && (
                <div style={{ color: 'var(--wc-green)' }}>
                  <Check size={22} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="actions">
        <button className="btn-secondary" onClick={() => setCurrentStep(1)}>
          <ArrowLeft size={20} /> Back to Groups
        </button>
        <button
          className="btn-primary"
          disabled={!isComplete}
          onClick={() => initializeBracket()}
        >
          Proceed to Round of 32 <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default BestThirdsStage;
