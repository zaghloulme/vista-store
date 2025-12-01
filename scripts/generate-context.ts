import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const questions = [
    { key: 'goal', question: '1. What is the primary business goal of this website?' },
    { key: 'audience', question: '2. Who is the target audience?' },
    { key: 'features', question: '3. List 3 key features (comma separated):' },
    { key: 'constraints', question: '4. Any technical constraints? (e.g., "Must be fast", "No external fonts")' },
];

const answers: Record<string, string> = {};

async function askQuestion(index: number) {
    if (index >= questions.length) {
        generateFile();
        rl.close();
        return;
    }

    rl.question(`\n${questions[index].question}\n> `, (answer) => {
        answers[questions[index].key] = answer.trim();
        askQuestion(index + 1);
    });
}

function generateFile() {
    const content = `# Project Context for AI

## Business Goal
${answers.goal}

## Target Audience
${answers.audience}

## Key Features
${answers.features.split(',').map(f => `- ${f.trim()}`).join('\n')}

## Technical Constraints
${answers.constraints || 'None specified.'}

## Development Priorities
1. Correctness (Architecture compliance)
2. Performance
3. Speed
`;

    const dir = path.join(process.cwd(), '.claude');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const filePath = path.join(dir, 'PROJECT_CONTEXT.md');
    fs.writeFileSync(filePath, content);

    console.log(`\n✅ Generated context file at: ${filePath}`);
    console.log('AI agents will now have better context for your project.');
}

console.log('🤖 AI Context Generator');
console.log('-----------------------');
askQuestion(0);
