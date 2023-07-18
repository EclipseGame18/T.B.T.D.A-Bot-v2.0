const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
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
	const lockDown = true
    const lockDownEmbed = new EmbedBuilder()
    .setTitle('T.B.T.D.A Beta Test is retiring')
    .setDescription(`As you probabely know, T.B.T.D.A Beta Test is retiring. We are now around 1-2 days away form switching back to the original T.B.T.D.A. This means that untill the switch occurs, I (T.B.T.D.A Beta Test) will be unavailable.\n\nIf you still havn't added T.B.T.D.A yet, you can do so with [this link](https://discord.com/api/oauth2/authorize?client_id=712958160620748820&permissions=8&scope=bot).`)
    .setColor('#0059FF');

    if(lockDown === true){
      if(message){
        message.channel.send({ embeds: [lockDownEmbed] })
      }
      if(interaction){
        interaction.reply({ embeds: [lockDownEmbed] })
      }
      return
    }
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