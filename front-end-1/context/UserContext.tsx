import React, { createContext, useContext, useState } from 'react';

type User = {
  email: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'strength';
  experience: 'beginner' | 'intermediate' | 'advanced';
  frequency: number; // Number of workouts per week
};

type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  const clearUser = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
