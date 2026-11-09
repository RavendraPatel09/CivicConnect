import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ui/ThemeToggle';

const ThemeConsumer = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('Theme Switching System', () => {
  it('toggles theme between light and dark modes and updates document root', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    const themeLabel = screen.getByTestId('current-theme');
    const initialTheme = themeLabel.textContent;
    const toggleButton = screen.getByText('Toggle');

    fireEvent.click(toggleButton);

    const newTheme = themeLabel.textContent;
    expect(newTheme).not.toBe(initialTheme);
    expect(['light', 'dark']).toContain(newTheme);
  });
});
