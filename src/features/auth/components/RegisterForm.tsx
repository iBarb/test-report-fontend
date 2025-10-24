import { useFormik } from 'formik';
import React, { useState } from 'react';
import type { RegisterData } from '../types/auth';
import * as Yup from "yup";
import { Label } from '@radix-ui/react-label';
import { Eye, EyeOff, University } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../services/authService';
import { setCredentials } from '@/redux/slices/authSlice';
import { toast } from 'sonner';
import { Link } from 'react-router';

const RegisterForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false)

    const dispatch = useDispatch();

    const mutation = useMutation({
        mutationFn: (data: RegisterData) => registerUser(data),
        onSuccess: (data) => {
            dispatch(setCredentials({ token: data.data.token, user: data.data.user }));
            toast.success("Registro exitoso");
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage || "Error al registrar usuario");
        },
    });

    const formik = useFormik<RegisterData>({
        initialValues: { full_name: "", email: "", password: "" },
        validationSchema: Yup.object({
            full_name: Yup.string().min(3, "El nombre debe tener al menos 3 caracteres *").required("Nombre requerido *"),
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
            {/* Full Name Field */}
            <div className="space-y-0.5">
                <div className="space-y-1">
                    <Label htmlFor="full_name" className="ml-1 text-sm font-medium">
                        Nombre Completo
                    </Label>
                    <div className="relative">
                        <University className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            id="full_name"
                            type="text"
                            name='full_name'
                            placeholder={"Juan Pérez Gómez"}
                            value={formik.values.full_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="pl-10 h-12 bg-background/50 border-border/50 focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>
                </div>
                <p className='absolute text-xs text-red-500 ml-3'>
                    {formik.errors.full_name && formik.touched.full_name && formik.errors.full_name}
                </p>
            </div>

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
                        <span>Creando cuenta...</span>
                    </div>
                ) : (
                    "Crear cuenta"
                )}
            </Button>

            <div className="pt-4 border-t border-border text-center">
                <Link to="/login" viewTransition className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    ¿Ya tienes cuenta? Inicia sesión
                </Link>
            </div>

        </form>
    );
};

export default RegisterForm;