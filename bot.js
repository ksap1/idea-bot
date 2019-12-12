const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
var Trello = require("trello");
var trello = new Trello("384c8844de75ae9224daf1f27055c5d8", "d566adcb05d29eb2a45a9403bd89211c1921f23068fd67ec1bdeb6977fb342d0");

const myListId= "5df08459fb765b14d62d6abc";

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

client.login(auth.token);