import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Library } from 'src/librarys/entities/library.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepo: Repository<Feedback>,

    @InjectRepository(Library)
    private readonly libraryRepo: Repository<Library>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async create(dto: CreateFeedbackDto) {
    try {

      const library = await this.libraryRepo.findOne({
        where: {
          id: dto.libraryId,
        },
      });

      if (!library) {
        throw new BadRequestException('Library not found');
      }

      const user = await this.userRepo.findOne({
        where: {
          id: dto.userId,
        },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const feedback = this.feedbackRepo.create(dto);

      const data = await this.feedbackRepo.save(feedback);

      return {
        message: 'Feedback added successfully',

        data,
      };

    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }


async findByLibrary(
  libraryId: string,
  page: number = 1,
  limit: number = 10,
) {
  const [feedbacks, total] = await this.feedbackRepo.findAndCount({
    where: {
      library: {
        id: libraryId,
      },
    },
    relations: ['user'],
    order: {
      createdAt: 'DESC',
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const ratings = await this.feedbackRepo.find({
    where: {
      library: {
        id: libraryId,
      },
    },
    select: ['rating'],
  });

  const totalRatings = ratings.reduce(
    (sum, item) => sum + Number(item.rating),
    0,
  );

  const averageRating =
    ratings.length > 0
      ? totalRatings / ratings.length
      : 0;

  return {
    message: 'Library feedback retrieved successfully',
    page,
    limit,
    totalFeedbacks: total,
    averageRating: Number(averageRating.toFixed(1)),
    hasMore: page * limit < total,
    data: feedbacks,
  };
}

  async remove(id: string) {
    try {
      const isMatch = await this.feedbackRepo.findOne({ where: { id } })

      if (!isMatch) {
        throw new BadRequestException("message not found")
      }

      await this.feedbackRepo.delete(id)

      return {
        message: "message delete sucessfully"
      }

    } catch (error) {

      throw new InternalServerErrorException(error)

    }
  }

}
