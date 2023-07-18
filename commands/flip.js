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
    const array = ['HEADS!', 'TAILS!', 'Middle...'];
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