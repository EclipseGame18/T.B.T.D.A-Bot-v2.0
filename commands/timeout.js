const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const ms = require("ms")
const GuildLogChannel = require('../Guild7')

module.exports = {
  // command options
  description: "Set a Discord timeout for a user",
  catagory: 'Mod/Admin Commands',
  aliases: ['mute'],
  minArgs: 3,
  expectedArgs: "<user> <time> <reason>",
  expectedArgsTypes: ['USER', 'STRING', 'STRING'],
  guildOnly: true,
  options: [
    {
      name: 'user',
      description: 'Select a user to timeout',
      type: 6, // Set the option type to 6 (User mention)
      required: true,
    },
    {
        name: 'timeout_duration',
        description: 'Select timeout duration (e.g. 1d, 3h, etc.)',
        type: 3,
        required: true,
    },
    {
        name: 'reason',
        description: 'Reason for timeing out the user',
        type: 3,
        required: true,
    }
  ],
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    if(!member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return ':x: Unable to comply, you do not have \`Moderate_Members\` permision.'

    if(!args[0]) return `Please enter a user to timeout`
    if(!args[1]) return `Please enter a timeout duration`
    if(!args[2]) return `Please enter a timeout reason`

    let time = args[1]

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

    if(totimeout.id === guild.ownerId) return 'You are not powerful enougth to timeout the server owner!'

    const milliseconds = ms(time)

    if(!milliseconds || milliseconds < 10000 || milliseconds > 2419200000) {
        return `error: ${time} is Invalid or it is not between 10s or 28d`
    }
    const reason = args.slice(2).join(" ");

    try{
		totimeout.timeout(milliseconds, reason)
	}catch (error){
		console.log(`unable to timeout ${totimeout.displayName}: ${error}`)
		message.channel.send(`:x: I was unable to timeout ${totimeout}! You might want to check my permissions.`)
	}

    try {

        const userwarn = new EmbedBuilder()
        .setTitle(`You were timed out in ${guild.name}`)
        .addFields(
            {name: 'Timed out by:', value: `${member}`},
            {name: 'Time:', value: `${time}`},
            {name: 'Reason:', value: `${reason}`}
        )
        .setColor('#FF6400')
        .setTimestamp()

        totimeout.send({embeds: [userwarn]})
        succeedDM = true

    } catch (error) {
        console.log(`Failed to dm timeout infomation for ${totimeout.displayName}: ${error}`)
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
            .setTitle("User timed out")
            .addFields(
                {name: `Timed out user:`, value: `${totimeout}`},
                {name: 'Timeout length:', value: `${time}`},
                {name: `Reason:`, value: `${reason}`},
                {name: 'Timed out by:', value: `${member}`}
            )
            .setColor('#FF6400')
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
    .setTitle("User timed out")
    .setDescription(`${succeedMsg}`)
    .addFields(
        {name: `Timed out user:`, value: `${totimeout}`},
        {name: 'Timeout length:', value: `${time}`},
        {name: `Reason:`, value: `${reason}`},
        {name: 'Timed out by:', value: `${member}`}
    )
    .setColor('#FF6400')
    .setTimestamp()

    if(message) message.channel.send({embeds: [timeoutMsg]})
    if(interaction) interaction.reply({embeds: [timeoutMsg]})

  },
}