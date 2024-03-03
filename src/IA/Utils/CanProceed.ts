import { Message, Chat } from 'whatsapp-web.js';
import config from '../../../config.json';

export default async function canProceed(message: Message) {

    if (message.hasMedia || message.isStatus) return false;

    const chat: Chat = await message.getChat();

    if (chat.isGroup && !config.allowGroups) {
        return false;
    }

    const isBlacklisted = config.blacklist.includes(chat.id._serialized) || config.blacklist.includes('*');
    const isWhitelisted = config.whitelist.includes(chat.id._serialized) || config.whitelist.includes('*');

    if (isBlacklisted && !isWhitelisted) {
        return false;
    }

    return true;

}