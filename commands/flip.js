const { CommandType } = require("wokcommands");
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');


module.exports = {
  // command options
  description: "Flips a coin",
  catagory: 'Fun Commands',
  guildOnly: false,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the ping command
  callback: ({ message, client, channel, interaction, options, args, guild, user }) => {
    const array = ['HEADS!', 'TAILS!', 'HEADS!', 'TAILS!', 'HEADS!', 'TAILS!', 'Middle...'];
    const rand = array[Math.floor(Math.random() * array.length)];
    
    const flip = new EmbedBuilder()
            .setTitle('Flips a coin and...')
            .setDescription(rand)
            .setColor('#FF00E4')
    

    if(message){
        message.channel.send({ embeds: [flip] });
    }
    if(interaction){
        interaction.reply({ embeds: [flip] })
    }
  },
}