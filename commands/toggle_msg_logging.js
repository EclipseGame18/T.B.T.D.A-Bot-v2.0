const { CommandType } = require("wokcommands");
const { PermissionsBitField } = require('discord.js')
const ToggleLogging = require('../Guild9')

module.exports = {
  // command options
  description: "Toggles the message logging plugin on or off",
  catagory: 'Mod/Admin Commands',
  aliases: ['log_msg'],
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: "[toggle on or off]",
  guildOnly: true,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    if(!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return':x: Unable to comply, you do not have \`Manage_Messages\` permision.'
    const toggleLog = await ToggleLogging.findOne({_id: guild.id}).catch(error =>{
		console.log(`There was a error: ${error}`)
	})
    let truetoggle = {}
			if (toggleLog.toggle === 'true'){
				 truetoggle = 'on'
			}
			else {
				 truetoggle = 'off'
			}
			const toggle = args[0]
			if (toggle === truetoggle){
				return(`:x: Unable to comply, the plugin is already set to \`${truetoggle}\`!`);
			} else{
			if (toggle === 'on'){
					await ToggleLogging.findOneAndUpdate({
						_id: guild.id
						},{
						_id: guild.id,
						toggle: 'true',
							
						},{
							upsert: true
						})
						
						return('Successfully toggled message logging plugin to: `on`')
					}else if (toggle === 'off'){
				
					await ToggleLogging.findOneAndUpdate({
						_id: guild.id
						},{
						_id: guild.id,
						toggle: 'false',
							
						},{
							upsert: true
						})
						
						return('Successfully toggled message logging plugin to: `off`')
					} else{
						return(`:x: ERROR: please only input \`on\` or \`off\` *e.g. /toggle_msg_logging on*.\n Current setting: \`${truetoggle}\``)
					}
				}
  },
}