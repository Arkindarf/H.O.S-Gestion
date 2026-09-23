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

  // Attente de 1,5s pour laisser le temps à Discord d'attacher l'embed
  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    // Récupération des données à jour du message
    const freshMessage = await message.channel.messages.fetch(message.id);

    if (freshMessage.author.id === PHOENIX_BOT_ID) {
      const hasEmbed = freshMessage.embeds.length > 0;
      const hasContent = freshMessage.content.trim().length > 0;

      if (hasEmbed || hasContent) {
        console.log('✅ Classement de PhoenixBot détecté et conservé.');

        // Supprime les anciens messages du salon
        const history = await freshMessage.channel.messages.fetch({ limit: 20 });
        const oldMessages = history.filter((msg) => msg.id !== freshMessage.id);
        if (oldMessages.size > 0) {
          await freshMessage.channel.bulkDelete(oldMessages, true);
        }
        return;
      }
    }

    // Suppression de tout autre message non conforme
    await freshMessage.delete();
    console.log('🗑️ Message non autorisé supprimé.');
  } catch (err) {
    // Le message a déjà pu être effacé
  }
});

client.login(process.env.DISCORD_TOKEN);