export interface Reviewstore {
  id: number;
  rating: string;
  comment: string;
}

export const fetchReviewstores = async (): Promise<Reviewstore[]> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch("http://localhost:8000/api/v1/reviewstores", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Failed to fetch reviewstores");
    }
  } catch (error) {
    console.error("Error fetching reviewstores:", error);
    throw error;
  }
};
export const deleteReviewstore = async (reviewstoreId: number): Promise<void> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch(`http://localhost:8000/api/v1/reviewstores/${reviewstoreId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      throw new Error("Failed to delete reviewstore");
    }
  } catch (error) {
    console.error("Error deleting reviewstore:", error);
    throw error;
  }
};

export const fetchReviewByStore = async (storeId: number): Promise<Reviewstore[]> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch(`http://localhost:8000/api/v1/stores/${storeId}/reviews`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Failed to fetch review by store");
    }
  } catch (error) {
    console.error("Error fetching review by store:", error);
    throw error;
  }
};

