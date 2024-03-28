const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const GuildWelcomeChannel = require('../Guild4')
const GuildWelcome = require('../Guild3')
const ToggleAntiSware = require('../Guild2')
const ToggleMusic = require(`../Guild5`)
const ToggleEco = require(`../Guild6`)
const LogChannel = require(`../Guild7`)
const ToggleImg = require(`../Guild8`)
const GetPrefix = require(`../Guild`)
const LogMsg = require("../Guild9")

module.exports = {
  // command options
  description: "Gets all the current guild settings",
  catagory: 'Utility Commands',
  aliases: ['settings'],
  guildOnly: true,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    let iserror;
    const welcomemessagechannel = await GuildWelcomeChannel.findOne({_id: guild.id}).catch(error =>{
        console.log(`There was a error: ${error}`)
        iserror = true
      })
        const guildwelcome = await GuildWelcome.findOne({_id: guild.id}).catch(error =>{
        console.log(`There was a error: ${error}`)
        iserror = true
      })
      const toggleSware = await ToggleAntiSware.findOne({_id: guild.id}).catch(error =>{
        console.log(`There was a error: ${error}`)
        iserror = true
      })
      const logchannel = await LogChannel.findOne({_id: guild.id}).catch(error =>{
        console.log(`There was a error: ${error}`)
        iserror = true
      })
      const toggleImg = await ToggleImg.findOne({_id: guild.id}).catch(error =>{
        console.log(`There was a error: ${error}`)
        iserror = true
      })
      const getPrefix = await GetPrefix.findOne({_id: guild.id}).catch(error =>{
        console.log(`There was a error: ${error}`)
        iserror = true
      })
      const logmsg = await LogMsg.findOne({_id: guild.id}).catch(error => {
        console.log(`There was an error: ${error}`)
      })
      let truetoggle;
      try{
              if (toggleSware.toggle == 'true'){
                   truetoggle = 'on'
              }
              else {
                   truetoggle = 'off'
              }
      } catch{
        truetoggle = 'Error retreving guild anti-swear status.'
        iserror = true
      }
      const toggleMusic = await ToggleMusic.findOne({_id: guild.id}).catch(error => {
        console.log(`There was an error: ${error}`)
      })
      const toggleEco = await ToggleEco.findOne({_id: guild.id}).catch(error => {
        console.log(`There was an error: ${error}`)
      })
      let musicToggle
      let ecoToggle
      let imgToggle
      let msgtoggle
      try{
      if(toggleMusic.toggle === 'true'){
        musicToggle = 'on'
      } else{
        musicToggle = 'off'
      }
    }catch{
      musicToggle = 'Error retreving Music module status'
      iserror = true
    }
    try {
      if(toggleImg.toggle === 'true'){
        imgToggle = 'on'
      }
      else{
        imgToggle = 'off'
      }
    } catch  {
      imgToggle = 'Error retreving Image Generation module status'
      iserror = true
    }

    try {
      if(logmsg.toggle === 'true'){
        msgtoggle = 'on'
      }
      else{
        msgtoggle = 'off'
      }
    } catch  {
      msgtoggle = 'Error retreving Message Logging module status'
      iserror = true
    }


    try{
      if(toggleEco.toggle === 'true'){
        ecoToggle = 'on'
      }else{
        ecoToggle = 'off'
      }
    }catch{
      ecoToggle = 'Error Economy module status'
      iserror = true
    }

      let welcomeToggle;
      let welcomeValue;
        try{
        if(guildwelcome.message === ''){
            welcomeToggle = 'off';
            welcomeValue = 'null';
        } else{
            welcomeToggle = 'on';
            welcomeValue = guildwelcome.message;
        }
        } catch{
        welcomeToggle = 'Error retreving welcome message status';
        iserror = true
        }

        let logChannel;
        let logValue
        try{
        if(logchannel.channel === ''){
            logChannel = 'off';
            logValue = 'null';
        } else{
            logChannel = 'on';
            logValue = logchannel.channel;
        }
        } catch{
            logChannel = 'Error retreving log channel status'
            iserror = true
        }

        let welcomeChannel;
        let welcomeValuechannel;
        try{
        if(welcomemessagechannel.channel === ''){
          welcomeChannel = 'off';
          welcomeValuechannel = 'null';
        } else{
          welcomeChannel = 'on';
          welcomeValuechannel = welcomemessagechannel.channel;
        }
        } catch{
          welcomeChannel = 'Error retreving log channel status'
          iserror = true
        }
        const settings = new EmbedBuilder()
        .setTitle('Current server settings:')
        .setDescription(`${iserror ? `It appears there are some errors in your servers database, try runnng /dbfix to attempt to resolve these problems.` : " "}`)
        .addFields(
            {name: "Guild anti-swear", value: `The guild anti-swear plugin is currentaly: \`${truetoggle}\``},
            {name: "Guild Prefix", value: `The Guild Prefix is currentaly: \`${getPrefix.prefix}\``},
            {name: "Guild Economy plugin", value: `The Economy plugin is currentaly: \`${ecoToggle}\``},
            {name: "Guild Music plugin", value: `The Music plugin is currentaly: \`${musicToggle}\``},
            {name: "Guild Message Logging", value: `The Message Logging plugin is currentaly: \`${msgtoggle}\``},
            {name: "Guild Image Generation plugin", value: `The Image Generation plugin is currentaly: \`${imgToggle}\``},
            {name: "Guild welcome message", value: `The guild welcome message plugin is currentaly: \`${welcomeToggle}\`. Settig value:\n\`${welcomeValue}\``},
            {name: "Guild Log channel", value: `The guild log channel is currentaly: \`${logChannel}\`. Setting Value:\n\`${logValue}\``},
            {name: "Guild Welcome channel", value: `The guild log channel is currentaly: \`${welcomeChannel}\`. Setting Value:\n\`${welcomeValuechannel}\``}
        )
        .setColor('#00B9FF')
        .setTimestamp()

        if(message){
            message.channel.send({ embeds: [settings] });
        }
        if(interaction){
            interaction.reply({ embeds: [settings] })
        }
  },
}