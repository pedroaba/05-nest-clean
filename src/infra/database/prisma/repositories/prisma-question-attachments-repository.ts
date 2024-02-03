import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    })

    return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    })
  }

  async createMany(attachments: QuestionAttachment[]) {
    if (attachments.length === 0) {
      return
    }

    await this.prisma.attachment.updateMany(
      PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments),
    )
  }

  async deleteMany(attachments: QuestionAttachment[]) {
    if (attachments.length === 0) {
      return
    }

    const attachmentIds = attachments.map((attachment) =>
      attachment.id.toString(),
    )

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    })
  }
}
