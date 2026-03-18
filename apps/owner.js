
export class owner extends plugin {
  constructor() {
    super({
      name: "owner",
      dsc: "谋取篡位",
      event: "message",
      priority: 0,
      rule: []
    })
  }

  async accept(e) {
    const _reply = e.reply
    if (e.bot?.version?.app_name === 'NapCat.Onebot') e.reply = async (msg, ...other) => {
      const text = (typeof msg === "string") ? msg : false
      const packet = [{
          "37": {
            "19": {
              "4": 400
            }
          }
        },
        {
          "1": {
            "1": text
          }
        }
      ]
      if (text) Packet.Elem(e, packet)
      else return _reply(msg, ...other)
    }
  }
}