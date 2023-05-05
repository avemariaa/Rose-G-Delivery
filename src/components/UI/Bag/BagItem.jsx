import React, { useState, useEffect } from "react";
import { ListGroupItem } from "reactstrap";
import "../../../style/Bag-Item.css";

// Firebase
import { auth, db } from "../../../firebase";
import { deleteDoc, getDoc, updateDoc, doc } from "firebase/firestore";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { bagActions } from "../../../store/MyBag/bagSlice";
import { fetchBagItems } from "../../../store/MyBag/bagSlice";

const BagItem = ({ item }) => {
  const { productId, productName, price, img, productQty, totalPrice } = item;

  const dispatch = useDispatch();

  const bagItems = useSelector((state) => state.bag.bagItems);

  useEffect(() => {
    dispatch(fetchBagItems(auth.currentUser.uid)); //retrieve user's bag items
  }, [dispatch]);

  //------------------ Increment Item Function ------------------//
  const [isUpdating, setIsUpdating] = useState(false);
  const incrementItem = async () => {
    if (isUpdating) {
      return;
    }
    setIsUpdating(true);

    const userBagRef = doc(db, "UserBag", auth.currentUser.uid);
    const userBagData = await getDoc(userBagRef);

    const updatedBag = userBagData.data().bag.map((item) => {
      if (item.productId === productId) {
        return {
          ...item,
          productQty: item.productQty + 1,
          totalPrice: Number(item.totalPrice) + Number(item.price),
        };
      } else {
        return item;
      }
    });
    await updateDoc(userBagRef, {
      bag: updatedBag,
    });

    setIsUpdating(false);

    // responsible for the data to reflect on the website
    dispatch(
      bagActions.addItem({
        productId: productId,
        productName,
        price,
        img,
        productQty: productQty + 1,
        totalPrice: totalPrice + price,
      })
    );
  };

  //------------------ Decrement Item Function ------------------//
  const decrementItem = async () => {
    if (isUpdating) {
      return;
    }
    setIsUpdating(true);

    const userBagRef = doc(db, "UserBag", auth.currentUser.uid);
    const userBagData = await getDoc(userBagRef);

    const updatedBag = userBagData
      .data()
      .bag.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            productQty: item.productQty - 1,
            totalPrice: Number(item.totalPrice) - Number(item.price),
          };
        } else {
          return item;
        }
      })
      .filter((item) => item.productQty && item.productQty > 0);

    if (updatedBag.length > 0) {
      await updateDoc(userBagRef, {
        bag: updatedBag,
      });
    } else {
      await deleteDoc(userBagRef);
    }

    setIsUpdating(false);

    dispatch(bagActions.removeItem(productId));
  };

  //------------------ Delete Item Function ------------------//
  const deleteItem = async () => {
    const userBagRef = doc(db, "UserBag", auth.currentUser.uid);
    const userBagData = await getDoc(userBagRef);

    const updatedBag = userBagData
      .data()
      .bag.filter((item) => item.productId !== productId);

    await updateDoc(userBagRef, {
      bag: updatedBag,
    });

    dispatch(bagActions.deleteItem(productId));
  };

  return (
    <ListGroupItem className="border-0 bag__item">
      <div className="bag__item-info d-flex gap-2" key={item.productId}>
        <img src={item.img} alt="product-img" />

        <div className="bag__product-info w-100 d-flex align-items-center gap-4 justify-content-between">
          <div>
            <h6 className="bag__product-title">{item.productName}</h6>
            <p className="d-flex align-items-center gap-5 ">
              <div className="d-flex align-items-center gap-3 increase__decrease-btn">
                <span className="increase__btn" onClick={incrementItem}>
                  <i class="ri-add-circle-fill"></i>
                </span>
                <span className="quantity__title">{productQty}</span>
                <span className="decrease__btn" onClick={decrementItem}>
                  <i class="ri-indeterminate-circle-fill"></i>
                </span>
              </div>

              <span className="bag__product-price">
                ₱ {parseFloat(price * productQty).toFixed(2)}
              </span>
            </p>
          </div>

          <span className="delete__btn" onClick={deleteItem}>
            <i class="ri-delete-bin-line"></i>
          </span>
        </div>
      </div>
    </ListGroupItem>
  );
};

export default BagItem;
