const fs = require("fs");
const yaml = require("yaml");
const Discord = require("discord.js");

var ON_DEATH = require('death')({uncaughtException: true}) 

const client = new Discord.Client();

const config = yaml.parse(fs.readFileSync("config.yaml", "utf8"));

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', (GuildMember) => {
    let Message = "Bienvenue <@!" + GuildMember.user.id + "> !\nJe suis Charles Louis Montesquieu, un philosophe et écrivain français des Lumières, qui a donné son nom à ton lycée, en outre...\nJ'aimerai bien connaître ton vrai nom, pour que les élèves et profs puissent plus facilement te reconnaitre...\nTu peux me le préciser en envoyant dans ce chat `!name TonPrenom TonNom`, en remplaçant bien sûr TonPrenom par ton prénom, et TonNom par ton nom. Ce message te donnera aussi le rôle élève. Si tu n'en souhaites pas, car tu es un prof, tu peux aussi envoyer dans ce chat `!prof`, pour demander à un délégué / modérateur de ce serveur de te vérifier.\nN'hésite pas à bien travailler sur ce serveur, même si la période actuelle est spéciale..."
    client.guilds.cache.find(guild => guild.id == config.MainGuild).systemChannel.send(Message)
});

client.on("message", (msg) => {
    if(msg.content.startsWith("!name ")){
        let name = msg.content.split("!name ")[1]
        client.guilds.cache.find(guild => guild.id == config.MainGuild).members.cache.find(member => member.user.id == msg.author.id).edit({
            nick : name,
            roles : [
                client.guilds.cache.find(guild => guild.id == config.MainGuild).roles.cache.find(role => role.id == config.EleveRole)
            ]
        })
    } else if(msg.content.startsWith("!prof")){
        let message = new Discord.MessageEmbed()
            .setColor("#b54387")
            .setTitle("Demande pour devenir prof")
            .setDescription(msg.author.tag + " a demandé d'avoir le rôle prof. Si vous acceptez, retirer lui son rôle élève...")
            .setThumbnail(msg.author.avatarURL)
            .setAuthor(client.user.tag, client.user.avatarURL)
            .setTimestamp(new Date())
        client.guilds.cache.find(guild => guild.id == config.MainGuild).channels.cache.find(channel => channel.id == config.VerificationChannel).send(message)
    }
})



ON_DEATH(() => {
    client.destroy();
})

client.login(config.token);
