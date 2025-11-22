import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  success: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
        success: null
      };
    case 'SET_SUCCESS':
      return {
        ...state,
        success: action.payload,
        error: null,
        loading: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = authService.getCurrentUser();
        const token = authService.getToken();
        console.log('AuthContext - Initializing auth:', { user: !!user, token: !!token });
        
        if (user && authService.isAuthenticated()) {
          console.log('AuthContext - User authenticated:', user);
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } else {
          console.log('AuthContext - No valid authentication found');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('AuthContext: Starting login with:', credentials.email);
      const user = await authService.login(credentials);
      console.log('AuthContext: Login successful:', user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      dispatch({ type: 'SET_SUCCESS', payload: 'Login successful! Welcome back.' });
      return user;
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('AuthContext: Starting registration with data:', userData);
      const user = await authService.register(userData);
      console.log('AuthContext: Registration successful, user:', user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return user;
    } catch (error) {
      console.error('AuthContext: Registration failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const clearSuccess = () => {
    dispatch({ type: 'SET_SUCCESS', payload: null });
  };

  const clearMessages = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_SUCCESS', payload: null });
  };

  const checkAuthentication = () => {
    return !!state.user && !!authService.getToken();
  };

  const value = {
    ...state,
    isAuthenticated: checkAuthentication(),
    login,
    register,
    logout,
    updateUser,
    clearError,
    clearSuccess,
    clearMessages
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;