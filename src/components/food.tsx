import React, { useEffect, useState } from "react";
import { createFood, deleteFood, updateFood, fetchFoods, Food } from "@/app/api/foodAPI";
import { fetchAdminInfo, Admin } from "@/app/api/adminAPI";


const FoodList = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [editingFood, setEditingFood] = useState<Food | null>(null); 
  const [isEditing, setIsEditing] = useState<boolean>(false); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null); 

  const handleEditClick = (food: Food) => {
    setEditingFood(food);
    setIsEditing(true);
    document.querySelector(".container-superadmin-food")?.classList.add("editing");
  };

  const handleSaveClick = async (updatedFood: Food) => {
    try {
      await updateFood(updatedFood.foodId, updatedFood);
      const updatedFoods = await fetchFoods();
      setFoods(updatedFoods);
      setIsEditing(false); 
      document.querySelector(".container-superadmin-food")?.classList.remove("editing");
    } catch (error) {
      console.error("Error updating food:", error);
      setError("Failed to update food");
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    document.querySelector(".container-superadmin-food")?.classList.remove("editing");
  };

  const [newFood, setNewFood] = useState<Partial<Food>>({
    foodName: "",
    price: 0,
    description: "",
    foodImage: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFood({ ...newFood, [e.target.name]: e.target.value });
  };

  const handleCreateFood = async () => {
    try {
      if (!newFood.foodName || !newFood.price || !newFood.description || !newFood.foodImage) {
        setError("Please fill in all required fields.");
        return;
      }

      const createdFood = await createFood(newFood);
      console.log("Food created successfully:", createdFood);
      const updatedFoods = await fetchFoods();
      setFoods(updatedFoods);
      setSuccessMessage("Food added successfully!"); 
      setNewFood({  // Reset input fields
        foodName: "",
        price: 0,
        description: "",
        foodImage: ""
      });
      setTimeout(() => {
        setSuccessMessage(null); 
      }, 3000);
    } catch (error) {
      console.error("Error creating food:", error);
      setError("Failed to create food");
    }
  };

  const handleDeleteFood = async (foodId: number) => {
    try {
      await deleteFood(foodId);
      const updatedFoods = await fetchFoods();
      setFoods(updatedFoods);
    } catch (error) {
      console.error("Error deleting food:", error);
      setError("Failed to delete food");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFoods();
        const dataAdmin = await fetchAdminInfo();
        setFoods(data);
        setAdmin(dataAdmin);
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!admin) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container-superadmin-food">
      <div className="createFood">
        {error && <p>Error: {error}</p>}
        {successMessage && <p>{successMessage}</p>}
        {admin.role === 'super admin' && (
          <>
            <input type="text" placeholder="Food Name" className="inputFood" name="foodName" value={newFood.foodName} onChange={handleInputChange} />
            <input type="number" placeholder="Price" className="inputFood" name="price" value={newFood.price} onChange={handleInputChange} />
            <input type="text" placeholder="Description" className="inputFood" name="description" value={newFood.description} onChange={handleInputChange} />
            <input type="text" placeholder="Image URL" className="inputFood" name="foodImage" value={newFood.foodImage} onChange={handleInputChange} />
            <button onClick={handleCreateFood} className="btn">Add Food</button>
          </>
        )}
      </div>
      <ul className="foodContainers">
        {foods.map(food => (
          <li key={food.foodId} className="listFood">
            <h2>{food.foodName}</h2>
            <p>Price: {food.price}</p>
            <p>Description: {food.description}</p>
            <img src={food.foodImage} alt={food.foodName} />
            {admin.role === 'super admin' &&
              <>
                <div>
                  <button onClick={() => handleEditClick(food)} className="btn">Update Food</button>
                </div>
                <button onClick={() => handleDeleteFood(food.foodId)} className="btn">Delete Food</button>
              </>
            }
          </li>
        ))}
      </ul>
      {isEditing && editingFood && (
        <div className="editFood">
          <h2>Edit Food</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSaveClick(editingFood);
          }}>
            <div>Name</div>
            <input type="text" value={editingFood.foodName} onChange={(e) => setEditingFood({ ...editingFood, foodName: e.target.value })} className="inputField" />
            <div>Price</div>
            <input type="number" value={editingFood.price} onChange={(e) => setEditingFood({ ...editingFood, price: Number(e.target.value) })} className="inputField" />
            <div>Description</div>
            <input type="text" value={editingFood.description} onChange={(e) => setEditingFood({ ...editingFood, description: e.target.value })} className="inputField" />
            <div>Image URL</div>
            <input type="text" value={editingFood.foodImage} onChange={(e) => setEditingFood({ ...editingFood, foodImage: e.target.value })} className="inputField" />
            <button type="submit" className="btn">Save</button>
            <button onClick={handleCancelClick} className="btn">Cancel</button>
          </form>
        </div>
      )}
    </div>
  );

};

export default FoodList;

