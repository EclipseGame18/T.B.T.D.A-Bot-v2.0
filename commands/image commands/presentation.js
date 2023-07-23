const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const DIG = require("discord-image-generation");
const Toggle = require('../../Guild8')

module.exports = {
  // command options
  description: "Make Lisa's presentation for her",
  catagory: 'Image Commands',
  minArgs: 1,
  expectedArgs: "<text>",
  expectedArgsTypes: ['STRING'],
  guildOnly: true,
  options: [
    {
      name: 'text',
      description: "Enter the text to post on Lisa's presentation (max 300 characters)",
      type: 3, // Set the option type to 6 (User mention)
      required: true,
    }
],
  
  // Create a legacy and slash command
  type: CommandType.SLASH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, text, guild, user, member }) => {
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
    if(text.length > 300) return `:x: Lisa's presentation can only have up to 300 characters`
    // Get the avatarUrl of the user
    
    // Make the image
    let img = await new DIG.LisaPresentation().getImage(text);
    // Add the image as an attachement
    let embed = new EmbedBuilder()
        .setTitle("She does make a good point...")
        .setColor('#8700FF')
        .setImage("attachment://blur.png");
    let attach = new AttachmentBuilder(img).setName("blur.png");
    interaction.reply({
        embeds: [embed],
        files: [attach]
    });
  },
}