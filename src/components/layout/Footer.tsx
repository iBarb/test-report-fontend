import { FileText } from 'lucide-react';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="py-12 px-6 border-t border-border">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <FileText className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-lg">TestAI Reports</span>
                    </div>

                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                        <span>© 2025 Created by</span>
                        <div className="flex gap-1 ml-1">
                            <a
                                href="https://github.com/iBarb"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                Bruno Barbaran
                            </a>
                            <span>/</span>
                            <a
                                href="https://github.com/jorgecotrinax1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                Jorge Cotrina
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;