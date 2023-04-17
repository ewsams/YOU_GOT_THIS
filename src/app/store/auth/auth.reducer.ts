import { createReducer, on } from '@ngrx/store';
import { HttpErrorResponse } from 'src/app/common/models/error-response.model';
import { User } from 'src/app/common/models/user.model';
import {
  register,
  registerFailure,
  registerSuccess,
  login,
  loginFailure,
  loginSuccess,
  logout,
  clearError,
} from './auth.actions';

export interface AuthState {
  user: User | null;
  errorMessage: string | null;
  loading: boolean;
}

export const initialState: AuthState = {
  user: null,
  errorMessage: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,
  on(registerSuccess, loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(registerFailure, loginFailure, (state, { error }) => ({
    ...state,
    errorMessage: error.error.message,
    loading: false,
  })),
  on(register, login, (state) => ({
    ...state,
    loading: true,
    errorMessage: null,
  })),
  on(logout, (state) => ({ ...state, user: null })),
  on(clearError, (state) => ({ ...state, errorMessage: null }))
);
