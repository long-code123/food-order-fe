// FoodList.tsx

import React, { useEffect, useState } from "react";
import { fetchFoods, Food } from "@/app/api/foodAPI";

const FoodList = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFoods();
        setFoods(data);
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {foods.map((food) => (
        <div key={food.foodId}>
          <h2>{food.foodName}</h2>
          <p>Price: {food.price}</p>
          <p>Description: {food.description}</p>
          <img src={food.foodImage} alt={food.foodName} />
        </div>
      ))}
    </div>
  );
};

export default FoodList;
