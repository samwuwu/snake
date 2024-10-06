import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import { Direction, Point } from './types';
import { useSwipe } from './hooks/useSwipe';

const BOARD_SIZE = 15;
const INITIAL_SNAKE: Point[] = [{ x: 7, y: 7 }];
const INITIAL_FOOD: Point = { x: 5, y: 5 };
const INITIAL_DIRECTION: Direction = 'RIGHT';
const GAME_SPEED = 200;

function App() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP':
        head.y = (head.y - 1 + BOARD_SIZE) % BOARD_SIZE;
        break;
      case 'DOWN':
        head.y = (head.y + 1) % BOARD_SIZE;
        break;
      case 'LEFT':
        head.x = (head.x - 1 + BOARD_SIZE) % BOARD_SIZE;
        break;
      case 'RIGHT':
        head.x = (head.x + 1) % BOARD_SIZE;
        break;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(prevScore => prevScore + 1);
      setFood(generateFood(newSnake));
    } else {
      newSnake.pop();
    }

    if (isCollision(head, newSnake.slice(1))) {
      setGameOver(true);
    } else {
      setSnake(newSnake);
    }
  }, [snake, direction, food, gameOver]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  const generateFood = (snake: Point[]): Point => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  const isCollision = (head: Point, body: Point[]): boolean => {
    return body.some(segment => segment.x === head.x && segment.y === head.y);
  };

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
  };

  const handleSwipe = useSwipe({
    onSwipeUp: () => setDirection('UP'),
    onSwipeDown: () => setDirection('DOWN'),
    onSwipeLeft: () => setDirection('LEFT'),
    onSwipeRight: () => setDirection('RIGHT'),
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4" {...handleSwipe}>
      <h1 className="text-3xl font-bold mb-4">贪食蛇游戏</h1>
      <ScoreBoard score={score} />
      <GameBoard
        snake={snake}
        food={food}
        boardSize={BOARD_SIZE}
      />
      {gameOver && (
        <div className="mt-4">
          <p className="text-xl font-bold mb-2">游戏结束！</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={restartGame}
          >
            重新开始
          </button>
        </div>
      )}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div></div>
        <button onClick={() => setDirection('UP')} className="p-2 bg-gray-200 rounded"><ChevronUp /></button>
        <div></div>
        <button onClick={() => setDirection('LEFT')} className="p-2 bg-gray-200 rounded"><ChevronLeft /></button>
        <div></div>
        <button onClick={() => setDirection('RIGHT')} className="p-2 bg-gray-200 rounded"><ChevronRight /></button>
        <div></div>
        <button onClick={() => setDirection('DOWN')} className="p-2 bg-gray-200 rounded"><ChevronDown /></button>
        <div></div>
      </div>
    </div>
  );
}

export default App;