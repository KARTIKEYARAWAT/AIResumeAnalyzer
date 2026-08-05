import { motion } from "framer-motion";
import { Lock, Unlock, Zap, Trophy, Shield } from "lucide-react";

export function XPBar({ xp, level }: { xp: number, level: number }) {
    const maxXP = level * 1000;
    const progress = (xp / maxXP) * 100;
    
    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Current Status</p>
                    <p className="text-xl font-display font-bold text-electric-purple glow-text-purple">
                        Level {level}: <span className="text-white">ATS Warrior</span>
                    </p>
                </div>
                <p className="text-xs font-mono text-neon-cyan">{xp} / {maxXP} XP</p>
            </div>
            
            {/* XP Track */}
            <div className="w-full h-3 bg-obsidian-light rounded-full overflow-hidden border border-white/5 relative">
                {/* Tick marks */}
                <div className="absolute inset-0 flex justify-between px-10">
                    {[1,2,3,4].map(i => <div key={i} className="w-px h-full bg-white/10" />)}
                </div>
                
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-electric-purple to-neon-cyan relative"
                >
                    <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-white/30 to-transparent" />
                </motion.div>
            </div>
        </div>
    )
}

export function SkillToken({ skill, status }: { skill: string, status: 'matched' | 'missing' | 'locked' }) {
    const colors = {
        matched: 'bg-cyber-green/10 border-cyber-green/50 text-cyber-green glow-text-green',
        missing: 'bg-electric-purple/10 border-electric-purple/50 text-electric-purple glow-text-purple',
        locked: 'bg-white/5 border-white/10 text-gray-400'
    };

    return (
        <motion.div 
            whileHover={{ scale: 1.05, rotate: status !== 'locked' ? 2 : 0 }}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 backdrop-blur-md cursor-pointer transition-colors ${colors[status]}`}
        >
            {status === 'locked' && <Lock className="size-3" />}
            {status === 'matched' && <Zap className="size-3" />}
            {skill}
        </motion.div>
    )
}

export function Achievement({ title, unlocked, icon: Icon = Trophy }: { title: string, unlocked: boolean, icon?: any }) {
    return (
        <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all duration-500 relative overflow-hidden ${unlocked ? 'bg-cyber-green/10 border-cyber-green/30' : 'bg-obsidian-light border-white/5 opacity-60'}`}>
            {unlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/0 via-cyber-green/10 to-cyber-green/0 animate-[shimmer_2s_infinite]" />
            )}
            
            <div className={`size-10 rounded-lg flex items-center justify-center ${unlocked ? 'bg-cyber-green/20' : 'bg-white/5'}`}>
                <Icon className={`size-5 ${unlocked ? 'text-cyber-green' : 'text-gray-500'}`} />
            </div>
            
            <div className="flex-1">
                <p className={`font-bold font-display ${unlocked ? 'text-white' : 'text-gray-400'}`}>{title}</p>
                <p className="text-xs text-gray-500 font-mono mt-1">
                    {unlocked ? 'Protocol Unlocked' : 'Requires Optimization'}
                </p>
            </div>
            
            {unlocked ? <Unlock className="size-4 text-cyber-green" /> : <Lock className="size-4 text-gray-500" />}
        </div>
    )
}
