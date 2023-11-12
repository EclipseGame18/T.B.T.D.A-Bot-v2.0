const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')

module.exports = {
  // command options
  description: "IDK",
  catagory: 'Fun Commands',

  guildOnly: false,
  
  // Create a legacy and slash command
  type: CommandType.LEGACY,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    message.reply({ content: `I don't know either...`}).then(msg => {
        const toDelete = [msg, message]
        setTimeout(() => {
        toDelete.forEach((delmsg) => {
            delmsg.delete().catch((err) => console.log('Error deleting idk message: ', err));
          });
        }, 3000);
      }).catch(err =>{
        console.log(`error deleting idk message: ${err}`)
        return
      });
  },
}