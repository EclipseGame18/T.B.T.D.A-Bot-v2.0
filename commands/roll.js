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