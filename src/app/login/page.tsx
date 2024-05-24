'use client'
import { useState } from "react";
import axios from "axios";
import React from "react";
import { useRouter } from "next/navigation";
import { json } from "stream/consumers";

const Home = () => {
  const [adminName, setAdminName] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<string | null>(null);


  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/admin/login", {
        adminName, // Ensure the keys match your backend's expected keys
        password
      });
      const token = response.data.token;
      setToken(token);
      localStorage.setItem('userToken', token);
      alert("Login successful!" + response.data.token);
      // Viet api admin get /me de lay info cua admin hien tai
      router.push('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert("Invalid username or password");
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
          <div className="password-input">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              required
            />
            <span className="toggle-password" onClick={toggleShowPassword}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Home;
