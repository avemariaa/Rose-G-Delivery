import React, { useEffect, useState } from "react";
import "../../style/MenuProductCard.css";

// Navigation
import { Link, useNavigate } from "react-router-dom";

// Redux
import { useDispatch } from "react-redux";
import { bagActions } from "../../store/MyBag/bagSlice";

// Connect Firebase
import { db, auth } from "../../firebase";
import { getDoc, setDoc, arrayUnion, updateDoc, doc } from "firebase/firestore";

// Toast
import { showSuccessToast, showErrorToast } from "../Toast/Toast";

const MenuProductCard = (props) => {
  const { id, productName, img, description, price } = props.item;

  //------------------ Navigation ------------------//
  const navigate = useNavigate();

  //------------------ Add to Bag Function ------------------//
  const dispatch = useDispatch();

  const addToBag = () => {
    if (!auth.currentUser) {
      showErrorToast("You need to login first", 2000);
      return;
    }
    dispatch(
      bagActions.addItem({
        productId: id,
        productName: productName,
        img: img,
        price: price,
        productQty: 1,
      })
    );
    const totalPrice = price * 1;

    // Add item to firebase
    const docRef = doc(db, "UserBag", auth.currentUser.uid);
    const data1 = {
      productId: id,
      productName: productName,
      img: img,
      price: price,
      productQty: 1,
      totalPrice: totalPrice,
    };

    // Check if document exists before updating it
    getDoc(docRef)
      .then((doc) => {
        if (doc.exists()) {
          updateDoc(docRef, {
            bag: arrayUnion(data1),
          })
            .then(() => {
              showSuccessToast("Item added to bag", 1000);
            })
            .catch((error) => {
              showErrorToast(`Item is not added to bag: ${error}`, 1000);
            });
        } else {
          setDoc(docRef, {
            bag: [data1],
          })
            .then(() => {
              showSuccessToast("Item added to bag", 1000);
            })
            .catch((error) => {
              showErrorToast(`Item is not added to bag: ${error}`, 1000);
            });
        }
      })
      .catch((error) => {
        showErrorToast(`The data doesn't exist: ${error}`, 1000);
      });
  };

  return (
    <div className="menu__productCards">
      <div className="menu__singleProduct">
        <div className="menu__productImg">
          <img src={img} alt="image01" />
        </div>
        <div className="menu__productContent">
          <h6>
            <Link to={`/productDetails/${id}`}>{productName}</Link>
          </h6>

          <p className="menu__productDesc">{description}</p>

          <div className="menu__productFooter">
            <span className="menu__productPrice">
              <span>₱{parseFloat(price).toFixed(2)}</span>
            </span>

            {/* Add to Bag button */}
            <button className="menu__orderBtn" onClick={addToBag}>
              {/* Add to bag */}
              <i class="ri-shopping-bag-2-line"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuProductCard;
