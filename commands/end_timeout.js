const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const GuildLogChannel = require('../Guild7')

module.exports = {
  // command options
  description: "End a Discord timeout for a user",
  catagory: 'Mod/Admin Commands',
  aliases: ['end_mute'],
  minArgs: 2,
  expectedArgs: "<user> <reason>",
  expectedArgsTypes: ['USER', 'STRING'],
  guildOnly: true,
  options: [
    {
      name: 'user',
      description: 'Select a user to end a timeout',
      type: 6, // Set the option type to 6 (User mention)
      required: true,
    },
    {
        name: 'reason',
        description: 'Your reason for ending a timeout',
        type: 3,
        required: true,
    },
  ],
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    if(!member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return ':x: Unable to comply, you do not have \`Moderate_members\` permision.'

    if(!args[0]) return `Please enter a user to timeout`
    if(!args[1]) return `Please enter a timeout reason`


    let succeedMsg;

    let succeedDM;

    let succeedLog;

    let canLog;

    const guildLog = await GuildLogChannel.findOne({_id: guild.id}).catch(error =>{
		console.log(`There was a error: ` + error)
	})

    if(!guildLog) return 'A database error occured, please run \`/dbfix fix\` to attempt to fix the problem.'

    const totimeout = message ? message.mentions.members.first() : interaction.options.getMember('user')

    if(!totimeout) return ":x: The user you mentioned was not found."

    if(totimeout.id === guild.ownerId) return 'The server owner can never be in timeout, therefor you cannot end their timeout!'

    if(!totimeout.communicationDisabledUntil) return `:x: ${totimeout.displayName} is not in timeout.`

    const reason = args.slice(1).join(" ");

    try{
		totimeout.timeout(null, reason)
	}catch (error){
		console.log(`unable to end timeout for ${totimeout.displayName}: ${error}`)
		message.channel.send(`:x: I was unable to end a timeout for ${totimeout}! You might want to check my permissions.`)
	}

    try {

        const userwarn = new EmbedBuilder()
        .setTitle(`Your timeout was ended ${guild.name}`)
        .addFields(
            {name: 'Timeout ended by:', value: `${member}`},
            {name: 'Reason:', value: `${reason}`}
        )
        .setColor('#13EB27')
        .setTimestamp()

        totimeout.send({embeds: [userwarn]})
        succeedDM = true

    } catch (error) {
        console.log(`Failed to dm end timeout infomation for ${totimeout.displayName}: ${error}`)
        succeedDM = false
    }

    try {
        if(guildLog.channel !== ''){
            canLog = true
        }else{
            canLog = false
        }

        if(canLog = true){
            const log = new EmbedBuilder()
            .setTitle("User end timeout")
            .addFields(
                {name: `Ended timeout for:`, value: `${totimeout}`},
                {name: `Reason:`, value: `${reason}`},
                {name: 'Timeout ended by:', value: `${member}`}
            )
            .setColor('#13EB27')
            .setTimestamp()
            
            guild.channels.cache.get(guildLog.channel).send({embeds: [log]})

            succeedLog = true
        } else{
            succeedLog = false
        }


    } catch (error) {
        console.log(`A error occured while sending log: ${error}`)
        succeedLog = false
    }

    if(succeedDM === true && succeedLog === true) succeedMsg = `The target user was notified and a log was submitted.`
    else if(succeedDM === true && succeedLog === false) succeedMsg = "The target user was notified, however, no log was submitted."
    else if(succeedDM === false && succeedLog === true) succeedMsg = "The target user was not notified, however, a log was submitted."
    else if(succeedDM === false && succeedLog === false) succeedMsg = "The target user was not notified, nor was a log submitted."
    else succeedMsg = 'An error occured while either attempting to DM the target user, or attempting to post a log.'

    const timeoutMsg = new EmbedBuilder()
    .setTitle("User end timeout")
    .setDescription(`${succeedMsg}`)
    .addFields(
        {name: `Ended timeout for:`, value: `${totimeout}`},
        {name: `Reason:`, value: `${reason}`},
        {name: 'Timeout ended by:', value: `${member}`}
    )
    .setColor('#13EB27')
    .setTimestamp()

    if(message) message.channel.send({embeds: [timeoutMsg]})
    if(interaction) interaction.reply({embeds: [timeoutMsg]})



  }
}