import React, { useState, useEffect } from "react";
import "../../style/FoodCategorySlider.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { CustomPrevArrow, CustomNextArrow } from "../../globals/Slider";

// Firebase
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase.js";

const FoodCategorySlider = () => {
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
    prevArrow: <CustomPrevArrow arrowSize={40} />,
    nextArrow: <CustomNextArrow arrowSize={40} />,
    className: "foodCategory__slides",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: false,
        },
      },
    ],
  };
  return (
    <div className="foodCategory__container">
      <h4>Menu</h4>
      <h6>What are you craving for today?</h6>
      <Slider {...settings}>
        {productCategoriesData.map((category) => (
          <div className="foodCategory__item" key={category.productCategoryId}>
            <Link to={`/menu?category=${category.categoryName}`}>
              <img src={category.categoryImg} alt={category.categoryName} />
              <span>{category.categoryName}</span>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FoodCategorySlider;
