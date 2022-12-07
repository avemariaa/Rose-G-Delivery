import React, { useState, useEffect } from "react";
import MenuProductCard from "../components/UI/MenuProductCard";
import { Container, Row, Col } from "reactstrap";
import FoodProductData from "../assets/sample-data/FoodProduct";
import "../style/Menu.css";
const Menu = () => {
  const [query, setQuery] = useState("");

  const iceCreamCategory = FoodProductData.filter((iceCream) => {
    return iceCream.category === "Ice Cream";
  });

  const drinksCategory = FoodProductData.filter((drinks) => {
    return drinks.category === "Drinks";
  });

  //Category Button
  const [category, setCategory] = useState("ALL");
  const [allProducts, setAllProducts] = useState(FoodProductData);

  useEffect(() => {
    if (category === "ALL") {
      setAllProducts(FoodProductData);
    }

    if (category === "ICE-CREAM") {
      const filteredProducts = FoodProductData.filter(
        (item) => item.category === "Ice Cream"
      );
      setAllProducts(filteredProducts);
    }

    if (category === "DRINKS") {
      const filteredProducts = FoodProductData.filter(
        (item) => item.category === "Drinks"
      );
      setAllProducts(filteredProducts);
    }
  });

  return (
    <div>
      <Container>
        <Row>
          <div className="category__title ">
            <Col className="d-flex align-items-center gap-5">
              <button
                className="category__btn"
                onClick={() => setCategory("ALL")}
              >
                All
              </button>
              <button
                className="category__btn"
                onClick={() => setCategory("ICE-CREAM")}
              >
                Ice Cream
              </button>
              <button
                className="category__btn"
                onClick={() => setCategory("DRINKS")}
              >
                Drinks
              </button>
            </Col>
          </div>
        </Row>
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
        <Row>
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
        </Row>

        {/*Ice Cream Row*/}
        <Row className="menu__iceCream">
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
        </Row>

        {/*Drinks Row*/}
        <Row className="menu__drinks">
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
        </Row>
      </Container>
    </div>
  );
};

export default Menu;
