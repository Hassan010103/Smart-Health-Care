import React from 'react';
import { render, screen } from '@testing-library/react';
import DoctorCard from '../components/DoctorCard';

describe('DoctorCard', () => {
  it('renders doctor details', () => {
    render(
      <DoctorCard doctor={{
        id: 1,
        name: 'Dr. Test',
        specialty: 'Cardiology',
        location: 'Mumbai',
        rating: 4.5,
        reviews: 10,
        imageUrl: 'https://placehold.co/400x400',
        bio: '',
        qualifications: [],
        availability: [],
      }} />
    );
    expect(screen.getByText('Dr. Test')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText('Mumbai')).toBeInTheDocument();
    expect(screen.getByText(/4.5/)).toBeInTheDocument();
    expect(screen.getByText(/10 reviews/)).toBeInTheDocument();
  });
}); 