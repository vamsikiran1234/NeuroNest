import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../stores/authStore';
import { apiClient } from '../api/client';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    vi.restoreAllMocks();
  });

  it('initializes with unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('logs in successfully and populates user session', async () => {
    const mockUser = {
      id: '123-uuid',
      email: 'alex@neuronest.dev',
      displayName: 'Alex',
      accountStatus: 'ACTIVE',
      emailVerified: true,
      minor: false,
      roles: ['ROLE_USER'],
      createdAt: new Date().toISOString(),
    };

    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      success: true,
      message: 'Logged in successfully',
      data: {
        accessToken: 'mock-access-jwt',
        refreshToken: 'mock-refresh-jwt',
        user: mockUser,
      },
      timestamp: new Date().toISOString(),
    });

    await useAuthStore.getState().login('alex@neuronest.dev', 'Password123!');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.accessToken).toBe('mock-access-jwt');
    expect(state.user?.displayName).toBe('Alex');
    expect(state.error).toBeNull();
  });

  it('handles logout and clears session', async () => {
    useAuthStore.setState({
      user: {
        id: '123-uuid',
        email: 'alex@neuronest.dev',
        displayName: 'Alex',
        accountStatus: 'ACTIVE',
        emailVerified: true,
        minor: false,
        roles: ['ROLE_USER'],
        createdAt: new Date().toISOString(),
      },
      accessToken: 'token',
      refreshToken: 'refresh-token',
      isAuthenticated: true,
    });

    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      success: true,
      message: 'Logged out',
      data: null,
      timestamp: new Date().toISOString(),
    });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });
});
