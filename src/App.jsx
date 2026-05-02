import React from 'react';
import { TournamentProvider, useTournament } from './context/TournamentContext';
import GroupStage from './components/GroupStage';
import BestThirdsStage from './components/BestThirdsStage';
import BracketStage from './components/BracketStage';

const AppContent = () => {
  const { currentStep } = useTournament();
  return (
    <>
      {currentStep === 1 && <GroupStage />}
      {currentStep === 2 && <BestThirdsStage />}
      {currentStep === 3 && <BracketStage />}
    </>
  );
};

function App() {
  return (
    <TournamentProvider>
      <AppContent />
    </TournamentProvider>
  );
}

export default App;

