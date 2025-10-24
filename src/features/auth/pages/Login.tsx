import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';
import LoginForm from '../components/LoginForm';


const Login: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Back Button */}
                <Link
                    to="/landing"
                    viewTransition
                    className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al inicio
                </Link>

                {/* Login/Register Card */}
                <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Acceso al Sistema
                            </CardTitle>
                            <CardDescription className="text-muted-foreground mt-2">
                                Plataforma de investigación para automatización de reportes de pruebas
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Login Form Component */}
                        <LoginForm />
                    </CardContent>

                </Card>

                {/* Footer Note */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-muted-foreground">
                        Estándar ISO 29119-3 • Modelos LLM • Automatización
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;