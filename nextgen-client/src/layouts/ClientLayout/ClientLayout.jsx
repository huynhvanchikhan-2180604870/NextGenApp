import React from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import ShootingStars from "../../components/widgets/effects/ShootingStars";
import Routers from "../../routers/Routers";

const ClientLayout = () => {
  return (
    <>
      {/* <CustomCursor /> */}
      <ShootingStars />
      {/* <Snowfall /> */}
      <Header />
      <Routers />
      <Footer />
    </>
  );
};

export default ClientLayout;
