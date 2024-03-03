import { IA, contexts } from '../IA'
import { Message } from 'whatsapp-web.js'
import config from '../../../config.json'
import Gemini from '../../gemini/Gemini';

export default function () {
    IA.on('context-updated', async (chatId: string) => {

        const oldContext = JSON.parse(JSON.stringify(contexts[chatId]));

        await sleep(config.timeoutForReply);

        const newContext = contexts[chatId];

        if (
            oldContext.messages_received.length !== newContext.messages_received.length ||
            oldContext.messages_sent.length !== newContext.messages_sent.length
        ) return

        // Envia ao GEMINI para gerar uma resposta através do contexto atua

        const IA = new Gemini(config.gemini_token, config.gemini_template);

        const prompt = gerarPrompt(newContext.messages_received, newContext.messages_sent);

        const responses: string[] = await IA.prompt(prompt);

        await newContext.chat.sendStateTyping();

        for (const response of responses) {
            await sleep(calcTypingTime(response.length));
            await newContext.chat.sendMessage(response.trim());
        }

    })
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
}

function gerarPrompt(messages_received: Message[], messages_sent: Message[]) {

    const mensagensPorOrdem = messages_received.concat(messages_sent).sort((a, b) => a.timestamp - b.timestamp);

    let prompt = '';

    for (const message of mensagensPorOrdem) {
        prompt += `${message.fromMe ? 'Eu: ' : 'Você: '} ${message.body}\n`;
    }

    return prompt;

}

function calcTypingTime(length: number) {
    // 1 Letra = 0.3 segundos
    return length * 0.3;
}