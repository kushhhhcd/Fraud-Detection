import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_ACCOUNTS = {
  analyst: {
    name: 'Sarah Kowalski',
    initials: 'SK',
    role: 'analyst',
    roleTitle: 'Fraud Analyst',
    email: 'analyst@fraud-detector.local',
    scope: 'Case Investigation & Queue',
  },
  admin: {
    name: 'Alex Mercer',
    initials: 'AM',
    role: 'admin',
    roleTitle: 'Project Admin',
    email: 'admin@fraud-detector.local',
    scope: 'Full Model Governance',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sentinel_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default logged in as Analyst for seamless student demo
    return {
      ...DEMO_ACCOUNTS.analyst,
      isAuthenticated: true,
      modelEnvironment: 'rf-balanced',
      modelName: 'Random Forest (v1.0 - Balanced via SMOTE)',
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('sentinel_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sentinel_user');
    }
  }, [user]);

  const login = (role = 'analyst', email = '', modelEnv = 'rf-balanced') => {
    const base = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.analyst;
    const modelMap = {
      'rf-balanced': 'Random Forest Classifier (v1.0 - Balanced via SMOTE)',
    };

    setUser({
      ...base,
      email: email || base.email,
      modelEnvironment: 'rf-balanced',
      modelName: modelMap['rf-balanced'],
      isAuthenticated: true,
    });
  };

  const logout = () => {
    setUser({
      ...DEMO_ACCOUNTS.analyst,
      isAuthenticated: false,
    });
  };

  const switchRole = (newRole) => {
    if (!DEMO_ACCOUNTS[newRole]) return;
    setUser((prev) => ({
      ...(prev || {}),
      ...DEMO_ACCOUNTS[newRole],
      isAuthenticated: true,
    }));
  };

  const hasPermission = (permission) => {
    if (!user || !user.isAuthenticated) return false;
    if (user.role === 'admin') return true;

    // Analyst permissions
    const analystPermissions = ['review_cases', 'view_metrics', 'submit_verdict'];
    return analystPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        switchRole,
        hasPermission,
        isAdmin: user?.role === 'admin',
        isAnalyst: user?.role === 'analyst',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
