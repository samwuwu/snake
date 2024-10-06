import React from 'react';

interface ScoreBoardProps {
  score: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold">得分: {score}</h2>
    </div>
  );
};

export default ScoreBoard;