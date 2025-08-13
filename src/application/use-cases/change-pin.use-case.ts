import { CardRepository } from '../../domain/repositories/card.repository';
import { hashPin, verifyPin } from '../../infrastructure/security/pin-hasher';

export class ChangePinUseCase {
  constructor(private readonly cards: CardRepository) {}

  async execute(cardId: string, input: { oldPin?: string; newPin: string }) {
    const card = await this.cards.findById(cardId);
    if (!card) throw new Error('CARD_NOT_FOUND');
    if (!card.isActive) throw new Error('CARD_NOT_ACTIVE');

    if (card.mustChangePin) {
    } else {
      if (!card.pinHash) throw new Error('PIN_NOT_SET');
      if (!input.oldPin) throw new Error('OLD_PIN_REQUIRED');
      const ok = await verifyPin(input.oldPin, card.pinHash);
      if (!ok) throw new Error('OLD_PIN_INVALID');
    }

    card.pinHash = await hashPin(input.newPin);
    card.mustChangePin = false;
    await this.cards.save(card);
    return { cardId: card.id, mustChangePin: card.mustChangePin };
  }
}
