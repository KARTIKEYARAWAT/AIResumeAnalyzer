import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAppStore } from "~/lib/store";
import { supabase } from "~/lib/supabase";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Loader2, Calendar, Trash2 } from "lucide-react";
import Navbar from "~/components/Navbar";

export const meta = () => ([
    { title: 'Ai-Powered Resume Analyzer | My Analyses' },
    { name: 'description', content: 'View your past resume analyses.' },
])

export default function History() {
    const { auth, isLoading: isStoreLoading } = useAppStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isStoreLoading && !auth.isAuthenticated) navigate('/auth?next=/history');
    }, [isStoreLoading, auth.isAuthenticated]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!auth.user?.id) return;
            const { data, error } = await supabase
                .from('resumes')
                .select('*')
                .eq('user_id', auth.user.id)
                .order('created_at', { ascending: false });

            if (data && !error) {
                setResumes(data);
            }
            setIsLoading(false);
        };
        
        if (auth.isAuthenticated) {
            fetchHistory();
        }
    }, [auth.isAuthenticated, auth.user?.id]);

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-obsidian">
                <Loader2 className="size-10 text-electric-purple animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-obsidian bg-cyber-grid text-white relative py-20 px-6">
            <Navbar />
            <div className="absolute top-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-neon-cyan/5 blur-[120px] mix-blend-screen pointer-events-none" />
            
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-purple to-neon-cyan mb-4 glow-text-purple">
                        Optimization History
                    </h1>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        Access your past resume scans, review AI feedback, and track your optimization progress over time.
                    </p>
                </div>

                {resumes.length === 0 ? (
                    <div className="glass-panel p-12 text-center flex flex-col items-center border border-white/5 border-dashed">
                        <FileText className="size-16 text-gray-500 mb-6" />
                        <h3 className="text-2xl font-bold font-display text-white mb-4">No Scans Found</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            You haven't initiated any resume optimization protocols yet. Upload your first resume to begin.
                        </p>
                        <Link to="/upload" className="cyber-button px-8 py-3 flex items-center gap-2">
                            Initiate Scan Protocol <ArrowRight className="size-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume, i) => {
                            const score = resume.feedback_json?.overallScore || resume.feedback_json?.ATS?.score || resume.feedback_json?.ats_score || 0;
                            const date = new Date(resume.created_at).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric'
                            });

                            return (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={resume.id}
                                    className="glass-panel p-6 flex flex-col hover:-translate-y-2 transition-transform cursor-pointer group neon-border-purple relative overflow-hidden"
                                    onClick={() => navigate(`/resume/${resume.id}`)}
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="size-8 text-neon-cyan" />
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="size-14 rounded-full border-2 border-electric-purple/30 bg-electric-purple/10 flex items-center justify-center text-xl font-bold font-display text-electric-purple glow-text-purple">
                                            {score}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg line-clamp-1">{resume.job_title || 'Untitled Protocol'}</h3>
                                            <p className="text-gray-400 text-sm line-clamp-1">{resume.company_name || 'Generic Target'}</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-sm text-gray-500 font-mono">
                                        <span className="flex items-center gap-2"><Calendar className="size-4"/> {date}</span>
                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={async (e) => { 
                                                    e.stopPropagation(); 
                                                    await supabase.from('resumes').delete().eq('id', resume.id);
                                                    setResumes(resumes.filter(r => r.id !== resume.id));
                                                }}
                                                className="text-gray-400 hover:text-danger transition-colors flex items-center gap-1 z-20 relative"
                                            >
                                                <Trash2 className="size-4" /> Delete
                                            </button>
                                            <span className="text-neon-cyan group-hover:underline">View Lab →</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
