const { CommandType } = require("wokcommands");
const { PermissionsBitField } = require('discord.js')
const guildQueue = require('../index');


module.exports = {
  // command options
  description: "Pause the current song",
  catagory: 'Music Commands',
  guildOnly: true,
  
  // Create a legacy and slash command
  type: CommandType.SLASH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    console.log(guildQueue)
    //guildQueue.setPaused(true);
    return 'paused'
  },
}