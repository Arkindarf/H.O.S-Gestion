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

  // 1. Toujours ignorer les messages de ton propre bot
  if (message.author.id === client.user.id) return;

  // 2. Traitement des messages de PhoenixBot
  if (message.author.id === PHOENIX_BOT_ID) {
    const embed = message.embeds[0]; // Premier embed = index 0
    const isLeaderboard = 
      embed?.title?.toLowerCase().includes('leaderboard') ||
      embed?.title?.toLowerCase().includes('classement') ||
      embed?.description?.toLowerCase().includes('leaderboard');

    if (isLeaderboard) {
      // Nettoie tous les anciens messages du salon pour ne garder QUE ce classement
      try {
        const history = await message.channel.messages.fetch({ limit: 20 });
        const oldMessages = history.filter((msg) => msg.id !== message.id);
        if (oldMessages.size > 0) {
          await message.channel.bulkDelete(oldMessages, true);
        }
      } catch (err) {
        console.error('Erreur lors du nettoyage de l\'ancien classement :', err);
      }
      return;
    }
  }

  // 3. Suppression immédiate de tout autre message (texte, autre commande /eco, etc.)
  try {
    await message.delete();
  } catch (err) {
    console.error('Erreur lors de la suppression du message :', err);
  }
});

client.login(process.env.DISCORD_TOKEN);