import { Injectable } from '@nestjs/common';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Library } from './entities/library.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class LibrarysService {
  constructor(
    @InjectRepository(Library)
    private readonly libraryRepository: Repository<Library>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.libraryRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      message: 'Library data fetched successfully',
      page,
      limit,
      total,
      hasMore: page * limit < total,
      data,
    };
  }

  async findOne(id: string) {
    const data = await this.libraryRepository.findOne({
      where: { id },
       relations: ['pricingPlans', 'features'],
    });

    return {
      message: 'Library fetched successfully',
      data,
    };
  }

  async findNearestLibraries(
    latitude: number,
    longitude: number,
    radius: number = 5,
    page: number = 1,
    limit: number = 10,
  ) {
    const distanceFormula = `
      (
        6371 * acos(
          cos(radians(:latitude)) *
          cos(radians(library.latitude)) *
          cos(radians(library.longitude) - radians(:longitude)) +
          sin(radians(:latitude)) *
          sin(radians(library.latitude))
        )
      )
    `;

    const qb = this.libraryRepository
      .createQueryBuilder('library')
      .addSelect(distanceFormula, 'distance')
      .setParameters({
        latitude,
        longitude,
      });

    const rawAndEntities = await qb.getRawAndEntities();

    const libraries = rawAndEntities.entities
      .map((library, index) => ({
        id: library.id,
        name: library.name,
        address: library.address,
        city: library.city,
        latitude: library.latitude,
        longitude: library.longitude,
        image: library.images?.[0] || null,
        distance: Number(rawAndEntities.raw[index].distance),
      }))
      .filter((item) => item.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    const total = libraries.length;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedLibraries = libraries.slice(startIndex, endIndex);

    return {
      message: `Libraries within ${radius} KM fetched successfully`,
      page,
      limit,
      total,
      hasMore: endIndex < total,
      data: paginatedLibraries.map((item) => ({
        ...item,
        distance: `${item.distance.toFixed(2)} KM`,
      })),
    };
  }

  async searchLibraries(
    q: string,
    page: number = 1,
    limit: number = 10,
  ) {
    if (!q) {
      return {
        message: 'Search query is required',
        page,
        limit,
        total: 0,
        hasMore: false,
        data: [],
      };
    }

    const [data, total] = await this.libraryRepository.findAndCount({
      where: [
        {
          name: ILike(`%${q}%`),
        },
        {
          city: ILike(`%${q}%`),
        },
        {
          address: ILike(`%${q}%`),
        },
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      message: 'Search results fetched successfully',
      page,
      limit,
      total,
      hasMore: page * limit < total,
      data,
    };
  }
}