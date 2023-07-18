const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const DIG = require("discord-image-generation");
const Toggle = require('../../Guild8')

module.exports = {
  // command options
  description: "Make a podium with 3 users",
  catagory: 'Image Commands',
  minArgs: 1,
  expectedArgs: "<user1> <user2> <user3>",
  expectedArgsTypes: ['USER', 'USER', 'USER'],
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
    },
    {
        name: 'user3',
        description: 'Select the third user',
        type: 6, // Set the option type to 6 (User mention)
        required: true,
    }
],
  
  // Create a legacy and slash command
  type: CommandType.SLASH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    const lockDown = true
    const lockDownEmbed = new EmbedBuilder()
    .setTitle('T.B.T.D.A Beta Test is retiring')
    .setDescription(`As you probabely know, T.B.T.D.A Beta Test is retiring. We are now around 1-2 days away form switching back to the original T.B.T.D.A. This means that untill the switch occurs, I (T.B.T.D.A Beta Test) will be unavailable.\n\nIf you still havn't added T.B.T.D.A yet, you can do so with [this link](https://discord.com/api/oauth2/authorize?client_id=712958160620748820&permissions=8&scope=bot).`)
    .setColor('#0059FF');

    if(lockDown === true){
      if(message){
        message.channel.send({ embeds: [lockDownEmbed] })
      }
      if(interaction){
        interaction.reply({ embeds: [lockDownEmbed] })
      }
      return
    }
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
    let toEdit3 = interaction.options.getMember('user3')
    // Get the avatarUrl of the user
    let avatar1 = toEdit1.displayAvatarURL({
        forceStatic: true,
        extension: 'png'
    });
    let avatar2 = toEdit2.displayAvatarURL({
        forceStatic: true,
        extension: 'png'
    });
    let avatar3 = toEdit3.displayAvatarURL({
        forceStatic: true,
        extension: 'png'
    });
    let name1 = toEdit1.displayName
    let name2 = toEdit2.displayName
    let name3 = toEdit3.displayName
    // Make the image
    let img = await new DIG.Podium().getImage(avatar1, avatar2, avatar3, name1, name2, name3);
    // Add the image as an attachement
    let embed = new EmbedBuilder()
        .setTitle("And the winners are...")
        .setColor('#8700FF')
        .setImage("attachment://blur.png");
    let attach = new AttachmentBuilder(img).setName("blur.png");
    interaction.reply({
        embeds: [embed],
        files: [attach]
    });
  },
}