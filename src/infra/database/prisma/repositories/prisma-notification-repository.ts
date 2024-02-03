import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaNotificationRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  findById(_id: string): Promise<Notification | null> {
    throw new Error('Method not implemented.')
  }

  create(_notification: Notification): Promise<void> {
    throw new Error('Method not implemented.')
  }

  save(_notification: Notification): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
