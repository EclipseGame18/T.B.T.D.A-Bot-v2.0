const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')
const globalPrefix = ('!');

const ToggleAntiSware = require('../Guild2');

const GuildWelcome = require('../Guild3');

const GuildWelcomeChannel = require('../Guild4');

const ToggleMusic = require(`../Guild5`);

const ToggleEco = require(`../Guild6`);

const LogChannel = require(`../Guild7`);
const ToggleImg = require(`../Guild8`)
const GetPrefix = require(`../Guild`)


module.exports = {
  // command options
  description: "Resets all server settings, USE AT OWN RISK, THIS CANNOT BE UNDONE!",
  catagory: 'Utility Commands',
  guildOnly: true,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    if(!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return ':x: Unable to comply, you do not have \`Manage_Guild\` permision.'
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
                        msgSend = await interaction.reply({ content: `Are you sure you want to reset all server settings, this cannot be undone.`, components: [buttons] })
                    }
                    if(message){
                        msgSend = await message.reply({ content: `Are you sure you want to reset all server settings, this cannot be undone.`, components: [buttons] })
                    }
                    const collector = await msgSend.createMessageComponentCollector();
            
                    collector.on('collect', async i =>{
                        if(i.customId === 'next'){
                            if(i.user.id !== member.id){
                                return i.reply({ content: `This option is locked to ${member}`, ephemeral: true })
                            }
                            next.setDisabled(true)
                            preveous.setDisabled(true)


                            await ToggleAntiSware.findOneAndUpdate({
                                _id: guild.id
                                },{
                                _id: guild.id,
                                toggle: 'false',
                                    
                                },{
                                    upsert: true
                                })
                                await GetPrefix.findOneAndUpdate({
                                    _id: guild.id
                                    },{
                                    _id: guild.id,
                                    prefix: globalPrefix,
                                        
                                    },{
                                        upsert: true
                                    })
                                    await GuildWelcome.findOneAndUpdate({
                                        _id: guild.id
                                        },{
                                        _id: guild.id,
                                        message: '',
                                            
                                        },{
                                            upsert: true
                                        })
                                        await GuildWelcomeChannel.findOneAndUpdate({
                                            _id: guild.id
                                            },{
                                            _id: guild.id,
                                            channel: '',
                                                
                                            },{
                                                upsert: true
                                            })
                                            await ToggleMusic.findOneAndUpdate({
                                                _id: guild.id
                                                },{
                                                _id: guild.id,
                                                toggle: true,
                                                    
                                                },{
                                                    upsert: true
                                                })
                                                await ToggleEco.findOneAndUpdate({
                                                    _id: guild.id
                                                    },{
                                                    _id: guild.id,
                                                    toggle: true,
                                                        
                                                    },{
                                                        upsert: true
                                                    })
                                                    await LogChannel.findOneAndUpdate({
                                                        _id: guild.id
                                                        },{
                                                        _id: guild.id,
                                                        channel: '',
                                                        
                                                        },{
                                                            upsert: true
                                                    })
                                                    await ToggleImg.findOneAndUpdate({
                                                        _id: guild.id
                                                        },{
                                                        _id: guild.id,
                                                        toggle: true,
                                                        
                                                        },{
                                                            upsert: true
                                                    })
                        
                                                    const welcomemessagechannel = await GuildWelcomeChannel.findOne({_id: guild.id}).catch(error =>{
                                                        console.log(`There was a error: ${error}`)
                                                      })
                                                        const guildwelcome = await GuildWelcome.findOne({_id: guild.id}).catch(error =>{
                                                        console.log(`There was a error: ${error}`)
                                                      })
                                                      const toggleSware = await ToggleAntiSware.findOne({_id: guild.id}).catch(error =>{
                                                        console.log(`There was a error: ${error}`)
                                                      })
                                                      const toggleMusic = await ToggleMusic.findOne({_id: guild.id}).catch(error => {
                                                        console.log(`There was an error: ${error}`)
                                                      })
                                                      const toggleEco = await ToggleEco.findOne({_id: guild.id}).catch(error => {
                                                        console.log(`There was an error: ${error}`)
                                                      })
                                                      const logChannel = await LogChannel.findOne({_id: guild.id}).catch(error => {
                                                        console.log(`There was an error: ${error}`)
                                                      })
                                                      const toggleImg = await ToggleImg.findOne({_id: guild.id}).catch(error =>{
                                                        console.log(`There was a error: ${error}`)
                                                      })
                                                      const getPrefix = await GetPrefix.findOne({_id: guild.id}).catch(error =>{
                                                        console.log(`There was a error: ${error}`)
                                                      })
                                                        let guildwelcometoggle;
                                                        let logchannelcheck;
                                                        let welcomemessageschanneltoggle;
                                                        let sweartoggle;
                                                        let ecotoggle;
                                                        let musictoggle;
                                                        let imgtoggle;
                                                        if(guildwelcome.message === ''){
                                                            guildwelcometoggle = '(disabled)'
                                                        }
                                                        if(welcomemessagechannel.channel === ''){
                                                            welcomemessageschanneltoggle = '(disabled)'
                                                        }
                                                        if(logChannel.channel === ''){
                                                            logchannelcheck = '(disabled)'
                                                        }
                                                        if(toggleSware.toggle === 'false'){
                                                            sweartoggle = 'off'
                                                        }
                                                        if(toggleEco.toggle === 'true'){
                                                            ecotoggle = 'on'
                                                        }
                                                        if(toggleMusic.toggle === 'true'){
                                                            musictoggle = 'on'
                                                        }
                                                        if(toggleImg.toggle === 'true'){
                                                            imgtoggle = 'on'
                                                        }
                                                        const reset = new EmbedBuilder()
                                                        .setTitle('All server settings have been reset')
                                                        .addFields(
                                                            {name: "Guild anti-swear", value: `The guild anti-swear plugin is now: \`${sweartoggle}\``},
                                                            {name: "Guild Prefix", value: `The Guild Prefix is now: \`${getPrefix.prefix}\``},
                                                            {name: "Guild Economy plugin", value: `The Economy plugin is now: \`${ecotoggle}\``},
                                                            {name: "Guild Music plugin", value: `The Music plugin is currentaly: \`${musictoggle}\``},
                                                            {name: "Guild Image Generation plugin", value: `The Image Generation plugin is now: \`${imgtoggle}\``},
                                                            {name: "Guild welcome message", value: `The guild welcome message plugin is now: \`${guildwelcometoggle}\``},
                                                            {name: "Guild Log channel", value: `The guild log channel is now: \`${logchannelcheck}\``},
                                                            {name: "Guild Welcome channel", value: `The guild log channel is now: \`${welcomemessageschanneltoggle}\``}
                                                        )
                                                        .setColor('#00B9FF')
                                                        .setTimestamp()
                                                        .setFooter({ text: `Reset by ${member.displayName}` })


                            await i.update({ embeds: [reset], components: [buttons]})
                            
                        }
                        if(i.customId === 'preveous'){
                            if(i.user.id !== member.id){
                                return i.reply({ content: `This option is locked to ${member}`, ephemeral: true })
                            }
                            next.setDisabled(true);
                            preveous.setDisabled(true);
                            await i.update({ content: 'Server settings reset successfully aborted.', components: [buttons]})
                        }
                    })
    
  },
}