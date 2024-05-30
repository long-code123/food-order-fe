export interface Reviewfood {
    rating: string;
    comment: string;
  }
  
  export const fetchReviewfoods = async (): Promise<Reviewfood[]> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("Token is required");
    }
    try {
      const res = await fetch("http://localhost:8000/api/v1/reviewfoods", {
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
      const res = await fetch(`http://localhost:8000/api/v1/reviewfoods/${reviewfoodId}`, {
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
  