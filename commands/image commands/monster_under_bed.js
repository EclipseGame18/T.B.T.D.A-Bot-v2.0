const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const DIG = require("discord-image-generation");
const Toggle = require('../../Guild8')

module.exports = {
  // command options
  description: "Are you really scared of another user under your bed?",
  catagory: 'Image Commands',
  minArgs: 1,
  expectedArgs: "<user1> <user2>",
  expectedArgsTypes: ['USER', 'USER'],
  guildOnly: true,
  options: [
    {
      name: 'user1',
      description: 'Select the first user',
      type: 6, // Set the option type to 6 (User mention)
      required: true,
    },
    {
        name: 'user2',
        description: 'Select the second user',
        type: 6, // Set the option type to 6 (User mention)
        required: true,
      }
],
  
  // Create a legacy and slash command
  type: CommandType.SLASH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    let canUse
    const canUseCheck = await Toggle.findOne({_id: guild.id}).catch(error =>{
      console.log(`There was a error`)
    })
    if(!canUseCheck){
      await Toggle.findOneAndUpdate({
        _id: guild.id
        },{
        _id: guild.id,
        toggle: true,
            
        },{
            upsert: true
        })
        canUse = true
   }
   canUse = canUseCheck.toggle

   if(canUse !== 'true') return `${member}, the admin of ${guild.name} has disabled the Image Generation plugin.`
    let toEdit1 = interaction.options.getMember('user1')
    let toEdit2 = interaction.options.getMember('user2')
    // Get the avatarUrl of the user
    let avatar1 = toEdit1.displayAvatarURL({
        forceStatic: true,
        extension: 'png'
    });
    let avatar2 = toEdit2.displayAvatarURL({
        forceStatic: true,
        extension: 'png'
    });
    // Make the image
    let img = await new DIG.Bed().getImage(avatar1, avatar2);
    // Add the image as an attachement
    let embed = new EmbedBuilder()
        .setTitle("There is a monster under my bed!")
        .setColor('#8700FF')
        .setImage("attachment://blur.png");
    let attach = new AttachmentBuilder(img).setName("blur.png");
    interaction.reply({
        embeds: [embed],
        files: [attach]
    });
  },
}