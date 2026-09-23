import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const CLASSEMENT_CHANNEL_ID = '1552042941575331932';
const PHOENIX_BOT_ID = '1230149118710779914';

client.once('ready', () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.channelId !== CLASSEMENT_CHANNEL_ID) return;
  if (message.author.id === client.user.id) return;

  if (message.author.id === PHOENIX_BOT_ID) {
    console.log('--- Message reçu de PhoenixBot ---');
    console.log('Contenu :', message.content);
    console.log('Nombre d\'embeds :', message.embeds.length);
    if (message.embeds.length > 0) {
      console.log('Titre de l\'embed :', message.embeds[0].title);
      console.log('Description :', message.embeds[0].description);
    }
  }
});;

client.login(process.env.DISCORD_TOKEN);