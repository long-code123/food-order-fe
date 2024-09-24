import { getMainApi } from "@/config";

export interface Voucher {
    voucherId: number;
    description: string;
    value: number;
    conditition: string;
  }

  const c = (path: string = ''): string => {
    return getMainApi().voucher + path;
  };
  
  
  export const fetchVouchers = async (): Promise<Voucher[]> => {
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
        throw new Error("Failed to fetch vouchers");
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      throw error;
    }
  };
  
  export const createVoucher = async (voucherData: Partial<Voucher>): Promise<Voucher> => {
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
        body: JSON.stringify(voucherData)
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw new Error("Failed to create voucher");
      }
    } catch (error) {
      console.error("Error creating voucher:", error);
      throw error;
    }
  };
  
  export const updateVoucher = async (voucherId: number, voucherData: Partial<Voucher>): Promise<Voucher> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("Token is required");
    }
    try {
      const res = await fetch(c(`/${voucherId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(voucherData)
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw new Error("Failed to update voucher");
      }
    } catch (error) {
      console.error("Error updating voucher:", error);
      throw error;
    }
  };
  
  export const deleteVoucher = async (voucherId: number): Promise<void> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("Token is required");
    }
    try {
      const res = await fetch(c(`/${voucherId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error("Failed to delete voucher");
      }
    } catch (error) {
      console.error("Error deleting voucher:", error);
      throw error;
    }
  };
  