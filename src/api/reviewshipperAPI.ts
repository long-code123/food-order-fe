export interface Reviewshipper {
  id: number;
  rating: string;
  comment: string;
}

export const fetchReviewshippers = async (): Promise<Reviewshipper[]> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch("http://localhost:8000/api/v1/reviewshippers", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Failed to fetch reviewshippers");
    }
  } catch (error) {
    console.error("Error fetching reviewshippers:", error);
    throw error;
  }
};
export const deleteReviewshipper = async (reviewshipperId: number): Promise<void> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch(`http://localhost:8000/api/v1/reviewshippers/${reviewshipperId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      throw new Error("Failed to delete reviewshipper");
    }
  } catch (error) {
    console.error("Error deleting reviewshipper:", error);
    throw error;
  }
};
export const fetchReviewByShipper = async (shipperId: number): Promise<Reviewshipper[]> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch(`http://localhost:8000/api/v1/shippers/${shipperId}/review`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Failed to fetch review by shipper");
    }
  } catch (error) {
    console.error("Error fetching review by shipper:", error);
    throw error;
  }
};