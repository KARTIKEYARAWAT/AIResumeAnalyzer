import re

with open('d:/AIAnalyser/AI-Resume-Analyzer/app/routes/builder.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    'bg-obsidian': 'bg-background',
    'bg-panel': 'bg-surface-container-lowest border-4 border-on-background neo-shadow-4',
    'bg-panel-light': 'bg-surface-container border-4 border-on-background neo-shadow-4',
    'border border-white/10': 'border-4 border-on-background',
    'border border-white/20': 'border-4 border-on-background bg-surface-lowest',
    'text-white': 'text-on-background font-bold',
    'text-gray-400': 'text-on-surface-variant font-bold',
    'text-gray-300': 'text-on-background font-bold',
    'text-gray-200': 'text-on-background font-bold',
    'cyber-btn-primary': 'bg-primary text-on-primary neo-border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-primary/90 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider',
    'text-neon-cyan': 'text-primary',
    'bg-neon-cyan/10': 'bg-primary-container',
    'border-neon-cyan/30': 'border-primary-container',
    'bg-danger/10': 'bg-[#ffdad6]',
    'text-danger': 'text-[#ba1a1a]',
    'border-danger/30': 'border-[#ba1a1a]',
    'bg-danger/20': 'bg-[#ffb3b0]',
    'hover:bg-danger/30': 'hover:bg-[#ffdad6]',
    'border-white/10': 'border-on-background',
    'border-white/20': 'border-on-background bg-surface-lowest'
}

for k, v in replacements.items():
    content = content.replace(k, v)

# Fix double replacements
content = content.replace('border-4 border-on-background bg-surface-lowest rounded-lg', 'border-4 border-on-background bg-surface-bright rounded-xl')
content = content.replace('border-4 border-on-background bg-surface-lowest', 'border-4 border-on-background')

with open('d:/AIAnalyser/AI-Resume-Analyzer/app/routes/builder.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Replacement complete.')
