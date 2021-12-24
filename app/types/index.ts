export type PollData = {
  id?: string;
  question?: string;
  created_at?: string;
  updated_at?: string;
};

export type OptionData = {
  id?: number;
  poll_id?: string;
  value?: string;
  created_at?: string;
  updated_at?: string;
};

export type VoteData = {
  id?: number;
  poll_id?: string;
  option_id?: number;
  ip?: string;
  created_at?: string;
  updated_at?: string;
};
