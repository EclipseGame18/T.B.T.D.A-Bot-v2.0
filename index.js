const { Client, Events, GatewayIntentBits, Partials, messageLink, Message, EmbedBuilder } = require ('discord.js');

const { VoiceConnection, VoiceConnectionStatus, joinVoiceChannel } = require('@discordjs/voice');

const wokcommands = require('wokcommands');

const path = require('path');
require("dotenv/config");

const globalPrefix = ('!');

const mongo = require('./mongo');

const GuildPrefix = require('./Guild')

const ToggleAntiSware = require('./Guild2')

const GuildWelcome = require('./Guild3')

const GuildWelcomeChannel = require('./Guild4')

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
                                     partials: [Partials.Channel],
                        });


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

    new wokcommands({
        client,
        commandsDir: path.join(__dirname, 'commands'),
        showWarns: true,
        mongoUri: 'mongodb+srv://Bot_Agent:Minecraft18@bot-settings.miusd.mongodb.net/test?authSource=admin&replicaSet=atlas-udb06o-shard-0&readPreference=primary&ssl=true',
        
    })
})

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
                    const welcomemessagechannel = await GuildWelcomeChannel.findOne({_id: guild.id}).catch(error =>{
                        console.log(`There was a error: ${error}`)
                      })
                        const guildwelcome = await GuildWelcome.findOne({_id: guild.id}).catch(error =>{
                        console.log(`There was a error: ${error}`)
                      })
                      const toggleSware = await ToggleAntiSware.findOne({_id: guild.id}).catch(error =>{
                        console.log(`There was a error: ${error}`)
                      })
                        let guildwelcometoggle;
                        let welcomemessageschanneltoggle;
                        if(guildwelcome.message === ''){
                            guildwelcometoggle = '(nothing)'
                        }
                        if(welcomemessagechannel.channel === ''){
                            welcomemessageschanneltoggle = '(nothing)'
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
    console.log(`Joined ${guild.name} with ${guild.memberCount} users. ID: ${guild.id}\nAnti-swear: ${toggleSware.toggle}.\nWelcome message: ${guildwelcometoggle}.\nLog channel: ${welcomemessageschanneltoggle}.`)
    }, 2000);
});

client.on('messageCreate', async (message) => {
    if(message.author.bot) return;

    const prefix = '!';
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    const toggleSware = await ToggleAntiSware.findOne({_id: message.guild.id}).catch(error =>{
		console.log(`There was a error: ${error}`)
	})

	if(toggleSware === null){
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
		
		for (var i in blacklisted) {
			const user = message.author;
			
		 	if (message.content.toLowerCase().includes(whitelisted[i])){
		 		return
			 
		 	} else if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())){
				message.delete().catch(error =>{
					console.log(`Failed to delete blacklisted word sent by ${user.username} in ${message.guild.name}, ID: ${message.guild.id}`)
					message.channel.send(`:x: Failed to delete message, try checking my permissions.`)
				});
				message.channel.send(`${user}, Please don't use that language here!`).then(msg => {setTimeout(() => msg.delete(), 8000)})
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
    .setDescription(`I am ${client.user.username}, my defult prefix is either **/** or **!**. If you need help please join our [support server.](https://discord.gg/3mkKSGw)`)
    .setColor('#00B9FF')
    message.channel.send({embeds: [ping]})
  }


    if(!message.content.startsWith(prefix)) return;
    const guildQueue = client.player.getQueue(message.guild.id);

    args[0];
    if(command == 'play'){
        if (!message.member.voice.channel) {
            return message.reply(":x: Unable to comply, you need to be in a voice channel to use this command.");
          }
        message.channel.send(`Searching for: \`${args.join(' ')}\``)
        let queue = client.player.createQueue(message.guild.id, {
            data: {
                queueInitMessage: message,
                requestedBy: message.author.username
                }
        });
        await queue.join(message.member.voice.channel);
        let song = await queue.play(args.join(' ')).catch(err => {
            console.log(`A DMP error occured: ` + err);
            message.channel.send('Unable to continue playback, an unknown error occured. :shrug:')
            if(!guildQueue)
                queue.stop();
                message.channel.send(':x: There was either a error playing the song or there was no song matching the query.\nPlease try that query again later.')

        });
    }
    else if(command == 'playlist'){
        if (!message.member.voice.channel) {
            return message.reply(":x: Unable to comply, you need to be in a voice channel to use this command.");
          }
        message.channel.send(`Searching for: \`${args.join(' ')}\``)
        let queue = client.player.createQueue(message.guild.id, {
            data: {
                queueInitMessage: message,
                requestedBy: message.author.username
                }
        });
        await queue.join(message.member.voice.channel);
        let song = await queue.playlist(args.join(' ')).catch(err => {
            console.log(`A DMP error occured: ` + err);
            message.channel.send('Unable to continue playback, an unknown error occured. :shrug:')
            if(!guildQueue)
                queue.stop();
                message.channel.send(':x: There was either a error playing the playlist or there was no playlist matching the query. Please try that query later.')
        });
    }
    else if(command == 'skip'){

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
        try{
            guildQueue.stop()
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
})
client.login(process.env.BOT_USER_TOKEN)
 //4.10.0