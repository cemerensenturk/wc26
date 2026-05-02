import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useTournament } from '../context/TournamentContext';
import Group from './Group';
import { ArrowRight } from 'lucide-react';
import logoImg from '../assets/2026_FIFA_World_Cup_emblem.png';


const GroupStage = () => {
  const { groups, reorderGroup, setCurrentStep } = useTournament();

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId !== destination.droppableId) return;
    if (source.index === destination.index) return;
    reorderGroup(source.droppableId, source.index, destination.index);
  };

  return (
    <div className="app-container">
      <div className="header">
        <img src={logoImg} alt="FIFA World Cup 2026" className="header-logo" />
        <div className="header-eyebrow">FIFA World Cup 2026™</div>
        <h1>Bracket Predictor</h1>
        <p>Drag &amp; drop to rank teams 1st–4th in each group</p>
        <a href="https://cemeren.dev" target="_blank" rel="noopener noreferrer" className="header-watermark">
          cemeren.dev
        </a>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="groups-grid">
          {groups.map(group => (
            <Group key={group.id} group={group} />
          ))}
        </div>
      </DragDropContext>

      <div className="actions">
        <button
          className="btn-primary"
          onClick={() => setCurrentStep(2)}
        >
          Proceed to Best 3rd Place Selection <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default GroupStage;
