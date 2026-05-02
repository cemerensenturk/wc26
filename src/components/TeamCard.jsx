import React from 'react';
import { createPortal } from 'react-dom';
import { Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';

const TeamCard = ({ team, index }) => {
  return (
    <Draggable draggableId={team.id} index={index}>
      {(provided, snapshot) => {
        const card = (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={provided.draggableProps.style}
            className={`team-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
          >
            <div className={`team-position position-${index + 1}`}>
              {index + 1}
            </div>
            <div className="team-flag">{team.flag}</div>
            <div className="team-info">
              <div className="team-name">{team.name}</div>
            </div>
            <div className="drag-handle" {...provided.dragHandleProps}>
              <GripVertical size={20} />
            </div>
          </div>
        );

        // Render dragging card into document.body via portal to avoid
        // scroll-offset bugs caused by parent transforms/backdrops
        return snapshot.isDragging
          ? createPortal(card, document.body)
          : card;
      }}
    </Draggable>
  );
};

export default TeamCard;
