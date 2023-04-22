const { CommandType } = require("wokcommands");

module.exports = {
  // Required for slash commands
  description: "Says hi back.",
  catagory: 'Fun Commands',
  aliases: ['hello'],
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the ping command
  callback: ({ message, client, channel, interaction, options, args, guild, user }) => {
    // Return the same object you would use in
    // message.reply
    // or
    // interaction.reply
    // WOKCommands will reply to the message or the interaction
    // depending on how the user ran the command (legacy vs slash)
    if(message){
      message.react('👋')
    }
    return {
      content: `Hello ${user.username}, I am ${client.user.username}`,
    }
  },
}