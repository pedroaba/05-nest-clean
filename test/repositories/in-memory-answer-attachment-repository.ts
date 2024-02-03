import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentRepository
{
  public items: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    )

    return answerAttachments
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (answerAttachment) => answerAttachment.answerId.toString() !== answerId,
    )

    this.items = answerAttachments
  }

  async createMany(attachments: AnswerAttachment[]) {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: AnswerAttachment[]) {
    const answerAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = answerAttachments
  }
}
