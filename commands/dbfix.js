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
const LogMsg = require('../Guild9')

module.exports = {
  // command options
  description: "Attempt to diagnose and repair your servers settings database",
  catagory: 'Utility Commands',
  aliases: ['fix'],
  minArgs: 1,
  expectedArgs: "<diagnose_or_fix>", // layout of expected arguments
  expectedArgsTypes: ['STRING'], //types of arguments that should be entered
  guildonly: true, //command can only be ran inside guilds (not DM)
  options: [
      {
          name: 'diagnose_or_fix', // name of argument option
          description: 'Select to diagnose the database, or try to fix it.', // description of argument
          type: 3, // Set the option type to 3 (String Input)
          required: true, // is the argument required for this command (yes)
          autocomplete: true
      },
  ],
  
  autocomplete: (command, argument, interaction) => {
      return ["diagnose", "fix"]; //define the autocomplete values
  },
  
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    if(args[0] === 'diagnose'){
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
      let prefixcheck;
      try{
        if(getPrefix.prefix){
            prefixcheck = ':white_check_mark: ok'
        }
      } catch{
        prefixcheck = ':x: not ok'
      }
      let truetoggle;
      try{
              if (toggleSware.toggle){
                   truetoggle = ':white_check_mark: ok'
              }
      } catch{
        truetoggle = ':x: not ok'
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
      let logtoggle
      try{
      if(toggleMusic.toggle){
        musicToggle = ':white_check_mark: ok'
      }
    }catch{
      musicToggle = ':x: not ok'
      iserror = true
    }
    try {
      if(toggleImg.toggle){
        imgToggle = ':white_check_mark: ok'
      }
    } catch  {
      imgToggle = ':x: not ok'
      iserror = true
    }

    try{
      if(toggleEco.toggle){
        ecoToggle = ':white_check_mark: ok'
      }
    }catch{
      ecoToggle = ':x: not ok'
      iserror = true
    }

    try {
      if(logmsg.toggle){
        logtoggle = ':white_check_mark: ok'
      }
    } catch {
      logtoggle = ':x: not ok'
      iserror = true
    }

      let welcomeToggle;
        try{
        if(guildwelcome.message){
            welcomeToggle = ':white_check_mark: ok';
        }
        } catch{
        welcomeToggle = ':x: not ok';
        iserror = true
        }

        let logChannel;
        try{
        if(logchannel.channel){
            logChannel = ':white_check_mark: ok';
        }
        } catch{
            logChannel = ':x: not ok'
            iserror = true
        }

        let welcomeChannel;
        try{
        if(welcomemessagechannel.channel){
          welcomeChannel = ':white_check_mark: ok';
        }
        } catch{
          welcomeChannel = ':x: not ok'
          iserror = true
        }
        let embedcolour;
        if(iserror === true){
            embedcolour = '#E41A1A'
        } else {
            embedcolour = '#1FE31F'
        }

        const diagnoseembed = new EmbedBuilder()
        .setTitle(`${guild.name} database diagnostic results`)
        .setDescription(`${iserror ? `It appears there are some errors in your servers database, try runnng \`/dbfix fix\` to attempt to resolve these problems.` : "Everything seems ok, no further action is required."}`)
        .addFields(
            {name: "Guild anti-swear", value: `${truetoggle}`},
            {name: "Guild Prefix", value: `${prefixcheck}`},
            {name: "Guild Economy plugin", value: `${ecoToggle}`},
            {name: "Guild Music plugin", value: `${musicToggle}`},
            {name: "Guild Image Generation plugin", value: `${imgToggle}`},
            {name: "Guild Welcome Message", value: `${welcomeToggle}`},
            {name: "Guild Welcome Channel", value: `${welcomeChannel}`},
            {name: "Guild Log Channel", value: `${logChannel}`},
            {name: "Guild Message Logging", value: `${logtoggle}`}
        )
        .setColor(embedcolour)

        if(interaction) interaction.reply({ embeds: [diagnoseembed] })
        if(message) message.channel.send({ embeds: [diagnoseembed] })
    }
    else if(args[0] === 'fix'){
      if(!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return ':x: Unable to comply, you do not have \`Manage_Guild\` permision.'
        let iserror;
        const welcomemessagechannel = await GuildWelcomeChannel.findOne({_id: guild.id}).catch(error =>{
            console.log(`There was a error: ${error}`)
          })
            const guildwelcome = await GuildWelcome.findOne({_id: guild.id}).catch(error =>{
            console.log(`There was a error: ${error}`)
          })
          const toggleSware = await ToggleAntiSware.findOne({_id: guild.id}).catch(error =>{
            console.log(`There was a error: ${error}`)
          })
          const logchannel = await LogChannel.findOne({_id: guild.id}).catch(error =>{
            console.log(`There was a error: ${error}`)
          })
          const toggleImg = await ToggleImg.findOne({_id: guild.id}).catch(error =>{
            console.log(`There was a error: ${error}`)
          })
          const getPrefix = await GetPrefix.findOne({_id: guild.id}).catch(error =>{
            console.log(`There was a error: ${error}`)
          })
          const logmsg = await LogMsg.findOne({_id: guild.id}).catch(error => {
            console.log(`There was an error: ${error}`)
          })
          let prefixcheck;
          try{
            if(getPrefix.prefix){
                prefixcheck = ':white_check_mark: no changes made'
            }
          } catch{
            await GetPrefix.findOneAndUpdate({
                _id: guild.id
                },{
                _id: guild.id,
                prefix: '!',
                    
                },{
                    upsert: true
                })
            prefixcheck = ':tools: fixed'
            iserror = true
          }
          let truetoggle;
          try{
                  if (toggleSware.toggle){
                       truetoggle = ':white_check_mark: no changes made'
                  }
          } catch{
            await ToggleAntiSware.findOneAndUpdate({
                _id: guild.id
                },{
                _id: guild.id,
                toggle: 'false',
                    
                },{
                    upsert: true
                })
            truetoggle = ':tools: fixed'
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
          let logtoggle
          try{
          if(toggleMusic.toggle){
            musicToggle = ':white_check_mark: no changes made'
          }
        }catch{
            await ToggleMusic.findOneAndUpdate({
                _id: guild.id
                },{
                _id: guild.id,
                toggle: 'true',
                    
                },{
                    upsert: true
                })
          musicToggle = ':tools: fixed'
          iserror = true
        }
        try {
          if(toggleImg.toggle){
            imgToggle = ':white_check_mark: no changes made'
          }
        } catch  {
            await ToggleImg.findOneAndUpdate({
                _id: guild.id
                },{
                _id: guild.id,
                toggle: 'true',
                    
                },{
                    upsert: true
                })
          imgToggle = ':tools: fixed'
          iserror = true
        }

        try {
          if(logmsg.toggle){
            logtoggle = ':white_check_mark: no changes made'
          }
        } catch  {
            await LogMsg.findOneAndUpdate({
                _id: guild.id
                },{
                _id: guild.id,
                toggle: 'false',
                    
                },{
                    upsert: true
                })
          logtoggle = ':tools: fixed'
          iserror = true
        }        
    
        try{
          if(toggleEco.toggle){
            ecoToggle = ':white_check_mark: no changes made'
          }
        }catch{
            await ToggleEco.findOneAndUpdate({
                _id: guild.id
                },{
                _id: guild.id,
                toggle: 'true',
                    
                },{
                    upsert: true
                })
          ecoToggle = ':tools: fixed'
          iserror = true
        }
    
          let welcomeToggle;
            try{
            if(guildwelcome.message){
                welcomeToggle = ':white_check_mark: no changes made';
            }
            } catch{
                await GuildWelcome.findOneAndUpdate({
                    _id: guild.id
                    },{
                    _id: guild.id,
                    message: '',
                        
                    },{
                        upsert: true
                    })
            welcomeToggle = ':tools: fixed';
            iserror = true
            }
    
            let logChannel;
            try{
            if(logchannel.channel){
                logChannel = ':white_check_mark: no changes made';
            }
            } catch{
                await LogChannel.findOneAndUpdate({
                    _id: guild.id
                    },{
                    _id: guild.id,
                    channel: '',
                        
                    },{
                        upsert: true
                    })
                logChannel = ':tools: fixed'
                iserror = true
            }
    
            let welcomeChannel;
            try{
            if(welcomemessagechannel.channel){
              welcomeChannel = ':white_check_mark: no changes made';
            }
            } catch{
                await GuildWelcomeChannel.findOneAndUpdate({
                    _id: guild.id
                    },{
                    _id: guild.id,
                    channel: '',
                        
                    },{
                        upsert: true
                    })
              welcomeChannel = `:tools: fixed`
              iserror = true
            }

            if(iserror === true){
                embedcolour = '#1679E9'
            } else{
                embedcolour = '#1FE31F'
            }

            const fixembed = new EmbedBuilder()
        .setTitle(`${guild.name} database diagnostic and repair results`)
        .setDescription(`${iserror ? `All database errors have been succesfully fixed!` : "Nothing was changed, there were no database errors found."}`)
        .addFields(
            {name: "Guild anti-swear", value: `${truetoggle}`},
            {name: "Guild Prefix", value: `${prefixcheck}`},
            {name: "Guild Economy plugin", value: `${ecoToggle}`},
            {name: "Guild Music plugin", value: `${musicToggle}`},
            {name: "Guild Image Generation plugin", value: `${imgToggle}`},
            {name: "Guild Welcome Message", value: `${welcomeToggle}`},
            {name: "Guild Welcome Channel", value: `${welcomeChannel}`},
            {name: "Guild Log Channel", value: `${logChannel}`},
            {name: "Guild Message Logging", value: `${logtoggle}`}
        )
        .setColor(embedcolour)

        if(interaction) interaction.reply({ embeds: [fixembed] })
        if(message) message.channel.send({ embeds: [fixembed] })
    }
    else{
        return ':x: Invalid choice, please enter either \`/dbfix diagnose\`, or \`/dbfix fix\`'
    }
  },
}