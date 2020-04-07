export type Message = {
  name: string;
  text: string;
};

type Vote = {
  answerId: string;
  userId: string;
};

export type Member = {
  id: string;
  name: string;
  votedAnswerId: string;
};

export type ActivityState = {
  messages: Message[];
  votes: Vote[];
  members: Member[];
};
