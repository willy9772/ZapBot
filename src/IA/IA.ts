import { Chat, Client, Message } from "whatsapp-web.js";
import Events from "events";
import config from '../../config.json'
import canProceed from "./Utils/CanProceed";
import ContextUpdated from "./Handlers/ContextUpdated";

const IA = new Events.EventEmitter();

export default class IAWhatsapp {

    private client: Client;

    constructor(Whatsapp: Client) {
        this.client = Whatsapp;
    }

    public start() {
        this.client.on("message", (message) => {
            IA.emit("message", message);
        });
        this.client.on("message_create", (message) => {
            IA.emit("message_create", message);
        });
    }

}

interface Context {
    chat: Chat,
    number: string,
    messages_received: Message[],
    messages_sent: Message[],
}

const contexts: { [chatId: string]: Context } = {};

IA.on("message", async (message: Message) => {
    if (!(await canProceed(message))) return

    if (message.fromMe) return;

    const chat = await message.getChat();

    console.log(`Message from ${chat.id._serialized} - ${message.body}`);

    if (contexts[chat.id._serialized]) {
        const context = contexts[chat.id._serialized];
        context.messages_received.push(message);
    } else {
        contexts[chat.id._serialized] = {
            chat,
            number: chat.id._serialized,
            messages_received: [message],
            messages_sent: [],
        }
    }

    IA.emit('context-updated', chat.id._serialized);

});

IA.on("message_create", async (message: Message) => {
    if (!(await canProceed(message))) return

    if (!message.fromMe) return;

    const chat = await message.getChat();

    console.log(`Message to ${chat.id._serialized} - ${message.body}`);

    if (contexts[chat.id._serialized]) {
        const context = contexts[chat.id._serialized];
        context.messages_sent.push(message);
    } else {
        contexts[chat.id._serialized] = {
            chat,
            number: chat.id._serialized,
            messages_received: [],
            messages_sent: [message],
        }
    }

});

export { IA, contexts }

ContextUpdated()