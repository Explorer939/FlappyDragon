import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const GRAVITY = 2;
const JUMP_HEIGHT = 40;
const PIPE_WIDTH = 60;
const PIPE_GAP = 200;

function App() {
  const [birdPosition, setBirdPosition] = useState(300);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [pipeHeight, setPipeHeight] = useState(200);
  const [pipePosition, setPipePosition] = useState(400);
  const [score, setScore] = useState(0);

  const bottomPipeHeight = 600 - PIPE_GAP - pipeHeight;

  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space') {
      setGameHasStarted(true);
      setBirdPosition((prev) => prev - JUMP_HEIGHT);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    let gameLoop;
    if (gameHasStarted) {
      gameLoop = setInterval(() => {
        setBirdPosition((prev) => prev + GRAVITY);
        setPipePosition((prev) => {
          if (prev <= -PIPE_WIDTH) {
            setScore((prevScore) => prevScore + 1);
            return 400;
          }
          return prev - 5;
        });
      }, 24);
    }
    return () => {
      clearInterval(gameLoop);
    };
  }, [gameHasStarted]);

  useEffect(() => {
    const handleCollision = () => {
      if (
        birdPosition >= 600 - 40 ||
        birdPosition <= 0 ||
        (pipePosition <= 90 &&
          pipePosition + PIPE_WIDTH >= 50 &&
          (birdPosition <= pipeHeight || birdPosition >= pipeHeight + PIPE_GAP - 40))
      ) {
        setGameHasStarted(false);
        setBirdPosition(300);
        setPipePosition(400);
        setScore(0);
      }
    };

    handleCollision();
  }, [birdPosition, pipeHeight, pipePosition]);

  useEffect(() => {
    const generatePipeHeight = () => {
      setPipeHeight(Math.floor(Math.random() * (400 - 100 + 1) + 100));
    };

    if (pipePosition <= -PIPE_WIDTH) {
      generatePipeHeight();
    }
  }, [pipePosition]);

  const clouds = [
    { key: 1, className: "cloud cloud-1", delay: 0 },
    { key: 2, className: "cloud cloud-2", delay: -10 },
    { key: 3, className: "cloud cloud-3", delay: -5 },
    { key: 4, className: "cloud cloud-4", delay: -15 },
    { key: 5, className: "cloud cloud-5", delay: -8 },
  ];

  return (
    <div className="game" onClick={() => setGameHasStarted(true)}>
      <div className="game-area">
        {clouds.map(cloud => (
          <div 
            key={cloud.key} 
            className={cloud.className} 
            style={{animationDelay: `${cloud.delay}s`}}
          >
            ☁️
          </div>
        ))}
        <div className="bird" style={{ top: birdPosition }}>
          🐉
        </div>
        <div className="pipe" style={{ height: pipeHeight, left: pipePosition }}></div>
        <div
          className="pipe"
          style={{ height: bottomPipeHeight, top: 600 - bottomPipeHeight, left: pipePosition }}
        ></div>
        <div className="score">{score}</div>
      </div>
    </div>
  );
}

export default App;