export type MovementType = 'deposit' | 'withdrawal' | 'commission' | 'transfer_in' | 'transfer_out';

export class Movement {
  constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly type: MovementType,
    public readonly amount: number,
    public readonly date: Date
  ) {}
}
