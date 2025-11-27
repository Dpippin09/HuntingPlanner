import React from 'react';
import { HuntingGame } from '../types';
import './GameSelector.css';

interface GameSelectorProps {
  selectedGame: HuntingGame | null;
  onGameSelect: (game: HuntingGame | null) => void;
}

const HUNTING_GAMES: HuntingGame[] = [
  { id: 'whitetail-deer', name: 'Whitetail Deer', season: 'Fall-Winter', icon: '🦌' },
  { id: 'mule-deer', name: 'Mule Deer', season: 'Fall-Winter', icon: '🦌' },
  { id: 'elk', name: 'Elk', season: 'Fall', icon: '🦌' },
  { id: 'moose', name: 'Moose', season: 'Fall', icon: '🫎' },
  { id: 'wild-turkey', name: 'Wild Turkey', season: 'Spring/Fall', icon: '🦃' },
  { id: 'duck', name: 'Duck', season: 'Fall-Winter', icon: '🦆' },
  { id: 'goose', name: 'Goose', season: 'Fall-Winter', icon: '🪿' },
  { id: 'pheasant', name: 'Pheasant', season: 'Fall', icon: '🐦' },
  { id: 'quail', name: 'Quail', season: 'Fall-Winter', icon: '🐦' },
  { id: 'wild-boar', name: 'Wild Boar', season: 'Year-round', icon: '🐗' },
  { id: 'rabbit', name: 'Rabbit', season: 'Fall-Winter', icon: '🐇' },
  { id: 'bear', name: 'Bear', season: 'Fall', icon: '🐻' },
];

const GameSelector: React.FC<GameSelectorProps> = ({
  selectedGame,
  onGameSelect,
}) => {
  const handleGameClick = (game: HuntingGame) => {
    if (selectedGame?.id === game.id) {
      onGameSelect(null);
    } else {
      onGameSelect(game);
    }
  };

  return (
    <div className="game-selector">
      <h2>🎯 Hunting Game</h2>
      
      <div className="game-grid">
        {HUNTING_GAMES.map((game) => (
          <button
            key={game.id}
            className={`game-card ${selectedGame?.id === game.id ? 'selected' : ''}`}
            onClick={() => handleGameClick(game)}
          >
            <span className="game-icon">{game.icon}</span>
            <span className="game-name">{game.name}</span>
            <span className="game-season">{game.season}</span>
          </button>
        ))}
      </div>

      {selectedGame && (
        <div className="selected-game-info">
          <h3>Selected: {selectedGame.icon} {selectedGame.name}</h3>
          <p>Typical Season: {selectedGame.season}</p>
        </div>
      )}
    </div>
  );
};

export default GameSelector;
