import { App } from "@slack/bolt";

const app = new App({
  token: process.env.BOT_TOKEN,
  signingSecret: process.env.SIGNING_SECRET,
});

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

    return res.ok;
  },
};
