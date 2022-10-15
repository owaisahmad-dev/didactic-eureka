import { App } from "@slack/bolt";
import { Message } from "@slack/web-api/dist/response/ConversationsRepliesResponse";

console.log(process.env.BOT_TOKEN, process.env.SIGNING_SECRET)

const app = new App({
  token: process.env.BOT_TOKEN,
  signingSecret: process.env.SIGNING_SECRET
})

export const SlackService = {
  getUserEmail: async (user_id: string, access_token: string) => {
    const res = await app.client.users.info({
      token: access_token,
      user: user_id,
    });

    return res.user.profile.email as string;
  },

  joinChannel: async (channel_id: string, access_token: string) => {
    const res = await app.client.conversations.join({
      channel: channel_id,
      token: access_token,
    });

    return res.ok;
  },
  leaveChannel: async (channel_id: string, access_token: string) => {
    const res = await app.client.conversations.leave({
      channel: channel_id,
      token: access_token,
    });

    return res.ok;
  },
  sendMessage: async (
    channel_id: string,
    text: string,
    access_token: string
  ) => {
    const res = await app.client.chat.postMessage({
      channel: channel_id,
      text,
      token: access_token,
    });

    return {ok:res.ok, ts: res.ts};
  },

  getThread: async (
    channel_id: string,
    ts: string,
    access_token: string
  ) => {
    const res = await app.client.conversations.replies({
      token: access_token,
      channel: channel_id,
      ts
    })

    let originalMessage: Message;
    let replies: Message[] = [];

    res.messages.forEach(msg => {
      if (msg.ts == ts){
        originalMessage = msg;
      }
      else {
        replies.push(msg);
      }
    })

    return {
      originalMessage,
      replies
    }
  }
};
