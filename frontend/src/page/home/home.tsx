import LandingPage from "./landing/landing";
import Navbar from "./navbar/navbar";
import Footer from "./footer/footer";
import "./home.css";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <LandingPage />
      <Footer />
    </div>
  );
};

export default Home;
