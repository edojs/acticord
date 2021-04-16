const Discord = require("discord.js");
const db = require("quick.db");
const cron = require("node-cron");

module.exports = async (client) => {
  console.log("<---------------- ACTICORD ---------------->");
  console.log("The bot is ready!");
  console.log("Server count: " + client.guilds.cache.size);
  console.log("Member count: " + client.users.cache.size);
  console.log("Channel count: " + client.channels.cache.size);
  console.log("<------------------------------------------>");
  
  setInterval(() => client.dbl.postStats(client.guilds.cache.size), 1800000);
  
  client.user.setActivity(client.config.name + " || " + client.config.prefix + "help");
  
  cron.schedule("0 0 * * Saturday", async() => {
    let channels = db.all().filter(data => data.ID.endsWith("_channel"));
    for(let i = 0; i < channels.length; i++) {
      let channeldb = await db.fetch(channels[i].ID);
      if(channeldb !== null) {
        let channel = client.channels.cache.get(channeldb) || await client.channels.fetch(channeldb);
        if(channel) {
          let embed = new Discord.MessageEmbed()
          .setTitle("Double Weekend event!")
          .setColor("#ffff00")
          .setDescription("**Happy weekend!**\nDouble XP is activated which will last till Monday!\n(grab yourself some XP)")
          .setImage("https://apis.eu.org/content/images/doubleweekend.png")
          .setFooter("Double Weekend | " + client.config.name, client.user.displayAvatarURL())
          .setTimestamp();
          
          channel.send(embed);
        }
      }
    }
    let stats = await db.all().filter(data => data.ID.startsWith("stats_"));
    for(let i = 0; i < stats.length; i++) {
      let gg = client.guilds.cache.get(stats[i].ID.split("_")[1]);
      if(gg) {
        let member = gg.members.cache.get(stats[i].ID.split("_")[2]);
        if(!member) db.delete(stats[i].ID);
      }
    }
  })
}