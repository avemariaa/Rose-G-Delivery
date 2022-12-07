import React from "react";
import "../../style/ProductCard.css";

const ProductCard = (props) => {
  const { id, title, image01, price } = props.item;
  return (
    <div className="single__product">
      {" "}
      <div className="product__img">
        <img src={image01} alt="image01" />
      </div>
      <div className="product__content">
        <h6>{title}</h6>
        <div className="align-items-center justify-content-between">
          <span className="product__price">
            <span>₱{price}</span>
          </span>
          <button className="order__btn">Order</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
