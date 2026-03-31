import { useState } from 'react';
import './Home.css';
import './Matches.css';
import Header from "../components/Header";
import Hero from "../components/Hero";
import SportCategories from "../components/SportCategories";
import FeaturedVenues from "../components/FeaturedVenues";
import Footer from "../components/Footer";
import Matches from '../components/Matches';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [venueTrigger, setVenueTrigger] = useState(0);

  const handleBookingSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleVenueSuccess = () => {
    setVenueTrigger(prev => prev + 1);
  };

  return (
    <>
      <Header onVenueSuccess={handleVenueSuccess} />
      <Hero />
      <SportCategories />
      <FeaturedVenues onBookingSuccess={handleBookingSuccess} venueTrigger={venueTrigger} />
      <Matches refreshTrigger={refreshTrigger} />
      <Footer />
    </>
  );
}
