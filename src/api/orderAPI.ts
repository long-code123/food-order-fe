import { getMainApi } from "@/config";

export interface Order {
    id: number;
    deliveryTime: string;
    userId: number;
    shipperId: number;
    status: string;
}

const c = (path: string = ''): string => {
  return getMainApi().order + path;
};


export const fetchOrders = async (): Promise<Order[]> => {
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
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  

export const fetchOrderByShipper = async (shipperId: number): Promise<Order[]> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error("Token is required");
    }
    try {
        const res = await fetch(getMainApi().orderbyshipper(shipperId), {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.ok) {
            const data = await res.json();
            return data;
        } else {
            throw new Error("Failed to fetch orders by shipper");
        }
    } catch (error) {
        console.error("Error fetching orders by store:", error);
        throw error;
    }
};