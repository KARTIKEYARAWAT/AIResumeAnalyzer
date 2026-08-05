import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ScanSearch, Zap, Sparkles, Target, Trophy, ShieldCheck, ArrowRight } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "OPT-LAB | AI Resume Optimization" },
    { name: "description", content: "Transform an ordinary resume into an ATS-optimized career weapon." },
  ];
}

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        className="glass-panel p-6 flex flex-col gap-4 group relative overflow-hidden"
    >
        <div className="absolute inset-0 bg-cyber-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="size-12 rounded-xl bg-obsidian border border-white/10 flex items-center justify-center group-hover:border-cyber-green transition-colors">
            <Icon className="text-white group-hover:text-cyber-green transition-colors" />
        </div>
        <h3 className="text-xl font-bold font-display text-white">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
);

export default function Home() {
  return (
    <main className="bg-obsidian min-h-screen bg-cyber-grid text-white overflow-hidden selection:bg-electric-purple selection:text-white relative">
        {/* Ambient Neural Energy Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-electric-purple/20 blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-neon-cyan/20 blur-[100px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[60%] w-[20vw] h-[20vw] rounded-full bg-cyber-green/10 blur-[80px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />

        <Navbar />

        {/* Massive Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-24 px-6 z-10">
            <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
                
                {/* Left: Copy & CTA */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col gap-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-green/30 bg-cyber-green/10 w-fit backdrop-blur-md">
                        <Sparkles className="size-4 text-cyber-green" />
                        <span className="text-sm text-cyber-green font-medium tracking-wide">Optimization Protocol v2.0 Live</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-display font-bold leading-[1.1] tracking-tight">
                        Level Up Your <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-purple to-neon-cyan glow-text-purple">
                            Resume with AI
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-400 font-light max-w-lg leading-relaxed">
                        Transform an ordinary resume into an ATS-optimized career weapon. Enter the AI Scanning Portal to begin your optimization sequence.
                    </p>
                    
                    <div className="flex flex-col gap-4 mt-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <Link to="/upload" className="cyber-button text-lg flex items-center justify-center gap-3 py-4 px-8 group">
                                <span>Initiate Scan</span>
                                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/builder" className="glass-panel text-lg flex items-center justify-center gap-3 py-4 px-8 border border-white/20 hover:border-neon-cyan hover:bg-neon-cyan/5 transition-all duration-300">
                                <span>Build Resume</span>
                                <Sparkles className="size-5 text-neon-cyan" />
                            </Link>
                        </div>
                        <p className="text-sm text-gray-500 font-medium pl-2">No Signup Required.</p>
                    </div>
                </motion.div>

                {/* Right: Floating 3D Resume & ATS */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative h-[600px] w-full hidden lg:block perspective-1000"
                >
                    <motion.div 
                        animate={{ y: [-10, 10, -10], rotateY: [-5, 5, -5], rotateX: [2, -2, 2] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center transform-style-3d"
                    >
                        {/* 3D Holographic Resume Card */}
                        <div className="relative w-[380px] h-[520px] rounded-2xl glass-panel neon-border-purple p-6 shadow-[0_0_50px_rgba(138,92,255,0.2)]">
                            <div className="w-full h-8 bg-white/5 rounded-md mb-6" />
                            <div className="w-3/4 h-4 bg-white/5 rounded-md mb-12" />
                            
                            <div className="space-y-4">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className="flex gap-4 items-center opacity-50">
                                        <div className="size-8 rounded bg-white/5" />
                                        <div className="flex-1 space-y-2">
                                            <div className="w-full h-2 bg-white/5 rounded" />
                                            <div className="w-2/3 h-2 bg-white/5 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Floating ATS Score */}
                            <motion.div 
                                animate={{ y: [0, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                                className="absolute -right-12 -top-12 size-32 rounded-full glass-panel border border-cyber-green/50 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(50,255,143,0.3)] bg-obsidian-light/90 backdrop-blur-xl"
                            >
                                <p className="text-3xl font-display font-bold text-cyber-green glow-text-green">98</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">ATS Score</p>
                            </motion.div>
                            
                            {/* Floating Suggestion */}
                            <motion.div 
                                animate={{ x: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 }}
                                className="absolute -left-16 bottom-20 px-4 py-3 rounded-lg glass-panel border border-electric-purple/50 flex items-center gap-3 shadow-[0_0_20px_rgba(138,92,255,0.2)] bg-obsidian-light/90"
                            >
                                <Zap className="size-4 text-electric-purple" />
                                <p className="text-xs font-medium text-white">Action Verb Added</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>

        {/* Features Section */}
        <section className="relative py-32 px-6 z-10 border-t border-white/5 bg-obsidian-light/30">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center text-center mb-16 gap-4">
                    <h2 className="text-4xl md:text-5xl font-display font-bold">Optimization Modules</h2>
                    <p className="text-gray-400 max-w-2xl">Our AI doesn't just read your resume; it deconstructs, analyzes, and rebuilds it using proprietary recruitment algorithms.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard 
                        delay={0.1}
                        icon={ScanSearch}
                        title="ATS Detection"
                        description="Simulates top Applicant Tracking Systems to ensure your document parses perfectly with zero data loss."
                    />
                    <FeatureCard 
                        delay={0.2}
                        icon={Zap}
                        title="Keyword Scanner"
                        description="Identifies missing industry-specific terminology and hard skills required by modern job descriptions."
                    />
                    <FeatureCard 
                        delay={0.3}
                        icon={Sparkles}
                        title="Impact Optimization"
                        description="Transforms weak bullet points into powerful, results-driven statements with optimal confidence."
                    />
                    <FeatureCard 
                        delay={0.4}
                        icon={Target}
                        title="Role Matching"
                        description="Aligns your professional narrative directly with the exact requirements of your target position."
                    />
                    <FeatureCard 
                        delay={0.5}
                        icon={ShieldCheck}
                        title="Formatting Analysis"
                        description="Detects invisible tables, bad fonts, and structural errors that cause instant ATS rejection."
                    />
                    <FeatureCard 
                        delay={0.6}
                        icon={Trophy}
                        title="Interview Readiness"
                        description="Predicts potential interview questions based on the weaknesses and strengths of your current profile."
                    />
                </div>
            </div>
        </section>
        
        {/* Final CTA */}
        <section className="relative py-32 px-6 z-10">
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8 glass-panel p-16 neon-border">
                <h2 className="text-5xl font-display font-bold">Ready to Upgrade?</h2>
                <p className="text-xl text-gray-400">Join thousands of professionals who have already bypassed the ATS and landed interviews.</p>
                <Link to="/upload" className="cyber-button text-lg flex items-center justify-center gap-3 w-fit py-4 px-8 mt-4">
                    <span>Initialize Scan</span>
                    <Zap className="size-5" />
                </Link>
            </div>
        </section>
    </main>
  );
}
