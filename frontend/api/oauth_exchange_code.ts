import { app } from "../components/slack-app";

export const oauthExchangeCode = (code: string, redirect_uri: string) => {
  return app.client.oauth.v2.access({
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string,
    client_secret: process.env.CLIENT_SECRET as string,
    code: code,
    redirect_uri,
  });
};
