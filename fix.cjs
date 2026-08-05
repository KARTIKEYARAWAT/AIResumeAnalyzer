const fs = require('fs');
const files = [
    'api/generate-jd.ts',
    'app/components/AIWorkbench.tsx',
    'app/components/Gamification/AchievementSystem.tsx',
    'app/components/Gamification/HolographicScore.tsx',
    'app/components/Gamification/LevelBar.tsx',
    'app/components/Gamification/SkillToken.tsx',
    'app/routes/home.tsx',
    'app/routes/resume.tsx',
    'app/routes/upload.tsx'
];
for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        const original = content;
        content = content.replace(/\\`/g, '`');
        content = content.replace(/\\\$/g, '$');
        if (content !== original) {
            fs.writeFileSync(file, content);
            console.log('Fixed', file);
        }
    }
}
