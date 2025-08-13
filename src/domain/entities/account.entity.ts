export class Account {
  constructor(
    public readonly id: string,
    public balance: number,
    public readonly type: 'debit' | 'credit',
    public creditLimit?: number,
    public withdrawLimit: number = 6000,
    public isCardActive: boolean = false
  ) {}

  canWithdraw(amount: number): boolean {
    if (!this.isCardActive) return false;

    if (this.type === 'debit') {
      return this.balance >= amount && amount <= this.withdrawLimit;
    }

    if (this.type === 'credit') {
      const availableCredit = (this.creditLimit ?? 0) - this.balance;
      return availableCredit >= amount && amount <= this.withdrawLimit;
    }

    return false;
  }

  applyWithdrawal(amount: number, commission: number = 0) {
    this.balance -= (amount + commission);
  }
}

