const { CommandType } = require("wokcommands");
const { PermissionFlagsBits } = require('discord.js')

module.exports = {
  // command options
  description: "Play RPS with the bot!",
  catagory: 'Fun Commands',
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: "[Rock  Paper  Scissors]",
  guildOnly: false,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the ping command
  callback: async ({ message, client, channel, interaction, options, args, guild, user }) => {

    const acceptedReplies = ['rock', 'paper', 'scissors'];
    const random = Math.floor((Math.random() * acceptedReplies.length));
    const result = ['rock', 'paper', 'scissors'][random];
    const acceptedRepliesfake = ['rock', 'paper', 'scissors', 'gun'];

    const choice = args[0];
    if (!choice) return(`How to play: \`/rps <rock|paper|scissors>\``);
    if (!acceptedRepliesfake.includes(choice)) return(`Only these responses are accepted: \`<rock|paper|scissors>\``)

    if (result === choice) return("It's a tie! We had the same choice.");

    switch (choice) {
        case 'rock':
            {
                if (result === 'paper') return(`I chose **paper** and you chose **${choice}**, I won!`);
                else return(`You won! I chose **${result}**`);
            }
        case 'paper':
            {
                if (result === 'scissors') return(`I chose **scissors** and you chose **${choice}**, I won!`);
                else return(`You won! I chose **${result}**`);
            }
        case 'scissors':
            {
                if (result === 'rock') return(`I chose **rock** and you chose **${choice}**, I won!`);
                else return(`You won! I chose **${result}**`);
            }
        case 'gun':
            {
                return('Nooo! You win, you win please don\'t shoot me!');
            }
        default:
            {
                return(`Only these responses are accepted: \`<rock|paper|scissors>\``)
            }
    }
      
  },
}