import React, { useContext, useEffect } from 'react';
import './CSS/Account.css';
import { UserContext } from '../Context/UserContext';

const Account = () => {
  const { user, fetchUserData } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="account-container">
      <h1>Account</h1>
      <div className="account-info">
        <p><strong>User Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
}

export default Account;
