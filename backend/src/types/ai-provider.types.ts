export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}
export interface AIProvider {
    generateReply(message: string, history: ChatMessage[]): Promise<string>;
}
