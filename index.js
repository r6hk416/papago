const Discord = require("discord.js")
const intent_list = new Discord.Intents(["GUILD_MEMBERS", "GUILD_MESSAGES", "GUILDS", "GUILD_INVITES"])
const client = new Discord.Client({ ws: { intents: intent_list } })
const token = process.argv.length == 2 ? process.env.token : "" // heroku를 사용하지 않을꺼라면 const token = "디스코드 봇 토큰" 으로 바꿔주세요.
const welcomeChannelName = "안녕하세요" // 입장 시 환영메시지를 전송 할 채널의 이름을 입력하세요.
const byeChannelName = "안녕히가세요" // 퇴장 시 메시지를 전송 할 채널의 이름을 입력하세요.
const welcomeChannelComment = "어서오세요." // 입장 시 전송할 환영메시지의 내용을 입력하세요.
const byeChannelComment = "안녕히가세요." // 퇴장 시 전송할 메시지의 내용을 입력하세요.

client.on("ready", () => {
  console.log("켰다.")
  client.user.setPresence({ activity: { name: "!help를 쳐보세요." }, status: "online" })
})

client.on("guildMemberAdd", (member) => {
  const guild = member.guild
  const newUser = member.user
  const welcomeChannel = guild.channels.cache.find((channel) => channel.name == welcomeChannelName)

  welcomeChannel.send(`<@${newUser.id}> ${welcomeChannelComment}\n`) // 올바른 채널명을 기입하지 않았다면, Cannot read property 'send' of undefined; 오류가 발생합니다.
  member.roles.add(guild.roles.cache.find((role) => role.name === roleName).id)
})

client.on("guildMemberRemove", (member) => {
  const guild = member.guild
  const deleteUser = member.user
  const byeChannel = guild.channels.cache.find((channel) => channel.name == byeChannelName)

  byeChannel.send(`<@${deleteUser.id}> ${byeChannelComment}\n`) // 올바른 채널명을 기입하지 않았다면, Cannot read property 'send' of undefined; 오류가 발생합니다.
})

client.on("message", (message) => {
  if (message.author.bot) return

  if (message.content == "ping") {
    return message.reply("pong")
  }

  if (message.content == ".Kim서버정보") {
    let img = "https://cdn.discordapp.com/attachments/797054999401725962/800629175324639252/papago.gif"
    let embed = new Discord.MessageEmbed()
      .setTitle("정보")
      .setURL("http://www.naver.com")
      .setAuthor("디스코드", img, "http://www.naver.com")
      .setThumbnail(img)
      .addField("개설일", "2021년1월18일")
      .addField("분류", "게임", true)
      .addField("구체적분류", "콜오브듀티", true)
      .addField("서버규칙", "https://discord.com/channels/800607585849311242/800618651698593843/800618673768628255", true)
      .addField("기타사항", "신생서버입니다\n콜오브듀티 워존합니다\n\n")
      .setTimestamp()
      .setFooter("제작자R6_HK416", img)

    message.channel.send(embed)
  } 
  
  if (message.content == "!제작자모드") {
    let img = "https://cdn.discordapp.com/attachments/756326812841279572/800646741099020328/giphy.gif"
    let embed = new Discord.MessageEmbed()
    .setTitle("제작자")
    .addField(img)
    .addField("제작자모드", "승인완료")
    message.channel.send(embed)
  }

  if (message.content === '!코로나') {
    let url = "https://apiv2.corona-live.com/stats.json"
    request(url, (error, response, body) => {
        let overview = JSON.parse(response.body).overview;
        overview = {
            total_confirmed_person: overview.confirmed[0], // 총 확진자수
            yesterday_confirmed_person: overview.confirmed[1], // 어제 확진자수
    
            current_confirmed_person: overview.current[0], // 현재 확진자수
            current_confirmed_person_diff: overview.current[1], // diff(어제 이 시간대 확진자 수 - 현재 이 시간대 확진자 수)
        }
    
        let embed = new Discord.MessageEmbed()
        embed.setTitle('코로나 라이브 홈페이지')
        embed.setURL('https://corona-live.com')
        embed.setColor('#FF8000')
        embed.setDescription('코로나 정보입니다')
        embed.addField(`대한민국 총 확진자 수`, `${overview.total_confirmed_person}명`, true)
        embed.addField(`어제 확진자 수`, overview.yesterday_confirmed_person + `명`, true)
        embed.addField(`오늘 확진자 수`, overview.current_confirmed_person + `명`, true)
        // embed.addField(`오늘 어제지금시간   -   현재지금시간의 확진자`, overview.current_confirmed_person_diff + `명`, true)
        message.channel.send(embed)
    
      })
    }
  
  else if (message.content == "Kim도움말") {
    let helpImg = "https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png"
    let commandList = [
      { name: "kim도움말", desc: "명령어 표시" },
      { name: "ping", desc: "현재 핑 상태" },
      { name: "kim서버정보", desc: "서버정보표시" },
      { name: "kim전체공지", desc: "dm으로 전체 공지 보내기" },
      { name: "kim전체공지2", desc: "dm으로 전체 embed 형식으로 공지 보내기" },
      { name: ".kim 챗청소", desc: "텍스트 지움" },
      { name: ".kim초대코드", desc: "해당 채널의 초대 코드 표기" },
      { name: ".kim코드2", desc: "봇이 들어가있는 모든 채널의 초대 코드 표기" },
    ]
    let commandStr = ""
    let embed = new Discord.MessageEmbed().setAuthor("Help of 파파고 BOT", helpImg).setColor("#186de6").setFooter(`콜라곰 BOT ❤️`).setTimestamp()

    commandList.forEach((x) => {
      commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`
    })

    embed.addField("Commands: ", commandStr)

    message.channel.send(embed)
  } else if (message.content == "!초대코드2") {
    client.guilds.cache.array().forEach((x) => {
      x.channels.cache
        .find((x) => x.type == "text")
        .createInvite({ maxAge: 0 }) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
        .then((invite) => {
          message.channel.send(invite.url)
        })
        .catch((err) => {
          if (err.code == 50013) {
            message.channel.send(`**${x.channels.cache.find((x) => x.type == "text").guild.name}** 채널 권한이 없어 초대코드 발행 실패`)
          }
        })
    })
  } else if (message.content == "!초대코드") {
    if (message.channel.type == "dm") {
      return message.reply("dm에서 사용할 수 없는 명령어 입니다.")
    }
    message.guild.channels.cache
      .get(message.channel.id)
      .createInvite({ maxAge: 0 }) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
      .then((invite) => {
        message.channel.send(invite.url)
      })
      .catch((err) => {
        if (err.code == 50013) {
          message.channel.send(`**${message.guild.channels.cache.get(message.channel.id).guild.name}** 채널 권한이 없어 초대코드 발행 실패`)
        }
      })
  } else if (message.content.startsWith("!전체공지2")) {
    if (checkPermission(message)) return
    if (message.member != null) {
      // 채널에서 공지 쓸 때
      let contents = message.content.slice("!전체공지2".length)
      let embed = new Discord.MessageEmbed().setAuthor("공지 of 콜라곰 BOT").setColor("#186de6").setFooter(`콜라곰 BOT ❤️`).setTimestamp()

      embed.addField("공지: ", contents)

      message.member.guild.members.cache.array().forEach((x) => {
        if (x.user.bot) return
        x.user.send(embed)
      })

      return message.reply("공지를 전송했습니다.")
    } else {
      return message.reply("채널에서 실행해주세요.")
    }
  } else if (message.content.startsWith("!전체공지")) {
    if (checkPermission(message)) return
    if (message.member != null) {
      // 채널에서 공지 쓸 때
      let contents = message.content.slice("!전체공지".length)
      message.member.guild.members.cache.array().forEach((x) => {
        if (x.user.bot) return
        x.user.send(`<@${message.author.id}> ${contents}`)
      })

      return message.reply("공지를 전송했습니다.")
    } else {
      return message.reply("채널에서 실행해주세요.")
    }
  } else if (message.content.startsWith(".kim 챗청소")) {
    if (message.channel.type == "dm") {
      return message.reply("dm에서 사용할 수 없는 명령어 입니다.")
    }

    if (message.channel.type != "dm" && checkPermission(message)) return

    var clearLine = message.content.slice(".kim 챗청소".length)
    var isNum = !isNaN(clearLine)

    if (isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
      return
    } else if (!isNum) {
      // c @나긋해 3
      if (message.content.split("<@").length == 2) {
        if (isNaN(message.content.split(" ")[2])) return

        var user = message.content.split(" ")[1].split("<@!")[1].split(">")[0]
        var count = parseInt(message.content.split(" ")[2]) + 1
        let _cnt = 0

        message.channel.messages.fetch().then((collected) => {
          collected.every((msg) => {
            if (msg.author.id == user) {
              msg.delete()
              ++_cnt
            }
            return !(_cnt == count)
          })
        })
      }
    } else {
      message.channel
        .bulkDelete(parseInt(clearLine) + 1)
        .then(() => {
          message.channel.send(`<@${message.author.id}> ${parseInt(clearLine)} 개의 메시지를 삭제했습니다. (이 메시지는 잠시 후 사라집니다.)`).then((msg) => msg.delete({ timeout: 3000 }))
        })
        .catch(console.error)
    }
  }
})

function checkPermission(message) {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> 명령어를 수행할 관리자 권한을 소지하고 있지않습니다.`)
    return true
  } else {
    return false
  }
}

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str
  limitLen -= tmp.length

  for (let i = 0; i < limitLen; i++) {
    tmp += " "
  }

  return tmp
}

client.login(token)
