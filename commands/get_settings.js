const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const GuildWelcomeChannel = require('../Guild4')
const GuildWelcome = require('../Guild3')
const ToggleAntiSware = require('../Guild2')

module.exports = {
  // command options
  description: "Gets all the current guild settings",
  catagory: 'Utility Commands',
  aliases: ['settings'],
  guildOnly: true,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    const welcomemessagechannel = await GuildWelcomeChannel.findOne({_id: guild.id}).catch(error =>{
        console.log(`There was a error: ${error}`)
      })
        const guildwelcome = await GuildWelcome.findOne({_id: guild.id}).catch(error =>{
        console.log(`There was a error: ${error}`)
      })
      const toggleSware = await ToggleAntiSware.findOne({_id: guild.id}).catch(error =>{
        console.log(`There was a error: ${error}`)
      })
      let truetoggle;
      try{
              if (toggleSware.toggle == 'true'){
                   truetoggle = 'on'
              }
              else {
                   truetoggle = 'off'
              }
      } catch{
        truetoggle = 'Error retreving guild anti-swear status.'
      }

      let welcomeToggle;
      let welcomeValue;
        try{
        if(guildwelcome.message === ''){
            welcomeToggle = 'off';
            welcomeValue = 'null';
        } else{
            welcomeToggle = 'on';
            welcomeValue = guildwelcome.message;
        }
        } catch{
        welcomeToggle = 'Error retreving welcome message status';
        }

        let logChannel;
        let logValue
        try{
        if(welcomemessagechannel.channel === ''){
            logChannel = 'off';
            logValue = 'null';
        } else{
            logChannel = 'on';
            logValue = welcomemessagechannel.channel;
        }
        } catch{
            logChannel = 'Error retreving log channel status'
        }
        const settings = new EmbedBuilder()
        .setTitle('Current server settings:')
        .addFields(
            {name: "Guild anti-swear", value: `The guild anti-swear plugin is currentaly: \`${truetoggle}\``},
            {name: "Guild welcome message", value: `The guild welcome message plugin is currentaly: \`${welcomeToggle}\`. Settig value:\n\`${welcomeValue}\``},
            {name: "Guild log and welcome channel", value: `The guild log and welcome channel is currentaly: \`${logChannel}\`. Setting Value:\n\`${logValue}\``}
        )
        .setColor('#00B9FF')
        .setTimestamp()

        if(message){
            message.channel.send({ embeds: [settings] });
        }
        if(interaction){
            interaction.reply({ embeds: [settings] })
        }
  },
}