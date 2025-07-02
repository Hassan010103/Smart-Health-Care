import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppointmentCard from '../components/AppointmentCard';

describe('AppointmentCard', () => {
  const appointment = {
    id: '1',
    doctorName: 'Dr. Test',
    specialty: 'Cardiology',
    date: '2024-06-10',
    time: '10:00 AM',
    status: 'pending',
  };

  it('renders appointment details', () => {
    render(
      <MemoryRouter>
        <AppointmentCard appointment={appointment} paymentStatus="pending" />
      </MemoryRouter>
    );
    expect(screen.getByText('Dr. Test')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText('2024-06-10')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    const pendingChips = screen.getAllByText('pending');
    expect(pendingChips.length).toBeGreaterThanOrEqual(2);
  });

  it('calls onRazorpayPay when Pay Now is clicked', () => {
    const onRazorpayPay = jest.fn();
    render(
      <MemoryRouter>
        <AppointmentCard appointment={appointment} paymentStatus="pending" onRazorpayPay={onRazorpayPay} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Pay Now'));
    expect(onRazorpayPay).toHaveBeenCalled();
  });
}); 