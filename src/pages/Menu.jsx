import React, { useState, useEffect } from "react";
import MenuProductCard from "../components/UI/MenuProductCard";
import { Container, Row, Col } from "reactstrap";
import "../style/Menu.css";
import { useLocation } from "react-router-dom";

// React Slick
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  // Navigation
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categories = params.get("category");

  //------------------ Category Buttons Function (Filter) ------------------//
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(categories || "All");
  const [allProducts, setAllProducts] = useState(foodData);

  useEffect(() => {
    if (category === "All") {
      setAllProducts(foodData);
    }

    if (category === "Palabok") {
      const filteredProducts = foodData.filter(
        (item) => item.categoryTitle === "Palabok"
      );
      setAllProducts(filteredProducts);
    }

    if (category === "Rice Meals") {
      const filteredProducts = foodData.filter(
        (item) => item.categoryTitle === "Rice Meal"
      );
      setAllProducts(filteredProducts);
    }

    if (category === "Barbecue") {
      const filteredProducts = foodData.filter(
        (item) => item.categoryTitle === "Barbecue"
      );
      setAllProducts(filteredProducts);
    }

    if (category === "Drinks") {
      const filteredProducts = foodData.filter(
        (item) => item.categoryTitle === "Drinks"
      );
      setAllProducts(filteredProducts);
    }

    if (category === "Ice Creams") {
      const filteredProducts = foodData.filter(
        (item) => item.categoryTitle === "Ice Cream"
      );
      setAllProducts(filteredProducts);
    }

    if (category === "Extras") {
      const filteredProducts = foodData.filter(
        (item) => item.categoryTitle === "Extra"
      );
      setAllProducts(filteredProducts);
    }
  }, [category, foodData]);

  //------------------ Categories Slider Settings ------------------//
  const settings = {
    className: "categoriesBtn__slides",
    speed: 500,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div>
      <Container>
        {/*------------------ Category Buttons ------------------*/}
        <Slider {...settings}>
          <div className="slides__item">
            <button
              className="category__btn"
              onClick={() => setCategory("All")}
            >
              All
            </button>
          </div>

          <div className="slides__item">
            <button
              className="category__btn"
              onClick={() => setCategory("Palabok")}
            >
              Palabok
            </button>
          </div>

          <div className="slides__item">
            <button
              className="category__btn"
              onClick={() => setCategory("Rice Meals")}
            >
              Rice Meals
            </button>
          </div>

          <div className="slides__item">
            <button
              className="category__btn"
              onClick={() => setCategory("Barbecue")}
            >
              Barbecue
            </button>
          </div>

          <div className="slides__item">
            <button
              className="category__btn"
              onClick={() => setCategory("Drinks")}
            >
              Drinks
            </button>
          </div>

          <div className="slides__item">
            <button
              className="category__btn"
              onClick={() => setCategory("Ice Creams")}
            >
              Ice Cream
            </button>
          </div>

          <div className="slides__item">
            <button
              className="category__btn"
              onClick={() => setCategory("Extras")}
            >
              Extras
            </button>
          </div>
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
        {/*------------------ Rice Meals Row------------------*/}
        {/* <Row>
          <Col>
            {" "}
            <div className="menu__search">
              <i class="ri-search-line"></i>
              <input
                type="text"
                placeholder="Search item..."
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </Col>
        </Row> */}

        {/*Ice Cream Row*/}
        {/* <Row className="menu__iceCream">
          <Col lg="12" md="10" sm="8" className="mb-2 mt-3">
            <h5>Ice Cream</h5>
          </Col>{" "}
          {iceCreamCategory
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
        </Row> */}

        {/*Drinks Row*/}
        {/* <Row className="menu__drinks">
          <Col lg="12" className="mb-2 mt-3">
            <h5>Drinks</h5>
          </Col>

          {drinksCategory
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
        </Row> */}
      </Container>
    </div>
  );
};

export default Menu;
