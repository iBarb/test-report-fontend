import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { FileText, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { logout } from '@/redux/slices/authSlice';
import { Link } from 'react-router';
import { notifService } from '@/lib/notificationServiceInstance';
import { useSocket } from '@/lib/useSocket';

const Navbar: React.FC = () => {
    const { user, token } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();

    const { isConnected } = useSocket(notifService, token);

    const [atTop, setAtTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setAtTop(window.scrollY === 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
    };

    const getInitials = (fullName: string) =>
        fullName
            .split(" ")
            .map((word) => word[0]?.toUpperCase())
            .join("")
            .slice(0, 2);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50
              backdrop-blur-md transition-all duration-300
              ${atTop
                    ? 'bg-transparent'
                    : 'bg-background/60 border-b border-border shadow-lg'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" viewTransition className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <FileText className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-semibold text-foreground">TestLLM</span>
                    </Link>

                    {!user ? (
                        <div className="flex items-center space-x-3">
                            <Link to="/login" viewTransition>
                                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all">
                                    Iniciar Sesión
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className='relative'>
                            <span className={`absolute right-0 bottom-[-8px] ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                                ●
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="bg-primary text-white font-bold rounded-full h-9 w-9 flex items-center justify-center cursor-pointer">
                                        <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuLabel className="flex items-center gap-3 justify-center">
                                        <Avatar className="min-h-8 min-w-8 bg-primary text-white rounded-full cursor-default flex items-center justify-center">
                                            <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col min-w-0 text-center">
                                            <span className="font-medium text-sm text-foreground truncate text-left">
                                                {user.full_name}
                                            </span>
                                            <span className="text-xs text-muted-foreground truncate">
                                                {user.email}
                                            </span>
                                        </div>
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        className="flex items-center space-x-2 font-medium px-3 py-2 cursor-pointer"
                                        onClick={handleLogout}
                                    >
                                        Cerrar Sesión
                                        <DropdownMenuShortcut>
                                            <LogOut className="h-4 w-4" />
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;