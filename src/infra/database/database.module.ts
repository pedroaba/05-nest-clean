import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaQuestionCommentRepository } from './prisma/repositories/prisma-question-comment-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository'
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comment-repository'
import { PrismaAnswerAttachmentRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { StudentRepository } from '@/domain/forum/application/repositories/students-repository'
import { PrismaStudentRepository } from './prisma/repositories/prisma-students-repository'
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answers-comment-repository'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachment-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { PrismaNotificationRepository } from './prisma/repositories/prisma-notification-repository'
import { CacheModule } from '../cache/cache.module'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionRepository,
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentRepository,
    },
    {
      provide: QuestionCommentRepository,
      useClass: PrismaQuestionCommentRepository,
    },
    {
      provide: QuestionAttachmentRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswerRepository,
    },
    {
      provide: AnswerCommentRepository,
      useClass: PrismaAnswerCommentRepository,
    },
    {
      provide: AnswerAttachmentRepository,
      useClass: PrismaAnswerAttachmentRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    QuestionCommentRepository,
    QuestionAttachmentRepository,
    AnswersRepository,
    AnswerCommentRepository,
    AnswerAttachmentRepository,
    StudentRepository,
    AttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
