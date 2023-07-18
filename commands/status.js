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
    if(member.id === '547655594715381760'){
    if(!text) return('Please input a new status')

    setStatus(client, text)
    return(`Set new status to \`${text}\``)

    }else{
        return(':x: Unable to comply, this command is a developer only command.')
    }

  },
}