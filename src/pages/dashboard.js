import ProtectedRoute from '../components/ProtectedRoute';
import Logout from '../components/Logout';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  useEffect(() => {
    const createDatabase = async () => {
      const response = await fetch('/api/create-db', {
        method: 'POST',
      });
      if (!response.ok) {
        console.error('Failed to create database');
      }
    };

    createDatabase();
  }, []);

  return (
    <ProtectedRoute>
      <div>
        <h1>You are logged in.</h1>
        <p>Welcome to your dashboard!</p>
        <Logout />
      </div>
    </ProtectedRoute>
  );
}