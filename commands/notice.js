const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')

module.exports = {
  // command options
  description: "Shows the latest announcement from the developer.",
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
              .setTitle('T.B.T.D.A Beta Test is close to retirement!')
              .setDescription(`T.B.T.D.A Beta Test, V2.0 pre 2.6, is close to end-of-life. When this happens T.B.T.D.A Beta Test will be deactovated and the original T.B.T.D.A will take its place. If you havn't yet, please add T.B.T.D.A to your server now using [this link](https://discord.com/api/oauth2/authorize?client_id=712958160620748820&permissions=8&scope=bot)`)
              .addFields(
                    {name: "What does this mean?", value: `The bot you are currentaly using, T.B.T.D.A Beta Test, was only intended to be used for a short while. This was because T.B.T.D.A was (and still is) undergoing a massive re-write and fix-up, and it was going to be quite experemental and buggy, so instead of using the old bot, we used this one as a beta test.`},
                    {name: "When will the change occur?", value: `We estimate around in 1-2 months T.B.T.D.A Beta Test will be deactovated and T.B.T.D.A will take over.`},
                    {name: "I need more help, where can I get it?", value: `If you need any more help reguardiung this change, or just have questions on T.B.T.D.A, you can join our support server [here](https://discord.com/invite/3mkKSGw). If you want to invite the bot, and configure it, you can use the [online web dashboard](https://tbtda.xyz)`}
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
              return('**CHANGELOG:** T.B.T.D.A v2.0 pre 2.7\n```\n-Final touch-ups\n-New /feedback command (any feedback is accepted and immeadetaly forwarded to the developers DM)\n-Log channel is now seperate from welcome channel (all welcome messages go to a specified welcome channel, logs go to a log channel)\n-Finishing porting over all the commands from the original T.B.T.D.A v1.0\n```')
            }
            else{
              return(`Please enter either \`notice\` for the latest notice from the developers, or \`changelog\` for the latest T.B.T.D.A changelog.`)
            }
    
  },
}