'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Food {
  foodId: number;
  foodName: string;
  price: number;
  description: string;
  foodImage: string;
}

interface User {
  userId: number;
  userName: string;
  userImage: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
}

interface Shipper {
  shipperId: number;
  shipperName: string;
  shipperImage: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
}

interface Store {
  storeId: number;
  storeName: string;
  storeImage: string;
  address: string;
}

async function fetchData(endpoint: string, token: string) {
  const res = await fetch(`http://localhost:8000/api/v1/${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}

async function createFood(token: string, food: Omit<Food, 'foodId'>) {
  const res = await fetch('http://localhost:8000/api/v1/foods', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(food)
  });
  return res.json();
}

async function updateFood(token: string, foodId: number, food: Omit<Food, 'foodId'>) {
  const res = await fetch(`http://localhost:8000/api/v1/foods/${foodId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(food)
  });
  return res.json();
}

async function deleteFood(token: string, foodId: number) {
  const res = await fetch(`http://localhost:8000/api/v1/foods/${foodId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}

export default function Home() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [shippers, setShippers] = useState<Shipper[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [newFood, setNewFood] = useState<Partial<Food>>({});

  
  useEffect(() => {
    const token = localStorage.getItem('userToken');

    const userRole = localStorage.getItem('userRole'); // Get user role from local storage
    setRole(userRole);
    console.log(userRole);

    if (token) {
      Promise.all([
        fetchData('foods', token),
        fetchData('users', token),
        fetchData('shippers', token),
        fetchData('stores', token),
      ])
        .then(([foodsData, usersData, shippersData, storesData]) => {
          setFoods(foodsData);
          setUsers(usersData);
          setShippers(shippersData);
          setStores(storesData);
          setLoading(false);
          if (!Array.isArray(foodsData) || !Array.isArray(usersData) || !Array.isArray(shippersData) || !Array.isArray(storesData)) {
            setError('You do not have access to this resource');
            setLoading(false);
            return;
          }          
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      // Handle case where token is not available in localStorage
      setError('Token not found in localStorage');
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    router.push('/login'); // Redirect to login page after logout
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFood({ ...newFood, [e.target.name]: e.target.value });
  };

  const handleCreateFood = async () => {
    const token = localStorage.getItem('userToken');
  
    if (token) {
      try {
        const createdFood = await createFood(token, newFood as Omit<Food, 'foodId'>);
        setFoods([...foods, createdFood]);
      } catch (error) {
        setError('Failed to create food');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <div>
        <nav className="navbar">
          <ul className="nav-list">
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
            <li><button onClick={handleLogout}>Logout</button></li> {/* Thêm nút Logout */}
          </ul>
        </nav>
      </div>
      <div>
        <h1 className="header">All List Foods</h1>
        {role === 'super admin' && (
          <div className="createFood">
            <input type="text" placeholder="Food Name" className="inputFood" name="foodName" onChange={handleInputChange} />
            <input type="number" placeholder="Price" className="inputFood" name="price" onChange={handleInputChange} />
            <input type="text" placeholder="Description" className="inputFood" name="description" onChange={handleInputChange} />
            <input type="text" placeholder="Image URL" className="inputFood" name="foodImage" onChange={handleInputChange} />
            <button onClick={handleCreateFood} className="btncreateFood">Add Food</button>
          </div>
        )}
        <ul className="foodContainers">
          {foods.map(food => (
            <li key={food.foodId} className="listsssFood">
              <h2>{food.foodName}</h2>
              <p>Price: {food.price}</p>
              {/* <p>Description: {food.description}</p> */}
              <img src={food.foodImage} alt={food.foodName} />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1 className="header">All List Users</h1>
        <ul className="userContainer">
          {users.map(user => (
            <li key={user.userId} className="listUser">
              <h2>{user.userName}</h2>
              <p>Email: {user.email}</p>
              {/* Hiển thị các thông tin khác của người dùng nếu có */}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1 className="header">All List Stores</h1>
        <ul className="storeContainer">
          {stores.map(store => (
            <li key={store.storeId} className="listStore">
              <h2>{store.storeName}</h2>
              <p>Address: {store.address}</p>
              {/* Hiển thị các thông tin khác của người dùng nếu có */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
