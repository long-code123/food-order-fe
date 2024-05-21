interface Food {
  foodId: number;
  foodName: string;
  price: number;
  description: string;
  foodImage: string;
}
async function getData() {
  const res = await fetch('http://localhost:8000/api/v1/foods');
  return res.json();
}

export default async function Home() {
  const data: Food[] = await getData();
  console.log(data);
  return (
    <div className="container">
      <div>
      <nav className="navbar">
        <ul className="nav-list">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
      </div>
      <div>
      <h1 className="header">All List Foods</h1>
      <div className="createFood">
        <input type="text" placeholder="Food Name" className="inputFood" />
        <input type="number" placeholder="Price" className="inputFood" />
        <input type="text" placeholder="Description" className="inputFood" />
        <input type="text" placeholder="Image URL" className="inputFood" />
        <button type="submit" className="btncreateFood">Add Food</button>
      </div>
      <ul className="foodContainer">
        {data.map(food => (
          <li key={food.foodId} className="listFood">
            <h2>{food.foodName}</h2>
            <p>Price: {food.price}</p>
            {/* <p>Description: {food.description}</p> */}
            <img src={food.foodImage} alt={food.foodName} />
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
