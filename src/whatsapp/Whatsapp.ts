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
            webVersion: "2.3000.1018290951-alpha",
            webVersionCache: {
                type: "remote",
                remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/refs/heads/main/html/2.3000.1018290951-alpha.html"
            }
        });
    }

    public async start(): Promise<Client> {
        return new Promise(async (resolve, reject) => {
            try {

                console.log('Loading Whatsapp...');

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
