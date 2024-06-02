import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) return;

    const response = await fetch('http://localhost:4000/user', {
      method: 'GET',
      headers: {
        'auth-token': token,
      },
    });

    const data = await response.json();
    console.log("Fetched User Data:", data); // Konsola veri ekleyerek kontrol edin
    setUser(data);
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
}
