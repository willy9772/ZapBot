const readline = require('readline');
const fs = require('fs');

interface IQuestion {
    type: string;
    name: string;
    message: string;
}

const Questions: IQuestion[] = [
    {
        type: 'input',
        name: 'gemini_token',
        message: 'Enter your Gemini API token above:\n'
    },
    {
        type: 'input',
        name: 'gemini_template',
        message: 'Enter your Gemini template prompt above:\n'
    },
    {
        type: 'input',
        name: 'place',
        message: 'Enter the place where the bot is running above (Ex: pt-BR, en-US) above:\n'
    }
]

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const Config = {
    whitelist: [
        "555180282898@c.us",
        "555199180715@c.us"
    ],
    blacklist: [
        '*'
    ],
    allowGroups: false,
    timeoutForReply: 15,
};

(async () => {
    for (const question of Questions) {
        if (question.type === 'input') {
            const answer = await AskToUser(question.message);
            (Config as any)[question.name] = answer as string;
        }
    }
    rl.close();
    fs.writeFileSync('config.json', JSON.stringify(Config, null, 2));
}
)();

async function AskToUser(question: string) {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer: string) => {
            resolve(answer);
        });
    });
}