import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hunting trip planner header', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { name: /Hunting Trip Planner/i });
  expect(headerElement).toBeInTheDocument();
});

test('renders trip details section', () => {
  render(<App />);
  const tripSection = screen.getByRole('heading', { name: /Trip Details/i });
  expect(tripSection).toBeInTheDocument();
});

test('renders packing list section', () => {
  render(<App />);
  const packingSection = screen.getByRole('heading', { name: /Packing List/i });
  expect(packingSection).toBeInTheDocument();
});

test('renders hunting game section', () => {
  render(<App />);
  const gameSection = screen.getByRole('heading', { name: /Hunting Game/i });
  expect(gameSection).toBeInTheDocument();
});

test('renders hunting location section', () => {
  render(<App />);
  const locationSection = screen.getByRole('heading', { name: /Hunting Location/i });
  expect(locationSection).toBeInTheDocument();
});

test('renders weather forecast section', () => {
  render(<App />);
  const weatherSection = screen.getByRole('heading', { name: /Weather Forecast/i });
  expect(weatherSection).toBeInTheDocument();
});
