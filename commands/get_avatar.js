const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')

module.exports = {
  // command options
  description: "Get a user's avatar",
  catagory: 'Fun Commands',
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: "[user]",
  expectedArgsTypes: ['USER'],
  guildOnly: true,
  options: [
    {
      name: 'user',
      description: 'Select a user',
      type: 6, // Set the option type to 6 (User mention)
      required: true,
    }
    ],
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    let target = message ? message.mentions.members.first() : interaction.options.getMember('user');
    const usrAvatar = new EmbedBuilder()
        .setTitle(`Here is ${target.user.username}'s avatar:`)
        .setImage(target.user.displayAvatarURL())
        .setColor('#FF00E4');
    
    if (interaction) {
        interaction.reply({ embeds: [usrAvatar] });
    }
    if (message) {
        message.channel.send({ embeds: [usrAvatar] });
    }
  },
}