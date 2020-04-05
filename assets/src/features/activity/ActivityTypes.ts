type Message = {
  name: string;
  text: string;
};

type Answer = {
  id: string;
};

export type ActivityState = {
  messages: Message[];
  answers: Answer[];
};
