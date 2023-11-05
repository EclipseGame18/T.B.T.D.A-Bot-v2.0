const { PermissionsBitField, EmbedBuilder } = require('discord.js'); //discord.js API (allows for the bot to interface with discord)
const { add } = require('libsodium-wrappers');
const { CommandType} = require("wokcommands"); //command handler package

module.exports = {
// command options
description: "Creates a new role in your guild", // description of command passed on to Discord
catagory: 'Utility Commands',
aliases: ['new_role'], // command either /create_role (slash commands), !create_role (legacy command), !new_role (alias legacy)
minArgs: 4,
expectedArgs: "<name> <colour> <add on create>", // layout of expected arguments
expectedArgsTypes: ['STRING', 'STRING', 'STRING', 'STRING'], //types of arguments that should be entered
guildonly: true, //command can only be ran inside guilds (not DM)
options: [
    {
        name: 'name', // name of argument option
        description: 'Name you new role', // description of argument
        type: 3, // Set the option type to 3 (String Input)
        required: true, // is the argument required for this command (yes)
    },
    {
        name: "colour",
        description: "Set the colout of your new role (using HEX color codes)", // colour must be a HEX value
        type: 3,
        required: true,
    },
    {
    name: 'display_separately',
    description: 'Display this role separately form other members?',
    type: 3,
    required: true,
    autocomplete: true, //sets "autocomplete" to true, autocomplete has the options 'yes', and 'no' as the only options for this argument
    },
    {
        name: 'auto_add_role',
        description: 'Automatically add you to the new role?',
        type: 3,
        required: true,
        autocomplete: true, //sets "autocomplete" to true, autocomplete has the options 'yes', and 'no' as the only options for this argument
    }
],

autocomplete: (command, argument, interaction) => {
    return ["yes", "no"]; //define the autocomplete values
},

// Create a legacy and slash command
type: CommandType.BOTH,

// Invoked when a user runs the command
callback: async ({message, client, channel, interaction, options, args, guild, user, member }) => {
    let addrolemsg;
    let roleSearch;
    let hoisttruefalse;
    roleSearch = args[0]

    //check if the user has the Discord Manage Roles permission, if not send the error message
    if(!member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return ':x: Unable to comply, you do not have \`Manage_Roles\` permision.'
    //check if all the argument requirements have been met
    if(!args[0] || !args[1] || !args[2] || !args[3]) return ":x: Unable to comply, you are missing some arguments. *!create_role {name} {colour (HEX)} {display separatly (yes, no)} {add role (yes, no)}*"

    if(args[2] === 'yes'){
         hoisttruefalse = true
    }else {
        hoisttruefalse = false
    }
   
    let role = await guild.roles.create({ //create role
        name: args[0], // name
        color: args[1], // color
        hoist: hoisttruefalse,
        reason: 'Created using T.B.T.D.A /create_role command', // auto mod reason

      }).catch(err => { //catch any errors that may occur while creating a role

        console.log(`An error occured while creating a role: ${err}`) //log the error to the console
        //send a message to the user informing them of the failed role creation
        //if 'message' is true than send the output though message.channel.send else send the reply through interaction.reply
        if(message) message.channel.send(":x: Unable to comply, an error occured. The most probable cause of this error is the incorect input of the role colour. Please enter colours as a HEX value.")
        else interaction.reply(":x: Unable to comply, an error occured. The most probable cause of this error is the incorect input of the role colour. Please enter colours as a HEX value.")
        return
      })

      if(args[3] === 'yes'){ //if add role on create is yes than move on, if not yes than skip
        try{
            member.roles.add(role).catch(err => { // add role to user
                console.log('A role error occured ' + err) // if fail then send the error to console
                addrolemsg = "I failed to add the role to you." // set {addrolemsg} to fail
            })
            addrolemsg = "the role was automatically added to you."
        }catch(err) { // catch any errors
            console.log('A role error occured ' + err) // send error to console
            addrolemsg = "I failed to add the role to you."
        }
      } else{
        addrolemsg = "as per your request, the role was not added to you." // if add role on create is no than {addrolemsg} is roel not added
      }

      if(addrolemsg === '' || !addrolemsg || addrolemsg === null) addrolemsg = "I failed to add the role to you"

      const embed = new EmbedBuilder() // create a discord embed
      .setTitle(`Successfully created the role!`) // titile
      .setDescription(`The role: \`${args[0]}\` was successfully created with settings; colour: \`${args[1]}\`, display seperataly: \`${args[3]}\`. Also, ${addrolemsg}`) //description. the ${addrolemsg} placeholder has 3 different values.
      .setColor(`${args[1]}`) // set the embed colour strip to the colour of the new role

      if(message) message.channel.send({ embeds: [embed] }) // if command was message reply as massage
      else interaction.reply({ embeds: [embed] }) // else reply as interaction
}
}