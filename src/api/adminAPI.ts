import { getMainApi } from "@/config";

export interface Admin {
  adminId: number;
  adminName: string;
  email: string;
  password: string;
  role: string;
}

const c = (path: string = ''): string => {
  return getMainApi().admin + path;
};

export const fetchAdmins = async (): Promise<Admin[]> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch(c('/'), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Failed to fetch admins");
    }
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
};

export const createAdmin = async (adminData: Partial<Admin>): Promise<Admin> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch(c("/register"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(adminData)
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Failed to create admin");
    }
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};

export const updateAdmin = async (adminId: number, adminData: Partial<Admin>): Promise<Admin> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch(c(`/${adminId}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(adminData)
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Failed to update admin");
    }
  } catch (error) {
    console.error("Error updating admin:", error);
    throw error;
  }
};

export const deleteAdmin = async (adminId: number): Promise<void> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch(c(`${adminId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      throw new Error("Failed to delete admin");
    }
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw error;
  }
};

export const fetchAdminInfo = async (): Promise<Admin> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch(c("/me"), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
