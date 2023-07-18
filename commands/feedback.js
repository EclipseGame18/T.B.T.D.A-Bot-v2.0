const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const {CommandCooldown, msToMinutes} = require('discord-command-cooldown');

const ms = require('ms')

const feedbackCooldown = new CommandCooldown('feedback', ms('2h'))

module.exports = {
  // command options
  description: "Sends feedback to the developer.",
  catagory: 'Utility Commands',
  minArgs: 1,
  expectedArgs: "[feedback]",
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
    const underCooldown = await feedbackCooldown.getUser(user.id)
        if(underCooldown){
            const time = msToMinutes(underCooldown.msLeft, false)
            return `${user}, you can send feedback again in **${time.hours}** hours, **${time.minutes}** minutes, **${time.seconds}** seconds.`
        }
        if(!args[0]) return 'Please provide some feedback'
        let feedback = text
        const developer = client.users.cache.get('547655594715381760')
        
        let feedbackembed = new EmbedBuilder()
        .setTitle(`:tada: You have feedback form ${user.username} ${guild ? `in ${guild.name}` : ' '}`)
        .setDescription(`You feedback is as follows:\n\`${feedback}\``)
        .setTimestamp()
        .setColor('#00F041')

        developer.send({ embeds: [feedbackembed] })
        await feedbackCooldown.addUser(user.id)
        return 'Your feedback has been sent to the developers!\nThank you in taking time to write to us!'
  },
}