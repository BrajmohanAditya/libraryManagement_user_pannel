import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BannerService {
 constructor (
  @InjectRepository(Banner)
  private readonly bannerRepo :Repository<Banner>

 ) {}

 async FindAll(){

  const banner = await this.bannerRepo.find()

  return {
    message : "find all banner",
    data : banner
  }

 }
}
