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

  // On conserve uniquement les messages de PhoenixBot et du bot lui-même
  if (message.author.id === PHOENIX_BOT_ID || message.author.id === client.user.id) {
    const isLeaderboard = message.embeds[0]?.title?.toLowerCase().includes('server-leaderboard');
    if(!isLeaderboard) {
      try {
        await message.delete();
        }  catch(err) {
          console.error('Erreur de suppresion',err);
        }
      }
      return;
    }

  // Suppression automatique de tout autre message envoyé
  try {
    await message.delete();
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
  }
});

client.login(process.env.DISCORD_TOKEN);