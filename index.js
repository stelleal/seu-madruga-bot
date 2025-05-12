// Import required modules 
const { Client, GatewayIntentBits } = require('discord.js');
const { join } = require("path");
const { createReadStream } = require("fs");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
require('dotenv').config(); 

// Create a new Discord client with message intent 
const client = new Client({ 
  intents: [ 
      GatewayIntentBits.Guilds,  
      GatewayIntentBits.GuildMessages,  
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent] 
}); 

// Bot is ready 
client.once('ready', () => { 
  console.log(`🤖 Logged in as ${client.user.tag}`); 
}); 

// Listen and respond to messages 
client.on('messageCreate', message => { 

  // Ignore messages from bots 
  if (message.author.bot) return; 

  // Respond to a specific message 
  if (message.content.startsWith('!sm ')) {
    if (!message.member?.voice?.channel?.id) {
      message.reply('Se você não tiver em um canal de voz fica foda meu amigo...');
      return;
    }

    if (!message.content.includes('?')) {
      message.reply('Isso não me parece uma pergunta sua anta.');
      return;
    }

    const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
    });

    const audioPlayer = createAudioPlayer();
    const audioToPlay = Math.floor(Math.random() * 2) === 1 ? "./audios/sim.mp3" : "./audios/nao.mp3"
    const resource = createAudioResource(createReadStream(join(__dirname, audioToPlay)));
    connection.subscribe(audioPlayer);
    audioPlayer.play(resource);

    setTimeout(() => {
        connection.disconnect();
    }, 2_000);
  }
});   

// Log in to Discord using token from .env 
client.login(process.env.DISCORD_TOKEN); 
