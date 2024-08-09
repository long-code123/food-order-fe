export interface Food {
  foodId: number;
  foodName: string;
  price: number;
  description: string;
  foodImage: string;
  categoryId: number;
  storeId: number;
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

export const createFood = async (foodData: Partial<Food>): Promise<Food> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch("http://localhost:8000/api/v1/foods", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(foodData)
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Failed to create food");
    }
  } catch (error) {
    console.error("Error creating food:", error);
    throw error;
  }
};

export const updateFood = async (foodId: number, foodData: Partial<Food>): Promise<Food> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch(`http://localhost:8000/api/v1/foods/${foodId}`, {
      method: 'PUT', // Sử dụng method PUT để cập nhật dữ liệu
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(foodData)
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Failed to update food");
    }
  } catch (error) {
    console.error("Error updating food:", error);
    throw error;
  }
};

export const deleteFood = async (foodId: number): Promise<void> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch(`http://localhost:8000/api/v1/foods/${foodId}`, {
      method: 'DELETE', // Sử dụng method DELETE để xóa dữ liệu
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      throw new Error("Failed to delete food");
    }
  } catch (error) {
    console.error("Error deleting food:", error);
    throw error;
  }
};
export const fetchFoodsByStore = async (storeId: number): Promise<Food[]> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch(`http://localhost:8000/api/v1/stores/${storeId}/foods`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Failed to fetch foods by store");
    }
  } catch (error) {
    console.error("Error fetching foods by store:", error);
    throw error;
  }
};

export const fetchFoodsByCategory = async (categoryId: number): Promise<Food[]> => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch(`http://localhost:8000/api/v1/categories/${categoryId}/foods`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Failed to fetch foods by category");
    }
  } catch (error) {
    console.error("Error fetching foods by category:", error);
    throw error;
  }
};