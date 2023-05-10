import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import "../style/Home.css";
import HomeSlider from "../components/UI/HomeSlider";
import FoodCategorySlider from "../components/UI/FoodCategorySlider";
import Feedback from "../components/UI/Feedback";
import FeaturedProducts from "../components/UI/FeaturedProducts";
import CompanyBackground from "../components/UI/CompanyBackground";
import OurPartners from "../components/UI/OurPartners";

const Home = () => {
  return (
    <div>
      {/*Home Slider Section*/}
      <section>
        <Container>
          <HomeSlider />
        </Container>
      </section>

      {/*Featured Product Slider Section*/}
      <section>
        <Container>
          <FeaturedProducts />
        </Container>
      </section>

      {/*Food Category Slider Section*/}
      <section>
        <Container>
          <FoodCategorySlider />
        </Container>
      </section>

      {/*Feedback Section*/}
      <section>
        <Container>
          <Feedback />
        </Container>
      </section>

      {/*About Us Section*/}
      <section>
        <Container>
          <CompanyBackground />
        </Container>
      </section>

      {/* Our Partner Section */}
      <section>
        <Container>
          <OurPartners />
        </Container>
      </section>
    </div>
  );
};

export default Home;
