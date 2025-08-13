import { CardRepository } from '../../domain/repositories/card.repository';
import { Card } from '../../domain/entities/card.entity';

export class CardInMemoryRepository implements CardRepository {
  private cards: Card[] = [
    new Card('CARD1', '1', 'BANKA', 'debit', false, false, null, 1000),
  ];

  async findById(cardId: string): Promise<Card | null> {
    return this.cards.find(c => c.id === cardId) ?? null;
  }
  async save(card: Card): Promise<void> {
    const i = this.cards.findIndex(c => c.id === card.id);
    if (i >= 0) this.cards[i] = card; else this.cards.push(card);
  }
}
