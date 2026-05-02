import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TeamCard from './TeamCard';

const Group = ({ group }) => {
  return (
    <div className="group-card">
      <div className="group-header">
        <h2>{group.name}</h2>
      </div>
      
      <Droppable droppableId={group.id}>
        {(provided) => (
          <div 
            className="team-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {group.teams.map((team, index) => (
              <TeamCard key={team.id} team={team} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Group;
