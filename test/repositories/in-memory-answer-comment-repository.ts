import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answers-comment-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { InMemoryStudentsRepository } from './in-memory-student-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  public items: AnswerComment[] = []
  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )

    this.items.splice(itemIndex, 1)
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async findManyByAnswerIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        )

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()}" does not exists.`,
          )
        }

        return CommentWithAuthor.create({
          content: comment.content,
          commentId: comment.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        })
      })

    return answerComments
  }
}
