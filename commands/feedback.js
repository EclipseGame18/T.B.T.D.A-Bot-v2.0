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
    if(args[0] === 'unlock' && user.id === '547655594715381760'){
      await feedbackCooldown.removeUser(user.id)
      return 'Feedback cooldown overridden'
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