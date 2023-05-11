import React, { useState, useEffect } from "react";
import ExtrasProductCard from "./ExtrasProductCard";
import "../../style/ExtrasProductList.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CustomPrevArrow, CustomNextArrow } from "../../globals/Slider";

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
    prevArrow: <CustomPrevArrow arrowSize={35} />,
    nextArrow: <CustomNextArrow arrowSize={35} />,
    className: "extrasList__slides",
    slidesToShow: 4,
    slidesToScroll: 4,
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
