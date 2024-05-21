'use client'
import { useState } from "react";
import axios from "axios";
import React from "react";
import { useRouter } from "next/router";

const Home = () => {
  const [adminName, setAdminName] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  // const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/admin/login", {
        adminName, // Ensure the keys match your backend's expected keys
        password
      });
      const token = response.data.token;
      setToken(token);
      alert("Login successful!" + token);
      // router.push('/home');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert("Invalid username or password");
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <div className="container_login">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            type="text"
            id="username"
            name="username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            name="password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Home;
