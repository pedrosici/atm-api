export type CardType = 'debit' | 'credit';

export class Card {
  constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly bankId: string,
    public type: CardType,
    public isActive = false,
    public mustChangePin = false,
    public pinHash: string | null = null,
    public withdrawLimit = 1000
  ) {}
}
