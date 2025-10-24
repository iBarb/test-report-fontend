import { Card } from '@/components/ui/card';
import React from 'react';
import { features } from '../constants/features';


const FeaturesSection: React.FC = () => {
    return (
        <section className="py-24 px-6 bg-gradient-to-b from-muted/5 to-background">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">¿Por qué hacemos esto?</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Porque creemos que el éxito de cada proyecto depende de herramientas que hagan el trabajo más simple, ágil y efectivo.
                    </p>
                </div>


                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="glass p-6 hover:glow-hover transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">{feature.title}</h3>
                            </div>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;