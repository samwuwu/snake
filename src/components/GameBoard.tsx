import React from 'react';
import { Point } from '../types';

interface GameBoardProps {
  snake: Point[];
  food: Point;
  boardSize: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, boardSize }) => {
  const cellSize = 20;

  return (
    <div
      className="border-2 border-gray-300"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${boardSize}, ${cellSize}px)`,
      }}
    >
      {Array.from({ length: boardSize * boardSize }).map((_, index) => {
        const x = index % boardSize;
        const y = Math.floor(index / boardSize);
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;

        return (
          <div
            key={index}
            className={`
              ${isSnake ? 'bg-green-500' : ''}
              ${isFood ? 'bg-red-500' : ''}
              ${!isSnake && !isFood ? 'bg-gray-100' : ''}
            `}
            style={{ width: cellSize, height: cellSize }}
          />
        );
      })}
    </div>
  );
};

export default GameBoard;