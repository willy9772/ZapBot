import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

export class Whatsapp {
    private client: Client;

    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth({
                // @ts-ignore
                dataPath: global.cacheDir + '/Whatsapp',
            }),
        });;
    }

    public async start(): Promise<Client> {
        return new Promise(async (resolve, reject) => {
            try {

                this.client.on("qr", (qr) => {
                    qrcode.generate(qr, { small: true });
                });

                this.client.on("ready", () => {
                    console.log('Whatsapp loaded successfully!');
                    resolve(this.client);
                });

                await this.client.initialize();

            } catch (error) {
                reject(error);
            }
        });
    }
}
