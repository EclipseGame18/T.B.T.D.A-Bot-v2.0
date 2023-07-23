const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')

module.exports = {
  // command options
  description: "Shows the latest announcement or changelog from the developer.",
  catagory: 'Utility Commands',
  aliases: ['announcement'],
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: "[notice or changelog]",
  guildOnly: false,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
            const choice = args[0]
            if(choice === 'notice'){
              const moveMessageEmbed = new EmbedBuilder()
              .setTitle(`New bot, what's different?`)
              .setDescription(`Glad you asked! Our answer is: nothing. Nothing has changed since you last used T.B.T.D.A Beta Test, all we did was move code over to the original T.B.T.D.A (the bot you are using). This solidifies the handover form T.B.T.D.A v1.0 to T.B.T.D.A v2.0, the only reason wy we made a tets bot was because, well, we were re-writing the entire T.B.T.D.A code and there were going to be lots of bugs, so to make it clear that v2.0 pre 1.1, 1.2, etc. could be unstable and buggy we created a whole different Discord client for the v2.0 pre relece versions.`)
              .addFields(
                    {name: "What does this mean?", value: `This means that you no longer need "T.B.T.D.A Beta Test" in your server anymore, you can remove the bot if you wish. To add on to the versioning, T.B.T.D.A is now on v2.0, however, this does not mean that T.B.T.D.A will not receve updates, T.B.T.D.A will continue to receve bug fixes and feature updates in the coming future.`},
                    {name: "I am in someone else's server, how can I get T.B.T.D.A?", value: `You can add T.B.T.D.A to your own server in one of two ways: the first one is to visit the [online dashboard](https://tbtda.xyz) and add the bot, or [add the bot directaly](https://discord.com/api/oauth2/authorize?client_id=712958160620748820&permissions=8&scope=bot).`},
                    {name: "I need more help, where can I get it?", value: `If you need any more help reguardiung this change, or just have questions on T.B.T.D.A, you can join our [support server](https://discord.com/invite/3mkKSGw).`}
                )
          .setColor('#0059FF');
          if(message){
            message.channel.send({ embeds: [moveMessageEmbed] });
          }
          if(interaction){
            interaction.reply({ embeds: [moveMessageEmbed] })
        }
            }
            else if(choice === 'changelog'){
              return('**CHANGELOG:** T.B.T.D.A v2.0\n```\n-Fully changed over to T.B.T.D.A Version 2.0\n-Bug fixes\n-Grammer fixes\n-Retired T.B.T.D.A Beta Test\n```')
            }
            else{
              return(`Please enter either \`notice\` for the latest notice from the developers, or \`changelog\` for the latest T.B.T.D.A changelog.`)
            }
    
  },
}