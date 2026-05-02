import React, { createContext, useContext, useState } from 'react';
import { initialGroups } from '../data/teams';

const TournamentContext = createContext();

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};

export const TournamentProvider = ({ children }) => {
  const [groups, setGroups] = useState(initialGroups);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedThirdPlaces, setSelectedThirdPlaces] = useState([]);
  
  const [bracket, setBracket] = useState({
    roundOf32: [],
    roundOf16: [],
    quarterFinals: [],
    semiFinals: [],
    thirdPlaceMatch: null,
    finalMatch: null
  });

  const reorderGroup = (groupId, startIndex, endIndex) => {
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const groupIndex = newGroups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return prevGroups;

      const group = { ...newGroups[groupIndex] };
      const newTeams = Array.from(group.teams);
      const [removed] = newTeams.splice(startIndex, 1);
      newTeams.splice(endIndex, 0, removed);

      group.teams = newTeams;
      newGroups[groupIndex] = group;
      return newGroups;
    });
  };

  const goToStep = (step) => {
    if (step === 1) {
      setSelectedThirdPlaces([]);
      setBracket({
        roundOf32: [],
        roundOf16: [],
        quarterFinals: [],
        semiFinals: [],
        thirdPlaceMatch: null,
        finalMatch: null
      });
    }
    setCurrentStep(step);
  };

  const toggleThirdPlaceSelection = (teamId) => {
    setSelectedThirdPlaces(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      } else {
        if (prev.length >= 8) return prev;
        return [...prev, teamId];
      }
    });
  };

  const initializeBracket = () => {
    const winners = groups.map(g => g.teams[0]);
    const runnersUp = groups.map(g => g.teams[1]);
    const thirds = groups.map(g => g.teams[2]).filter(t => selectedThirdPlaces.includes(t.id));

    // R32: 16 matches split left/right
    const roundOf32 = [];
    for (let i = 0; i < 16; i++) {
      let t1, t2;
      const side = i < 8 ? 'left' : 'right';
      if (i < 4) {                      // Winners A-D vs Best 3rds 1-4
        t1 = winners[i]; t2 = thirds[i];
      } else if (i < 8) {               // Winners I-L vs Runners A-D
        t1 = winners[i + 4]; t2 = runnersUp[i - 4];
      } else if (i < 12) {              // Winners E-H vs Best 3rds 5-8
        t1 = winners[i - 4]; t2 = thirds[i - 4];
      } else {                           // Runners E-H vs Runners I-L
        t1 = runnersUp[i - 8]; t2 = runnersUp[i - 4];
      }
      roundOf32.push({ id: `m32-${i}`, team1: t1, team2: t2, winner: null, side });
    }

    const initRound = (count, prefix) =>
      Array.from({ length: count }, (_, i) => ({
        id: `${prefix}-${i}`,
        team1: null, team2: null, winner: null,
        side: i < count / 2 ? 'left' : 'right'
      }));

    const newBracket = {
      roundOf32,
      roundOf16: initRound(8, 'm16'),
      quarterFinals: initRound(4, 'm8'),
      semiFinals: initRound(2, 'm4'),
      thirdPlaceMatch: { id: 'm3rd', team1: null, team2: null, winner: null },
      finalMatch: { id: 'mfinal', team1: null, team2: null, winner: null }
    };

    // Atomically update bracket AND advance to step 3
    setBracket(newBracket);
    setCurrentStep(3);
  };


  const selectMatchWinner = (roundKey, matchId, teamId) => {
    setBracket(prev => {
      const newBracket = {
        ...prev,
        roundOf32: [...prev.roundOf32],
        roundOf16: [...prev.roundOf16],
        quarterFinals: [...prev.quarterFinals],
        semiFinals: [...prev.semiFinals],
        finalMatch: { ...prev.finalMatch },
        thirdPlaceMatch: { ...prev.thirdPlaceMatch }
      };

      // Handle object-based rounds (Final and 3rd Place) separately
      if (roundKey === 'finalMatch') {
        newBracket.finalMatch.winner = teamId;
        return newBracket;
      }
      if (roundKey === 'thirdPlaceMatch') {
        newBracket.thirdPlaceMatch.winner = teamId;
        return newBracket;
      }

      // Handle array-based rounds
      const currentRound = [...newBracket[roundKey]];
      const matchIndex = currentRound.findIndex(m => m.id === matchId);
      if (matchIndex === -1) return prev; // safety check

      const match = { ...currentRound[matchIndex] };
      const prevWinner = match.winner;
      match.winner = teamId;
      currentRound[matchIndex] = match;
      newBracket[roundKey] = currentRound;

      const teamObj = teamId === match.team1?.id ? match.team1 : match.team2;
      const loserObj = teamId === match.team1?.id ? match.team2 : match.team1;

      // Advance winner to the next round
      const advance = (nextRoundKey, nextMatchIdx, isTeam1) => {
        const nextRound = [...newBracket[nextRoundKey]];
        const nextMatch = { ...nextRound[nextMatchIdx] };
        if (isTeam1) nextMatch.team1 = teamObj; else nextMatch.team2 = teamObj;
        if (prevWinner && prevWinner !== teamId) nextMatch.winner = null;
        nextRound[nextMatchIdx] = nextMatch;
        newBracket[nextRoundKey] = nextRound;
      };

      if (roundKey === 'roundOf32') {
        advance('roundOf16', Math.floor(matchIndex / 2), matchIndex % 2 === 0);
      } else if (roundKey === 'roundOf16') {
        advance('quarterFinals', Math.floor(matchIndex / 2), matchIndex % 2 === 0);
      } else if (roundKey === 'quarterFinals') {
        advance('semiFinals', Math.floor(matchIndex / 2), matchIndex % 2 === 0);
      } else if (roundKey === 'semiFinals') {
        // Advance to final
        const final = { ...newBracket.finalMatch };
        if (matchIndex === 0) final.team1 = teamObj; else final.team2 = teamObj;
        newBracket.finalMatch = final;

        // Advance loser to third place
        const third = { ...newBracket.thirdPlaceMatch };
        if (matchIndex === 0) third.team1 = loserObj; else third.team2 = loserObj;
        newBracket.thirdPlaceMatch = third;
      }

      return newBracket;
    });
  };

  const value = {
    groups, reorderGroup,
    currentStep, setCurrentStep: goToStep,
    selectedThirdPlaces, toggleThirdPlaceSelection,
    bracket, initializeBracket, selectMatchWinner
  };

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
};
