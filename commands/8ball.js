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
    const lockDown = true
    const lockDownEmbed = new EmbedBuilder()
    .setTitle('T.B.T.D.A Beta Test is retiring')
    .setDescription(`As you probabely know, T.B.T.D.A Beta Test is retiring. We are now around 1-2 days away form switching back to the original T.B.T.D.A. This means that untill the switch occurs, I (T.B.T.D.A Beta Test) will be unavailable.\n\nIf you still havn't added T.B.T.D.A yet, you can do so with [this link](https://discord.com/api/oauth2/authorize?client_id=712958160620748820&permissions=8&scope=bot).`)
    .setColor('#0059FF');

    if(lockDown === true){
      if(message){
        message.channel.send({ embeds: [lockDownEmbed] })
      }
      if(interaction){
        interaction.reply({ embeds: [lockDownEmbed] })
      }
      return
    }


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