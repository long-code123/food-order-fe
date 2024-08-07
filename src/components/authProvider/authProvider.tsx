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

    const expirationDate = new Date(expirationTime * 1000).toLocaleString();
    const currentDate = new Date(currentTime * 1000).toLocaleString();

    // alert(`Time current: ${currentDate}\nTime expiration: ${expirationDate}`);
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