import React, { useState, useEffect } from "react";
import MenuProductCard from "../components/UI/MenuProductCard";
import { Container, Row, Col } from "reactstrap";
import "../style/Menu.css";
import { useLocation } from "react-router-dom";

// React Slick
import Slider from "react-slick";

// Connect Firebase
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";

const Menu = () => {
  //------------------ Retrieve Food Data ------------------//
  const [foodData, setFoodData] = useState([]);
  useEffect(() => {
    //LISTEN (REALTIME)
    const unsub = onSnapshot(
      collection(db, "FoodData"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setFoodData(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  //------------------ Retrieve Product Categories Data ------------------//
  const [productCategoriesData, setProductCategoriesData] = useState([]);
  useEffect(() => {
    //LISTEN (REALTIME)
    const unsub = onSnapshot(
      collection(db, "ProductCategories"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setProductCategoriesData(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);
  // console.log(productCategoriesData);

  // Navigation
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categories = params.get("category");

  //------------------ Category Buttons Function (Filter) ------------------//
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(categories || "All");
  const [allProducts, setAllProducts] = useState(foodData);
  const [label, setLabel] = useState("All");
  useEffect(() => {
    if (category === "All") {
      setAllProducts(foodData);
      setLabel("All");
    } else {
      const filteredProducts = foodData.filter(
        (item) => item.categoryTitle === category
      );
      setAllProducts(filteredProducts);
      setLabel(category);
    }
  }, [category, foodData]);

  //------------------ Categories Slider Settings ------------------//
  const settings = {
    className: "categoriesBtn__slides",
    speed: 500,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
    ],
  };

  return (
    <div>
      <Container>
        {/*------------------ Category Buttons ------------------*/}
        <Row>
          <h6 className="slider__title mt-5">Menu Categories</h6>
          <p className="slider__subtitle">You selected category "{label}"</p>
        </Row>

        <Slider {...settings}>
          <div className="slides__item">
            <button
              className="category__btn"
              onClick={() => setCategory("All")}
            >
              All
            </button>
          </div>

          {productCategoriesData.map((category) => {
            return (
              <div className="slides__item" key={category.productCategoryId}>
                <button
                  // className="category__btn"
                  className={`category__btn ${
                    category.categoryName === categories ? "active" : ""
                  }`}
                  onClick={() => setCategory(category.categoryName)}
                >
                  {category.categoryName}
                </button>
              </div>
            );
          })}
        </Slider>

        {/*------------------ Display Food ------------------*/}
        <section>
          <Row>
            {allProducts
              .filter((post) => {
                if (query === "") {
                  return post;
                } else if (
                  post.title.toLowerCase().includes(query.toLowerCase()) ||
                  post.category.toLowerCase().includes(query.toLowerCase())
                ) {
                  return post;
                }
              })
              .map((item) => (
                <Col lg="3" md="6" sm="6" key={item.id}>
                  <MenuProductCard item={item} />
                </Col>
              ))}
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default Menu;
