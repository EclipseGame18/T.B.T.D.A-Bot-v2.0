const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  // command options
  description: "Ask the 8ball a question, and receve the answer you have been waiting for...",
  catagory: 'Fun Commands',
  minArgs: 1,
  expectedArgs: "[question]",
  guildOnly: false,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, text, guild, user, member }) => {
    if(!args[0]) return 'Please specify a question for the 8ball to answer.'
    const replies = ['Yes.', 'No.', 'Never!', 'Definitely.', 'Ask again later...', 'HA HA HA no.', 'Hell yes!', 'Future still undecided.', 'The possiblity is low.', 'The possiblity is high.', 'Your question is too vague...'];
    const result = replies[Math.floor(Math.random() *replies.length)];
    const question = text
    let answer = new EmbedBuilder()
    .setTitle('🎱 The 8 Ball says...')
    .addFields(
        {name: 'Question', value: `${question}`},
        {name: 'Answer', value: `${result}`}
    )
    .setFooter({ text: `Requested by ${member.displayName}` })
    .setColor('#FF00E4')
    
    if(message){
        message.channel.send({ embeds: [answer] })
    }
    if(interaction){
        interaction.reply({ embeds: [answer] })
    }
  },
}