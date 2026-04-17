// src/services/authService.ts

import { Storage } from '../storage/storage';
import { KEYS } from '../storage/keys';
import { User, UserRole } from '../types';

const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (Math.imul(31, hash) + password.charCodeAt(i)) | 0;
  }
  return hash.toString(16);
};

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

interface StoredUser extends User {
  passwordHash: string;
}

// ─── Register ────────────────────────────────────────────────
export const register = async (payload: RegisterPayload): Promise<User> => {
  const users = await Storage.getList<StoredUser>(KEYS.USERS);

  const exists = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
  if (exists) throw new Error('An account with this email already exists.');

  const newUser: StoredUser = {
    id:           generateId(),
    name:         payload.name,
    email:        payload.email.toLowerCase(),
    role:         payload.role,
    passwordHash: hashPassword(payload.password),
  };

  await Storage.set(KEYS.USERS, [...users, newUser]);

  const { passwordHash: _, ...publicUser } = newUser;
  await Storage.set(KEYS.CURRENT_USER, publicUser);
  return publicUser;
};

// ─── Login ───────────────────────────────────────────────────
export const login = async (payload: LoginPayload): Promise<User> => {
  const users = await Storage.getList<StoredUser>(KEYS.USERS);

  const user = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
  if (!user) throw new Error('No account found with this email.');

  if (user.passwordHash !== hashPassword(payload.password)) {
    throw new Error('Incorrect password.');
  }

  const { passwordHash: _, ...publicUser } = user;
  await Storage.set(KEYS.CURRENT_USER, publicUser);
  return publicUser;
};

// ─── Logout ──────────────────────────────────────────────────
export const logout = async (): Promise<void> => {
  await Storage.remove(KEYS.CURRENT_USER);
};

// ─── Get session ─────────────────────────────────────────────
export const getCurrentUser = async (): Promise<User | null> => {
  return Storage.get<User>(KEYS.CURRENT_USER);
};

// ─── Update profile ──────────────────────────────────────────
export const updateProfile = async (
  userId: string,
  updates: Partial<Pick<User, 'name' | 'phone' | 'address' | 'profilePicture'>>
): Promise<User> => {
  const users = await Storage.getList<StoredUser>(KEYS.USERS);
  const updated = users.map((u) => u.id === userId ? { ...u, ...updates } : u);
  await Storage.set(KEYS.USERS, updated);

  const current = await Storage.get<User>(KEYS.CURRENT_USER);
  if (current?.id === userId) {
    const updatedCurrent = { ...current, ...updates };
    await Storage.set(KEYS.CURRENT_USER, updatedCurrent);
    return updatedCurrent;
  }

  const found = updated.find((u) => u.id === userId)! as StoredUser;
  const { passwordHash: _, ...publicUser } = found;
  return publicUser;
};

// ─── Change password ─────────────────────────────────────────
export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  const users = await Storage.getList<StoredUser>(KEYS.USERS);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error('User not found.');
  if (user.passwordHash !== hashPassword(oldPassword)) throw new Error('Current password is incorrect.');
  const updated = users.map((u) =>
    u.id === userId ? { ...u, passwordHash: hashPassword(newPassword) } : u
  );
  await Storage.set(KEYS.USERS, updated);
};
