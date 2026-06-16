import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BannerService } from './banner.service';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}


  @Get()
  findAll() {
    return this.bannerService.FindAll();
  }

}
