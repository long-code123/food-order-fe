// foodAPI.ts

export interface Food {
  foodId: number;
  foodName: string;
  price: number;
  description: string;
  foodImage: string;
}

export const fetchFoods = async (): Promise<Food[]> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch("http://localhost:8000/api/v1/foods", {
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
