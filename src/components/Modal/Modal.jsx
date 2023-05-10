import React from "react";
import "./Modal.css";
const Modal = ({ closeModal, handleCancel }) => {
  return (
    <>
      <div className="modal__wrapper">
        <div className="modal__container">
          {/* <div className="modal__close-btn">
            <button onClick={closeModal}>
              <i class="ri-close-fill"></i>
            </button>
          </div> */}
          <div className="modal__header">
            <h6>Confirm Deletion</h6>
          </div>

          <div className="modal__content">
            <p>Are you sure you want to cancel this order?</p>
            <div className="modal__actions">
              <button onClick={handleCancel}>Yes</button>
              <button onClick={closeModal}>No</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
