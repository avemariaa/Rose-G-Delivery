import React, { useState, useEffect } from "react";
import "../../style/ExtrasProductCard.css";

// Navigation
import { Link, useLocation } from "react-router-dom";

const ExtrasProductCard = (props) => {
  const { id, productName, img, price } = props.item;
  const location = useLocation();
  const [isDataChanged, setIsDataChanged] = useState(false);

  // If the location pathname changes, set isDataChanged to true
  useEffect(() => {
    setIsDataChanged(true);
  }, [location.pathname]);

  return (
    <div className="extrasProduct__card">
      <div className="single__extrasProduct">
        <div className="extrasProduct__img">
          <Link to={`productDetails/${id}`}>
            <img src={img} alt="product-image" />
          </Link>
        </div>
        <div className="extrasProduct__content">
          <h6>
            <Link key={location.pathname} to={`/productDetails/${id}`}>
              {productName}
            </Link>
          </h6>
          <div className="extrasProductCard__footer">
            <span className="extrasProduct__price">
              <span>₱{parseFloat(price).toFixed(2)}</span>
            </span>
            <Link to={`/productDetails/${id}`}>
              <button className="extrasProduct__btn">Order</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtrasProductCard;
