import {
  Question as PrismaQuestion,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      author: raw.author.name,
      authorId: new UniqueEntityID(raw.authorId),
      questionId: new UniqueEntityID(raw.id),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      slug: Slug.create(raw.slug),
      title: raw.title,
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityID(raw.bestAnswerId)
        : null,
    })
  }
}
