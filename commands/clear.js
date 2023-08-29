const { CommandType } = require("wokcommands");
const { PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')

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
      const next = new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Confirm')
                        .setStyle(ButtonStyle.Danger)
            
                        const preveous = new ButtonBuilder()
                        .setCustomId('preveous')
                        .setLabel('Cancel')
                        .setStyle(ButtonStyle.Primary)
            
                        const buttons = new ActionRowBuilder()
                        .addComponents(preveous, next)
        const toDelete = args[0];
        if (isNaN(args[0])) return(`${toDelete} is not a number, please imput a number!`);
        if(toDelete > 50) return(`${toDelete} is too many messages to delete I wont let you nuke the whole server, you can only delete up to 50 messages at a time!`);
        if(toDelete > 20){
          let msgSend
            
                    if(interaction){
                        msgSend = await interaction.reply({ content: `You are about to delete more than 20 messages, do you wish to continue? This cannot be undone.`, components: [buttons] })
                    }
                    if(message){
                        msgSend = await message.reply({ content: `You are about to delete more than 20 messages, do you wish to continue? This cannot be undone.`, components: [buttons] })
                    }
                    const collector = await msgSend.createMessageComponentCollector();
                    collector.on('collect', async i =>{
                      if(i.customId === 'next'){
                          if(i.user.id !== member.id){
                              return i.reply({ content: `This option is locked to ${member}`, ephemeral: true })
                          }
                          next.setDisabled(true)
                          preveous.setDisabled(true)
                          if(message) await message.delete()
                          await msgSend.delete()
                          await channel.bulkDelete(toDelete, true).catch(error =>{
                            console.log(`Failed to bulk delete ${toDelete} words in ${message.guild.name}, ${error}`)
                            channel.send({ content: `:x: Error: \`Missing Permissions\`. I was unable to delete the messages because you have granted me insignificant permissions.` })
                            })
                            channel.send({ content: `Deleted ${toDelete} messages. :put_litter_in_its_place:`, components: [buttons]});

                      }
                      if(i.customId === 'preveous'){
                        if(i.user.id !== member.id){
                            return i.reply({ content: `This option is locked to ${member}`, ephemeral: true })
                        }
                        next.setDisabled(true);
                        preveous.setDisabled(true);
                        await i.update({ content: 'Operation cancelled.', components: [buttons]})
                    }
                    })

        }else{

        if (message) {
            await message.delete()
        }
            
        await channel.bulkDelete(toDelete, true).catch(error =>{
        console.log(`Failed to bulk delete ${toDelete} words in ${message.guild.name}, ${error}`)
        return(`:x: Error: \`Missing Permissions\`. I was unable to delete the messages because you have granted me insignificant permissions.`)
        });

        return(`Deleted ${toDelete} messages. :put_litter_in_its_place:`);
      }
    }else{
        return(`:x: Unable to comply, you do not have \`Manage_Messages\` permision.`)
    }
  },
}