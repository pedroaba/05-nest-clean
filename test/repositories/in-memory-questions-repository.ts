import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { DomainEvents } from '@/core/events/domain-events'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { InMemoryStudentsRepository } from './in-memory-student-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentRepository: QuestionAttachmentRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentRepository: InMemoryStudentsRepository,
  ) {}

  async create(question: Question) {
    this.items.push(question)
    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)
    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question
    await this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentRepository.items.find((student) => {
      return student.id.equals(question.authorId)
    })

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exists.`,
      )
    }

    const questionAttachments =
      await this.questionAttachmentRepository.findManyByQuestionId(
        question.id.toString(),
      )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId)
      })

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exists.`,
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      attachments,
      author: author.name,
      authorId: question.authorId,
      content: question.content,
      createdAt: question.createdAt,
      slug: question.slug,
      title: question.title,
      bestAnswerId: question.bestAnswerId,
      updatedAt: question.updatedAt,
    })
  }
}
