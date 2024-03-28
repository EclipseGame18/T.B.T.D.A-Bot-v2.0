const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const { db } = require("../index")

module.exports = {
  // command options
  description: "Generates a report on a specified user",
  catagory: 'Mod/Admin Commands',

  minArgs: 1,
  expectedArgs: "<user>",
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
    if(!member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return ':x: Unable to comply, you do not have \`Moderate_Members\` permision.'
    let target = message ? message.mentions.members.first() : interaction.options.getMember('user')
    const guildId = guild.id
    const userId = target.id

    function getCommandCount(guildId, userId, callback) {
        db.get('SELECT command_count FROM command_counts WHERE guild_id = ? AND user_id = ?', [guildId, userId], (err, row) => {
          if (err) {
            console.error(`Error querying database: ${err}`);
            callback(err, null);
            return;
          }
      
          if (row) {
            callback(null, row.command_count);
          } else {
            // If the user is not found, return 0 commands
            callback(null, 0);
          }
        });
      }
      function getOffenseCount(guildId, userId, callback) {
        db.get('SELECT offense_count FROM offenses WHERE guild_id = ? AND user_id = ?', [guildId, userId], (err, row) => {
          if (err) {
            console.error(`Error querying database: ${err}`);
            callback(err, null);
            return;
          }
      
          if (row) {
            callback(null, row.offense_count);
          } else {
            // If the user is not found, return 0 offenses
            callback(null, 0);
          }
        });
      }

      getOffenseCount(guildId, userId, (err, offenseCount) => {
        if (err) {
          console.error('Error:', err);
        } else {

 

      getCommandCount(guildId, userId, (err, commandCount) => {
        if (err) {
          console.error('Error:', err);
        } else {
           

      let targetStatus;
      try{
      if(target.presence.status === 'online') targetStatus = "🟢 Online"
      else if(target.presence.status === 'idle') targetStatus = "🌙 Idle"
      else if(target.presence.status === 'dnd') targetStatus = "⛔ Do Not Disturb"
      else if(target.presence.status === 'offline') targetStatus = "⚫ Offline"
      else targetStatus = "Unknown"
      }catch{
        targetStatus = "STATUS_UNAVAILABLE"
      }

    const embed = new EmbedBuilder()
    .setTitle(`Guild infomation on ${target.user.username}`)
    .addFields(
        {name: "User's ID", value: `ID: ${target.id}`},
        {name: "User's status", value: `${targetStatus}`},
        {name: `User joined ${guild.name}`, value: `${target.joinedAt}`},
        {name: "User's highest role", value: `${target.roles.highest}`},
        {name: "Number of swear warnings:", value: `${offenseCount} warn(s)`},
        {name: "Number of T.B.T.D.A's commands used", value: `${commandCount} command(s)`}
    )
    .setColor('#DAF000')
    .setTimestamp()
    .setThumbnail(target.user.displayAvatarURL())

    if(interaction) interaction.reply({ embeds: [embed] })
    if(message) message.channel.send({ embeds: [embed] })

        }
    });

        }
    })
    
  },
}