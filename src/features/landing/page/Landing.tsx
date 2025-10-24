import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import { CTASection } from '../components/CtaSection';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';


const Landing: React.FC = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <CTASection />
            <Footer />
        </div>
    );
};

export default Landing;