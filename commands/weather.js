const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const weather = require('weather-js');

module.exports = {
  // command options
  description: "Gets the weather for a specified location.",
  catagory: 'Utility Commands',
  minArgs: 1,
  expectedArgs: "[weather location]",
  guildOnly: false,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, text, guild, user, member }) => {
    weather.find({
        search: text,
        degreeType: 'C'
    }, function(error, result) {
        if (error) return(error);
        if (!args[0]) return('Please specify a location to lookup the weather.')

        if(!result[0] || !result[0].current){
            if(message){
                message.channel.send('ERROR: Invalid location, try:`/weather {city}`.')
            }
            if(interaction){
                interaction.reply('ERROR: Invalid location, try:`/weather {city}`.')
            }
            return
        }

        var current = result[0].current;
        var location = result[0].location;

        const weatherinfo = new EmbedBuilder()
            .setTitle(`Weather fortcast for ${current.observationpoint}`)
            .setDescription(`${current.skytext}`)
            .setThumbnail(current.imageUrl)
            .setColor('#FF00E4')
            .addFields(
                {name: "Timezone", value: `UTC${location.timezone}`, inline: true},
                {name: 'Day', value: `${current.day}`, inline: true},
                {name: 'Degree Type', value: 'Celsius', inline: true},
                {name: 'Tempreture', value: `${current.temperature}°C`, inline: true},
                {name: 'Wind', value: `${current.winddisplay}`, inline: true},
                {name: 'Feels Like', value: `${current.feelslike}°C`, inline: true},
                {name: 'Humidity', value: `${current.humidity}%`, inline: true}
            )
            .setTimestamp();

        if(message){
            message.channel.send({embeds: [weatherinfo]});
        }
        if(interaction){
            interaction.reply({embeds: [weatherinfo]});
        }
    });
    
  },
}