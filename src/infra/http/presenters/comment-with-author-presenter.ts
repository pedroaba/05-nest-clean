import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class CommentWithAuthorPresenter {
  static toHttp(commentWithAuthor: CommentWithAuthor) {
    return {
      id: commentWithAuthor.commentId.toString(),
      content: commentWithAuthor.content,
      createdAt: commentWithAuthor.createdAt,
      updatedAt: commentWithAuthor.updatedAt,
      authorName: commentWithAuthor.author,
      authorId: commentWithAuthor.authorId.toString(),
    }
  }
}
