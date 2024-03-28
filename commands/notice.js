const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')

module.exports = {
  // command options
  description: "Shows the latest announcement or changelog from the developer.",
  catagory: 'Utility Commands',
  aliases: ['announcement'],
  minArgs: 1,
  expectedArgs: "<choice>",
  expectedArgsTypes: ['STRING'],
  guildOnly: true,
  options: [
    {
      name: 'notice-or-changelog',
      description: 'select either to view the latest notice or changelog',
      type: 3, // Set the option type to 3 (string input)
      required: true,
      autocomplete: true,
    },
  ],

  autocomplete: (command, argument, interaction) => {
    return ["notice", "changelog"]; //define the autocomplete values
  },
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
            const choice = args[0]
            if(choice === 'notice'){
              const MessageEmbed = new EmbedBuilder()
              .setTitle('Online dashboard temporarily down')
              .setDescription('The online dashboard is down at the moment. We are working to fix it, however, if you need to change some settings, you can do so with their in-bot commands.')
              .setColor('#0059FF');
          if(message){
            message.channel.send({ embeds: [MessageEmbed] });
          }
          if(interaction){
            interaction.reply({ embeds: [MessageEmbed] })
        }
            }
            else if(choice === 'changelog'){
              return('**CHANGELOG:** T.B.T.D.A v2.2.3\n```\n-Added message logging plugin. Any messages sent in channels where T.B.T.D.A can view will be logged in the servers logs channel. This can be toggled via the /toggle_msg_logging command.\n-More bug fixes\n-The online web dashboard (https://tbtda.xyz) is currently down. I will notify you when it is back up. All settings do have command counterparts, so you can still configure the bot.\n```')
            }
            else{
              return(`Please enter either \`notice\` for the latest notice from the developers, or \`changelog\` for the latest T.B.T.D.A changelog.`)
            }
    
  },
}