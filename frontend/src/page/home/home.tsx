import Footer from "../../component/footer/footer";
import "./home.css";
import LandingPage from "../../component/landing/landing";
import Navbar from "../../navbar/navbar";

const Home = () => {
  return (
    <div className="home-container">
      <div className="navbar-container">
        <Navbar />
      </div>
      <LandingPage />
      <Footer />
    </div>
  );
};

export default Home;
