const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
var Trello = require("trello");
var trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN);

const myListId= process.env.TRELLO_LIST;

function newTrello(task){
    trello.addCard(task, 'Wax on, wax off', myListId,
    function (error, trelloCard) {
        if (error) {
            console.log('Could not add card:', error);
        }
        else {
            console.log('Added card:', trelloCard.name);
        }
    });
}

function listTrello(){
    return trello.getCardsOnList(myListId);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg)=>{
    const embed = new Discord.RichEmbed();
    if(msg.author.bot || msg.content.indexOf('-')!==0) return;
    const channel = client.channels.find('name',"project-ideas");
    const args = msg.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(command=="h"){
        channel.send("Commands:\n`-h`: help\n`-create [your idea]`: create new idea\n`-l`: list current ideas")
    }
    else if(command=="create"){
        setTimeout(()=>{
            const ide = args.join(' ');
            newTrello(ide);
            channel.send("`idea saved:`");
            channel.send(embed.setDescription(ide).setColor(0x34eb80));
        }, 1500);
    }
    else if(command=="l"){
        var names = listTrello();
        const arr = [];
        //channel.send(names.join('\n'));
        names.then((cards)=>{
            for(let [key,value] of Object.entries(cards)){
                arr.push(value.name);
            }  
        }).then((cards)=>{
            setTimeout(()=>{
                embed.setTitle(`Ideas`).setDescription('•'+arr.join('\n•')).setColor(0x34eb80);
                channel.send(embed);
            },1500);
        });
    }
    else{
        channel.send("Unrecognized, type `-h` for help");
    }
});

client.login(process.env.BOT_TOKEN);
