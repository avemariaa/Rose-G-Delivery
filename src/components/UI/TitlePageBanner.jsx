import React from "react";
import "../../style/TitlePageBanner.css";
const TitlePageBanner = ({ title }) => {
  return (
    <div className="banner">
      <h1>{title}</h1>
    </div>
  );
};

export default TitlePageBanner;
