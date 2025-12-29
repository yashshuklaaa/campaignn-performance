import { LayoutDashboard } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, current: true },
];

export function Sidebar({ className }: { className?: string }) {
    const { theme } = useTheme();

    return (
        <div className={cn(
            "flex flex-col h-full w-64 border-r",
            theme === 'dark'
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-200",
            className
        )}>
            <div className={cn(
                "flex items-center h-16 px-6 border-b",
                theme === 'dark' ? "border-slate-800" : "border-gray-200"
            )}>
                <span className={cn(
                    "text-xl font-bold",
                    theme === 'dark'
                        ? "bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
                        : "text-blue-600"
                )}>Mixo Ads</span>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navigation.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                            item.current
                                ? theme === 'dark'
                                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                    : "bg-blue-50 text-blue-700 border border-blue-200"
                                : theme === 'dark'
                                    ? "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                    </a>
                ))}
            </nav>
        </div>
    );
}
