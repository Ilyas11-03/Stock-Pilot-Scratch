// import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface AuthContextType {
//   token: string | null;
//   clientId: string | null;
//   login: (token: string, clientId: string | null) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [token, setToken] = useState<string | null>(null);
//   const [clientId, setClientId] = useState<string | null>(null);

//   const login = (token: string, clientId: string | null) => {
//     setToken(token);
//     setClientId(clientId);
//   };

//   const logout = () => {
//     setToken(null);
//     setClientId(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, clientId, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
