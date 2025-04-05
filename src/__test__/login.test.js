import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/login';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mockAxios = new MockAdapter(axios);

describe('Login Page', () => {
  beforeEach(() => {
    mockAxios.reset();
    delete window.location;
    window.location = { href: '' };
  });

  it('displays error on invalid credentials', async () => {
    mockAxios.onPost('http://localhost:8000/api/login').reply(401);

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('stores token and redirects on successful login', async () => {
    mockAxios.onPost('http://localhost:8000/api/login').reply(200, {
      token: 'mock-token',
    });

    const setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'user@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'correctpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith('token', 'mock-token');
      expect(window.location.href).toBe('/');
    });
  });
});
