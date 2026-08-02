export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export interface AIProvider {
    generateReply(message: string, history: ChatMessage[]): Promise<string>;
    generateReplyStream(
        message: string,
        history: ChatMessage[],
        onToken: (chunk: string) => void,
    ): Promise<string>; // tra ve full text sau khi stream xong, de luu DB
}