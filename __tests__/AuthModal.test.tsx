import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthModal from '../components/AuthModal';

describe('AuthModal', () => {
  it('renders login form by default', () => {
    render(<AuthModal type="login" onClose={() => {}} onLogin={() => {}} onSwitch={() => {}} />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('renders register form when switched', () => {
    render(<AuthModal type="register" onClose={() => {}} onLogin={() => {}} onSwitch={() => {}} />);
    expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  it('calls onSwitch when switch button is clicked', () => {
    const onSwitch = jest.fn();
    render(<AuthModal type="login" onClose={() => {}} onLogin={() => {}} onSwitch={onSwitch} />);
    fireEvent.click(screen.getByText('Sign up'));
    expect(onSwitch).toHaveBeenCalled();
  });
}); 