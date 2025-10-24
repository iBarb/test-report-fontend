import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkle } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

const HeroSection: React.FC = () => {
    return (
        <section className="relative flex items-center justify-center overflow-hidden min-h-[700px] h-screen">
            {/* Background gradient */}
            <div className="absolute inset-0 gradient-bg" />

            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            ></div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <div className="flex items-center justify-center mb-8">
                    <div className="glass rounded-full px-4 py-2 flex items-center gap-2 ">
                        <Sparkle className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Proyecto de Tesis</span>
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
                    <span className="hero-gradient">Automatización de</span>{" "}
                    <span className="accent-gradient animated-gradient">Informes de Pruebas</span>{" "}
                    <span className="hero-gradient">mediante LLM</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto text-pretty leading-relaxed">
                    Investigación y desarrollo de un sistema automatizado para la generación de informes de ejecución e incidentes
                    de pruebas de software utilizando modelos de lenguaje grandes (LLM), siguiendo los estándares ISO/IEC/IEEE
                    29119-3.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/login" viewTransition>
                        <Button size="lg" className="glow-hover text-base px-8 py-4 h-12">
                            Probar el Sistema
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Estándar ISO 29119-3</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Modelos LLM</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>Automatización</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;