'use client'
import {jwtDecode} from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/login');
      return;
    }
    const decodedToken: { exp: number } = jwtDecode(token);
    const expirationTime = decodedToken.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    alert("Time current : " +  currentTime + "\n" +  "Time expiration: " + expirationTime)
    if (currentTime >= expirationTime) {
      localStorage.removeItem('userToken');
      router.push('/login');
    }
  }, []);
  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};