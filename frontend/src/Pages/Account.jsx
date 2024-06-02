import React, { useContext } from 'react';
import './CSS/Account.css';
import { UserContext } from '../Context/UserContext'; // Kullanıcı bilgileri için context

const Account = () => {
  const { user } = useContext(UserContext); // UserContext'ten kullanıcı bilgilerini alıyoruz

  return (
    <div className="account-container">
      <h1>Account</h1>
      <div className="account-info">
        <p><strong>User Name:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
}

export default Account;
