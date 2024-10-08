import { getMainApi } from "@/config";

export interface Store {
    storeId: number;
    storeName: string;
    storeImage: string;
    address: string
  }
  
  const c = (path: string = ''): string => {
    return getMainApi().store + path;
  };
  

  export const fetchStores = async (): Promise<Store[]> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("Token is required");
    }
    try {
      const res = await fetch(c("/"), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw new Error("Failed to fetch stores");
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      throw error;
    }
  };
  
  export const createStore = async (storeData: Partial<Store>): Promise<Store> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("Token is required");
    }
    try {
      const res = await fetch(c("/"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(storeData)
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw new Error("Failed to create store");
      }
    } catch (error) {
      console.error("Error creating store:", error);
      throw error;
    }
  };
  
  export const updateStore = async (storeId: number, storeData: Partial<Store>): Promise<Store> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("Token is required");
    }
    try {
      const res = await fetch(c(`/${storeId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(storeData)
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw new Error("Failed to update store");
      }
    } catch (error) {
      console.error("Error updating store:", error);
      throw error;
    }
  };
  
  export const deleteStore = async (storeId: number): Promise<void> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("Token is required");
    }
    try {
      const res = await fetch(c(`/${storeId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error("Failed to delete store");
      }
    } catch (error) {
      console.error("Error deleting store:", error);
      throw error;
    }
  };
  