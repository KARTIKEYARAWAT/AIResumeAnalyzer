import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { supabase } from "~/lib/supabase";
import { useAppStore } from "~/lib/store";
import Navbar from "~/components/Navbar";
import { ChevronLeft, BrainCircuit, LayoutList, Target, Sparkles, Check, Zap, Download, TrendingUp, Code2, Briefcase, PenTool, ShieldAlert, BookOpen, Award } from "lucide-react";
import FullReport from "~/components/FullReport";

export default function Resume() {
    const { auth, isLoading: isStoreLoading } = useAppStore();
    const { id } = useParams();
    const navigate = useNavigate();

    const [feedback, setFeedback] = useState<any>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [activeReportTab, setActiveReportTab] = useState('section-1');

    useEffect(() => {
        if (!isStoreLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isStoreLoading, auth.isAuthenticated, navigate, id]);

    useEffect(() => {
        const fetchAnalysis = async () => {
            const { data } = await supabase.from('resumes').select('*').eq('id', id).single();
            if (data) {
                setFeedback(data.feedback_json);
                const path = (data.image_paths && data.image_paths[0]) || data.image_path;
                if (path) {
                    const { data: signed } = await supabase.storage.from('resumes').createSignedUrl(path, 3600);
                    if (signed) setImageUrl(signed.signedUrl);
                }
            }
        };
        if (id) fetchAnalysis();
    }, [id]);

    const handleDownloadPDF = () => {
        setIsExporting(true);
        setTimeout(() => {
            window.print();
            setIsExporting(false);
        }, 500);
    };

    if (!feedback) {
        return (
            <div className="min-h-screen bg-obsidian text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-electric-purple border-t-transparent rounded-full animate-spin" />
                    <p className="text-neon-cyan font-display tracking-widest animate-pulse">ANALYZING SYSTEMS...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-obsidian text-white relative pt-24 px-6 overflow-hidden print:overflow-visible print:pt-0 print:px-0">
            <div className="print:hidden">
                <Navbar />
                <div className="absolute top-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-electric-purple/5 blur-[120px] mix-blend-screen pointer-events-none" />
            </div>
            
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[calc(100vh-8rem)] pb-12 lg:pb-0 print:block print:w-full print:max-w-none print:m-0">
                
                {/* LEFT SIDEBAR - Original Image & Quick Stats */}
                <section className="lg:col-span-4 h-fit lg:h-full flex flex-col gap-6 print:hidden">
                    <div className="relative glass-panel p-2 neon-border-purple group overflow-hidden h-full min-h-[500px]">
                        {imageUrl && (
                            <img src={imageUrl} alt="Resume" className="w-full h-full object-contain rounded-xl shadow-lg" />
                        )}
                        <div className="absolute inset-0 overflow-hidden rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="w-full h-[2px] bg-cyber-green shadow-[0_0_15px_#32FF8F] absolute top-0 left-0 animate-scan" />
                        </div>
                    </div>
                </section>

                {/* RIGHT MAIN PANEL - Full Analytics Report */}
                <section className="lg:col-span-8 h-full flex flex-col print:col-span-12 print:h-auto">
                    
                    {/* Download Button */}
                    <div className="flex justify-between items-center mb-6 print:hidden">
                        <h2 className="text-xl font-bold font-display text-white">In-Depth Analysis Report</h2>
                        <button onClick={handleDownloadPDF} disabled={isExporting} className={`cyber-button py-2 px-4 text-sm flex items-center gap-2 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <Download className="size-4" /> {isExporting ? 'Generating PDF...' : 'Export PDF'}
                        </button>
                    </div>

                    <div className="flex-1 flex gap-8 relative h-full print:block print:h-auto">
                        {/* Main Scrolling Content (Visible) */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pb-32 print:hidden">
                            <FullReport feedback={feedback} activeTab={activeReportTab} isPrinting={false} />
                        </div>

                        {/* Hidden Content strictly for PDF generation */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '800px', zIndex: -50, pointerEvents: 'none' }} className="print:static print:w-full print:z-auto">
                            <div id="hidden-pdf-report" className="bg-obsidian text-white p-8 print:p-0">
                                {imageUrl && (
                                    <div className="mb-12 print:block break-after-page">
                                        <h1 className="text-3xl font-bold mb-6 text-center text-neon-cyan">Original Resume</h1>
                                        <img src={imageUrl} alt="Original Resume" className="w-full h-auto object-contain max-h-[10.5in]" />
                                    </div>
                                )}
                                <h1 className="text-3xl font-bold mb-8 text-center text-neon-cyan break-before-page">AI Resume Analysis Report</h1>
                                <FullReport feedback={feedback} isPrinting={true} />
                            </div>
                        </div>

                        {/* Sticky Table of Contents (Desktop Only) */}
                        <div className="w-56 flex-shrink-0 hidden xl:flex flex-col gap-2 sticky top-0 h-fit max-h-full overflow-y-auto custom-scrollbar pr-2 pb-12 print:hidden">
                            <h3 className="font-bold text-gray-500 text-xs uppercase tracking-widest mb-3 pl-3">Diagnostic Modules</h3>
                            {[
                                { id: 'section-1', label: 'Overall Analysis', icon: TrendingUp },
                                { id: 'section-2', label: 'ATS Compatibility', icon: BrainCircuit },
                                { id: 'section-3', label: 'Resume Structure', icon: LayoutList },
                                { id: 'section-6', label: 'Skills Analysis', icon: Code2 },
                                { id: 'section-8', label: 'Experience', icon: Briefcase },
                                { id: 'section-14', label: 'Writing Quality', icon: PenTool },
                                { id: 'section-16', label: 'ATS Red Flags', icon: ShieldAlert },
                                { id: 'section-19', label: 'Improvement Plan', icon: Zap },
                                { id: 'section-24', label: 'Recruiter Simulation', icon: BookOpen },
                                { id: 'section-25', label: 'Final Verdict', icon: Award }
                            ].map(tab => {
                                const isActive = activeReportTab === tab.id;
                                return (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveReportTab(tab.id)}
                                        className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border ${
                                            isActive 
                                            ? 'bg-electric-purple/10 border-electric-purple/30 text-white shadow-[0_0_15px_rgba(138,92,255,0.15)]' 
                                            : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'
                                        }`}
                                    >
                                        <tab.icon className={`size-4 ${isActive ? 'text-neon-cyan' : 'text-gray-500'}`} />
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
