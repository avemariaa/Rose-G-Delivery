import React, { useState, useEffect } from "react";
import ExtrasProductCard from "./ExtrasProductCard";
import "../../style/ExtrasProductList.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Firebase
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const ExtrasProductList = ({ categoryName, title }) => {
  const [extraProducts, setExtraProducts] = useState([]);

  useEffect(() => {
    const extrasQuery = query(
      collection(db, "ProductData"),
      where("categoryName", "==", "Extras")
    );

    getDocs(extrasQuery)
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          const id = doc.id;
          const product = doc.data();
          return { id, ...product };
        });
        setExtraProducts(data);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, []);

  // Extras Products Slider
  const ArrowLeft = (props) => (
    <button
      {...props}
      className={"extrasListPrev__btn ri-arrow-left-circle-fill"}
    />
  );
  const ArrowRight = (props) => (
    <button
      {...props}
      className={"extrasListNext__btn ri-arrow-right-circle-fill"}
    />
  );

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: true,
    prevArrow: <ArrowLeft />,
    nextArrow: <ArrowRight />,
    className: "extrasList__slides",
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <div className="extrasProduct__list-container mt-5">
      <h5>{title}</h5>
      <Slider {...sliderSettings}>
        {extraProducts.map((product) => (
          <div key={product.id}>
            <ExtrasProductCard item={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ExtrasProductList;
