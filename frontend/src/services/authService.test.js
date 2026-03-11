import { jest } from '@jest/globals';

const mockPost = jest.fn();

jest.unstable_mockModule('../utils/api.js', () => ({
  api: {
    post: mockPost,
  },
}));

const { authService } = await import('./authService.js');
const { api } = await import('../utils/api.js');

describe('authService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call api.post with correct login credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockResponse = { user: { id: 1, email }, token: 'fake-token' };
      api.post.mockResolvedValue(mockResponse);

      const result = await authService.login(email, password);

      expect(api.post).toHaveBeenCalledWith('/login', { email, password });
      expect(result).toEqual(mockResponse);
    });

    it('should propagate errors if api.post fails', async () => {
      const error = new Error('Invalid credentials');
      api.post.mockRejectedValue(error);

      await expect(authService.login('test@example.com', 'wrong-password')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should call api.post with user data for registration', async () => {
      const userData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      const mockResponse = { message: 'User registered successfully' };
      api.post.mockResolvedValue(mockResponse);

      const result = await authService.register(userData);

      expect(api.post).toHaveBeenCalledWith('/register', userData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should call api.post with token for logout', async () => {
      const token = 'active-token';
      const mockResponse = { message: 'Logged out' };
      api.post.mockResolvedValue(mockResponse);

      const result = await authService.logout(token);

      expect(api.post).toHaveBeenCalledWith('/logout', {}, token);
      expect(result).toEqual(mockResponse);
    });
  });
});
