import React, { useState, useEffect } from "react";
import "../../style/FeaturedProducts.css";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import { CustomNextArrow, CustomPrevArrow } from "../../globals/Slider";

// Firebase
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase.js";

const FeaturedProducts = ({ props }) => {
  //------------------ Retrieve Food Data ------------------//
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    //LISTEN (REALTIME)
    const unsub = onSnapshot(
      collection(db, "ProductData"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setProductData(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  //------------------ Featured Products Slider ------------------//
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    arrows: true,
    prevArrow: <CustomPrevArrow arrowSize={40} />,
    nextArrow: <CustomNextArrow arrowSize={40} />,
    className: "featuredProduct__slides",
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
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="ftProd__container">
      <h4>Featured Product</h4>
      <h6>Discover your new favorites here!</h6>
      <Slider {...settings}>
        {productData.map((item) => (
          <div className="ftProduct__item" key={item.productId}>
            {/* <Col lg="12" key={item.productId}> */}
            <ProductCard item={item} />
            {/* </Col> */}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeaturedProducts;
