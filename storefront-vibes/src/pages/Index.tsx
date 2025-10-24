import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import HeroCarousel from "@/components/HeroCarousel";
import BrandShowcase from "@/components/BrandShowcase";
import CategoryNav from "@/components/CategoryNav";
import ProductGrid from "@/components/ProductGrid";
import BrandGallery from "@/components/BrandGallery";
import ServicesSection from "@/components/ServicesSection";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="min-h-screen scroll-smooth">
      <Navbar />
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <CategoryNav 
          selectedCategory={selectedCategory} 
          onCategorySelect={setSelectedCategory}
        />
      </div>
      <main>
        {!searchQuery && (
          <>
            <HeroCarousel />
            <BrandShowcase />
          </>
        )}
        <ProductGrid searchQuery={searchQuery} selectedCategory={selectedCategory} />
        {!searchQuery && !selectedCategory && (
          <>
            <BrandGallery />
            <ServicesSection />
            <ReviewsSection />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
