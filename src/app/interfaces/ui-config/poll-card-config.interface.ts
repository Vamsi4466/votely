export interface PollCardConfig{
    id: string;
    title: string;
    options: PollCardOption[];
    isOwner: boolean;
    hasVoted: boolean;
    dateCreated: Date;
    totalVotes: number;
}


export interface PollCardOption{
    name: string;
    count: number;
}