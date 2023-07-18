const { CommandType } = require("wokcommands");
const GuildWelcomeChannel = require('../Guild4')
const GuildWelcome = require('../Guild3')
const ToggleAntiSware = require('../Guild2')
const { EmbedBuilder } = require('discord.js')

module.exports = {
  // Required for slash commands
  description: "Test the bot",
  catagory: 'Utility Commands',
  aliases: ['report'],
  minArgs: -1,
  maxArgs: -1,
  expectedArgs: '[optional args test]',
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the ping command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, text }) => {
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
    try{
    if(guildwelcome.message === ''){
        welcomeToggle = 'off';
    } else{
        welcomeToggle = 'on';
    }
    } catch{
        welcomeToggle = 'Error retreving welcome message status';
    }

    let logChannel;
    try{
    if(welcomemessagechannel.channel === ''){
      logChannel = 'off'
    } else{
      logChannel = 'on'
    }
    } catch{
        logChannel = 'Error retreving log channel status'
   }

    if(!args[0]) text = 'NO_ARGS_ENTERD'
    return {
      content: `${client.user.username} is online.\nAll commands are registerd.\nMy defult prefix is ! or /.\nThe optional args you enterd were: \`${text}\`\nWelcome message plugin is currentaly: \`${welcomeToggle}\`\nLog and welcome channel is currentaly: \`${logChannel}\`\nGuild anti-swear plugin is currentaly: \`${truetoggle}\``,
    }
  },
}