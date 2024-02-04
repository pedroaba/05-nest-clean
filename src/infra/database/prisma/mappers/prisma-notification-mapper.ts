import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Notification as PrismaNotification, Prisma } from '@prisma/client'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        readAt: raw.readAt,
        createdAt: raw.createdAt,
        recipientId: new UniqueEntityID(raw.recipientId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      content: notification.content,
      createdAt: notification.createdAt,
      title: notification.title,
      readAt: notification.readAt,
    }
  }
}
