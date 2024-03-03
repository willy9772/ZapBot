import { GoogleGenerativeAI } from '@google/generative-ai'
import config from '../../config.json'

export default class Gemini {

    private key: string;
    private template: string;
    private gemini: GoogleGenerativeAI;
    private model: any;

    constructor(Key: string, Template: string) {

        this.key = Key;
        this.template = Template;

        this.gemini = new GoogleGenerativeAI(this.key);
        this.model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });

    }

    public async prompt(prompt: string) {
        const result = await this.model.generateContent(this.AjustarTemplate() + '\n' + prompt);
        const response = await result.response
        const text = await response.text()
        return SplitMessages(text)
    }

    private AjustarTemplate() {
        let template_atual = this.template;

        const variaveis = {
            "current_date": new Date().toLocaleDateString(config.place),
            "current_time": new Date().toLocaleTimeString(config.place),
            "current_day": diaDaSemana()
        }

        for (const variavel of Object.keys(variaveis)) {
            const regex = new RegExp(`{${variavel}}`, 'g');
            // @ts-ignore
            template_atual = template_atual.replace(regex, variaveis[variavel]);
        }

        return template_atual;

    }

}

function SplitMessages(message: string) {
    const regex = /(?:http[s]?:\/\/[^\s]+)|(?:www\.[^\s]+)|[^.?!]+(?:[.?!]+["']?|$)/g;
    const parts: string[] = message.match(regex) as string[];
    parts.forEach((part) => part.trim());
    return parts;
}

function diaDaSemana() {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return dias[new Date().getDay()];
}