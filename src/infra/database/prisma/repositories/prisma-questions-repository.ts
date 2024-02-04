import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper'
import { DomainEvents } from '@/core/events/domain-events'
import { CacheRepository } from '@/infra/cache/cache-repository'

@Injectable()
export class PrismaQuestionRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentsRepository: QuestionAttachmentRepository,
    private cache: CacheRepository,
  ) {}

  async findBySlug(slug: string) {
    const cacheHit = await this.cache.get(`question:${slug}:details`)
    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit)

      return cachedData
    }

    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    })

    if (!question) {
      return null
    }

    const questionDetails = PrismaQuestionMapper.toDomain(question)
    this.cache.set(`question:${slug}:details`, JSON.stringify(questionDetails))

    return questionDetails
  }

  async findDetailsBySlug(slug: string) {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    })

    if (!question) {
      return null
    }

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)
    this.cache.set(`question:${slug}:details`, JSON.stringify(questionDetails))

    return questionDetails
  }

  async findById(id: string) {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findManyRecent({ page }: PaginationParams) {
    const perPage = 20

    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async create(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.create({
      data,
    })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.delete({
      where: {
        id: data.id,
      },
    })
  }

  async save(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question)

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
      this.cache.delete(`question:${data.slug}:details`),
    ])

    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
