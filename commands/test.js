const { CommandType } = require("wokcommands");

module.exports = {
  // Required for slash commands
  description: "Test the bot",
  catagory: 'Utility Commands',
  minArgs: -1,
  maxArgs: -1,
  expectedArgs: '[optional args test]',
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the ping command
  callback: ({ message, client, channel, interaction, options, args, guild, user, text }) => {
    if(!args[0]) text = 'NO_ARGS_ENTERD'
    return {
      content: `${client.user.username} is online.\nAll commands are registerd.\nMy defult prefix is ! or /.\nThe optional args you enterd were: \`${text}\``,
    }
  },
}