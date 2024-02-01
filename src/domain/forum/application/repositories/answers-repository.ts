import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { PaginationParams } from '@/core/repositories/pagination-params'

export abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<void>
  abstract delete(answer: Answer): Promise<void>
  abstract save(question: Answer): Promise<void>
  abstract findById(id: string): Promise<Answer | null>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>
}
