// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data);
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to fetch users. Please try again later.');
    }
  };

  const addUser = async () => {
    try {
        const response = await axios.post('http://localhost:5000/users', { name, email });
        setUsers([...users, response.data]);
        setName('');
        setEmail('');
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Failed to add user. Please try again later.');
    }
  };

  const deleteUser = async (id) => {
    try {
        await axios.delete(`http://localhost:5000/users/${id}`);
        setUsers(users.filter(user => user.id !== id));
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again later.');
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={addUser}>Add User</button>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
