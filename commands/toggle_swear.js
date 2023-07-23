const { CommandType } = require("wokcommands");
const { PermissionsBitField } = require('discord.js')
const ToggleAntiSware = require('../Guild2')

module.exports = {
  // command options
  description: "Toggles the anti-swear plugin on or off",
  catagory: 'Mod/Admin Commands',
  aliases: ['swear'],
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: "[toggle on or off]",
  guildOnly: true,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    if(!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return':x: Unable to comply, you do not have \`Manage_Guild\` permision.'
    const toggleSware = await ToggleAntiSware.findOne({_id: guild.id}).catch(error =>{
		console.log(`There was a error: ${error}`)
	})
    let truetoggle = {}
			if (toggleSware.toggle == 'true'){
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
					await ToggleAntiSware.findOneAndUpdate({
						_id: guild.id
						},{
						_id: guild.id,
						toggle: 'true',
							
						},{
							upsert: true
						})
						
						return('Successfully toggled anti-swear plugin to: `on`')
					}else if (toggle === 'off'){
				
					await ToggleAntiSware.findOneAndUpdate({
						_id: guild.id
						},{
						_id: guild.id,
						toggle: 'false',
							
						},{
							upsert: true
						})
						
						return('Successfully toggled anti-swear plugin to: `off`')
					} else{
						return(`:x: ERROR: please only input \`on\` or \`off\` *e.g. /toggle_swear on*.\n Current setting: \`${truetoggle}\``)
					}
				}
  },
}