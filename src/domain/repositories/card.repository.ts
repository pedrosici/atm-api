import { Card } from '../entities/card.entity';

export interface CardRepository {
  findById(cardId: string): Promise<Card | null>;
  save(card: Card): Promise<void>;
}
