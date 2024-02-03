import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { expect } from 'vitest'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-student-repository'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentRepository: InMemoryStudentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentRepository = new InMemoryStudentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentRepository,
    )
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 18) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 23) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questions).toHaveLength(2)
  })
})
