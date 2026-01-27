import './Home.css';
import Header from "../components/Header";
import Hero from "../components/Hero";
import SportCategories from "../components/SportCategories";
import FeaturedVenues from "../components/FeaturedVenues";
import Footer from "../components/Footer";


export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <SportCategories />
      <FeaturedVenues />
      <Footer />
    </>
  );
}
