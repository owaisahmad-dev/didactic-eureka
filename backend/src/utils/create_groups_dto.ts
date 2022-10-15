import { Message } from "@slack/web-api/dist/response/ConversationsRepliesResponse";

type CreateGroupDto = {
    user_id: string,
    answers: string[]
}[];

export const create_groups_dto = (originalMessage: Message, replies: Message[]) => {
    const reply_users = originalMessage.reply_users;
    const dto: CreateGroupDto = [];

    const users_replies = {};
    reply_users.forEach(user => {
        users_replies[user] = []
    });
    
    replies.forEach(reply => {
        reply_users[reply.user].push(reply.text);
    })

    for(const user in users_replies){
        dto.push({
            user_id: user,
            answers: users_replies[user]
        })
    }

    return dto;
}