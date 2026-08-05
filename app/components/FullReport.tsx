import { motion } from "framer-motion";
import { 
    CheckCircle2, XCircle, AlertTriangle, TrendingUp, Award, 
    Briefcase, Code2, PenTool, FileText, Zap, ShieldAlert, BookOpen, BrainCircuit, LayoutList
} from "lucide-react";

const Section = ({ id, title, icon: Icon, children }: any) => (
    <div id={id} className="glass-panel p-6 neon-border-purple scroll-mt-24">
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <div className="p-2 bg-electric-purple/10 rounded-lg">
                <Icon className="size-6 text-electric-purple" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white">{title}</h2>
        </div>
        {children}
    </div>
);

const ScoreCircle = ({ score, label }: { score: number, label: string }) => {
    let color = 'text-cyber-green';
    if (score < 70) color = 'text-warning';
    if (score < 40) color = 'text-danger';
    
    return (
        <div className="flex flex-col items-center gap-2 p-4 bg-obsidian/50 rounded-xl border border-white/5">
            <div className={`text-3xl font-display font-bold ${color}`}>{score || 0}</div>
            <div className="text-xs text-gray-400 text-center uppercase tracking-wider">{label}</div>
        </div>
    );
};

const BooleanItem = ({ label, value }: { label: string, value: boolean }) => (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
        <span className="text-sm text-gray-300">{label}</span>
        {value ? <CheckCircle2 className="size-5 text-cyber-green" /> : <XCircle className="size-5 text-danger" />}
    </div>
);

const ListItems = ({ title, items, color = "cyber-green" }: { title: string, items: string[], color?: string }) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="mb-4">
            <h4 className="text-sm font-bold text-white mb-2">{title}</h4>
            <div className="flex flex-wrap gap-2">
                {items.map((item, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded-md bg-${color}/10 text-${color} border border-${color}/20`}>
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default function FullReport({ feedback, activeTab = 'section-1', isPrinting = false }: { feedback: any, activeTab?: string, isPrinting?: boolean }) {
    if (!feedback) return null;

    const renderSection = (id: string, Component: any) => {
        if (!isPrinting && activeTab !== id) return null;
        return Component;
    };

    return (
        <div className="flex flex-col gap-12" id="full-report-content">
            
            {renderSection('section-1',
                <Section id="section-1" title="1. Overall Analysis" icon={TrendingUp}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <ScoreCircle score={feedback.overallResumeScore || 0} label="Overall Score" />
                        <ScoreCircle score={feedback.atsCompatibilityScore || 0} label="ATS Score" />
                        <ScoreCircle score={feedback.recruiterAppealScore || 0} label="Recruiter Appeal" />
                        <ScoreCircle score={feedback.technicalStrengthScore || 0} label="Tech Strength" />
                    </div>
                    <div className="flex items-center justify-between p-6 bg-electric-purple/10 border border-electric-purple/30 rounded-xl">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Overall Grade</h3>
                            <p className="text-gray-400 text-sm">Based on comprehensive AI evaluation</p>
                        </div>
                        <div className="text-5xl font-display font-bold glow-text-purple text-electric-purple">
                            {feedback.overallGrade || 'N/A'}
                        </div>
                    </div>
                </Section>
            )}

            {renderSection('section-2',
                <Section id="section-2" title="2. ATS Compatibility" icon={Zap}>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <BooleanItem label="ATS Friendly Status" value={feedback.atsFriendlyStatus} />
                            <BooleanItem label="PDF/DOCX Validation" value={feedback.pdfDocxValidation} />
                            <BooleanItem label="Font Compatibility" value={feedback.fontCompatibility} />
                            <BooleanItem label="Multi-column Detection" value={feedback.multiColumnDetection} />
                            <BooleanItem label="Tables Detection" value={feedback.tablesDetection} />
                        </div>
                        <div>
                            <div className="mb-4">
                                <span className="text-sm text-gray-400">Parsing Accuracy</span>
                                <div className="h-2 bg-obsidian mt-1 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyber-green" style={{ width: `${feedback.resumeParsingAccuracy || 0}%` }} />
                                </div>
                            </div>
                            <ListItems title="ATS Red Flags" items={feedback.atsRedFlags} color="danger" />
                            <ListItems title="Improvement Suggestions" items={feedback.atsImprovementSuggestions} color="warning" />
                        </div>
                    </div>
                </Section>
            )}

            {renderSection('section-3',
                <Section id="section-3" title="3. Resume Structure" icon={LayoutList}>
                    <div className="mb-6 flex items-center gap-4">
                        <div className="text-3xl font-bold text-white">{feedback.structureAnalysis?.completenessPercentage || 0}%</div>
                        <div className="text-gray-400 uppercase text-sm font-bold tracking-wider">Completeness</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <BooleanItem label="Contact Info" value={feedback.structureAnalysis?.contactInformation} />
                        <BooleanItem label="Summary" value={feedback.structureAnalysis?.professionalSummary} />
                        <BooleanItem label="Tech Skills" value={feedback.structureAnalysis?.technicalSkills} />
                        <BooleanItem label="Experience" value={feedback.structureAnalysis?.workExperience} />
                        <BooleanItem label="Projects" value={feedback.structureAnalysis?.projects} />
                        <BooleanItem label="Education" value={feedback.structureAnalysis?.education} />
                    </div>
                    <div className="mt-6">
                        <ListItems title="Missing Sections" items={feedback.structureAnalysis?.missingSections} color="danger" />
                    </div>
                </Section>
            )}

            {renderSection('section-6',
                <Section id="section-6" title="6. Skills Analysis" icon={Code2}>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Technical Skills Found</h3>
                            <ListItems title="Languages" items={feedback.skillsAnalysis?.technical?.programmingLanguages} color="neon-cyan" />
                            <ListItems title="Frontend" items={feedback.skillsAnalysis?.technical?.frontend} color="neon-cyan" />
                            <ListItems title="Backend" items={feedback.skillsAnalysis?.technical?.backend} color="neon-cyan" />
                            <ListItems title="Cloud/DevOps" items={[...(feedback.skillsAnalysis?.technical?.cloud || []), ...(feedback.skillsAnalysis?.technical?.devOps || [])]} color="neon-cyan" />
                        </div>
                        <div>
                            <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl mb-4">
                                <ListItems title="Missing Critical Skills" items={feedback.skillsAnalysis?.missingSkills} color="danger" />
                            </div>
                            <div className="p-4 bg-cyber-green/10 border border-cyber-green/20 rounded-xl">
                                <ListItems title="Recommended to Learn" items={feedback.skillsAnalysis?.recommendedSkills} color="cyber-green" />
                            </div>
                        </div>
                    </div>
                </Section>
            )}

            {renderSection('section-8',
                <Section id="section-8" title="8. Experience Analysis" icon={Briefcase}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <ScoreCircle score={feedback.experience?.totalExperienceYears || 0} label="Total Years" />
                        <ScoreCircle score={feedback.experience?.relevantExperienceYears || 0} label="Relevant Years" />
                        <ScoreCircle score={feedback.experience?.experienceQualityScore || 0} label="Quality Score" />
                        <ScoreCircle score={feedback.experience?.industryRelevance || 0} label="Industry Match" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl flex justify-between">
                            <span className="text-gray-400">Career Progression</span>
                            <span className="font-bold text-white">{feedback.experience?.careerProgression}</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl flex justify-between">
                            <span className="text-gray-400">Job Stability</span>
                            <span className="font-bold text-white">{feedback.experience?.jobStability}</span>
                        </div>
                    </div>
                </Section>
            )}

            {renderSection('section-14',
                <Section id="section-14" title="14. Writing Quality" icon={PenTool}>
                    <div className="grid md:grid-cols-2 gap-8 mb-6">
                        <div className="space-y-3">
                            <BooleanItem label="Grammar & Spelling" value={feedback.writingQuality?.grammar && feedback.writingQuality?.spelling} />
                            <BooleanItem label="Active Voice Usage" value={feedback.writingQuality?.activeVoice} />
                            <BooleanItem label="Professional Tone" value={feedback.writingQuality?.professionalTone} />
                        </div>
                        <div className="flex items-center justify-center">
                            <ScoreCircle score={feedback.writingQuality?.readability || 0} label="Readability Score" />
                        </div>
                    </div>
                    <ListItems title="Strong Action Words Found" items={feedback.writingQuality?.strongActionWords} color="cyber-green" />
                    <ListItems title="Weak/Buzzwords to Remove" items={[...(feedback.writingQuality?.weakWords || []), ...(feedback.writingQuality?.buzzwords || [])]} color="warning" />
                </Section>
            )}

            {renderSection('section-16',
                <Section id="section-16" title="16. ATS Red Flags" icon={ShieldAlert}>
                    <div className="space-y-4">
                        <div className="p-4 bg-danger/10 border border-danger/30 rounded-xl">
                            <h3 className="font-bold text-danger mb-2">Critical Severity</h3>
                            <ul className="list-disc pl-5 text-sm text-danger space-y-1">
                                {feedback.atsRedFlagsAnalysis?.critical?.map((flag: string, i: number) => <li key={i}>{flag}</li>)}
                                {!feedback.atsRedFlagsAnalysis?.critical?.length && <li>No critical red flags detected.</li>}
                            </ul>
                        </div>
                    </div>
                </Section>
            )}

            {renderSection('section-19',
                <Section id="section-19" title="19. Improvement Roadmap" icon={TrendingUp}>
                    <div className="space-y-6">
                        {feedback.improvementRoadmap?.critical?.map((item: any, i: number) => (
                            <div key={i} className="p-4 bg-obsidian border-l-4 border-danger rounded-r-xl">
                                <h4 className="font-bold text-white mb-2">{item.issue}</h4>
                                <p className="text-sm text-gray-400 mb-2"><strong>Fix:</strong> {item.suggestedFix}</p>
                                <p className="text-sm text-cyber-green"><strong>Impact:</strong> {item.expectedImpact}</p>
                            </div>
                        ))}
                        {feedback.improvementRoadmap?.highImpact?.map((item: any, i: number) => (
                            <div key={i} className="p-4 bg-obsidian border-l-4 border-warning rounded-r-xl">
                                <h4 className="font-bold text-white mb-2">{item.issue}</h4>
                                <p className="text-sm text-gray-400 mb-2"><strong>Fix:</strong> {item.suggestedFix}</p>
                                <p className="text-sm text-cyber-green"><strong>Impact:</strong> {item.expectedImpact}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {renderSection('section-24',
                <Section id="section-24" title="24. Recruiter Simulation" icon={BrainCircuit}>
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <ScoreCircle score={feedback.recruiterSimulation?.firstImpressionScore || 0} label="First Impression" />
                        <ScoreCircle score={feedback.recruiterSimulation?.shortlistProbability || 0} label="Shortlist Prob." />
                        <ScoreCircle score={feedback.recruiterSimulation?.interviewProbability || 0} label="Interview Prob." />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 bg-cyber-green/5 border border-cyber-green/20 rounded-xl">
                            <h4 className="font-bold text-cyber-green mb-3">Top Strengths</h4>
                            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
                                {feedback.recruiterSimulation?.topStrengths?.map((str: string, i: number) => <li key={i}>{str}</li>)}
                            </ul>
                        </div>
                        <div className="p-4 bg-danger/5 border border-danger/20 rounded-xl">
                            <h4 className="font-bold text-danger mb-3">Top Concerns</h4>
                            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
                                {feedback.recruiterSimulation?.topConcerns?.map((con: string, i: number) => <li key={i}>{con}</li>)}
                            </ul>
                        </div>
                    </div>
                </Section>
            )}
            
            {renderSection('section-25',
                <Section id="section-25" title="25. Final Verdict" icon={Award}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                        <div className="p-4 bg-obsidian rounded-xl border border-white/5">
                            <div className="text-sm text-gray-400 mb-2">ATS Ready</div>
                            {feedback.finalVerdict?.atsReady ? <CheckCircle2 className="size-8 text-cyber-green mx-auto" /> : <XCircle className="size-8 text-danger mx-auto" />}
                        </div>
                        <div className="p-4 bg-obsidian rounded-xl border border-white/5">
                            <div className="text-sm text-gray-400 mb-2">Recruiter Ready</div>
                            {feedback.finalVerdict?.recruiterReady ? <CheckCircle2 className="size-8 text-cyber-green mx-auto" /> : <XCircle className="size-8 text-danger mx-auto" />}
                        </div>
                        <div className="p-4 bg-obsidian rounded-xl border border-white/5">
                            <div className="text-sm text-gray-400 mb-2">Job Ready</div>
                            {feedback.finalVerdict?.jobReady ? <CheckCircle2 className="size-8 text-cyber-green mx-auto" /> : <XCircle className="size-8 text-danger mx-auto" />}
                        </div>
                        <ScoreCircle score={feedback.finalVerdict?.confidenceScore || 0} label="AI Confidence" />
                    </div>
                    <div className="p-6 bg-electric-purple/10 border border-electric-purple/50 rounded-xl text-center">
                        <h3 className="text-2xl font-bold font-display text-white mb-2">Overall Verdict: {feedback.finalVerdict?.overallResumeGrade || 'N/A'}</h3>
                        <p className="text-gray-300 text-lg">Estimated Interview Chance: <span className="text-cyber-green font-bold">{feedback.finalVerdict?.estimatedInterviewChance || 0}%</span></p>
                    </div>
                </Section>
            )}

        </div>
    );
}
