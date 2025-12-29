import { Sidebar } from './Sidebar';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={cn(
            "flex h-screen overflow-hidden",
            theme === 'dark' ? "bg-slate-950" : "bg-gray-50"
        )}>
            <aside className="hidden lg:flex flex-shrink-0">
                <Sidebar />
            </aside>
            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                <header className={cn(
                    "flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 backdrop-blur-xl border-b",
                    theme === 'dark'
                        ? "bg-slate-900/80 border-slate-800"
                        : "bg-white/80 border-gray-200"
                )}>
                    <h1 className={cn(
                        "text-lg sm:text-xl font-semibold",
                        theme === 'dark' ? "text-slate-100" : "text-gray-800"
                    )}>Overview</h1>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className={cn(
                                "p-2 rounded-lg transition-all duration-300",
                                theme === 'dark'
                                    ? "bg-slate-800 hover:bg-slate-700 text-amber-400"
                                    : "bg-gray-100 hover:bg-gray-200 text-slate-700"
                            )}
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                        </button>

                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg",
                            theme === 'dark'
                                ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-blue-500/20"
                                : "bg-gradient-to-br from-blue-600 to-blue-500 text-white"
                        )}>
                            JS
                        </div>
                    </div>
                </header>
                <main className={cn(
                    "flex-1 overflow-y-auto p-4 sm:p-6",
                    theme === 'dark'
                        ? "bg-gradient-to-b from-slate-950 to-slate-900"
                        : "bg-gradient-to-b from-gray-50 to-white"
                )}>
                    {children}
                </main>
            </div>
        </div>
    );
}
