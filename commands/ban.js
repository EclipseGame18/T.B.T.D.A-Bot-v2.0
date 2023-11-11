const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')
const GuildWelcomeChannel = require('../Guild7')

module.exports = {
  // command options
  description: "Bans a user from the guild.",
  catagory: 'Mod/Admin Commands',
  minArgs: 3,
  expectedArgs: "<user> <days> <reason>",
  expectedArgsTypes: ['USER', 'STRING', 'STRING'],
  guildOnly: true,
  options: [
    {
      name: 'user',
      description: 'Select a user to ban',
      type: 6, // Set the option type to 6 (User mention)
      required: true,
    },
    {
        name: 'message_deletion',
        description: 'How many days of messages to delete [enter 0 to disable]',
        type: 3,
        required: true,
    },
    {
        name: 'reason',
        description: 'Reason for baning the user',
        type: 3,
        required: true,
    }
  ],
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    if(!member.permissions.has(PermissionsBitField.Flags.BanMembers)) return ':x: Unable to comply, you do not have \`Ban_Members\` permision.'
    const guildLog = await GuildWelcomeChannel.findOne({_id: guild.id}).catch(error =>{
		console.log(`There was a error: ` + error)
	})
    if(!guildLog) return 'A database error occured, please run \`/dbfix fix\` to attempt to fix the problem.'

    let tokick = message ? message.mentions.members.first() : interaction.options.getMember('user')
            if(!tokick) return `${args[0]} is not a member.`;
            if (guild.ownerId === tokick.id) return ':x: You are not powerful enougth to ban the server owner!'
            if (!tokick.bannable) {
				return ':x: I cannot ban someone if they either have higher ranking permissions than myself, or they are server admins.'
			}
            args.shift()
            let daysdelete
                if(args[0] > 7){
                    return ":x: The maxmum number of days to delete messages can't exceed 7."
                }
                if(!isNaN(args[0])){
                    daysdelete = args[0]
                }
                args.shift()
            let reason = args.join(' ')

			if (!reason) reason = ('NO_REASON_SPECIFYED');

			const userwarn = new EmbedBuilder()
            .setTitle(`You were banned in ${guild.name}`)
            .addFields(
                {name: 'Banned by:', value: `${member}`},
                {name: 'Reason', value: `${reason}`}
            )
            .setTimestamp()
            .setColor('#E01212')
			
			if (tokick.bannable) {
                let canLog
                if(guildLog.channel !== ''){
                    canLog = true
                }else{
                    false
                }

				let x = new EmbedBuilder()
					.setTitle('User Successfully Banned')
                    .setDescription(`${canLog ? ` ` : 'No log was filed, reason: `There is currentaly no log channel in our records`'}`)
                    .addFields(
                        {name: 'Member Banned', value: `${tokick}`},
                        {name: 'Banned by', value: `${member}`},
                        {name: 'Reason', value: `${reason}`},
                        {name: 'Days of messages deleted', value: `${daysdelete}`}
                    )
					.setColor('#E01212')
                    .setTimestamp()


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
            
                    let msgSend
            
                    if(interaction){
                        msgSend = await interaction.reply({ content: `Are you sure you want to ban ${tokick} for reason: \`${reason}\`?`, components: [buttons] })
                    }
                    if(message){
                        msgSend = await message.reply({ content: `Are you sure you want to ban ${tokick} for reason: \`${reason}\`?`, components: [buttons] })
                    }
                    const collector = await msgSend.createMessageComponentCollector();
            
                    collector.on('collect', async i =>{
                        if(i.customId === 'next'){
                            if(i.user.id !== member.id){
                                return i.reply({ content: `This option is locked to ${member}`, ephemeral: true })
                            }
                            next.setDisabled(true)
                            preveous.setDisabled(true)
                            await i.update({ embeds: [x], components: [buttons]})
                            tokick.send({ embeds: [userwarn] })
                            tokick.ban({
                                reason,
                                deleteMessageDays: daysdelete
                            }).catch(error =>{
                            console.log(`Failed to ban ${tokick.displayName} in ${guild.name}: ${error}`)
                            return `:x: Error: I was unable to ban the member due to an unknown error. :shrug:`
                        });
                            if(canLog === true){
                                try{
                                    guild.channels.cache.get(guildLog.channel).send({embeds: [x]})
                                    }catch{
                                        return 'There was an error sending the log to the log channel, try checking if the channel ID is correct.'
                                    }
                                }
                            
                        }
                        if(i.customId === 'preveous'){
                            if(i.user.id !== member.id){
                                return i.reply({ content: `This option is locked to ${member}`, ephemeral: true })
                            }
                            next.setDisabled(true);
                            preveous.setDisabled(true);
                            await i.update({ content: 'Ban successfully aborted.', components: [buttons]})
                        }
                    })
			}

},
}