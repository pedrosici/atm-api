export class Account {
  constructor(
    public readonly id: string,
    public balance: number,
    public readonly type: 'debit' | 'credit',
    public creditLimit?: number
  ) {}
}
