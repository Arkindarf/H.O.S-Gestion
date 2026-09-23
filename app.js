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

async function processMessage(message) {
  if (message.channelId !== CLASSEMENT_CHANNEL_ID) return;
  if (message.author?.id === client.user.id) return;

  // Pause de 1 seconde pour laisser à Discord le temps d'attacher l'embed
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const freshMessage = await message.channel.messages.fetch(message.id);

    if (freshMessage.author.id === PHOENIX_BOT_ID) {
      const embed = freshMessage.embeds[0];
      const commandName = freshMessage.interactionMetadata?.name || freshMessage.interaction?.commandName || '';

      // Vérifie si le message est issu de /eco server-leaderboard ou contient un classement
      const isLeaderboard =
        commandName.includes('leaderboard') ||
        embed?.title?.toLowerCase().includes('leaderboard') ||
        embed?.title?.toLowerCase().includes('classement') ||
        embed?.description?.toLowerCase().includes('leaderboard') ||
        freshMessage.content.toLowerCase().includes('classement') ||
        freshMessage.embeds.length > 0;

      if (isLeaderboard) {
        // Conserve le message et purge les anciens messages du salon
        const history = await freshMessage.channel.messages.fetch({ limit: 20 });
        const oldMessages = history.filter((msg) => msg.id !== freshMessage.id);
        if (oldMessages.size > 0) {
          await freshMessage.channel.bulkDelete(oldMessages, true);
        }
        return;
      }
    }

    // Supprime tout autre message (ex: texte membre ou réponse d'une autre commande)
    await freshMessage.delete();
  } catch (err) {
    // Le message a pu être déjà supprimé
  }
}

// Écoute de la création ET de la mise à jour des messages
client.on('messageCreate', processMessage);
client.on('messageUpdate', async (_, newMessage) => {
  processMessage(newMessage);
});

client.login(process.env.DISCORD_TOKEN);