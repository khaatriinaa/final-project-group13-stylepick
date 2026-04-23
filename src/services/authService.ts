// src/services/authService.ts

import { Storage } from '../storage/storage';
import { KEYS } from '../storage/keys';
import { User, UserRole } from '../types';
import { supabase } from './supabaseClient'; // ← ADDED

const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (Math.imul(31, hash) + password.charCodeAt(i)) | 0;
  }
  return hash.toString(16);
};

// ─── Log activity to Supabase backend ────────────────────────
const logActivityToSupabase = async (
  action: 'LOGIN' | 'LOGOUT',
  userId: string,
  email: string,
  role: string
) => {
  try {
    const phTime = new Date().toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      year:     'numeric',
      month:    'long',
      day:      'numeric',
      hour:     '2-digit',
      minute:   '2-digit',
      second:   '2-digit',
      hour12:   true,
    });

    const { error } = await supabase.from('activity_logs').insert({
      user_id:  userId,
      email:    email,
      role:     role,
      action:   action,
      ph_time:  phTime,
    });

    if (error) throw error;
  } catch (err) {
    console.warn('Failed to log activity to Supabase:', err);
  }
};
// ─────────────────────────────────────────────────────────────

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

  // ─── SUPABASE: Register user in Supabase Auth + profiles table ───
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: payload.email.toLowerCase(),
      password: payload.password,
      options: {
        data: {
          full_name: payload.name,  // ✅ ADDED
          role: payload.role,       // ✅ ADDED - triggers buyer_profiles or seller_profiles insert
        }
      }
    });

    console.log('Supabase signUp response:', JSON.stringify(authData));  // ✅ DEBUG
    console.log('Supabase signUp error:', JSON.stringify(authError));    // ✅ DEBUG

    if (authError) throw authError;

    // ─── SUPABASE: Manually insert into profiles table ───────────────
    if (authData?.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id:           authData.user.id,
        email:        payload.email.toLowerCase(),
        full_name:    payload.name,
        role:         payload.role,
        phone_number: null,
        avatar_url:   null,
      });

      if (profileError) {
        console.warn('Supabase profiles insert error:', JSON.stringify(profileError)); // ✅ DEBUG
      } else {
        console.log('Supabase profiles insert success for:', payload.email); // ✅ DEBUG
      }
    }
    // ─────────────────────────────────────────────────────────────────

  } catch (supabaseError) {
    console.warn('Supabase register error:', JSON.stringify(supabaseError)); // ✅ DEBUG
  }
  // ─────────────────────────────────────────────────────────────────

  return publicUser;
};

// ─── Login ───────────────────────────────────────────────────
export const login = async (payload: LoginPayload): Promise<User> => {

  // ─── SUPABASE: Try signing in via Supabase Auth first (works on any device) ───
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email:    payload.email.toLowerCase(),
      password: payload.password,
    });

    if (signInError) throw signInError;

    if (signInData?.user) {
      // ─── Fetch profile from Supabase profiles table ──────────────
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signInData.user.id)
        .single();

      if (profileError) {
        console.warn('Supabase profile fetch error:', JSON.stringify(profileError));
      }

      if (profileData) {
        // ─── Build publicUser from Supabase profile ───────────────
        const publicUser: User = {
          id:             signInData.user.id,
          name:           profileData.full_name   ?? signInData.user.email ?? '',
          email:          signInData.user.email   ?? payload.email.toLowerCase(),
          role:           profileData.role         as UserRole,
          profilePicture: profileData.avatar_url  ?? undefined,
          phone:          profileData.phone_number ?? undefined,
        };

        // ─── Sync to local storage so offline works too ───────────
        await Storage.set(KEYS.CURRENT_USER, publicUser);

        const users = await Storage.getList<StoredUser>(KEYS.USERS);
        const existsLocally = users.find(
          (u) => u.email.toLowerCase() === publicUser.email.toLowerCase()
        );
        if (!existsLocally) {
          // Save to local users list without a passwordHash (Supabase manages auth)
          await Storage.set(KEYS.USERS, [...users, { ...publicUser, passwordHash: '' }]);
        }
        // ──────────────────────────────────────────────────────────

        // ─── LOG: Login activity to Supabase backend ──────────────
        await logActivityToSupabase('LOGIN', publicUser.id, publicUser.email, publicUser.role);
        // ──────────────────────────────────────────────────────────

        console.log('Supabase login success for:', publicUser.email); // ✅ DEBUG
        return publicUser;
      }
    }
  } catch (supabaseError) {
    console.warn('Supabase login failed, falling back to local:', supabaseError);
  }
  // ────────────────────────────────────────────────────────────────────────────

  // ─── FALLBACK: Local storage login (for offline or Supabase failure) ────────
  const users = await Storage.getList<StoredUser>(KEYS.USERS);

  const user = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
  if (!user) throw new Error('No account found with this email.');

  if (user.passwordHash !== hashPassword(payload.password)) {
    throw new Error('Incorrect password.');
  }

  const { passwordHash: _, ...publicUser } = user;
  await Storage.set(KEYS.CURRENT_USER, publicUser);

  // ─── LOG: Login activity to Supabase backend ─────────────────────
  await logActivityToSupabase('LOGIN', publicUser.id, publicUser.email, publicUser.role);
  // ─────────────────────────────────────────────────────────────────

  return publicUser;
  // ────────────────────────────────────────────────────────────────────────────
};

// ─── Logout ──────────────────────────────────────────────────
export const logout = async (): Promise<void> => {
  // ─── Capture user before clearing session ────────────────────────
  const currentUser = await Storage.get<User>(KEYS.CURRENT_USER);
  // ─────────────────────────────────────────────────────────────────

  await Storage.remove(KEYS.CURRENT_USER);

  // ─── SUPABASE: Sign out from Supabase Auth ───────────────────────
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (supabaseError) {
    console.warn('Supabase logout error (local logout succeeded):', supabaseError);
  }
  // ─────────────────────────────────────────────────────────────────

  // ─── LOG: Logout activity to Supabase backend ────────────────────
  if (currentUser) {
    await logActivityToSupabase('LOGOUT', currentUser.id, currentUser.email, currentUser.role);
  }
  // ─────────────────────────────────────────────────────────────────
};

// ─── Get session ─────────────────────────────────────────────
export const getCurrentUser = async (): Promise<User | null> => {
  return Storage.get<User>(KEYS.CURRENT_USER);
};

// ─── SUPABASE: Get Supabase session ──────────────────────────
export const getSupabaseSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};
// ─────────────────────────────────────────────────────────────

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

    // ─── SUPABASE: Update profile in Supabase profiles table ─────────
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      if (error) throw error;
    } catch (supabaseError) {
      console.warn('Supabase updateProfile error (local update succeeded):', supabaseError);
    }
    // ───────────────────────────────────────────────────────────────────

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

  // ─── SUPABASE: Update password in Supabase Auth ──────────────────
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  } catch (supabaseError) {
    console.warn('Supabase changePassword error (local update succeeded):', supabaseError);
  }
  // ─────────────────────────────────────────────────────────────────
};