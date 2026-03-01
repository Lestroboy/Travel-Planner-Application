import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiStar, FiMapPin, FiCheck, FiShield, FiHeadphones, FiDollarSign, FiCalendar, FiUsers, FiTarget } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import HeroSearchBox from "../components/home/HeroSearchBox";
import TripPlannerSection from "../components/home/TripPlannerSection";
import { popularDestinations, deals } from "../utils/dummyData";
import { formatCurrency } from "../utils/helpers";
import heroBg from "../assets/hero-bg3.png";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    { icon: FiShield, title: "Secure Booking", desc: "100% secure payment gateway" },
    { icon: FiHeadphones, title: "24/7 Support", desc: "Round the clock assistance" },
    { icon: FiDollarSign, title: "Best Prices", desc: "Guaranteed lowest prices" },
    { icon: FiCheck, title: "Easy Cancellation", desc: "Free cancellation on most bookings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Background Image */}
      <section className="relative pt-20 pb-8 md:pb-16 min-h-[900px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background/80" />
        
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 pt-12"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 leading-tight drop-shadow-lg">
              Your Journey Starts Here
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto drop-shadow">
              Book flights, trains & cabs. Plan itineraries, track budgets, and travel smarter.
            </p>
          </motion.div>

          {/* Search Box */}
          <HeroSearchBox />
        </div>
      </section>

      {/* Trip Planner Section */}
      <TripPlannerSection />

      {/* Popular Destinations */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">Popular Destinations</h2>
              <p className="text-muted-foreground">Explore trending places loved by travelers</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
              View All <FiArrowRight />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {popularDestinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated cursor-pointer group"
                onClick={() => navigate(`/hotels/search?location=${dest.name}`)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
                    {dest.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-lg">{dest.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <FiMapPin className="w-3 h-3" /> {dest.country}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <FiStar className="w-4 h-4 fill-accent-yellow text-accent-yellow" />
                      <span className="text-sm font-medium">{dest.rating}</span>
                    </div>
                    <p className="text-primary font-semibold">
                      From {formatCurrency(dest.price)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Carousel
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">Hot Deals</h2>
            <p className="text-muted-foreground">Grab these exclusive offers before they're gone</p>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {deals.map((deal) => (
              <SwiperSlide key={deal.id}>
                <div className="card-elevated h-full">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-lg">
                      {deal.discount}% OFF
                    </span>
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-muted-foreground">{deal.duration}</span>
                    <h3 className="font-heading font-semibold text-xl mt-1">{deal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{deal.subtitle}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground line-through">
                          {formatCurrency(deal.originalPrice)}
                        </span>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(deal.price)}</p>
                      </div>
                      <button className="btn-primary text-sm py-2">Book Now</button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section> */}

      {/* Features */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">Why Choose Us</h2>
            <p className="text-muted-foreground">Trusted by millions of travelers worldwide</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-sunset">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
            Ready to Plan Your Next Trip?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Create a free account and start building your dream itinerary today.
          </p>
          <button
            onClick={() => navigate("/trips/new")}
            className="bg-background text-foreground font-semibold px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-xl"
          >
            Start Planning
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
