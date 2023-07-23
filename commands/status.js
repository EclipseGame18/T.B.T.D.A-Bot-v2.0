const { CommandType } = require("wokcommands");
const { PermissionFlagsBits, EmbedBuilder, Activity, ActivityType } = require('discord.js');

const setStatus = (client, newStatus) => {
    client.user?.setPresence({
        status: 'online',
        activities: [
            {
                name: newStatus,
                type: ActivityType.Playing,
            }
        ]
    })
}


module.exports = {
  // command options
  description: "Sets the bot's status",
  catagory: 'Developer Commands',
  guildOnly: false,
  minArgs: 1,
  expectedArgs: '[status]',

  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the ping command
  callback: ({ message, client, channel, interaction, options, args, guild, user, text, member }) => {
    if(member.id === '547655594715381760'){
    if(!text) return('Please input a new status')

    setStatus(client, text)
    return(`Set new status to \`${text}\``)

    }else{
        return(':x: Unable to comply, this command is a developer only command.')
    }

  },
}