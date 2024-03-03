import { Client } from "whatsapp-web.js";
import IAWhatsapp from "./src/IA/IA";
import CheckFiles from "./src/etc/CheckFiles";
import { Whatsapp } from "./src/whatsapp/Whatsapp";

CheckFiles();

(async () => {

    const Whats: Client = await (new Whatsapp()).start()
    new IAWhatsapp(Whats).start();

})()