import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const Navbar = ({ className = "" }: { className?: string }) => {
    const location = useLocation();
    
    return (
        <nav className={`fixed top-0 left-0 w-full z-50 glass-panel border-x-0 border-t-0 rounded-none bg-obsidian-light/50 px-8 py-4 flex items-center justify-between ${className}`}>
            <a href="/" className="flex items-center gap-3 group">
                <div className="relative flex items-center justify-center size-10 rounded-xl bg-obsidian-light border border-white/10 group-hover:border-cyber-green transition-colors overflow-hidden">
                    <div className="absolute inset-0 bg-cyber-green/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Zap className="text-cyber-green size-5 z-10" />
                </div>
                <div className="flex flex-col">
                    <p className="text-xl font-display font-bold text-white tracking-wide">
                        OPT<span className="text-cyber-green">LAB</span>
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        Optimization Protocol
                    </p>
                </div>
            </a>
            
            <div className="flex items-center gap-6">
                <a href="/history" className="text-gray-400 hover:text-neon-cyan transition-colors font-medium text-sm">My Analyses</a>
                <a href="/builder" className="text-gray-400 hover:text-electric-purple transition-colors font-medium text-sm">Build Resume</a>
                {location.pathname !== '/upload' && (
                    <a href="/upload" className="cyber-button text-sm flex items-center gap-2">
                        <span>Initialize Scan</span>
                        <div className="size-2 rounded-full bg-white animate-pulse" />
                    </a>
                )}
            </div>
        </nav>
    );
};
export default Navbar;
