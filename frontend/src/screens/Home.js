import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import img1 from '../Mutton Biryani.jpeg'
import img2 from '../paneer tikka masala.jpeg'
import img3 from '../Rasgulla.jpeg'
import { useParams } from 'react-router-dom';

export default function Home() {

  const { table } = useParams();
  console.log(table)
  localStorage.setItem('Table', table)
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState('');

  const loadFoodItems = async () => {
    try {
      let response = await fetch("http://localhost:5000/api/auth/foodData", {
        method: 'POST',
      });

      response = await response.json();
      setFoodItems(response[0]);
      setFoodCat(response[1]);
      
      
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  useEffect(() => {
    console.log(foodItems,foodCat)
    loadFoodItems();
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-inner" id="carousel">
            <div className="carousel-caption" style={{ zIndex: "9" }}>
              <div className="d-flex justify-content-center">
                <input
                  className="form-control me-2 w-75 bg-white text-dark"
                  type="search"
                  placeholder="Search in here..."
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn text-white bg-danger" onClick={() => setSearch('')}>X</button>
              </div>
            </div>
            <div className="carousel-item active">
              <img
                src={img1}
                className="d-block w-100"
                style={{ filter: "brightness(30%)" }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src={img2}
                className="d-block w-100"
                style={{ filter: "brightness(30%)" }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src={img3}
                className="d-block w-100"
                style={{ filter: "brightness(30%)" }}
                alt="..."
              />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      {/* <Card
        foodName="Pastry"
        item=" hi"
        options="by"
        ImgSrc={img}
      /> */}
      <div className="container">
        {foodCat.length > 0 ? (
          foodCat.map((data) => (
            <div key={data.id} className="row mb-3">
              <div className="fs-3 m-3">
                {data.CategoryName}
              </div>
              <hr
                id="hr-success"
                style={{
                  height: "4px",
                  backgroundImage: "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))"
                }}
              />
              {foodItems.length > 0 ? (
                foodItems
                  .filter(
                    (items) =>
                      items.CategoryName === data.CategoryName &&
                      items.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((filterItems) => (
                    <div key={filterItems.id} className="col-12 col-md-6 col-lg-3">
                      <Card
                        foodName={filterItems.name}
                        item={filterItems}
                        options={filterItems.options[0]}
                        ImgSrc={filterItems.img}
                      />
                    </div>
                  ))
              ) : (
                <div>No Such Data</div>
              )}
            </div>
          ))
        ) : (
          <div>Loading categories...</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
