import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';


@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }

  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

 @Get('library/:libraryId')
findByLibrary(
  @Param('libraryId') libraryId: string,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
) {
  return this.feedbackService.findByLibrary(
    libraryId,
    Number(page),
    Number(limit),
  );
}
}
