import { getMainApi } from "@/config";
import axios from 'axios'
import { log } from "console";
export interface Admin {
  adminId: number;
  adminName: string;
  email: string;
  password: string;
  role: string;
}

const c = (path: string = ''): string => {
  return getMainApi().login + path;
};

export const login = async ({username, password}:any): Promise<any> => {
  
    try {
        const res = await axios.post(c("/login"), {
            username, // Ensure the keys match your backend's expected keys
            password
          });
    } catch (error) {
      console.error("Error fetching admins:", error);
      throw error;
    }
  };

export default {
    login
}