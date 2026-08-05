import { motion } from "framer-motion";

export default function ScoreGauge({ score }: { score: number }) {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center size-48 mx-auto mt-4">
            {/* Holographic Glowing Effects */}
            <div className="absolute inset-0 bg-cyber-green/5 blur-2xl rounded-full" />
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-cyber-green/20 border-dashed rounded-full"
            />
            <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border border-neon-cyan/20 rounded-full"
            />
            
            {/* Central Score SVG */}
            <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90 relative z-10">
                {/* Background Ring */}
                <circle 
                    cx="80" cy="80" r={radius} 
                    fill="transparent" 
                    stroke="rgba(255, 255, 255, 0.05)" 
                    strokeWidth="8" 
                />
                
                {/* Score Progress Ring */}
                <motion.circle 
                    cx="80" cy="80" r={radius} 
                    fill="transparent" 
                    stroke="var(--color-cyber-green)" 
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(50,255,143,0.6))' }}
                />
            </svg>
            
            {/* Score Number inside ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                <motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="text-4xl font-display font-bold text-white glow-text-green"
                >
                    {score}
                </motion.span>
                <span className="text-[10px] uppercase tracking-widest text-cyber-green font-semibold">
                    ATS Score
                </span>
            </div>
        </div>
    );
}
