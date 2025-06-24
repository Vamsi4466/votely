export interface CreatePoll{
    pollId?: string;
    title: string;
    options: CreatePollOptions[];
    isActive: boolean;
    ownerId: string;
    voters: CreatePollVoters[];
    createdDate: Date
}

export interface CreatePollOptions{
    name: string;
    count: number;
}

export interface CreatePollVoters{
    name: string;
    optionId: number;
    userId: string;
    userName: string;
}
