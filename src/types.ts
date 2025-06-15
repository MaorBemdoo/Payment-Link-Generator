export type FormValues = {
  currency: string;
  amount: string;
  description: string;
  expiryDate: string;
};

export type FormErrors = Partial<Record<keyof FormValues, string>>;

export type Currency =  {
    emoji: string;
    key: string;
    symbol: string;
    value: string;
}