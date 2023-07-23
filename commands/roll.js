const { EmbedBuilder } = require("discord.js");
const { CommandType } = require("wokcommands");

module.exports = {
  // Required for slash commands
  description: "Rolls a dice",
  catagory: 'Fun Commands',
  aliases: ['dice'],
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: '[how many sides]',
  guildOnly: false,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the ping command
  callback: ({ message, client, channel, interaction, options, args, guild, user }) => {
   var amount = args[0]
   if(isNaN(amount)) return('Please specify a number.')
   if(amount > 24) return('I can only roll up to a 24 sided die.')

   var response = [Math.floor(Math.random() * ((amount - 1) + 1) + 1)];

   const roll = new EmbedBuilder()
    .setTitle('You rolled...')
    .setDescription(`${response}`)
    .setColor('#FF00E4')
   

    if(message){
        message.channel.send({ embeds: [roll] });
    }
    if(interaction){
        interaction.reply({ embeds: [roll] })
    }
  },
}