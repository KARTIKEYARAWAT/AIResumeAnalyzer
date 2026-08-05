import { useState, useRef } from "react";
import { Plus, Trash2, PenTool, Download } from "lucide-react";
import Navbar from "~/components/Navbar";

export const meta = () => ([
    { title: 'Ai-Powered Resume Analyzer | Build Resume' },
    { name: 'description', content: 'Build a new ATS-friendly resume from scratch.' },
]);

export default function Builder() {
    const [personalInfo, setPersonalInfo] = useState({
        name: 'Alex Mercer',
        email: 'alex@example.com',
        phone: '+1 234 567 8900',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alex',
        github: 'github.com/alexmercer',
        portfolio: 'alexmercer.dev',
        summary: 'Forward-thinking software engineer with 5+ years of experience in building scalable web applications and optimizing user experiences.'
    });

    const [experience, setExperience] = useState([
        { id: 1, title: 'Senior Developer', company: 'TechCorp', dates: '2020 - Present', bullets: 'Led a team of 5 engineers to rebuild the core architecture, reducing latency by 40%.\nImplemented CI/CD pipelines.' }
    ]);

    const [projects, setProjects] = useState([
        { id: 1, title: 'Neural Engine CLI', link: 'github.com/alexmercer/neural-cli', techStack: 'Rust, WebAssembly, Node.js', bullets: 'Built a lightning-fast CLI tool for optimizing neural network weights.\nAchieved 10k+ weekly NPM downloads.' }
    ]);

    const [education, setEducation] = useState([
        { id: 1, degree: 'B.S. Computer Science', school: 'University of Technology', year: '2019' }
    ]);

    const [technicalSkills, setTechnicalSkills] = useState('React, TypeScript, Node.js, Python, AWS, Docker');
    const [softSkills, setSoftSkills] = useState('Agile Leadership, Cross-functional Communication, Mentoring');

    const [certifications, setCertifications] = useState([
        { id: 1, name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2022' }
    ]);

    const handleDownload = () => {
        // Native print is extremely robust. We just need print CSS in app.css to hide everything except the resume body.
        window.print();
    };

    return (
        <main className="min-h-screen bg-obsidian text-white relative pt-24 px-6 overflow-hidden print:bg-white print:text-black print:overflow-visible print:pt-0 print:px-0">
            <Navbar className="print:hidden" />
            <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-electric-purple/5 blur-[120px] mix-blend-screen pointer-events-none print:hidden" />
            
            <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 h-auto lg:h-[calc(100vh-8rem)] pb-12 lg:pb-0 print:block print:w-full print:max-w-none print:m-0">
                {/* LEFT: Cyberpunk Form Editor */}
                <section className="h-[60vh] lg:h-full flex flex-col glass-panel p-6 overflow-y-auto custom-scrollbar neon-border-purple relative no-print">
                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                            <PenTool className="text-neon-cyan" /> Optimization Matrix
                        </h2>
                        <button onClick={handleDownload} className="cyber-button text-sm flex items-center gap-2">
                            <Download className="size-4" /> Export PDF
                        </button>
                    </div>

                    <div className="space-y-8 pb-12">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-electric-purple">Identity Node</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input className="cyber-input col-span-2" placeholder="Full Name" value={personalInfo.name} onChange={e => setPersonalInfo({...personalInfo, name: e.target.value})} />
                                <input className="cyber-input" placeholder="Email" value={personalInfo.email} onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})} />
                                <input className="cyber-input" placeholder="Phone" value={personalInfo.phone} onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})} />
                                <input className="cyber-input" placeholder="Location" value={personalInfo.location} onChange={e => setPersonalInfo({...personalInfo, location: e.target.value})} />
                                <input className="cyber-input" placeholder="LinkedIn URL" value={personalInfo.linkedin} onChange={e => setPersonalInfo({...personalInfo, linkedin: e.target.value})} />
                                <input className="cyber-input" placeholder="GitHub URL" value={personalInfo.github} onChange={e => setPersonalInfo({...personalInfo, github: e.target.value})} />
                                <input className="cyber-input" placeholder="Portfolio URL" value={personalInfo.portfolio} onChange={e => setPersonalInfo({...personalInfo, portfolio: e.target.value})} />
                                <textarea className="cyber-input col-span-2 resize-none" rows={3} placeholder="Professional Summary" value={personalInfo.summary} onChange={e => setPersonalInfo({...personalInfo, summary: e.target.value})} />
                            </div>
                        </div>

                        {/* Experience */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-cyber-green">Experience Vectors</h3>
                                <button 
                                    onClick={() => setExperience([...experience, { id: Date.now(), title: '', company: '', dates: '', bullets: '' }])}
                                    className="text-cyber-green hover:text-white transition-colors"
                                ><Plus className="size-5" /></button>
                            </div>
                            {experience.map((exp, i) => (
                                <div key={exp.id} className="p-4 border border-white/10 rounded-lg space-y-4 bg-white/5 relative group">
                                    <button 
                                        onClick={() => setExperience(experience.filter(e => e.id !== exp.id))}
                                        className="absolute top-2 right-2 text-gray-500 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                                    ><Trash2 className="size-4" /></button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input className="cyber-input" placeholder="Job Title" value={exp.title} onChange={e => { const newE = [...experience]; newE[i].title = e.target.value; setExperience(newE); }} />
                                        <input className="cyber-input" placeholder="Company" value={exp.company} onChange={e => { const newE = [...experience]; newE[i].company = e.target.value; setExperience(newE); }} />
                                        <input className="cyber-input col-span-2" placeholder="Dates (e.g. Jan 2020 - Present)" value={exp.dates} onChange={e => { const newE = [...experience]; newE[i].dates = e.target.value; setExperience(newE); }} />
                                        <textarea className="cyber-input col-span-2 resize-none" rows={4} placeholder="Bullets (One per line)" value={exp.bullets} onChange={e => { const newE = [...experience]; newE[i].bullets = e.target.value; setExperience(newE); }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Projects */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-electric-purple">Project Clusters</h3>
                                <button 
                                    onClick={() => setProjects([...projects, { id: Date.now(), title: '', link: '', techStack: '', bullets: '' }])}
                                    className="text-electric-purple hover:text-white transition-colors"
                                ><Plus className="size-5" /></button>
                            </div>
                            {projects.map((proj, i) => (
                                <div key={proj.id} className="p-4 border border-white/10 rounded-lg space-y-4 bg-white/5 relative group">
                                    <button 
                                        onClick={() => setProjects(projects.filter(p => p.id !== proj.id))}
                                        className="absolute top-2 right-2 text-gray-500 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                                    ><Trash2 className="size-4" /></button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input className="cyber-input" placeholder="Project Title" value={proj.title} onChange={e => { const newP = [...projects]; newP[i].title = e.target.value; setProjects(newP); }} />
                                        <input className="cyber-input" placeholder="Project Link" value={proj.link} onChange={e => { const newP = [...projects]; newP[i].link = e.target.value; setProjects(newP); }} />
                                        <input className="cyber-input col-span-2" placeholder="Tech Stack (e.g. React, Node.js)" value={proj.techStack} onChange={e => { const newP = [...projects]; newP[i].techStack = e.target.value; setProjects(newP); }} />
                                        <textarea className="cyber-input col-span-2 resize-none" rows={4} placeholder="Description Bullets (One per line)" value={proj.bullets} onChange={e => { const newP = [...projects]; newP[i].bullets = e.target.value; setProjects(newP); }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Education */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-neon-cyan">Education Nodes</h3>
                                <button 
                                    onClick={() => setEducation([...education, { id: Date.now(), degree: '', school: '', year: '' }])}
                                    className="text-neon-cyan hover:text-white transition-colors"
                                ><Plus className="size-5" /></button>
                            </div>
                            {education.map((edu, i) => (
                                <div key={edu.id} className="grid grid-cols-2 gap-4 p-4 border border-white/10 rounded-lg bg-white/5 relative group">
                                    <button 
                                        onClick={() => setEducation(education.filter(e => e.id !== edu.id))}
                                        className="absolute top-2 right-2 text-gray-500 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                                    ><Trash2 className="size-4" /></button>
                                    <input className="cyber-input col-span-2 mt-4" placeholder="Degree / Major" value={edu.degree} onChange={e => { const newE = [...education]; newE[i].degree = e.target.value; setEducation(newE); }} />
                                    <input className="cyber-input" placeholder="School / University" value={edu.school} onChange={e => { const newE = [...education]; newE[i].school = e.target.value; setEducation(newE); }} />
                                    <input className="cyber-input" placeholder="Graduation Year" value={edu.year} onChange={e => { const newE = [...education]; newE[i].year = e.target.value; setEducation(newE); }} />
                                </div>
                            ))}
                        </div>

                        {/* Certifications */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-warning">Certifications</h3>
                                <button 
                                    onClick={() => setCertifications([...certifications, { id: Date.now(), name: '', issuer: '', date: '' }])}
                                    className="text-warning hover:text-white transition-colors"
                                ><Plus className="size-5" /></button>
                            </div>
                            {certifications.map((cert, i) => (
                                <div key={cert.id} className="grid grid-cols-2 gap-4 p-4 border border-white/10 rounded-lg bg-white/5 relative group">
                                    <button 
                                        onClick={() => setCertifications(certifications.filter(c => c.id !== cert.id))}
                                        className="absolute top-2 right-2 text-gray-500 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                                    ><Trash2 className="size-4" /></button>
                                    <input className="cyber-input col-span-2 mt-4" placeholder="Certification Name" value={cert.name} onChange={e => { const newC = [...certifications]; newC[i].name = e.target.value; setCertifications(newC); }} />
                                    <input className="cyber-input" placeholder="Issuer (e.g. AWS)" value={cert.issuer} onChange={e => { const newC = [...certifications]; newC[i].issuer = e.target.value; setCertifications(newC); }} />
                                    <input className="cyber-input" placeholder="Date / Year" value={cert.date} onChange={e => { const newC = [...certifications]; newC[i].date = e.target.value; setCertifications(newC); }} />
                                </div>
                            ))}
                        </div>

                        {/* Skills */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white">Skill Tokens</h3>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider">Technical Skills</label>
                                <textarea className="cyber-input resize-none" rows={3} placeholder="React, TypeScript, Python..." value={technicalSkills} onChange={e => setTechnicalSkills(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider">Soft Skills</label>
                                <textarea className="cyber-input resize-none" rows={2} placeholder="Leadership, Agile, Communication..." value={softSkills} onChange={e => setSoftSkills(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* RIGHT: Live A4 PDF Preview */}
                <section className="h-full flex items-start justify-center overflow-y-auto custom-scrollbar p-6 bg-obsidian-light rounded-xl border border-white/5 print:bg-white print:p-0 print:border-none print:block print:overflow-visible">
                    {/* A4 Paper Size wrapper */}
                    <div id="builder-resume-doc" className="w-[8.5in] min-h-[11in] bg-white shadow-2xl p-8 text-black print:w-full print:shadow-none print:p-0">
                        
                        {/* Clean ATS-Friendly Format inside */}
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-serif font-bold uppercase tracking-wider">{personalInfo.name || 'Your Name'}</h1>
                            <div className="text-sm mt-2 text-gray-700 flex flex-wrap justify-center gap-x-2 gap-y-1">
                                {personalInfo.email && <span>{personalInfo.email}</span>}
                                {personalInfo.email && personalInfo.phone && <span>•</span>}
                                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                                {personalInfo.phone && personalInfo.location && <span>•</span>}
                                {personalInfo.location && <span>{personalInfo.location}</span>}
                                {personalInfo.linkedin && <span>•</span>}
                                {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                                {personalInfo.github && <span>•</span>}
                                {personalInfo.github && <span>{personalInfo.github}</span>}
                                {personalInfo.portfolio && <span>•</span>}
                                {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
                            </div>
                        </div>

                        {personalInfo.summary && (
                            <div className="mb-5">
                                <p className="text-sm text-gray-800 leading-relaxed">{personalInfo.summary}</p>
                            </div>
                        )}

                        {experience.length > 0 && (
                            <div className="mb-5">
                                <h2 className="text-lg font-bold border-b border-gray-400 mb-2 pb-1 uppercase tracking-wider">Experience</h2>
                                <div className="space-y-3">
                                    {experience.map(exp => (
                                        <div key={exp.id}>
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="font-bold text-gray-900">{exp.title} <span className="font-normal italic text-gray-700">at {exp.company}</span></h3>
                                                <span className="text-sm text-gray-600 font-medium">{exp.dates}</span>
                                            </div>
                                            {exp.bullets && (
                                                <ul className="list-disc list-outside ml-4 mt-1 text-sm text-gray-800 space-y-1">
                                                    {exp.bullets.split('\n').filter(b => b.trim()).map((bullet, idx) => (
                                                        <li key={idx}>{bullet}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {projects.length > 0 && (
                            <div className="mb-5">
                                <h2 className="text-lg font-bold border-b border-gray-400 mb-2 pb-1 uppercase tracking-wider">Projects</h2>
                                <div className="space-y-3">
                                    {projects.map(proj => (
                                        <div key={proj.id}>
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="font-bold text-gray-900">
                                                    {proj.title}
                                                    {proj.link && <span className="font-normal text-sm text-gray-600 ml-2">({proj.link})</span>}
                                                </h3>
                                            </div>
                                            {proj.techStack && (
                                                <p className="text-xs text-gray-600 italic mb-1">Technologies: {proj.techStack}</p>
                                            )}
                                            {proj.bullets && (
                                                <ul className="list-disc list-outside ml-4 mt-1 text-sm text-gray-800 space-y-1">
                                                    {proj.bullets.split('\n').filter(b => b.trim()).map((bullet, idx) => (
                                                        <li key={idx}>{bullet}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {education.length > 0 && (
                            <div className="mb-5">
                                <h2 className="text-lg font-bold border-b border-gray-400 mb-2 pb-1 uppercase tracking-wider">Education</h2>
                                <div className="space-y-2">
                                    {education.map(edu => (
                                        <div key={edu.id} className="flex justify-between items-baseline">
                                            <div>
                                                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                                <p className="text-sm text-gray-800">{edu.school}</p>
                                            </div>
                                            <span className="text-sm text-gray-600 font-medium">{edu.year}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {certifications.length > 0 && (
                            <div className="mb-5">
                                <h2 className="text-lg font-bold border-b border-gray-400 mb-2 pb-1 uppercase tracking-wider">Certifications</h2>
                                <div className="space-y-1">
                                    {certifications.map(cert => (
                                        <div key={cert.id} className="flex justify-between items-baseline text-sm text-gray-800">
                                            <span className="font-medium">{cert.name} - <span className="text-gray-600 italic">{cert.issuer}</span></span>
                                            <span className="text-gray-600">{cert.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(technicalSkills || softSkills) && (
                            <div>
                                <h2 className="text-lg font-bold border-b border-gray-400 mb-2 pb-1 uppercase tracking-wider">Skills</h2>
                                <div className="text-sm text-gray-800 leading-relaxed space-y-1">
                                    {technicalSkills && (
                                        <p><span className="font-bold text-gray-900">Technical: </span>{technicalSkills}</p>
                                    )}
                                    {softSkills && (
                                        <p><span className="font-bold text-gray-900">Soft Skills: </span>{softSkills}</p>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </section>
            </div>
        </main>
    );
}
