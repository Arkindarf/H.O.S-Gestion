import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const CLASSEMENT_CHANNEL_ID = 'ID_DE_TON_SALON_CLASSEMENT';
const PHOENIX_BOT_ID = 'ID_DU_BOT_PHOENIX';

client.once('ready', () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.channelId !== CLASSEMENT_CHANNEL_ID) return;

  // On conserve uniquement les messages de PhoenixBot et du bot lui-même
  if (message.author.id === PHOENIX_BOT_ID || message.author.id === client.user.id) {
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