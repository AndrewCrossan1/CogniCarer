// useLogin.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useLogin } from '@/hooks/useLogin';
import API from '@/services/api/api';

// Mock the API instance
jest.mock('@/services/api/api');

describe('useLogin hook', () => {
    const mockLoginResponse = { token: 'mock-token' };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should log in successfully', async () => {
        // Mock the login function to resolve with a successful response
        (API.login as jest.Mock).mockResolvedValue(mockLoginResponse);

        const { result } = renderHook(() => useLogin());

        // Perform the login action
        await act(async () => {
            await result.current.login({email: 'testuser', password: 'password'});
        });

        // Assert loading, data, and error states
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual(mockLoginResponse);
        expect(result.current.error).toBeNull();
    });

    it('should handle login failure', async () => {
        // Mock the login function to reject with an error
        (API.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

        const { result } = renderHook(() => useLogin());

        // Perform the login action and handle the failure
        await act(async () => {
            try {
                await result.current.login({ email: 'wronguser', password: 'wrongpassword' });
            } catch (error) {
                // Expected to throw an error
            }
        });

        // Assert loading, data, and error states
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBe('Invalid credentials');
    });

    it('should set loading state while logging in', async () => {
        // Mock the login function to return a promise that resolves after a delay
        (API.login as jest.Mock).mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve(mockLoginResponse), 100))
        );

        const { result } = renderHook(() => useLogin());

        act(() => {
            result.current.login({ email: 'testuser', password: 'password' });
        });

        // Assert loading state is set to true immediately after calling login
        expect(result.current.loading).toBe(true);
    });
});
