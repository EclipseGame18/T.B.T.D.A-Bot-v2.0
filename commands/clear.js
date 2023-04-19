const { CommandType } = require("wokcommands");
const { PermissionsBitField } = require('discord.js')

module.exports = {
  // command options
  description: "Clears a specified amout of messages in a channel.",
  catagory: 'Utility Commands',
  aliases: ['purge'],
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: "[amount]",
  guildOnly: true,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the ping command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    if (member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        const toDelete = args[0];
        if (isNaN(args[0])) return(`${toDelete} is not a number, please imput a number!`);
        if(toDelete > 50) return(`${toDelete} is too many messages to delete I wont let you nuke the whole server, you can only delete up to 50 messages at a time!`);

        if (message) {
            await message.delete()
        }
            
        await channel.bulkDelete(toDelete, true).catch(error =>{
        console.log(`Failed to bulk delete ${toDelete} words in ${message.guild.name}`)
        return(`:x: Error: \`Missing Permissions\`. I was unable to delete the messages because you have granted me insignificant permissions.`)
        });

        return(`Deleted ${toDelete} messages. :put_litter_in_its_place:`);
    }else{
        return(`:x: Unable to comply, you do not have \`Manage_Messages\` permision.`)
    }
  },
}