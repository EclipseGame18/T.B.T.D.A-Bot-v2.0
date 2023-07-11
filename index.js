const { Client, Events, GatewayIntentBits, Partials, messageLink, Message, EmbedBuilder, ActivityType, PermissionsBitField, DMChannel } = require ('discord.js');

const {AudioPlayer, createAudioResource, StreamType, entersState, VoiceConnectionStatus, joinVoiceChannel, getVoiceConnection, AudioPlayerStatus} = require('@discordjs/voice');

const discordTTS = require("discord-tts");

const wokcommands = require('wokcommands');

const Economy = require('discord-economy-super/mongodb')

const {CommandCooldown, msToMinutes} = require('discord-command-cooldown');

const ms = require('ms')

const stealCooldown = new CommandCooldown('steal', ms('10m'))
const begCooldown = new CommandCooldown('beg', ms('5m'))
const depCooldown = new CommandCooldown('dep', ms('60s'))
const moveMessageCooldown = new CommandCooldown('msg', ms('5m'))

const path = require('path');
require("dotenv/config");

const globalPrefix = ('!');

const mongo = require('./mongo');

const GuildPrefix = require('./Guild')

const ToggleAntiSware = require('./Guild2')

const GuildWelcome = require('./Guild3')

const GuildWelcomeChannel = require('./Guild4')

const ToggleMusic = require(`./Guild5`)

const ToggleEco = require(`./Guild6`)

const LogChannel = require(`./Guild7`)

function print(log){
    console.log(log)
}

const {
	Mongoose, connection
} = require('mongoose');


const client = new Client({ intents: [GatewayIntentBits.Guilds,
                                      GatewayIntentBits.MessageContent,
                                      GatewayIntentBits.GuildMessages,
                                      GatewayIntentBits.DirectMessages,
                                      GatewayIntentBits.GuildMembers,
                                      GatewayIntentBits.GuildVoiceStates,
                                      GatewayIntentBits.GuildModeration,
                                      GatewayIntentBits.DirectMessages
                                     ],
                                     partials: [
                                        Partials.Channel,
                                        Partials.User,
                                        Partials.Message,
                                        Partials.GuildMember,
                                    ],
                        });


let eco = new Economy({
    connection: {
        connectionURI: 'mongodb+srv://Bot_Agent:Minecraft18@bot-settings.miusd.mongodb.net/test?authSource=admin&replicaSet=atlas-udb06o-shard-0&readPreference=primary&ssl=true', // mongodb connection URI
        collectionName: 'eco-database', // specify if using MongoDB version (optional)
        dbName: 'eco-db', // specify if using MongoDB version (optional)
        mongoClientProperties: {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } // specify if using MongoDB version (optional)
    },
    dailyAmount: 150,
    workAmount: [15, 75],
    weeklyAmount: [250, 350],
    monthlyAmount: [400, 500],
    hourlyAmount: 85,
    dailyCooldown: 86400000,
    workCooldown: 14400000,
    weeklyCooldown: 604800000,
    monthlyCooldown: 2629746000,
    hourlyCooldown: 3600000,
    dateLocale: 'au',
    updater: {

        // enable or disable the console message
        // when the module is out of date
        // (when using the older version and newer is available)
        checkUpdates: true,

        // enable or disable the console message when the module is up to date
        // (when using the latest version)
        upToDateMessage: true
    },
    errorHandler: {

        // enable or disable module start up errors handling
        handleErrors: true,

        // number of attempts to start the module up
        attempts: 5,

        // time between each aattempt (in milliseconds)
        time: 5000
    },
})


const { RepeatMode } = require('discord-music-player');
const { Player } = require("discord-music-player");
const player = new Player(client, {
leaveOnEmpty: true,
leaveOnStop: true,
leaveOnEnd: false,
deafenOnJoin: true,
volume: 100,
quality: 'high',
});
client.player = player;

client.player
// Emitted when a song was added to the queue.
.on('songAdd',  async(queue, song) =>{
	let requestedBy = queue.data.requestedBy
	let initMessage = queue.data.queueInitMessage;
	const queueEmbed = new EmbedBuilder()
			.setTitle('New song added:')
			.setDescription(`[${song}](${song.url}) was added to the queue!`)
			.setThumbnail(`${song.thumbnail}`)
			.setColor('#6CFFD9');
			await initMessage.channel.send({embeds: [queueEmbed]})
		return;
	})
			// Emitted when a playlist was added to the queue.
.on('playlistAdd', async(queue, playlist) => {
	let initMessage = queue.data.queueInitMessage;
const embed = new EmbedBuilder()
.setTitle('Playlist added:') 
.setDescription(`${playlist.songs.length} songs were added to the queue.`)
.setColor('#6CFFD9');
await initMessage.channel.send({embeds: [embed]})
return;
})
// Emitted when a song changed.
.on('songChanged', async(queue, newSong, oldSong) =>{
	let initMessage = queue.data.queueInitMessage;
	let requestedBy = queue.data.requestedBy
	const embed = new EmbedBuilder()
	.setTitle('New Song:')
	.setDescription(`\`${oldSong}\` has finished, now playing: [${newSong}](${newSong.url})!`)
	.setThumbnail(`${newSong.thumbnail}`)
	.setColor('#6CFFD9');
	await initMessage.channel.send({embeds: [embed]}).then(msg => {setTimeout(() => msg.delete(), 120000)})
	return;
})
// Emitted when a first song in the queue started playing.
.on('songFirst',  async(queue, song) => {
	let requestedBy = queue.data.requestedBy
	let initMessage = queue.data.queueInitMessage;
	const playEmbed = new EmbedBuilder()
.setTitle("Now Playing:")
.setDescription(`[${song}](${song.url})!`)
.setColor('#6CFFD9')
.setThumbnail(`${song.thumbnail}`)
await initMessage.channel.send({embeds: [playEmbed]})
 return;
})
.on('channelEmpty',  async(queue) => {
        let initMessage = queue.data.queueInitMessage;
        const empty = new EmbedBuilder()
        .setTitle('Channel empty')
        .setDescription('The voice channel is empty, I have left the channel to save recources.')
        .setColor('#6CFFD9')
        await initMessage.channel.send({embeds: [empty]})
        
        
})
	
// Emitted when there was an error in runtime
.on('error', (error, queue, song) => {
	console.log(`DMP error: ${error}`)
    let initMessage = queue.data.queueInitMessage;
    initMessage.channel.send(`An error occured trying to playback: \`${song}\`. The queue is now cleared.`)
})

process.on("unhandledRejection", error => console.log(`There was an unhandled rejection error, but it was caught:\n${error}`));

client.on('ready', async() => {
    console.log(`Logged in as ${client.user.tag}`)

    client.user?.setPresence({
        status: 'online',
        activities: [
            {
                name: "Version 2.0 pre 2.8",
                type: ActivityType.Watching,
            }
        ]
    })
    new wokcommands({
        client,
        commandsDir: path.join(__dirname, 'commands'),
        showWarns: true,
        mongoUri: 'mongodb+srv://Bot_Agent:Minecraft18@bot-settings.miusd.mongodb.net/test?authSource=admin&replicaSet=atlas-udb06o-shard-0&readPreference=primary&ssl=true',
        
    })
})

eco.on('ready', economy => {
    console.log(`Economy module online`);
    console.log('Music module online')
    eco = economy
  })

let voiceConnection;
let audioPlayer = new AudioPlayer();

client.on('guildMemberAdd', async(member) =>{
    await member.guild.fetch();

    // Access the guild ID
    const guildId = member.guild.id;
    const welcomemessage = await GuildWelcome.findOne({_id: guildId}).catch(error =>{
		console.log(`There was a error: ${error}`)
	})
    const welcomemessagechannel = await GuildWelcomeChannel.findOne({_id: guildId}).catch(error =>{
		console.log(`There was a error: ${error}`)
	})
    if(!welcomemessage || !welcomemessagechannel) return
    if(welcomemessage.message === '' || !welcomemessagechannel.channel === ''){
        return
    } 
    else{
        try{
            let WelcomeGuildMessage = welcomemessage.message
            if(WelcomeGuildMessage.includes('{member}')){
                const EditWelcomeGuildMessage =  WelcomeGuildMessage.replace('{member}', member.user.username)
                WelcomeGuildMessage = EditWelcomeGuildMessage;
            }
            if(WelcomeGuildMessage.includes('{ping-member}')){
                const EditWelcomeGuildMessage =  WelcomeGuildMessage.replace('{ping-member}', member)
                WelcomeGuildMessage = EditWelcomeGuildMessage;
            }
        member.guild.channels.cache.get(welcomemessagechannel.channel).send(WelcomeGuildMessage)
        } catch(err){
            console.log('There was an error sending the welcome message: ' + err)
        }
    }
})

client.on("guildCreate", async (guild) => {
	await ToggleAntiSware.findOneAndUpdate({
		_id: guild.id
		},{
		_id: guild.id,
		toggle: 'false',
			
		},{
			upsert: true
		})
		await GuildPrefix.findOneAndUpdate({
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
                        let guildwelcometoggle;
                        let logchannelcheck;
                        let welcomemessageschanneltoggle;
                        if(guildwelcome.message === ''){
                            guildwelcometoggle = '(nothing)'
                        }
                        if(welcomemessagechannel.channel === ''){
                            welcomemessageschanneltoggle = '(nothing)'
                        }
                        if(logChannel.channel === ''){
                            logchannelcheck = '(nothing)'
                        }
	setTimeout(async () => {
    /*
    const channels = await guild.channels.fetch()
    const textChannels = channels.filter(channel => channel.type === 'GUILD_TEXT');
    // This event triggers when the bot joins a guild.    
    console.log(`Joined new guild: ${guild.name} with ${guild.memberCount} users!`);
	const join = new EmbedBuilder()
        .setTitle(`Hello ${guild.name}! :wave:`)
        .setDescription(`Thanks for adding me! My name is **${client.user.username}** and I am happy to be here!`)
        .addFields(
            { name: 'First things first', value: 'My defult prefix is **>** and you can change it by either going to https://tbtda.cf or using the >setprefix command.' },
            { name: 'Commands and command usage', value: `Most of my commands only require one arguement e.g. the /play command which can be used like this: \`/play {song name}\` and the >clear command which is used like this: \`/clear {number}\`. But don't worry you will get the hang of it in no time! :)` },
            { name: 'Plugins', value: `I also come with some plugins. One of my most useful plugins is the Anti-Swear plugin, this plugin will moderate your chat even when your admins and mods are offline! (this can be turned on and off using the \`/toggle_swear\` command)` },
            { name: 'Errors/Bugs', value: `Now, while using the bot you may encounter errors or bugs. But don't worry because there is a [Google Form](https://forms.gle/s3nUpZ3Dro8JNBDj8) setup so that you can report any bugs you find.` },
            { name: 'General help', value: `If you have any questions or need help there is a [Discord Server](https://discord.gg/3mkKSGw) with people that will be happy to help you!` }
        )
        .setColor('#35F01F')
        
        
            const textChannel = textChannels.values().next().value;
            console.log(`${textChannel}`)
            
    //try{
	//await textChannel.send({ embeds: [join]});
    //} catch{
        //console.log(`Unable to send welcome message in ${guild.name}`)
    //}
    */
    console.log(`Joined ${guild.name} with ${guild.memberCount} users. ID: ${guild.id}\nAnti-swear: ${toggleSware.toggle}.\nWelcome message: ${guildwelcometoggle}.\nwelcome channel: ${welcomemessageschanneltoggle}.\nLog channel: ${logchannelcheck}\nMusic toggle: ${toggleMusic.toggle}.\nEco toggle: ${toggleEco.toggle}`)
    }, 2000);
});

const getUser = userID => client.users.cache.get(userID)

let stream
let ttsChannel
let tts_text
let ttsOn = false
let ttsQueue = []
let ttsPlayerStatus = false
let ttsMessageRequirement
let musicOn = false
let importantMessage = true

setInterval(function(){ 
    //code goes here that will be run every 2 seconds.
    if(ttsQueue.length && ttsPlayerStatus === 'idle' && ttsOn === true){
        tts_text = (ttsQueue[0])
        tts(ttsMessageRequirement)
        ttsQueue.shift()
    }   
}, 2000);
    

client.on('messageCreate', async (message) => {
    if(message.author.bot) return;
    ttsMessageRequirement = message

    if(!message.guild) return

    const welcomemessagechannel = await GuildWelcomeChannel.findOne({_id: message.guild.id}).catch(error =>{
        console.log(`There was a error: ${error}`)
      })

      const logChannel = await LogChannel.findOne({_id: message.guild.id}).catch(error => {
        console.log(`There was an error: ${error}`)
      })

      const toggleMusic = await ToggleMusic.findOne({_id: message.guild.id}).catch(error => {
        console.log(`There was an error: ${error}`)
      })
      const toggleEco = await ToggleEco.findOne({_id: message.guild.id}).catch(error => {
        console.log(`There was an error: ${error}`)
      })

      const guildPrefix = await GuildPrefix.findOne({_id: message.guild.id}).catch(error => {
        console.log(`There was an error: ${error}`)
      })
      if(!guildPrefix || guildPrefix.prefix === ''){
        await GuildPrefix.findOneAndUpdate({
            _id: message.guild.id
            },{
            _id: message.guild.id,
            prefix: globalPrefix,
                
            },{
                upsert: true
            })
      }
      
      let serverPrefix = guildPrefix.prefix
      

      if(!toggleMusic || toggleMusic === null){
        await ToggleMusic.findOneAndUpdate({
            _id: message.guild.id
            },{
            _id: message.guild.id,
            toggle: true,
                
            },{
                upsert: true
            })
      }
      if(!toggleEco || toggleEco === null){
        await ToggleEco.findOneAndUpdate({
            _id: message.guild.id
            },{
            _id: message.guild.id,
            toggle: true,
                
            },{
                upsert: true
            })
      }
      
      if(tts_text === null || !tts_text){
        tts_text = 'TTS encountered and error'
      }
      if(message.channel.id === ttsChannel && ttsOn === true){
        tts_text = (`${message.author.username} said: ${message.content}`)
        if(ttsPlayerStatus === 'playing'){
            ttsQueue.push(tts_text)
            message.react('📝')
        } else{

        if(message.content.startsWith('!')){
            message.react('🔇')
        }
        else{

        message.react('🔊')
        tts(message)
        
    }
    }
    
   }


      let ecoStatus = toggleEco.toggle;
      let musicStatus = toggleMusic.toggle;

    const prefix = serverPrefix || globalPrefix;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    const toggleSware = await ToggleAntiSware.findOne({_id: message.guild.id}).catch(error =>{
		console.log(`There was a error: ${error}`)
	})

	if(toggleSware === null || !toggleSware){
		await ToggleAntiSware.findOneAndUpdate({
			_id: message.guild.id
			},{
			_id: message.guild.id,
			toggle: 'false',
				
			},{
				upsert: true
			})
	} 

try{
	if (toggleSware.toggle === 'true'){
		const blacklisted = ['fuck', 'shit', 'ass', 'cock', 'dick', 'c0ck', 'd1ck', 'nigger', 'cunt'];
		const whitelisted = ['pass', 'mass', 'hass', 'harass']
        if(message.channel.nsfw) return
		
		for (var i in blacklisted) {
			const user = message.author;
			
		 	if (message.content.toLowerCase().includes(whitelisted[i])){
		 		return
			 
		 	} else if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())){
				message.delete().catch(error =>{
					console.log(`Failed to delete blacklisted word sent by ${user.username} in ${message.guild.name}, ID: ${message.guild.id}`)
					message.channel.send(`:x: Failed to delete message, try checking my permissions.`).then(msg => {setTimeout(() => msg.delete(), 8000)})
				});
				message.channel.send(`${user}, Please don't use that language here!`).then(msg => {setTimeout(() => msg.delete(), 8000)})
                let canLog
                if(logChannel.channel !== ''){
                    canLog = true
                }else{
                    false
                }

                if(canLog === true){
                    const swear = new EmbedBuilder()
                    .setTitle('User Warned')
                    .addFields(
                        {name: 'User', value: `${message.author}`},
                        {name: 'Warned by', value: `${client.user} (auto mod)`},
                        {name: 'Reason', value: `Bad words`}
                    )
                    .setTimestamp()
                    .setColor('#FF6400')

                    message.guild.channels.cache.get(logChannel.channel).send({embeds: [swear]})
                }
		 	}
		}
	}
}catch{
    console.log(`Error retreving swear status for ${message.guild.name} (${message.guild.id})`)
}

if (message.mentions.has(client.user.id)) {
    if(message.mentions.everyone) return
    message.react('👋')
    const ping = new EmbedBuilder()
    .setTitle(`Hello ${message.author.username}`)
    .setDescription(`I am ${client.user.username}, I support slash (**/**) commands and also legacy commands. My legacy command prefix is currentaly: **${prefix}**.\nIf you need help please join our [support server.](https://discord.gg/3mkKSGw)`)
    .setColor('#00B9FF')
    message.channel.send({embeds: [ping]})
  }


    if(!message.content.startsWith(prefix)) return;
    const guildQueue = client.player.getQueue(message.guild.id);

    let guild = eco.cache.guilds.get({
        guildID: message.guild.id
    })

    let user = eco.cache.users.get({
        memberID: message.author.id,
        guildID: message.guild.id
    })

    const userID = message.mentions.members?.first()?.id ||
        message.guild.members.cache.find(member => member.user.username == args[0])?.id
        || getUser(args[0])?.id

    let argumentUser = eco.cache.users.get({
        memberID: userID,
        guildID: message.guild.id
    })

    const shop = eco.cache.shop.get({
        guildID: message.guild.id
    }) || []

    const inventory = eco.cache.inventory.get({
        guildID: message.guild.id,
        memberID: message.author.id
    }) || []

    const history = eco.cache.history.get({
        guildID: message.guild.id,
        memberID: message.author.id
    }) || []

    if (userID && !argumentUser) {
        argumentUser = await eco.users.create(userID, message.guild.id)
    }

    if (!guild) {
        guild = await eco.guilds.create(message.guild.id)
    }

    if (!user) {
        const ecoUser = await eco.users.get(message.author.id, message.guild.id)

        if (ecoUser) {
            eco.cache.users.update({
                guildID: message.guild.id,
                memberID: message.author.id
            })

            user = ecoUser
            return
        }

        user = await guild.users.create(message.author.id)
    }

    args[0];
    if(command == 'play'){
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        if (!message.member.voice.channel) {
            return message.reply(":x: Unable to comply, you need to be in a voice channel to use this command.");
          }
          if(ttsPlayerStatus !== false) return message.reply('You must end TTS to begin music playback, use `!tts_off` to turn off TTS')
        message.channel.send(`Searching for: \`${args.join(' ')}\``)
        let queue = client.player.createQueue(message.guild.id, {
            data: {
                queueInitMessage: message,
                requestedBy: message.author.username
                }
        });
        await queue.join(message.member.voice.channel);
        musicOn = true
        let song = await queue.play(args.join(' ')).catch(err => {
            console.log(`A DMP error occured: ` + err);
            message.channel.send('Unable to continue playback, an unknown error occured. :shrug:')
            if(!guildQueue)
                queue.stop();
                message.channel.send(':x: There was either a error playing the song or there was no song matching the query.\nPlease try that query again later.')

        });
    }
    else if(command == 'playlist'){
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        if (!message.member.voice.channel) {
            return message.reply(":x: Unable to comply, you need to be in a voice channel to use this command.");
          }
          if(ttsPlayerStatus !== false) return message.reply('You must end TTS to begin music playback, use `!tts_off` to turn off TTS')
        message.channel.send(`Searching for: \`${args.join(' ')}\``)
        let queue = client.player.createQueue(message.guild.id, {
            data: {
                queueInitMessage: message,
                requestedBy: message.author.username
                }
        });
        await queue.join(message.member.voice.channel);
        musicOn = true
        let song = await queue.playlist(args.join(' ')).catch(err => {
            console.log(`A DMP error occured: ` + err);
            message.channel.send('Unable to continue playback, an unknown error occured. :shrug:')
            if(!guildQueue)
                queue.stop();
                message.channel.send(':x: There was either a error playing the playlist or there was no playlist matching the query. Please try that query later.')
        });
    }
    else if(command == 'skip'){
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        try{
            guildQueue.skip();
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        const skip = new EmbedBuilder()
			.setTitle('Song Skipped:')
			.setDescription(`\`${guildQueue.nowPlaying}\` was skipped!`)
			.setColor('#6CFFD9');
		message.channel.send({embeds: [skip]});
    }
    else if(command == 'stop'){
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        try{
            guildQueue.stop()
            musicOn = false
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        
        const stop = new EmbedBuilder()
			.setTitle('Music stopped :stop_sign:')
			.setDescription('The queue was also cleared!')
			.setColor('#6CFFD9');
		message.channel.send({embeds: [stop]});
    }
    else if(command === 'loopoff') {
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        try{
            guildQueue.setRepeatMode(RepeatMode.DISABLED); // or 0 instead of RepeatMode.DISABLED
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        
        const loopsongoff = new EmbedBuilder()
			.setTitle('All loops are deactovated!')
			.setDescription(`song and queue looping is now off.`)
			.setColor('#6CFFD9');
		message.channel.send({embeds: [loopsongoff]});
    }

    else if(command === 'loopsong') {
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        try{
            guildQueue.setRepeatMode(RepeatMode.SONG); // or 1 instead of RepeatMode.SONG
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        
        const loopsongon = new EmbedBuilder()
			.setTitle('The current song will be looped!')
			.setDescription(`\n${guildQueue.nowPlaying}\n will be repeated indefinitely!`)
			.setColor('#6CFFD9');
		message.channel.send({embeds: [loopsongon]});
    }

    else if(command === 'loopqueue') {
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        try{
            guildQueue.setRepeatMode(RepeatMode.QUEUE); // or 2 instead of RepeatMode.QUEUE
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        
        const loopqueueon = new EmbedBuilder()
			.setTitle('The whole queue will be looped!')
			.setDescription('I am dizzy now!')
			.setColor('#6CFFD9');
		message.channel.send({embeds: [loopqueueon]});
    }

    else if(command === 'setvolume') {
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        try{
            if(!args[0]) return message.reply('Please specify a new volume.')
            if(args[0] > 200) return message.reply(`Hay, ${args[0]}% is too high! I will not let you blast off your ears or anyone else on the voice channel! -_-`)
            if(isNaN(args[0])) return message.reply(`Please specify the volume in numbers.`)
            guildQueue.setVolume(parseInt(args[0]));
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        
        const volume = new EmbedBuilder()
			.setTitle('The new volume is:')
			.setDescription(`**${args[0]}%**`)
			.setColor('#6CFFD9');
		message.channel.send({embeds: [volume]});
    }

    else if(command === 'seek') {
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        try{
            if(!args[0]) return message.reply('Please specify a time in seconds to seek.')
            guildQueue.seek(parseInt(args[0]) * 1000);
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        
        const seek = new EmbedBuilder()
        .setTitle('Seeking...')
        .setDescription(`Seeked \`${args[0]}\` seconds into the song.`)
        .setColor('#6CFFD9')
        message.channel.send({embeds: [seek]})
    }

    else if(command === 'clearqueue') {
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        try{
            guildQueue.clearQueue();
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        
        const queueclear = new EmbedBuilder()
			.setTitle('The queue was cleared!')
			.setDescription(`The queue is now in the trash! ;)`)
			.setColor('#6CFFD9');
		message.channel.send({embeds: [queueclear]});
    }

    else if(command === 'shuffle') {
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        try{
            guildQueue.shuffle();
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        
        const shuffle = new EmbedBuilder()
			.setTitle('Queue was shuffled!')
			.setDescription(`Just like shuffleing cards!`)
			.setColor('#6CFFD9');
		message.channel.send({embeds: [shuffle]});
    }

    else if(command === 'queue') {
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        try{
            let initqueue = player.getQueue(message.guild.id)
            let requestedBy = initqueue.data.requestedBy
            const rawQueue = guildQueue.songs;
    
            const queueSongNames = rawQueue.map((element, index) => `${index + 1}) ${element.name} | ${element.author}`);
    
            const queue = queueSongNames.join(`\n\`[${requestedBy}]\`\n\n`);
            const queueEmbed = new EmbedBuilder()
            .setTitle(`Music queue for ${message.guild.name}:`)
            .setDescription(`Now Playing: [${guildQueue.nowPlaying}](${guildQueue.nowPlaying.url})\n**__Queue:__**\n${queue}`)
            .setColor('#6CFFD9');
            message.channel.send({embeds: [queueEmbed]})
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        
    }

    else if(command === 'volume') {
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        try{
            const volume = new EmbedBuilder()
            .setTitle('The queue volume is:')
            .setDescription(`${guildQueue.volume}%`)
            .setColor('#6CFFD9');
            message.channel.send({embeds: [volume]})
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        
    }

    else if(command === 'playing') {
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        try{
            const ProgressBar = guildQueue.createProgressBar();
            const playing = new EmbedBuilder()
                .setTitle('Now Playing:')
                .setDescription(`[${guildQueue.nowPlaying}](${guildQueue.nowPlaying.url})`)
                .addFields(
                    { name: 'Progress', value: ProgressBar.prettier }
                )
                .setThumbnail(`${guildQueue.nowPlaying.thumbnail}`)
                .setColor('#6CFFD9');
            message.channel.send({embeds: [playing]});
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        
    }

    else if(command === 'pause') {
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        try{
            guildQueue.setPaused(true);
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        
        const pause = new EmbedBuilder()
			.setTitle('Music Paused:')
			.setDescription(`\`${guildQueue.nowPlaying}\` was paused! :pause_button:`)
			.setColor('#6CFFD9');
		message.channel.send({embeds: [pause]});
    }

    else if(command === 'resume') {
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        try{
            guildQueue.setPaused(false);
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        
        const resume = new EmbedBuilder()
			.setTitle('Music Resumed:')
			.setDescription(`\`${guildQueue.nowPlaying}\` was resumed! :arrow_forward:`)
			.setColor('#6CFFD9');
		message.channel.send({embeds: [resume]});
    }

    else if(command === 'remove') {
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        if(!guildQueue) return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        try{
        let song = args[0]
        if(!song) return message.reply('Please specify which song to remove.')
        if(isNaN(song)) return message.reply('Please enter the song number in the queue.')
        guildQueue.remove(parseInt(song))
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        const remove = new EmbedBuilder()
			.setTitle('Song Removed:')
			.setDescription(`Removed song \`${song}\` from the Queue! :outbox_tray:`)
			.setColor('#6CFFD9');
		message.channel.send({embeds: [remove]});
    }

    else if(command === 'progress') {
        if(musicStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the music plugin.`)
        infoMessage(message)
        try{
        const ProgressBar = guildQueue.createProgressBar();
        
        const progress = new EmbedBuilder()
        .setTitle('Progress:')
        .setDescription(ProgressBar.prettier)
        .setColor('#6CFFD9');

        message.channel.send({embeds: [progress]})
        }catch(err){
            return message.channel.send(':x: Unable to comply, the queue is currentaly empty.')
        }
        
    }
    else if(command === 'bal' || command === 'balance'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const [userID] = args

        const member =
            message.mentions.users.first() ||
            getUser(userID) || message.author


        //const economyUser = member ? argumentUser : user
        //const balanceData = await eco.cache.balance.get({ memberID: member.id, guildID: message.guild.id })

        //const [balance, bank] = [balanceData?.money, balanceData?.bank]

        const userBalanceGet = eco.cache.users.get({
            memberID: member.id,
            guildID: message.guild.id
        })

        const userBalance = await userBalanceGet.balance.get()
        const userBankBalance = await userBalanceGet.bank.get()

        message.channel.send(
            `${member}'s balance:\n` +
            `Coins in wallet: **${userBalance || 0}**.\n` +
            `Coins in bank: **${userBankBalance || 0}**.`
        )
    }

    else if (command === 'add_coins'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`:x: Unable to comply, you do not have \`Manage_Guild\` permision.`)
        infoMessage(message)
        const [userID] = args
        const user = message.mentions.users.first() || getUser(userID)

        if (!userID) {
            return message.channel.send(
                `${message.author}, please specify a user to add money to.`
            )
        }

        if (!user) {
            return message.channel.send(
                `${message.author}, user not found.`
            )
        }

        const amount = parseInt(args[1])

        if (!amount) {
            return message.channel.send(
                `${message.author}, please specify an amount to add.`
            )
        }

        if (isNaN(amount)) {
            return message.channel.send(
                `${message.author}, please specify a valid amount number.`
            )
        }


        await argumentUser.balance.add(amount)

        message.channel.send(
            `${message.author}, successfully added **${amount}** coins to **${user}**'s balance.`
        )
    }
    else if (command === 'remove_coins'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`:x: Unable to comply, you do not have \`Manage_Guild\` permision.`)
        infoMessage(message)
        const [userID] = args
        const user = message.mentions.users.first() || getUser(userID)

        if (!userID) {
            return message.channel.send(
                `${message.author}, please specify a user to subtract money from.`
            )
        }

        if (!user) {
            return message.channel.send(
                `${message.author}, user not found.`
            )
        }

        const userBalance = await argumentUser.balance.get() || 0
        const amount = args[1] == 'all' ? userBalance : parseInt(args[1])

        if (!amount) {
            return message.channel.send(
                `${message.author}, please specify an amount to subtract.`
            )
        }

        if (isNaN(amount)) {
            return message.channel.send(
                `${message.author}, please specify a valid amount number.`
            )
        }


        await argumentUser.balance.subtract(amount)

        message.channel.send(
            `${message.author}, successfully removed **${amount}** coins from **${user}**'s balance.`
        )
    }
    else if (command === 'daily'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const dailyResult = await user.rewards.getDaily()

        if(dailyResult.claimed){
            message.channel.send(`Congradulations ${message.author}, you claimed you daily reward of \`${dailyResult.reward}\` coins!`)
        }

        if (!dailyResult.claimed) {
            const cooldownTime = dailyResult.cooldown.time

            const cooldownTimeString =
                `${cooldownTime.days ? `**${cooldownTime.days}** days, ` : ''}` +

                `${cooldownTime.days || cooldownTime.hours ?
                    `**${cooldownTime.hours}** hours, `
                    : ''}` +

                `${cooldownTime.hours || cooldownTime.minutes ?
                    `**${cooldownTime.minutes}** minutes, ` :
                    ''}` +
                `**${cooldownTime.seconds}** seconds`


            return message.channel.send(
                `${message.author}, you can claim your daily reward in ${cooldownTimeString}.`
            )
        }
    }
    else if(command === 'monthly'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const monthlyResult = await user.rewards.getMonthly()

        if(monthlyResult.claimed){
            message.channel.send(`Congradulations ${message.author}, you claimed you daily reward of \`${monthlyResult.reward}\` coins!`)
        }

        if (!monthlyResult.claimed) {
            const cooldownTime = monthlyResult.cooldown.time

            const cooldownTimeString =
                `${cooldownTime.days ? `**${cooldownTime.days}** days, ` : ''}` +

                `${cooldownTime.days || cooldownTime.hours ?
                    `**${cooldownTime.hours}** hours, `
                    : ''}` +

                `${cooldownTime.hours || cooldownTime.minutes ?
                    `**${cooldownTime.minutes}** minutes, ` :
                    ''}` +
                `**${cooldownTime.seconds}** seconds`


            return message.channel.send(
                `${message.author}, you can claim your monthly reward in ${cooldownTimeString}.`
            )
        }
    }
    else if (command === 'hourly'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const hourlyResult = await user.rewards.getHourly()

        if(hourlyResult.claimed){
            message.channel.send(`Congradulations ${message.author}, you claimed you hourly reward of \`${hourlyResult.reward}\` coins!`)
        }

        if (!hourlyResult.claimed) {
            const cooldownTime = hourlyResult.cooldown.time

            const cooldownTimeString =
                `${cooldownTime.days ? `**${cooldownTime.days}** days, ` : ''}` +

                `${cooldownTime.days || cooldownTime.hours ?
                    `**${cooldownTime.hours}** hours, `
                    : ''}` +

                `${cooldownTime.hours || cooldownTime.minutes ?
                    `**${cooldownTime.minutes}** minutes, ` :
                    ''}` +
                `**${cooldownTime.seconds}** seconds`


            return message.channel.send(
                `${message.author}, you can claim your hourly reward in ${cooldownTimeString}.`
            )
        }
    }
    else if (command === 'work'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const workResult = await user.rewards.getWork()

        if (!workResult.claimed) {
            const cooldownTime = workResult.cooldown.time

            const cooldownTimeString =
                `${cooldownTime.days ? `**${cooldownTime.days}** days, ` : ''}` +

                `${cooldownTime.days || cooldownTime.hours ?
                    `**${cooldownTime.hours}** hours, `
                    : ''}` +

                `${cooldownTime.hours || cooldownTime.minutes ?
                    `**${cooldownTime.minutes}** minutes, ` :
                    ''}` +
                `**${cooldownTime.seconds}** seconds`


            return message.channel.send(
                `${message.author}, you can work again in ${cooldownTimeString}.`
            )
        }

        if(workResult.reward < 30){
            message.channel.send(
                `${message.author}, you did a terrible job and only receved \`${workResult.reward}\` coins.`
            )
        }if(workResult.reward > 50){
            message.channel.send(
                `${message.author}, you did an exellant job! You receved \`${workResult.reward}\` coins.`
            )
        }else{
            if(workResult.reward < 30) return
            message.channel.send(
                `${message.author}, you did a decent job and receved \`${workResult.reward}\` coins.`
            )
            }
    }
    else if (command === 'weekly'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const weeklyResult = await user.rewards.getWeekly()

        if (!weeklyResult.claimed) {
            const cooldownTime = weeklyResult.cooldown.time

            const cooldownTimeString =
                `${cooldownTime.days ? `**${cooldownTime.days}** days, ` : ''}` +

                `${cooldownTime.days || cooldownTime.hours ?
                    `**${cooldownTime.hours}** hours, `
                    : ''}` +

                `${cooldownTime.hours || cooldownTime.minutes ?
                    `**${cooldownTime.minutes}** minutes, ` :
                    ''}` +
                `**${cooldownTime.seconds}** seconds`


            return message.channel.send(
                `${message.author}, you can claim your weekly reward in ${cooldownTimeString}.`
            )
        }

        message.channel.send(
            `${message.author}, you claimed your **${weeklyResult.reward}** weekly coins!`
        )
    }
    else if (command === 'transfer'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const [id, amountString] = args

        const sender = user
        const receiver = argumentUser

        const senderBalance = await sender.balance.get()
        const amount = amountString == 'all' ? senderBalance : parseInt(amountString)

        if (!id) {
            return message.channel.send(
                `${message.author}, please specify a user to transfer coins to.`
            )
        }

        if (!userID) {
            return message.channel.send(`${message.author}, user not found.`)
        }

        if (!amount) {
            return message.channel.send(
                `${message.author}, please specify an amount of coins to transfer.`
            )
        }

        if (senderBalance < amount) {
            return message.channel.send(
                `:x: ${message.author}, you don't have enough coins to perform this transfer.\nYou have: \`${senderBalance}\` coins.\nYou specified: \`${amount}\` coins.`
            )
        }

        const transferingResult = await receiver.balance.transfer({
            amount,
            senderMemberID: message.author.id,

            sendingReason: `transfered ${amount} coins to ${getUser(argumentUser.id).tag}.`,
            receivingReason: `received ${amount} coins from ${message.author.tag}.`
        })

        message.channel.send(
            `${message.author}, you transfered **${transferingResult.amount}** coins to ${getUser(argumentUser.id)}.`
        )
    }
    else if (command === 'steal'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const underCooldown = await stealCooldown.getUser(message.author.id)
        if(underCooldown){
            const time = msToMinutes(underCooldown.msLeft, false)
            return message.channel.send(
                `${message.author}, you can steal again in **${time.minutes}** minutes, **${time.seconds}** seconds.`
            )
        }
        const [userID] = args
        const user = message.mentions.users.first() || getUser(userID)
        function generateRandom(min = -25, max = 150) {

            // find diff
            let difference = max - min;
        
            // generate random number 
            let rand = Math.random();
        
            // multiply with difference 
            rand = Math.floor( rand * difference);
        
            // add with min value 
            rand = rand + min;
        
            return rand;
        }
        

        if(!userID){
            return message.channel.send(`${message.author}, please specify a member to steal form.\n*!steal {@member}*`)
        }
        if (!user) {
            return message.channel.send(
                `${message.author}, user not found.`
            )
        }
        if(user === message.author){
            await stealCooldown.addUser(message.author.id)
            return message.channel.send(`${message.author}, you can't steal form yourself -_-`)
        }
        const userBalance = await argumentUser.balance.get() || 0
        const amount = generateRandom()

        if(userBalance < 20){
            await stealCooldown.addUser(message.author.id)
            return message.channel.send(
                `${message.author}, that user is too poor to steal form, try stealing form someone richer.`
            )
        }

        if(userBalance < amount){
            return message.channel.send(
                `${message.author}, you attempted to steal ${amount} coins form ${user.username}. However, ${user.username} does not have ${amount} coins. You apologyze and walk off.`
            )
        }

        if(amount < 0){
            await stealCooldown.addUser(message.author.id)
            const newAugment = eco.cache.users.get({
                memberID: message.author.id,
                guildID: message.guild.id
            })
            await newAugment.balance.subtract(20)
            return message.channel.send(
                `${message.author}, ha ha! You were caught, you have paid a fine of 20 coins.`
            )
        }

        await argumentUser.balance.subtract(amount)
        const newAugmentSuccess = eco.cache.users.get({
            memberID: message.author.id,
            guildID: message.guild.id
        })
        await newAugmentSuccess.balance.add(amount)
        message.channel.send(
            `${message.author}, you successfully stole \`${amount}\` coins!`
        )
        await stealCooldown.addUser(message.author.id)
    }
    else if (command === 'beg'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const underCooldown = await begCooldown.getUser(message.author.id)
        if(underCooldown){
            const time = msToMinutes(underCooldown.msLeft, false)
            return message.channel.send(
                `${message.author}, you can beg again in **${time.minutes}** minutes, **${time.seconds}** seconds.`
            )
        }
        const nameList = [
            'Bill', 'Tegan', 'Peter', 'Margerate', 'Bob', 'Amanda', 'Noah', 'Jerry', 'Picard', 'Anikin', 'Sophie', 'Jack', 'Daniel', 'Malinda', 'Craig', 'Megan', 'James', 'Fred'
        ]
        function generateName() {
            var finalName = nameList[Math.floor(Math.random() * nameList.length)];
                  return finalName
                };
        function generateRandom(min = -30, max = 100) {

            // find diff
            let difference = max - min;
        
            // generate random number 
            let rand = Math.random();
        
            // multiply with difference 
            rand = Math.floor( rand * difference);
        
            // add with min value 
            rand = rand + min;
        
            return rand;
        }
        const amount = generateRandom()
        if(amount < 0){
            await begCooldown.addUser(message.author.id)
            return message.channel.send(
                `${message.author}, you beged for a while and everyone ignored you. You have reveved no coins, nor have you lost any.`
            )
            }
        if(amount === 0){
            await begCooldown.addUser(message.author.id)
            return message.channel.send(
                `${message.author}, ${generateName()} tried to give you some coins but found out they had none, they apoligized and walked away.`
            )
        }
        const newAugmentSuccess = eco.cache.users.get({
            memberID: message.author.id,
            guildID: message.guild.id
        })
        await newAugmentSuccess.balance.add(amount)
        message.channel.send(`${message.author}, **${generateName()}** has given you \`${amount}\` coins.`)
        await begCooldown.addUser(message.author.id)
    }
    else if (command === 'dep' || command === 'deposit'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const underCooldown = await depCooldown.getUser(message.author.id)
        if(underCooldown){
            const time = msToMinutes(underCooldown.msLeft, false)
            return message.channel.send(
                `${message.author}, you can deposit coins in **${time.seconds}** seconds.`
            )
        }
        const [amountString] = args

        const userBalance = await user.balance.get()
        const amount = amountString == 'all' ? userBalance : parseInt(amountString)

        const bankCheck = await user.bank.get()
        if(bankCheck === 4500){
            return message.channel.send(`${message.author}, you have reached the bank limit of **4500** coins. You can no longer add any more coins.`)
        }
        if(bankCheck + amount > 4500){
            return message.channel.send(`${message.author}, You are trying to add \`${amount}\` coins into your bank, but you already have \`${bankCheck}\` coins in your bank.\nThe max amount allowed in your bank is **4500** coins, this total amount would be \`${bankCheck + amount}\` coins, this is \`${bankCheck + amount - 4500}\` coins too many.`)
        }

        if (isNaN(amountString)){
            if(amountString == 'all'){
        

        if (userBalance < amount || !userBalance) {
            return message.channel.send(
                `:x: ${message.author}, you don't have enough coins in your wallet to perform this deposit.\nYou have: \`${userBalance}\` coins.\nYou specified \`${amount}\` coins.`
            )
        }

        await user.balance.subtract(amount, `depositted ${amount} coins`)
        await user.bank.add(amount, `depositted ${amount} coins`)
        await depCooldown.addUser(message.author.id)
        message.channel.send(
            `${message.author}, you depositted **${amount}** coins into your bank.`
        )
    } else{
        return message.channel.send(`${message.author}, invalid input, either specify amount using numbers or enter 'all' to deposit all your coins.`)
    }} else {
        if (userBalance < amount || !userBalance) {
            return message.channel.send(
                `:x: ${message.author}, you don't have enough coins in your wallet to perform this deposit.\nYou have: \`${userBalance}\` coins.\nYou specified \`${amount}\` coins.`
            )
        }

        await user.balance.subtract(amount, `depositted ${amount} coins`)
        await user.bank.add(amount, `depositted ${amount} coins`)
        await depCooldown.addUser(message.author.id)
        message.channel.send(
            `${message.author}, you depositted **${amount}** coins into your bank.`
        )
    }
    }
    else if (command === 'withdraw'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const [amountString] = args

        const userBankBalance = await user.bank.get()
        const amount = amountString == 'all' ? userBankBalance : parseInt(amountString)

        if (isNaN(amountString)){
            if(amountString == 'all'){

        if (userBankBalance < amount || !userBankBalance) {
            return message.channel.send(
                `${message.author}, you don't have enough coins in your bank to perform this withdraw.\nYou have: \`${userBankBalance}\`\nYou specified: \`${amount}\``
            )
        }

        await user.balance.add(amount, `withdrew ${amount} coins`)
        await user.bank.subtract(amount, `withdrew ${amount} coins`)

        message.channel.send(
            `${message.author}, you withdrew **${amount}** coins from your bank.`
        )
    } else{
        return message.channel.send(`${message.author}, invalid input, either specify amount using numbers or enter 'all' to withdraw all your coins.`)
    }} else{
        if (userBankBalance < amount || !userBankBalance) {
            return message.channel.send(
                `${message.author}, you don't have enough coins in your bank to perform this withdraw.\nYou have: \`${userBankBalance}\`\nYou specified: \`${amount}\``
            )
        }

        await user.balance.add(amount, `withdrew ${amount} coins`)
        await user.bank.subtract(amount, `withdrew ${amount} coins`)

        message.channel.send(
            `${message.author}, you withdrew **${amount}** coins from your bank.`
        )
    }
    }
    else if (command === 'lb' || command === 'rich' || command === "leader_board"){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const rawLeaderboard = await guild.leaderboards.money()

        const leaderboard = rawLeaderboard
            .filter(lb => !getUser(lb.userID)?.bot)
            .filter(lb => !!lb.money)

        if (!leaderboard.length) {
            return message.channel.send(`${message.author}, there are no users in the leaderboard.`)
        }

        message.channel.send(
            `Richest users in **${message.guild.name}**:\n\n` +
            `${leaderboard
                .map((lb, index) => `${index + 1} - <@${lb.userID}> - **${lb.money}** coins in wallet`)
                .join('\n')}`
        )
    }
    else if (command === 'shop'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const guildShop = shop.filter(item => !item.custom.hidden)

        if (!guildShop.length) {
            return message.channel.send(`${message.author}, there are no items in the shop.`)
        }

        message.channel.send(
            `Server shop for **${message.guild.name}** | \`${guildShop.length} items\`:\n\n` +

            `${guildShop
                .map((item, index) =>
                    `${index + 1} - ${item.custom.locked ? ' 🔒 | ' : ' '}${item.custom.emoji} ` +
                    `**${item.name}** (ID: \`${item.id}\`) - \`${item.price}\` coins\n` +
                    `Description: \`${item.description}\`. Max amount in inventory: \`${item.maxAmount}\`.`
                    )
                .join('\n')}`
        )
    }
    else if (command === 'item_info'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const [itemID] = args

        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please specify an item.`)
        }

        if (!item || item?.custom?.hidden) {
            return message.channel.send(`${message.author}, the item either cannot be found, or it has been hidden by an admin.`)
        }

        message.channel.send(
            `**${item.custom.emoji} ${item.name}** - Item Info:\n\n` +

            `Name: \`${item.name}\`` +
            `${item.custom.locked ? ` [🔒 | Locked since ${new Date(item.custom.lockedSince)
                .toLocaleString()}]` : ''}\n` +

            `ID: \`${item.id}\`\n` +
            `Emoji: ${item.custom.emoji}\n\n` +

            `Price: \`${item.price}\` coins\n` +
            `Description: \`${item.description}\`\n` +
            `Max quantity in inventory: \`${item.maxAmount}\`\n\n` +

            `${item.role ? `Role granted on use: ${item.role}\n` : ''}` +
            `Hidden: \`${item.custom.hidden ? 'Yes' : 'No'}\`\n` +
            `Locked: \`${item.custom.locked ? 'Yes' : 'No'}\`\n\n` +

            `Message on use: \`${item.message}\`\n` +
            `Created at: \`${item.date}\``
        )
    }
    else if (command === 'add_shop_item'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        let [name, emoji, priceString, description, maxAmount, role] = args

        if(args[0] === 'syntax'){
            return message.channel.send(`Syntax for \`!add_shop_item\` command:\n\`!add_shop_item\` \`{name}\` \`{emoji}\` \`{price}\` \`{description_seperated_by_underscores}\` \`{max amount allowed in inventory}\` \`{role to add to player on use [enter null if no role]}\` \`{message on use NO UNDERSCORES}\``)
        }

        const price = parseInt(priceString)
        const messageOnUse = args.slice(6).join(' ')

        // message on use is optional and defaults to `You have used this item!`

        // supports choosing a random string from a specified strings list with following syntax:
        // [random="str", "str1", "str2"]

        // for example, if specifying `What a [random="wonderful", "great", "sunny"] day!` as message on use
        // then in returned message, `[random="wonderful", "great", "sunny"]` will be replaced with either
        // "wonderful", "great" or "sunny".

        if (!name) {
            return message.channel.send(`${message.author}, please provide a name for the item.\n*!add_shop_item {name} {emoji} {price} {description_seperated_by_underscores} {max amount allowed in inventory} {role to add to player on use [enter null if no role]} {message on use NO UNDERSCORES}*`)
        }

        if (!emoji) {
            return message.channel.send(`${message.author}, please provide an emoji for the item.\n*!add_shop_item {name} {emoji} {price} {description_seperated_by_underscores} {max amount allowed in inventory} {role to add to player on use [enter null if no role]} {message on use NO UNDERSCORES}*`)
        }

        if (!price) {
            return message.channel.send(`${message.author}, please provide a price for the item.\n*!add_shop_item {name} {emoji} {price} {description_seperated_by_underscores} {max amount allowed in inventory} {role to add to player on use [enter null if no role]} {message on use NO UNDERSCORES}*`)
        }
        if (!description){
            return message.channel.send(`${message.author}, please provide a description for the item.\n*!add_shop_item {name} {emoji} {price} {description_seperated_by_underscores} {max amount allowed in inventory} {role to add to player on use [enter null if no role]} {message on use NO UNDERSCORES}*`)
        }
        if (!maxAmount){
            return message.channel.send(`${message.author}, please provide a maxmum amount allowed in inventory for the item.\n*!add_shop_item {name} {emoji} {price} {description_seperated_by_underscores} {max amount allowed in inventory} {role to add to player on use [enter null if no role]} {message on use NO UNDERSCORES}*`)
        }
        if(isNaN(maxAmount)){
                return message.channel.send(`${message.author}, your maxmum amount allowed in inventory specification must be a number.`)
            }
        if(role !== 'null' && !message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)){
            return message.reply(`:x: Unable to comply, you require \`Manage_Roles\` permision to specify a role to add. Input \`null\` to ignore role`)
        }
        if(role === 'null'){
            role = ''
        }

        const newItem = await guild.shop.addItem({
            name,
            price,
            description,
            maxAmount,
            message: messageOnUse || '{error: no_message_entered}',
            role,

            custom: {
                emoji,
                hidden: false,
                locked: false,
                hiddenSince: null,
                lockedSince: null
            }
        })

        message.channel.send(
            `${message.author}, you added **${newItem.name}** for **${newItem.price}** coins to the shop.`
        )
    }
    else if (command === 'remove_shop_item'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`:x: Unable to comply, you do not have \`Manage_Guild\` permision.`)
        infoMessage(message)
        const [itemID] = args

        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        await item.delete()

        message.channel.send(
            `${message.author}, you removed \`${item.name}\` from the shop.`
        )
    }
    else if (command === 'edit_item'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`:x: Unable to comply, you do not have \`Manage_Guild\` permision.`)
        infoMessage(message)
        if(args[0] === 'syntax'){
            return message.channel.send(`Syntax for \`!edit_item\` command:\n\`!edit_item\` \`{item ID}\` \`{item property}\` \`{new value}\``)
        }
        const itemProperties = ['description', 'price', 'name', 'message', 'maxAmount']

        const [itemID, itemProperty] = args
        const newValue = args.slice(2).join(' ')

        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please provide an item ID.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        if (!itemProperty) {
            return message.channel.send(
                `${message.author}, please provide an item property to change.\nValid item properties are: ${itemProperties.map(prop => `\`${prop}\``).join(', ')}`
            )
        }

        if (!itemProperties.includes(itemProperty)) {
            return message.channel.send(
                `${message.author}, item property you specified is not valid.\nValid item properties are: ${itemProperties.map(prop => `\`${prop}\``).join(', ')}`
            )
        }

        if (!newValue) {
            return message.channel.send(`${message.author}, please provide a new value for the item property.`)
        }

        await item.edit(itemProperty, newValue)

        message.channel.send(
            `${message.author}, item \`${item.id}\`'s property: \`${itemProperty}\` has been changed to: \`${newValue}\``
        )
    }
    else if (command === 'hide_item'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`:x: Unable to comply, you do not have \`Manage_Guild\` permision.`)
        infoMessage(message)
        const [itemID] = args
        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please provide an item ID.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        if (item.custom.hidden) {
            return message.channel.send(`${message.author}, item is already hidden.`)
        }

        await item.setCustom({
            emoji: item.custom.emoji,
            hidden: true,
            hiddenSince: Date.now(),
            locked: item.custom.locked,
            lockedSince: item.custom.lockedSince
        })

        message.channel.send(
            `${message.author}, you hid the item **${item.name}** from the shop.`
        )
    }
    else if (command === 'hidden_shop'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`:x: Unable to comply, you do not have \`Manage_Guild\` permision.`)
        infoMessage(message)
        const hiddenShop = shop.filter(item => item.custom.hidden)

        if (!hiddenShop.length) {
            return message.channel.send(`${message.author}, there are no hidden items in the shop.`)
        }

        message.channel.send(
            `Server hidden shop for **${message.guild.name}** | \`${hiddenShop.length} items\`:\n\n` +

            `${hiddenShop
                .map((item, index) =>
                    `${index + 1} - ${item.custom.locked ? ' 🔒 | ' : ' '}${item.custom.emoji} ` +
                    `**${item.name}** (ID: \`${item.id}\`) - \`${item.price}\` coins ` +
                    `(Hidden since \`${new Date(item.custom.hiddenSince).toLocaleString()}\`)\n` +
                    `Description: \`${item.description}\`. Max amount in inventory: \`${item.maxAmount}\`. Item use message: \`${item.message}\``
                )
                .join('\n')}`
        )
    }
    else if (command === 'item_unhide'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`:x: Unable to comply, you do not have \`Manage_Guild\` permision.`)
        infoMessage(message)
        const [itemID] = args
        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please provide an item ID.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        if (!item.custom.hidden) {
            return message.channel.send(`${message.author}, item is already visible.`)
        }

        await item.setCustom({
            emoji: item.custom.emoji,
            hidden: false,
            hiddenSince: null,
            locked: item.custom.locked,
            lockedSince: item.custom.lockedSince
        })

        message.channel.send(
            `${message.author}, item **${item.name}** is now visible in the shop.`
        )
    }
    else if (command === 'lock_item'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`:x: Unable to comply, you do not have \`Manage_Guild\` permision.`)
        infoMessage(message)
        const [itemID] = args
        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please provide an item ID.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        if (item.custom.locked) {
            return message.channel.send(`${message.author}, item is already locked.`)
        }

        await item.setCustom({
            emoji: item.custom.emoji,
            hidden: item.custom.hidden,
            hiddenSince: item.custom.hiddenSince,
            locked: true,
            lockedSince: Date.now()
        })

        message.channel.send(
            `${message.author}, you locked the item **${item.name}** in the shop.`
        )
    }
    else if (command === 'locked_shop'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`:x: Unable to comply, you do not have \`Manage_Guild\` permision.`)
        infoMessage(message)
        const lockedShop = shop.filter(item => item.custom.locked)

        if (!lockedShop.length) {
            return message.channel.send(`${message.author}, there are no locked items in the shop.`)
        }

        message.channel.send(
            `Server locked shop for **${message.guild.name}** | \`${lockedShop.length} items\`:\n\n` +

            `${lockedShop
                .map((item, index) =>
                    `${index + 1} - ${item.custom.locked ? ' 🔒 | ' : ' '}${item.custom.emoji} ` +
                    `**${item.name}** (ID: \`${item.id}\`) - \`${item.price}\` coins ` +
                    `(Locked since \`${new Date(item.custom.lockedSince).toLocaleString()}\`)\n` +
                    `Description: \`${item.description}\`. Max amount in inventory: \`${item.maxAmount}\`. Item use message: \`${item.message}\``
                )
                .join('\n')}`
        )
    }
    else if (command === 'item_unlock'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`:x: Unable to comply, you do not have \`Manage_Guild\` permision.`)
        infoMessage(message)
        const [itemID] = args

        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please provide an item ID.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        if (!item.custom.locked) {
            return message.channel.send(`${message.author}, item is already unlocked.`)
        }

        await item.setCustom({
            emoji: item.custom.emoji,
            hidden: item.custom.hidden,
            hiddenSince: item.custom.hiddenSince,
            locked: false,
            lockedSince: null
        })

        message.channel.send(
            `${message.author}, you unlocked the item **${item.name}** in the shop.`
        )
    }
    else if (command === 'clear_shop'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`:x: Unable to comply, you do not have \`Manage_Guild\` permision.`)
        infoMessage(message)
        if(args[0] === 'confirm'){
        if (!shop.length) {
            return message.channel.send(`${message.author}, there are no items in the shop.`)
        }

        await guild.shop.clear()

        message.channel.send(
            `${message.author}, you cleared \`${shop.length}\` items from the shop.`
        )
        }
        else{
            return message.channel.send(`${message.author}, please type \`confirm\` if you wish to clear the entire guild shop. This cannot be undone.\n*!clear_shop confirm*`)
        }
    }
    else if (command === 'inv' || command === 'inventory'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const userInventory = inventory.filter(item => !item.custom.hidden)

        if (!userInventory.length) {
            return message.channel.send(`${message.author}, you don't have any items in your inventory.`)
        }

        const cleanInventory = [...new Set(userInventory.map(item => item.name))]
            .map(itemName => shop.find(shopItem => shopItem.name == itemName))
            .map(item => {
                const quantity = userInventory.filter(invItem => invItem.name == item.name).length

                return {
                    quantity,
                    totalPrice: item.price * quantity,
                    item
                }
            })

        message.channel.send(
            `${message.author}, here's your inventory \`${userInventory.length} items\`:\n\n` +
            cleanInventory
                .map(
                    (data, index) =>
                        `${index + 1} - x${data.quantity} ${data.item.custom.emoji} ` +
                        `**${data.item.name}** (ID: \`${data.item.id}\`) ` +
                        `for \`${data.totalPrice}\` coins`
                )
                .join('\n')
        )
    }
    else if (command === 'clear_inv' || command === 'clear_inventory'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        if(args[0] === 'confirm'){
        if (!inventory.length) {
            return message.channel.send(`${message.author}, you don't have any items in your inventory.`)
        }

        await user.inventory.clear()

        message.channel.send(
            `${message.author}, cleared **${inventory.length}** items from your inventory.`
        )
        }
        else{
            message.channel.send(`${message.author}, please type \`confirm\` if you wish to clear your entire inventory. This cannot be undone.\n*!clear_inv confirm*`)
        }
    }
    else if (command === 'history'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        //const userHistory = history.filter(item => !item.custom.hidden) [old way, uses cache. cache is broken.]
        const userHistory = user.history.get() // new way, gets directaly from data base.
        if (!(await userHistory).length) {
            return message.channel.send(`${message.author}, you don't have any items in your purchases history.`)
        }

        message.channel.send(
            `${message.author}, here's your purchase history [**${(await userHistory).length} items**]:\n\n` +
            (await userHistory).map(
                    item => `x${item.quantity} ${item.custom.emoji} **${item.name}** - ` +
                        `\`${item.price}\` coins. Purchased: \`${item.date}\``
                )
                .join('\n')
        )
    }
    else if (command === 'clear_history'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        if(args[0] === 'confirm'){
            const userHistory = user.history.get()
        if (!(await userHistory).length) {
            return message.channel.send(`${message.author}, you don't have any items in your purchases history.`)
        }

        await user.history.clear()

        message.channel.send(
            `${message.author}, cleared **${(await userHistory).length}** items from your purchases history.`
        )
        }
        else{
            message.channel.send(`${message.author}, please type \`confirm\` if you wish to clear your entire purchase history. This cannot be undone.\n*!clear_history confirm*`)
        }
    }
    else if (command === 'buy'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        if(args[0] === 'syntax'){
            return message.channel.send(`Syntax for \`!buy\` command:\n\`!buy\` \`{item ID}\` \`{item quantity}\``)
        }
        const [itemID, quantityString] = args
        const quantity = parseInt(quantityString) || 1

        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please specify an item.`)
        }

        if (!item || item?.custom?.hidden) {
            return message.channel.send(`${message.author}, the item either cannot be found, or it has been hidden by an admin.`)
        }

        if (item.custom.locked) {
            return message.channel.send(`:lock: ${message.author}, this item is locked - you cannot buy it.`)
        }

        if (!await item.isEnoughMoneyFor(message.author.id, quantity)) {
            return message.channel.send(
                `${message.author}, you don't have enough coins to buy ` +
                `x${quantity} \`${item.custom.emoji} ${item.name}\`.`
            )
        }

        const buyingResult = await user.items.buy(item.id, quantity)

        if (!buyingResult.status) {
            return message.channel.send(`:x: ${message.author}, failed to buy the item: \`${buyingResult.message}\``)
        }

        message.channel.send(
            `${message.author}, you bought x${buyingResult.quantity} ` +
            `${item.custom.emoji} \`${item.name}\` for \`${buyingResult.totalPrice}\` coins.`
        )
    }
    else if (command === 'use_item' || command === 'use'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const [itemID] = args
        const item = inventory.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please specify an item in your inventory.`)
        }

        if (!item || item?.custom?.hidden) {
            return message.channel.send(`${message.author}, the item either cannot be found, or it has been hidden by an admin.`)
        }

        if (item.custom.locked) {
            return message.channel.send(`:lock: ${message.author}, this item is locked - you cannot use it.`)
        }

        const resultMessage = await item.use(client)
        message.channel.send(`**Item ${item.id}**: ${resultMessage}`)
    }
    else if (command === 'sell'){
        if(ecoStatus === 'false') return message.channel.send(`${message.author}, the admin of ${message.guild.name} has disabled the economy plugin.`)
        infoMessage(message)
        const [itemID, quantityString] = args
        const quantity = parseInt(quantityString) || 1

        const item = inventory.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please specify an item in your inventory.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found in your inventory.`)
        }

        if (item.custom.locked) {
            return message.channel.send(`:lock: ${message.author}, this item is locked - you cannot sell it.`)
        }

        const sellingResult = await user.items.sell(item.id, quantity)

        if (!sellingResult.status) {
            return message.channel.send(`:x: ${message.author}, failed to sell the item: \`${sellingResult.message}\``)
        }

        message.channel.send(
            `${message.author}, you sold x${sellingResult.quantity} ` +
            `${item.custom.emoji} \`${item.name}\` for \`${sellingResult.totalPrice}\` coins.`
        )
    }
    else if(command === 'override'){
        if(message.author.id !== '547655594715381760') return console.log(`${message.author.tag} form server: ${message.guild.name} just attempted to run an override command, the attempt was blocked.`)

        const userID = message.mentions.users.first() || message.author

        try{
        if(args[0] === 'beg_cooldown'){
            await begCooldown.removeUser(userID.id)
            message.channel.send('Successfully executed override command.')
        }if(args[0] === 'steal_cooldown'){
            await stealCooldown.removeUser(userID.id)
            message.channel.send('Successfully executed override command.')
        }if(args[0] === 'dep_cooldown'){
            await depCooldown.removeUser(userID.id)
            message.channel.send('Successfully executed override command.')
        }if(args[0] === 'clear_temp_settings'){
            ttsChannel = null
            tts_text = null
            ttsOn = false
            ttsQueue = []
            ttsPlayerStatus = false
            musicOn = false
            message.channel.send('Successfully executed override command.')
        }
    } catch(err) {()=> {
        message.channel.send('Failed to execute override command, check the console for more details.')
        console.log(`An override command failed to execute, error: ${err}`)
    }}

    }
    else if(command === 'tts'){
        infoMessage(message)
        if(!message.member.voice.channel) return message.channel.send(`${message.author}, you myst be in a voice channel to use this command.`)
        if(musicOn === true) return message.reply(`You must stop music playback before starting TTS, use \`!stop\` to stop music playback.`)
        ttsChannel = message.channel.id
        tts_text = "Text to speach is ready, TTS will use the channel the command was ran in as the input channel."
        ttsOn = true
        message.channel.send(`TTS is now active, TTS commands and input are locked to ${message.channel}. ${message.member.nickname} User message rate of 5 seconds is active.`)
        message.channel.setRateLimitPerUser(5)
        tts(message)
    }
    else if(command === 'tts_off'){
        infoMessage(message)
        if(ttsOn === false) return message.channel.send(':x: TTS is alreay off, use `!leave` to disconnect the bot form a channel.')
        //let ttsChannelname = message.guild.channels.cache.get(ttsChannel)
        //if(message.channel.id !== ttsChannel) return message.channel.send(`:x: You must run this command in the current TTS channel, ${ttsChannelname}`)
        const connection = getVoiceConnection(message.guild.id);
        if(connection) {
          // Disconnect from the voice channel
          connection.destroy();
          voiceConnection = null
          message.channel.setRateLimitPerUser(0)
          ttsOn = false
          ttsChannel = null
          ttsPlayerStatus = false
          ttsQueue = []
          //console.log(`Disconnected from ${connection.joinConfig.channel.name} voice channel!`);
           message.channel.send(`TTS and channel message rate is off and I have left the voice channel! :wave:`);
        } else {
           message.channel.send(':x: Unable to comply, I am not currently connected to a voice channel.');
        }
    }
})

async function tts(message){
    if(tts_text.length > 200){
        tts_text = 'Error, text overload, please limit TTS messages to 200 characters or less'
        message.channel.send(`${message.author}, please limit TTS messages to 200 characters or less.`)
    }
    stream = discordTTS.getVoiceStream(tts_text);
    const audioResource=createAudioResource(stream, {inputType: StreamType.Arbitrary, inlineVolume:true});
        if(!voiceConnection || voiceConnection.status===VoiceConnectionStatus.Disconnected || voiceConnection.status===VoiceConnectionStatus.Destroyed){
            voiceConnection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
            voiceConnection=await entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
        }
        
        if(voiceConnection.status===VoiceConnectionStatus.Connected){
            voiceConnection.subscribe(audioPlayer);
            audioPlayer.play(audioResource);
            audioPlayer.once('playing', () => ttsPlayerStatus = audioPlayer.state.status)

            audioPlayer.once('idle', () => ttsPlayerStatus = audioPlayer.state.status)
            
        }
}

async function infoMessage(message){
    if(importantMessage === false) return
    const underCooldown = await moveMessageCooldown.getUser(message.author.id)
        if(underCooldown){
            return
        }
    function generateRandom(min = -50, max = 20) {

        // find diff
        let difference = max - min;
    
        // generate random number 
        let rand = Math.random();
    
        // multiply with difference 
        rand = Math.floor( rand * difference);
    
        // add with min value 
        rand = rand + min;
    
        return rand;
    }
    const chance = generateRandom()
    if(chance < 0 || chance === 0){
        await moveMessageCooldown.addUser(message.author.id)
        return
    }
    if(chance > 0){
		const UME = new EmbedBuilder()
            .setTitle('You have a message form the developers!')
            .setDescription(`Hey, ${message.author}, you have a important message from the developers.\nTo view the important announcement, use command \`/notice notice\` (or \`!notice notice\`).`)
            .setColor('#0059FF');
        message.reply({ embeds: [UME] });
        await moveMessageCooldown.addUser(message.author.id)
    }

}
client.login(process.env.BOT_USER_TOKEN)
 //4.10.0