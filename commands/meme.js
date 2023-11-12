const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const fetch = require("node-fetch");

module.exports = {
  // command options
  description: "Find a random meme from r/memes",
  catagory: 'Fun Commands',
  aliases: ['funny'],
  guildOnly: false,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    try {
      const url = await fetch("https://www.reddit.com/r/memes/random/.json");
      const random = await url.json();

      const meme = new EmbedBuilder()
        .setTitle(`${random[0].data.children[0].data.title}`)
        .setImage(random[0].data.children[0].data.url)
        .setColor('#FF00E4')
        .setFooter({ text: `This spicy meme was origionally posted on r/memes` })

        if(message){
            message.channel.send({ embeds: [meme] });
        }
        if(interaction){
            interaction.reply({ embeds: [meme] })
        }
    } catch (error) {
        console.log("Failed to send meme: " + error)
        return ":x: failed to find a funny enougth meme."
    }
  },
}