import { useState, useCallback } from 'react'
import Navbar from "~/components/Navbar";
import { useAppStore } from "~/lib/store";
import { supabase } from "~/lib/supabase";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Zap, CheckCircle2, ShieldCheck, Target, Loader2, Sparkles } from 'lucide-react';

export default function Upload() {
    const { auth } = useAppStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isGeneratingJD, setIsGeneratingJD] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const [companyName, setCompanyName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: 20 * 1024 * 1024,
    });

    const handleGenerateJD = async () => {
        if (!jobTitle || !companyName) {
            setErrorMessage("Please enter Target Company and Target Role to generate a job description.");
            return;
        }
        
        setIsGeneratingJD(true);
        setErrorMessage('');
        try {
            const res = await fetch('/api/generate-jd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobTitle, companyName, userId: auth.user?.id || 'guest' })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate JD');
            setJobDescription(data.jobDescription);
        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message || 'Error generating JD');
        } finally {
            setIsGeneratingJD(false);
        }
    }

    const handleAnalyze = async () => {
        if (!auth.isAuthenticated || !auth.user) {
            // If they are not logged in, we should ideally log them in anonymously or redirect.
            // For now, keep original logic:
            navigate('/auth?next=/upload');
            return;
        }

        if (!file) {
            setErrorMessage("Please upload a resume first.");
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');
        setStatusText('Initializing Quantum Upload...');

        const newUuid = generateUUID();
        const originalPath = `${auth.user.id}/${newUuid}/original.pdf`;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

            const { error: uploadError } = await supabase.storage.from('resumes').upload(originalPath, file);
            if (uploadError) throw new Error("Upload aborted: " + uploadError.message);

            setStatusText("Rasterizing Document Vectors...");
            const { files: imgFiles, error: imgError, text: pdfText } = await convertPdfToImage(file);
            const imagePaths: string[] = [];
            
            if (!imgError && imgFiles.length > 0) {
                for (let i = 0; i < imgFiles.length; i++) {
                    const imgPath = `${auth.user.id}/${newUuid}/preview-${i + 1}.png`;
                    await supabase.storage.from("resumes").upload(imgPath, imgFiles[i]);
                    imagePaths.push(imgPath);
                }
            }

            setStatusText("Executing OCR Extraction Protocol...");
            let extractedText = pdfText || "";
            if (!extractedText) {
                throw new Error("OCR Failed. No text could be extracted from the document.");
            }

            clearTimeout(timeoutId);

            setStatusText("Registering Sequence Data...");
            const dataToInsert = {
                id: newUuid,
                user_id: auth.user.id,
                company_name: companyName,
                job_title: jobTitle,
                resume_path: originalPath,
                image_path: imagePaths[0] || "",
                image_paths: imagePaths,
                job_description: jobDescription
            };
            const { error: dbError } = await supabase.from('resumes').insert(dataToInsert);
            if (dbError) throw new Error("Database sync error: " + dbError.message);

            setStatusText('Engaging Primary AI Engine...');
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({ resumeText: extractedText, jobTitle, jobDescription, userId: auth.user.id })
            });

            const responseData = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(responseData.error || 'AI Node Offline.');

            const { error: updateError } = await supabase.from('resumes').update({ feedback_json: responseData }).eq('id', newUuid);
            if (updateError) throw new Error("Could not save final AI report.");

            setStatusText('Analysis complete. Rendering Interface...');
            navigate(`/resume/${newUuid}`);
        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message || 'Fatal system error.');
            setIsProcessing(false);
            supabase.storage.from('resumes').remove([originalPath]);
        }
    }

    return (
        <main className="bg-obsidian min-h-screen bg-cyber-grid text-white overflow-hidden selection:bg-electric-purple selection:text-white relative">
            <Navbar />

            {/* Ambient Lighting */}
            <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-electric-purple/10 blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-cyber-green/10 blur-[100px] mix-blend-screen pointer-events-none" />

            <section className="relative min-h-screen flex items-center justify-center pt-24 px-6 z-10">
                <div className="max-w-6xl mx-auto w-full">
                    
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-display font-bold glow-text-cyan mb-4">Initialize Analysis Protocol</h1>
                        <p className="text-gray-400 text-lg">Provide target parameters and upload your document for AI processing.</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {isProcessing ? (
                            <motion.div 
                                key="processing"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="max-w-2xl mx-auto glass-panel p-12 neon-border flex flex-col items-center text-center gap-8"
                            >
                                <div className="relative size-40 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full border-2 border-cyber-green/20 border-t-cyber-green animate-spin" />
                                    <div className="absolute inset-2 rounded-full border-2 border-neon-cyan/20 border-b-neon-cyan animate-spin-reverse" style={{ animationDuration: '3s' }} />
                                    <div className="absolute inset-4 rounded-full border-2 border-electric-purple/20 border-l-electric-purple animate-spin" style={{ animationDuration: '2s' }} />
                                    <Zap className="size-12 text-cyber-green animate-pulse" />
                                    
                                    {/* Scanning Laser Line */}
                                    <motion.div 
                                        animate={{ y: [-80, 80] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        className="absolute left-0 right-0 h-0.5 bg-cyber-green glow-text-green opacity-50 z-10"
                                    />
                                </div>
                                
                                <div>
                                    <h2 className="text-2xl font-display font-bold text-white mb-2 tracking-wide uppercase">Scanning...</h2>
                                    <p className="text-cyber-green font-mono">{statusText}</p>
                                </div>

                                <div className="w-full h-1 bg-obsidian-light rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-gradient-to-r from-electric-purple to-neon-cyan"
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-6"
                            >
                                {errorMessage && (
                                    <div className="glass-panel p-4 border border-danger bg-danger/10 text-danger flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="size-5" />
                                            <span className="font-medium">{errorMessage}</span>
                                        </div>
                                        <button onClick={() => setErrorMessage('')} className="hover:text-white transition-colors">✕</button>
                                    </div>
                                )}
                                <div className="grid lg:grid-cols-2 gap-8 items-start">
                                    {/* Left: Target Parameters Form */}
                                <div className="glass-panel p-8 flex flex-col gap-6">
                                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                        <Target className="text-neon-cyan size-6" />
                                        <h2 className="text-xl font-display font-bold">Target Parameters (Optional)</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium text-gray-400">Target Company</label>
                                            <input 
                                                type="text" 
                                                value={companyName}
                                                onChange={e => setCompanyName(e.target.value)}
                                                className="bg-obsidian-light/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                                                placeholder="e.g. Acme Corp"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium text-gray-400">Target Role</label>
                                            <input 
                                                type="text" 
                                                value={jobTitle}
                                                onChange={e => setJobTitle(e.target.value)}
                                                className="bg-obsidian-light/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                                                placeholder="e.g. Senior Frontend Engineer"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium text-gray-400">Job Description</label>
                                                <button 
                                                    onClick={handleGenerateJD}
                                                    disabled={isGeneratingJD}
                                                    className="text-xs flex items-center gap-1 text-neon-cyan hover:text-white transition-colors disabled:opacity-50"
                                                >
                                                    {isGeneratingJD ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
                                                    {isGeneratingJD ? 'Generating...' : 'Auto Generate'}
                                                </button>
                                            </div>
                                            <textarea 
                                                rows={5}
                                                value={jobDescription}
                                                onChange={e => setJobDescription(e.target.value)}
                                                className="bg-obsidian-light/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors resize-none"
                                                placeholder="Paste the job description here for maximum alignment..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right: AI Scanning Portal */}
                                <div className="flex flex-col gap-6 h-full">
                                    <div 
                                        {...getRootProps()}
                                        className="flex-1 min-h-[400px] relative rounded-2xl cursor-pointer group"
                                    >
                                        <input {...getInputProps()} />
                                        
                                        <motion.div 
                                            animate={{ scale: isDragActive ? 1.02 : 1 }}
                                            className={`absolute inset-0 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 text-center
                                                ${isDragActive ? 'border-cyber-green bg-cyber-green/5' : 'border-white/20 bg-obsidian-light/50 group-hover:border-electric-purple/50'}
                                                ${file ? 'border-solid border-neon-cyan bg-neon-cyan/5' : ''}
                                            `}
                                        >
                                            {file ? (
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="size-16 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                                                        <FileText className="size-8 text-neon-cyan" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium text-lg">{file.name}</p>
                                                        <p className="text-neon-cyan text-sm mt-1 flex items-center justify-center gap-1">
                                                            <CheckCircle2 className="size-4" /> Ready for processing
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="size-20 rounded-full bg-obsidian border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <UploadCloud className={`size-10 ${isDragActive ? 'text-cyber-green' : 'text-gray-400 group-hover:text-electric-purple'} transition-colors`} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xl font-display font-bold text-white mb-2">Drop your document here</p>
                                                        <p className="text-gray-400 text-sm">PDF format only (Max 20MB)</p>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>

                                    <button 
                                        onClick={handleAnalyze}
                                        disabled={!file}
                                        className={`cyber-button w-full flex items-center justify-center gap-3 text-lg py-5 ${!file ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <span>Execute Scan Sequence</span>
                                        <ShieldCheck className="size-5" />
                                    </button>
                                </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </main>
    )
}
