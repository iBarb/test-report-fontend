import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, University } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from '../services/authService';
import { setCredentials } from '@/redux/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import type { LoginData } from '../types/auth';
import { toast } from 'sonner';

const LoginForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false)

    const dispatch = useDispatch();

    const mutation = useMutation({
        mutationFn: (data: LoginData) => loginUser(data),
        onSuccess: (data) => {
            dispatch(setCredentials({ token: data.data.token, user: data.data.user }));
            toast.success("Sesión iniciada");
        },
        onError: (error: any) => {
            console.log(error);

            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage || "Error al iniciar sesión");
        },
    });

    const formik = useFormik<LoginData>({
        initialValues: { email: "", password: "" },
        validationSchema: Yup.object({
            email: Yup.string().email("Correo inválido *").required("Correo requerido *"),
            password: Yup.string()
                .min(8, "La contraseña debe tener al menos 8 caracteres *")
                .required("Contraseña requerida *"),
        }),
        onSubmit: (values) => {
            mutation.mutate(values);
        },
    });

    return (
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* Email Field */}
            <div className="space-y-0.5">
                <div className="space-y-1">
                    <Label htmlFor="email" className="ml-1 text-sm font-medium">
                        Email
                    </Label>
                    <div className="relative">
                        <University className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            name='email'
                            placeholder={"ejemplo@correo.com"}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            autoComplete="email"
                            className="pl-10 h-12 bg-background/50 border-border/50 focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>
                </div>
                <p className='absolute text-xs text-red-500 ml-3'>
                    {formik.errors.email && formik.touched.email && formik.errors.email}
                </p>
            </div>

            {/* Password Field */}
            <div className="space-y-0.5">
                <div className="space-y-1">
                    <Label htmlFor="password" className="ml-1 text-sm font-medium">
                        Contraseña
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            name='password'
                            placeholder="Ingresa tu contraseña"
                            type={showPassword ? "text" : "password"}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            autoComplete="current-password"
                            className="pr-10 h-12 bg-background/50 border-border/50 focus:border-blue-500 transition-colors"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <p className='absolute text-xs text-red-500 ml-3'>
                    {formik.errors.password && formik.touched.password && formik.errors.password}
                </p>
            </div>

            <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
                {mutation.isPending ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verificando credenciales...</span>
                    </div>
                ) : (
                    "Acceder"
                )}
            </Button>

            <div className="pt-4 border-t border-border text-center">
                <Link to="/register" viewTransition className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    ¿No tienes cuenta? Regístrate aquí
                </Link>
            </div>
        </form>
    );
};

export default LoginForm;