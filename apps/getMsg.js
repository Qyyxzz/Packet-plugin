import {
  getMsg as get,
  replacer
} from '../model/PacketHelper.js'
import common from '../../../lib/common/common.js'

export class getMsg extends plugin {
  constructor() {
    super({
      name: "取消息",
      event: "message",
      priority: 1000,
      rule: [{
        reg: "^#?取$",
        fnc: "get"
      }]
    })
  }

  async get(e) {
    if (!e.reply_id) return e.reply("请回复要取的消息")
    const reply = (await e.bot.sendApi('get_msg', {
      message_id: e.reply_id
    }))?.data
    const data = await get(
      e,
      reply.real_seq ?? e.reply_id,
      !!reply.real_seq
    )
    const del = ["37", "9", "16"]
    const elems = (data["3"]?.["6"]?.["3"]?.["1"]?.["2"] ?? []).filter(i => !del.includes(Object.keys(i)?.[0]))

    const user = reply.sender
    const messages = [{
        name: "msg array",
        content: reply.message
      },
      {
        name: "msg raw",
        content: reply
      },
      {
        name: "pb elem",
        content: elems.length ? elems : ["无elem元素"]
      },
      {
        name: "pb raw",
        content: data
      }
    ].map(i => ({
      type: "node",
      data: {
        uin: user.user_id,
        name: user.nickname,
        content: [{
          type: "node",
          data: {
            uin: user.user_id,
            name: user.nickname,
            content: [{
              type: "text",
              data: {
                text: JSON.stringify(i.content, i.name.startsWith("pb") ? replacer : null, 2)
              }
            }]
          }
        }],
        source: i.name
      }
    }))

    e.isGroup ? e.bot.sendApi('send_group_forward_msg', {
      'group_id': e.group_id,
      messages
    }) : e.bot.sendApi('send_private_forward_msg', {
      'user_id': e.user_id,
      messages
    })
  }
}