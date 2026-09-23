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

  // Si le message vient de PhoenixBot
  if (message.author.id === PHOENIX_BOT_ID) {
    const textContent = message.content.toLowerCase();
    const embedText = message.embeds[0]?.title?.toLowerCase() || message.embeds[0]?.description?.toLowerCase() || '';

    // Détecte si le message contient du texte ou un embed en rapport avec le classement
    const isLeaderboard = 
      textContent.includes('leaderboard') || 
      textContent.includes('classement') ||
      embedText.includes('leaderboard') || 
      embedText.includes('classement') ||
      message.embeds.length > 0; // Si PhoenixBot envoie n'importe quel embed, on le conserve

    if (isLeaderboard) {
      // Supprime les anciens messages pour garder uniquement ce nouveau classement
      try {
        const history = await message.channel.messages.fetch({ limit: 20 });
        const oldMessages = history.filter((msg) => msg.id !== message.id);
        if (oldMessages.size > 0) {
          await message.channel.bulkDelete(oldMessages, true);
        }
      } catch (err) {
        console.error('Erreur lors du nettoyage :', err);
      }
      return;
    }
  }

  // Tout autre message est supprimé
  try {
    await message.delete();
  } catch (err) {
    console.error('Erreur lors de la suppression :', err);
  }
});

client.login(process.env.DISCORD_TOKEN);