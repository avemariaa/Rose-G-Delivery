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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
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
