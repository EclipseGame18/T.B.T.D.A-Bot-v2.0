const { CommandType, Command } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ApplicationCommandOptionType } = require('discord.js')
const GuildPrefix = require('../Guild')
const GlobalPrefix = '!'
const version = '2.2'

module.exports = {
  // command options
  description: "View T.B.T.D.A's help menu",
  catagory: 'Utility Commands',
  aliases: ['infomation', 'info'],
  maxArgs: 1,
  expectedArgs: "<Catagory-selector>",
  guildOnly: false,
  options: [
    {
        name: 'catagory-selector',
        description: 'Select a command catagory to view commands',
        type: ApplicationCommandOptionType.String,
        required: false,
        autocomplete: true
    }
  ],
  autocomplete: (command, argument, interaction) => {
    return ["utility", "fun", "moderation", "music", "economy", "image", "introduction"];
  },
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the ping command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    let getGuildPrefix
    if(guild){
    const guildPrefix = await GuildPrefix.findOne({_id: guild.id}).catch(error => {
        console.log(`There was an error: ${error}`)
      })
      getGuildPrefix = guildPrefix.prefix
    }else{
        getGuildPrefix = GlobalPrefix
    }
      let prefix = getGuildPrefix || GlobalPrefix
    if(!args[0] || args[0] === 'introduction'){
        const noArgs = new EmbedBuilder()
        .setTitle('T.B.T.D.A\'s help menu selector')
        .setDescription(`This is T.B.T.D.A's help menu selector, here you can select which menu you want to view.\nFor Utility commands, use \`/help utility\`.\nFor Fun commands, use \`/help fun\`.\nFor Mod/Admin commands, use \`/help moderation\`.\nFor Music commands, use \`/help music\`.\nFor Economy commands, use \`/help economy\`.\nFor Image Generation commands, use \`/help image\`.`)
        .addFields(
            {name: 'What prefix do I use?', value: `T.B.T.D.A supports slash (**/**) and legacy commands. The defult legacy command prefix is **!**, but this can be changed with \`/prefix {new prefix}\`. The current guild prefix is: **${prefix}**`},
            {name: 'Need more help?', value: `If you require more help, you can join our Discord [support server](https://discord.gg/3mkKSGw). Do you want all avalable infomation on T.B.T.D.A? Check out T.B.T.D.A's [official docs!](https://docs.tbtda.xyz)`},
            {name: 'Want to configure the bot online?', value: `Check out the online [web dashboard](https://tbtda.xyz) to configure and setup the bot to suit your needs.`},
            {name: 'Need to contact us?', value: `You can contact us either via the [support server](https://discord.gg/3mkKSGw), or you can email us directaly at support@tbtda.xyz`},
            {name: 'Got some feedback?', value: `You can submit feedback through the \`/feedback\` command.`}
        )
        .setColor('#00B9FF')
        .setFooter({ text: `T.B.T.D.A version: ${version} | Counting 126 total commands!` })
        if(message){
            return message.channel.send({ embeds: [noArgs] })
        }
        if(interaction){
            return interaction.reply({ embeds: [noArgs] })
        }
    }
    if(args[0] === 'utility'){
        const utility = new EmbedBuilder()
        .setTitle('Utility commands')
        .setDescription(`Here is T.B.T.D.A's 22 utility commands: ([L] = legacy command only)`)
        .addFields(
            {name: '/clear', value: 'Clears a specified amount of messages form a channel'},
            {name: '/join', value: 'T.B.T.D.A will join the VC you are currentaly in'},
            {name: '/disconnect', value: 'T.B.T.D.A will leave the VC it is currentaly in'},
            {name: '/test', value: 'Test if T.B.T.D.A is online and if all parts of T.B.T.D.A are functional'},
            {name: '/test_log', value: 'Test the log and welcome channels you specify'},
            {name: '/weather', value: 'Get the current weather for your specified location'},
            {name: '/feedback', value: 'Give feedback to the developers about bugs, improvements, ect.'},
            {name: `[L] ${prefix}tts`, value: `T.B.T.D.A will join your VC and read all messages form the channel where the ${prefix}tts command was origionaly ran`},
            {name: `[L] ${prefix}tts_off`, value: 'Disables TTS and disconnects T.B.T.D.A form your VC'},
            {name: '/toggleCommand', value: 'Disable any slash command in your guild (does not apply to some legacy commands)'},
            {name: '/requiredRole', value: 'Allows for server admins to configure which slash commands require roles, however, most commands already check for user permissions before executing'},
            {name: '/prefix', value: 'Allows for server admins to configure custom server legacy command prefixes, the defult prefix is **!**'},
            {name: '/channelCommand', value: 'Allows for server admins to customize which slash command can be ran certan channels'},
            {name: '/customCommand create', value: 'Create a custom slash and legacy command for your server'},
            {name: '/customCommand delete', value: 'Delete your servers custom commands, however, this cannot delete T.B.T.D.A\'s official commands'},
            {name: '/setup', value: 'Learn how to setup T.B.T.D.A in your server'},
            {name: '/reset_settings', value: 'Reset allof T.B.T.D.A\'s settings in your guild'},
            {name: '/get_settings', value: 'Get all the current guild settings'},
            {name: '/notice', value: 'Get either the latest notice form the developers, or the latest T.B.T.D.A changelog'},
            {name: '/ping', value: 'Get T.B.T.D.A\'s current ping'},
            {name: '/create_role', value: 'Creates a new role in your guild'},
            {name: '/dbfix', value: 'Attempt to diagnose and repair your servers settings database'}
        )
        .setFooter({ text: `T.B.T.D.A version: ${version} | Current server prefix: ${prefix}` })
        .setColor('#00B9FF')
        if(message){
            message.channel.send({ embeds: [utility] })
        }
        if(interaction){
            interaction.reply({ embeds: [utility] })
        }

    }
    else if(args[0] === 'fun'){
        const fun = new EmbedBuilder()
        .setTitle('Fun commands')
        .setDescription(`Here is T.B.T.D.A's 7 fun commands:`)
        .addFields(
            {name: '/8ball', value: 'Ask the 8ball a question, and get the answer you have been waiting for'},
            {name: '/flip', value: 'Flip a coin'},
            {name: '/hi', value: 'Says \'hi\' back'},
            {name: '/roll', value: 'Roll a dice up to a maxmum of 24 sides'},
            {name: '/rps', value: 'Play rock, paper, scissors with T.B.T.D.A'},
            {name: '/random_colour', value: 'Generates a random color and displays the HEX and RGB values'},
            {name: '/get_avatar', value: 'Get a user\'s avatar'}
        )
        .setFooter({ text: `T.B.T.D.A version: ${version} | Current server prefix: ${prefix}` })
        .setColor('#00B9FF')
        if(message){
            message.channel.send({ embeds: [fun] })
        }
        if(interaction){
            interaction.reply({ embeds: [fun] })
        }
    }
    else if(args[0] === 'moderation'){
        const mod = new EmbedBuilder()
        .setTitle('Mod/Admin commands')
        .setDescription(`Here is T.B.T.D.A's 14 moderation commands. Please keep in mind that these commands do require the user to have special permissions in order to execute.`)
        .addFields(
            {name: '/log', value: 'Send a log to the servers log channel'},
            {name: '/warn', value: 'Warn a user'},
            {name: '/kick', value: 'Kick a user form your server'},
            {name: '/ban', value: 'Ban a user form your server'},
            {name: '/timeout', value: 'Set a Discord timeout for a user'},
            {name: '/end_timeout', value: 'End a Discord timeout for a user'},
            {name: '/guild_log_channel', value: 'Set the guild log channel'},
            {name: '/guild_welcome_channel', value: 'Set the guild welcome channel'},
            {name: '/guild_welcome', value: 'Set the guild welcome message'},
            {name: '/toggle_eco', value: 'Toggle the economy plugin on or off'},
            {name: '/toggle_image', value: 'Toggle the image generation plugin on or off'},
            {name: '/toggle_music', value: 'Toggle the music plugin on or off'},
            {name: '/toggle_swear', value: 'Toggle the guild anti-swear plugin on or off'},
            {name: '/member_info', value: 'Get infomation on any member in your guild'}
        )
        .setFooter({ text: `T.B.T.D.A version: ${version} | Current server prefix: ${prefix}` })
        .setColor('#00B9FF')
        if(message){
            message.channel.send({ embeds: [mod] })
        }
        if(interaction){
            interaction.reply({ embeds: [mod] })
        }
    }
    else if(args[0] === 'music'){
        const music = new EmbedBuilder()
        .setTitle('Music commands')
        .setDescription(`Here is T.B.T.D.A's 18 music commands. Please note that music commands are only avalabe as legacy commands.`)
        .addFields(
            {name: `${prefix}play`, value: 'Play a song in your VC'},
            {name: `${prefix}playlist`, value: 'Play a playlist in your VC'},
            {name: `${prefix}skip`, value: 'Skip a song'},
            {name: `${prefix}stop`, value: 'Stop music playback and clear the queue'},
            {name: `${prefix}loopoff`, value: 'Disable all loops'},
            {name: `${prefix}loopsong`, value: 'Loop the current song'},
            {name: `${prefix}loopqueue`, value: 'Loop the current guild queue'},
            {name: `${prefix}setvolume`, value: 'Set the playback volume'},
            {name: `${prefix}seek`, value: 'Skip to different parts of a song in seconds'},
            {name: `${prefix}clearqueue`, value: 'Clear the current guild queue'},
            {name: `${prefix}shuffle`, value: 'Shuffle the current guild queue'},
            {name: `${prefix}queue`, value: 'Get the current guild queue'},
            {name: `${prefix}volume`, value: 'Get the current playback volume'},
            {name: `${prefix}playing`, value: 'Get info on the curent song playing'},
            {name: `${prefix}pause`, value: 'Pause playback'},
            {name: `${prefix}resume`, value: 'Resume playback'},
            {name: `${prefix}remove`, value: 'remove a song form the queue'},
            {name: `${prefix}progress`, value: 'Get the current progress of the song'},
        )
        .setFooter({ text: `T.B.T.D.A version: ${version} | Current server prefix: ${prefix}` })
        .setColor('#00B9FF')
        if(message){
            message.channel.send({ embeds: [music] })
        }
        if(interaction){
            interaction.reply({ embeds: [music] })
        }
    }
    else if(args[0] === 'economy'){
        const eco = new EmbedBuilder()
        .setTitle('Economy commands 1')
        .setDescription(`Here is part 1 of T.B.T.D.A's 33 economy commands. Please note that economy commands are only avalabe as legacy commands.`)
        .addFields(
            {name: `${prefix}bal`, value: 'Get a users balance'},
            {name: `${prefix}add_coins`, value: 'Add coins into a users wallet'},
            {name: `${prefix}remove_coins`, value: 'Remove coins form a users wallet'},
            {name: `${prefix}daily`, value: 'Receve your daily allowence'},
            {name: `${prefix}monthly`, value: 'Receve yout monthly allowence'},
            {name: `${prefix}hourly`, value: 'Receve your hourly allowence'},
            {name: `${prefix}weekly`, value: 'Receve your weekly allowence'},
            {name: `${prefix}work`, value: 'Try to work and get coins'},
            {name: `${prefix}transfer`, value: 'Transfer coins into another user\'s wallet'},
            {name: `${prefix}steal`, value: 'Attempt to steal coins form another user'},
            {name: `${prefix}beg`, value: 'Beg for coins'},
            {name: `${prefix}dep`, value: 'Deposit coins into your bank, once there coins cannot be stolen'},
            {name: `${prefix}withdraw`, value: 'Withdraw coins form your bank'},
            {name: `${prefix}lb`, value: 'Get the servers coins leader board (only mesures form users wallets)'},
            {name: `${prefix}shop`, value: 'View the guild shop'},
        )
        .setFooter({ text: `T.B.T.D.A version: ${version} | Current server prefix: ${prefix}` })
        .setColor('#00B9FF')

        const eco2 = new EmbedBuilder()
        .setTitle('Economy commands 2')
        .setDescription(`Here is part 2 of T.B.T.D.A's 33 economy commands. Please note that economy commands are only avalabe as legacy commands.`)
        .addFields(
            {name: `${prefix}item_info`, value: 'Get infomation on a shop item'},
            {name: `${prefix}add_shop_item`, value: 'Add an item to the shop'},
            {name: `${prefix}remove_shop_item`, value: 'Remove an item from the shop'},
            {name: `${prefix}edit_item`, value: 'Edit an item\'s propertys'},
            {name: `${prefix}hide_item`, value: 'Hide an item from the main shop'},
            {name: `${prefix}hidden_shop`, value: 'View all currentaly hidden items'},
            {name: `${prefix}unhide_item`, value: 'Un-hide an item'},
            {name: `${prefix}lock_item`, value: 'Lock an item form being bought or used'},
            {name: `${prefix}locked_shop`, value: 'View all locked items'},
            {name: `${prefix}unlock_item`, value: 'Un-lock an item'},
            {name: `${prefix}clear_shop`, value: 'Clear your server\'s shop'},
            {name: `${prefix}inv`, value: 'View your personal inventory'},
            {name: `${prefix}clear_inv`, value: 'Clear your inventory'},
            {name: `${prefix}history`, value: 'View your purchase history'},
            {name: `${prefix}clear_history`, value: 'Clear your purchase history'},
            {name: `${prefix}buy`, value: 'Buy an item form the shop'},
            {name: `${prefix}use`, value: 'Use an item in your inventory'},
            {name: `${prefix}sell`, value: 'Sell an item in your inventory'},
        )
        .setFooter({ text: `T.B.T.D.A version: ${version} | Current server prefix: ${prefix}` })
        .setColor('#00B9FF')

            const next = new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Page 2')
            .setStyle(ButtonStyle.Primary)

            const preveous = new ButtonBuilder()
            .setCustomId('preveous')
            .setLabel('Page 1')
            .setStyle(ButtonStyle.Secondary)

            const buttons = new ActionRowBuilder()
            .addComponents(preveous, next)

        preveous.setDisabled(true)
        let msgSend
        if(interaction) msgSend = await interaction.reply({ embeds: [eco], components: [buttons] })
        if(message) msgSend = await message.channel.send({ embeds: [eco], components: [buttons] })
        const collector = await msgSend.createMessageComponentCollector();

        collector.on('collect', async i =>{
            if(i.customId === 'next'){
                if(i.user.id !== interaction.user.id){
                    return i.reply({ content: `This help menu is locked to ${member}`, ephemeral: true })
                }
                preveous.setDisabled(false)
                next.setDisabled(true)
                await i.update({ embeds: [eco2], components: [buttons] })
                
            }
            if(i.customId === 'preveous'){
                if(i.user.id !== interaction.user.id){
                    return i.reply({ content: `This help menu is locked to ${member}`, ephemeral: true })
                }
                preveous.setDisabled(true)
                next.setDisabled(false)
                await i.update({ embeds: [eco], components: [buttons] })
            }
        })
    }
    else if(args[0] === 'image'){
        const img = new EmbedBuilder()
        .setTitle('Image generation commands 1')
        .setDescription(`Here is part 1 of T.B.T.D.A's 32 image generation commands. Please note that image generation commands are only avalabe as slash commands.`)
        .addFields(
            {name: '/advertisement', value: 'Makes a users avatar an advertisement'},
            {name: '/art', value: 'Makes a users avatar art'},
            {name: '/blur', value: 'Makes a users avatar blury'},
            {name: '/clown', value: 'Makes a user look like a clown'},
            {name: '/confused_stonks', value: 'Makes a user have confused stonks'},
            {name: '/deepfry', value: 'Deepfrys a users avatar'},
            {name: '/delete', value: 'Delete a users avatar'},
            {name: '/discord_avatar', value: 'Make a users avatar look like the Discord logo'},
            {name: '/double_stonks', value: 'Makes two users have double stonks'},
            {name: '/facepalm', value: 'Makes a user facepalm themself'},
            {name: '/great_point', value: 'Makes a user have a great point'},
            {name: '/greyscale', value: 'Makes a uses avatar greyscale'},
            {name: '/invert', value: 'Invert a users avatar'},
            {name: '/jail', value: 'Put a user in jail'},
            {name: '/mirror', value: 'Mirror a users avatar'},
            {name: '/monster_under_bed', value: 'Makes a user scared of another user under their bed'},
            
        )
        .setFooter({ text: `T.B.T.D.A version: ${version} | Current server prefix: ${prefix}` })
        .setColor('#00B9FF')

        const img2 = new EmbedBuilder()
        .setTitle('Image generation commands 2')
        .setDescription(`Here is part 2 of T.B.T.D.A's 32 image generation commands. Please note that image generation commands are only avalabe as slash commands.`)
        .addFields(
            {name: '/not_stonks', value: 'Makes a user have no stonks'},
            {name: '/painting', value: 'Make Bob Ross paint a users avatar'},
            {name: '/podium', value: 'Select three users to go on a podium'},
            {name: '/presentation', value: 'Makes Lisa\'s presentation for her'},
            {name: '/pride', value: 'Add the pride flag on top of a users avatar'},
            {name: '/rip', value: 'Put a users avatar at a funeral'},
            {name: '/slap', value: 'Makes a user slap another user'},
            {name: '/spank', value: 'Makes a user spank another user'},
            {name: '/stonks', value: 'Makes a user have stonks'},
            {name: '/tatoo', value: 'Makes a users avatar become a tatoo'},
            {name: '/thomas', value: 'Makes a users avatar become Thomas the Tank Engine\'s face'},
            {name: '/trash', value: 'Makes a user become trash'},
            {name: '/trigger', value: 'Trigger a user'},
            {name: '/wanted', value: 'Make a wanted poster for a user'},
            {name: '/wont_affect_my_baby', value: 'Make a wont affect my baby meme with a users avatar'},
            {name: '/worse_than_hitler', value: 'Makes a user worse then hitler (Family Guy news scene)'},
        )
        .setFooter({ text: `T.B.T.D.A version: ${version} | Current server prefix: ${prefix}` })
        .setColor('#00B9FF')

        const next = new ButtonBuilder()
        .setCustomId('next')
        .setLabel('Page 2')
        .setStyle(ButtonStyle.Primary)

        const preveous = new ButtonBuilder()
        .setCustomId('preveous')
        .setLabel('Page 1')
        .setStyle(ButtonStyle.Secondary)

        const buttons = new ActionRowBuilder()
        .addComponents(preveous, next)

            preveous.setDisabled(true)
            let msgSend
            if(interaction) msgSend = await interaction.reply({ embeds: [img], components: [buttons] })
            if(message) msgSend = await message.channel.send({ embeds: [img], components: [buttons] })
            const collector = await msgSend.createMessageComponentCollector();

        collector.on('collect', async i =>{
            if(i.customId === 'next'){
                if(i.user.id !== member.id){
                    return i.reply({ content: `This help menu is locked to ${member}`, ephemeral: true })
                }
                preveous.setDisabled(false)
                next.setDisabled(true)
                await i.update({ embeds: [img2], components: [buttons] })
                
            }
            if(i.customId === 'preveous'){
                if(i.user.id !== member.id){
                    return i.reply({ content: `This help menu is locked to ${member}`, ephemeral: true })
                }
                preveous.setDisabled(true)
                next.setDisabled(false)
                await i.update({ embeds: [img], components: [buttons] })
            }
        })
    }


    else{
        const elseArgs = new EmbedBuilder()
        .setTitle('Invalid option')
        .setDescription(`The args you entered do not match the options provided.\n\nFor Utility commands, use \`/help utility\`.\nFor Fun commands, use \`/help fun\`.\nFor Mod/Admin commands, use \`/help moderation\`.\nFor Music commands, use \`/help music\`.\nFor Economy commands, use \`/help economy\`.\nFor Image Generation commands, use \`/help image\`.\n\nThe defult legacy command prefix is **!**. The current server prefix is **${prefix}**`)
        .setFooter({ text: `T.B.T.D.A version: ${version} | Current server prefix: ${prefix}` })
        .setColor('#FF6400')

        if(message){
            message.channel.send({ embeds: [elseArgs] })
        }
        if(interaction){
            interaction.reply({ embeds: [elseArgs] })
        }
    }
  },
}