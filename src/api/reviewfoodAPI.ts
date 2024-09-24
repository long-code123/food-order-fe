import { getMainApi } from "@/config";

export interface Reviewfood {
    rating: string;
    comment: string;
  }
  
  const c = (path: string = ''): string => {
    return getMainApi().payment + path;
  };
  

  export const fetchReviewfoods = async (): Promise<Reviewfood[]> => {
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
        throw new Error("Failed to fetch reviewfoods");
      }
    } catch (error) {
      console.error("Error fetching reviewfoods:", error);
      throw error;
    }
  };
  export const deleteReviewfood = async (reviewfoodId: number): Promise<void> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("Token is required");
    }
    try {
      const res = await fetch(c(`/${reviewfoodId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error("Failed to delete reviewfood");
      }
    } catch (error) {
      console.error("Error deleting reviewfood:", error);
      throw error;
    }
  };
  