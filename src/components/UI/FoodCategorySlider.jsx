import React from "react";
import "../../style/FoodCategorySlider.css";
import Slider from "react-slick";
import FoodCategoryImg1 from "../../assets/images/category-01.png";
import { Link } from "react-router-dom";
const FoodCategorySlider = () => {
  const ArrowLeft = (props) => (
    <button
      {...props}
      className={"foodCatPrev__btn ri-arrow-left-circle-fill"}
    />
  );
  const ArrowRight = (props) => (
    <button
      {...props}
      className={"foodCatNext__btn ri-arrow-right-circle-fill"}
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
    className: "foodCategory__slides",
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
      <h4>Menu</h4>
      <h6>What are you craving for today?</h6>
      <Slider {...settings}>
        <div className="foodCategory__item">
          <Link to="/menu">
            <img src={FoodCategoryImg1} />
            <span>Burgir1</span>
          </Link>
        </div>
        <div className="foodCategory__item">
          <Link to="/menu">
            <img src={FoodCategoryImg1} />
            <span>Burgir2</span>
          </Link>
        </div>
        <div className="foodCategory__item">
          <Link to="/menu">
            <img src={FoodCategoryImg1} />
            <span>Burgir3</span>
          </Link>
        </div>
        <div className="foodCategory__item">
          <Link to="/menu">
            <img src={FoodCategoryImg1} />
            <span>Burgir4</span>
          </Link>
        </div>
        <div className="foodCategory__item">
          <Link to="/menu">
            <img src={FoodCategoryImg1} />
            <span>Burgir5</span>
          </Link>
        </div>
        <div className="foodCategory__item">
          <Link to="/menu">
            <img src={FoodCategoryImg1} />
            <span>Burgir6</span>
          </Link>
        </div>
      </Slider>
    </div>
  );
};

export default FoodCategorySlider;
