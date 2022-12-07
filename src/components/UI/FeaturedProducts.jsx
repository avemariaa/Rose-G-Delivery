import React from "react";
import "../../style/FeaturedProducts.css";
import Slider from "react-slick";
import FeaturedProductsData from "../../assets/sample-data/FoodProduct";
import { Col } from "reactstrap";
import ProductCard from "./ProductCard";
const FeaturedProducts = () => {
  const ArrowLeft = (props) => (
    <button
      {...props}
      className={"ftProdPrev__btn ri-arrow-left-circle-fill"}
    />
  );
  const ArrowRight = (props) => (
    <button
      {...props}
      className={"ftProdNext__btn ri-arrow-right-circle-fill"}
    />
  );
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    arrows: true,
    prevArrow: <ArrowLeft />,
    nextArrow: <ArrowRight />,
    className: "featuredProduct__slides",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
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
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div>
      <h4 className="ftProd__title">Featured Product</h4>
      <h6>Sheeeshable!!!</h6>
      <Slider {...settings}>
        {FeaturedProductsData.map((item) => (
          <div className="ftProduct__item">
            <Col lg="3" key={item.id}>
              <ProductCard item={item} />
            </Col>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeaturedProducts;
