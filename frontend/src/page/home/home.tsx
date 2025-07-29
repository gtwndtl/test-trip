import "./home.css";
import LandingPage from "../../component/landing/landing";
import Head from "../../navbar/head";

const Home = () => {
  return (
    <div className="home-container">
      <div className="head-container">
        <Head />
      </div>
      <LandingPage />
    </div>
  );
};

export default Home;
