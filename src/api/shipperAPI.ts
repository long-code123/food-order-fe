export interface Shipper {
    shipperId: number;
    shipperName: string;
    shipperImage: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
    address: string;
    password: string;
  }
  
  export const fetchShippers = async (): Promise<Shipper[]> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("Token is required");
    }
    try {
      const res = await fetch("http://localhost:8000/api/v1/shippers", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw new Error("Failed to fetch shippers");
      }
    } catch (error) {
      console.error("Error fetching shippers:", error);
      throw error;
    }
  };
  
  export const createShipper = async (shipperData: Partial<Shipper>): Promise<Shipper> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("Token is required");
    }
    try {
      console.log(JSON.stringify(shipperData));
      const res = await fetch("http://localhost:8000/api/v1/shippers", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shipperData)
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        console.log(res.json);
        throw new Error("Failed to create shipper");
      }
    } catch (error) {
      console.error("Error creating shipper:", error);
      throw error;
    }
  };
  
  export const updateShipper = async (shipperId: number, shipperData: Partial<Shipper>): Promise<Shipper> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("Token is required");
    }
    try {
      const res = await fetch(`http://localhost:8000/api/v1/shippers/${shipperId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shipperData)
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw new Error("Failed to update shipper");
      }
    } catch (error) {
      console.error("Error updating shipper:", error);
      throw error;
    }
  };
  
  export const deleteShipper = async (shipperId: number): Promise<void> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("Token is required");
    }
    try {
      const res = await fetch(`http://localhost:8000/api/v1/shippers/${shipperId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error("Failed to delete shipper");
      }
    } catch (error) {
      console.error("Error deleting shipper:", error);
      throw error;
    }
  };
  