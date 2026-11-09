import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Logo, { CivicLogoIcon } from '../components/common/Logo';

describe('CivicConnect AI Brand Logo', () => {
  it('renders standalone icon with SVG accessible label', () => {
    render(<CivicLogoIcon />);
    const icon = screen.getByLabelText('CivicConnect AI Icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders horizontal brand wordmark with tagline', () => {
    render(<Logo variant="horizontal" showTagline={true} />);
    expect(screen.getByText('Civic')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Your City. Your Voice. Real Action.')).toBeInTheDocument();
  });

  it('renders stacked variation correctly', () => {
    render(<Logo variant="stacked" size="lg" showTagline={true} />);
    expect(screen.getByText('Civic')).toBeInTheDocument();
    expect(screen.getByText('Your City. Your Voice. Real Action.')).toBeInTheDocument();
  });
});
