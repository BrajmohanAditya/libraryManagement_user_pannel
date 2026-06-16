import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Library } from 'src/librarys/entities/library.entity';
import { Banner } from 'src/banner/entities/banner.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Library)
        private readonly libraryRepo: Repository<Library>,

        @InjectRepository(Banner)
        private readonly bannerRepo: Repository<Banner>,

        @InjectRepository(Feedback)
        private readonly feedbackRepo: Repository<Feedback>,
    ) { }

    private calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
    ): number {
        const R = 6371;

        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return Number((R * c).toFixed(2));
    }

    async getDashboard(
        userLat: number,
        userLng: number,
        page = 1,
        limit = 10,
    ) {
        const [libraries, banners, feedbacks] = await Promise.all([
            this.libraryRepo.find(),
            this.bannerRepo.find(),
            this.feedbackRepo.find({
                relations: ['library'],
            }),
        ]);

        const libraryRatings: Record<
            string,
            {
                total: number;
                count: number;
            }
        > = {};

        for (const feedback of feedbacks) {
            if (!feedback.library) continue;

            const libraryId = feedback.library.id;

            if (!libraryRatings[libraryId]) {
                libraryRatings[libraryId] = {
                    total: 0,
                    count: 0,
                };
            }

            libraryRatings[libraryId].total += Number(feedback.rating);
            libraryRatings[libraryId].count += 1;
        }

        const librariesWithDetails = libraries.map((library) => {
            const ratingData = libraryRatings[library.id];

            const averageRating = ratingData
                ? Number((ratingData.total / ratingData.count).toFixed(1))
                : 0;

            const totalReviews = ratingData?.count || 0;

            const distance = this.calculateDistance(
                Number(userLat),
                Number(userLng),
                Number(library.latitude),
                Number(library.longitude),
            );

            return {
                id: library.id,
                name: library.name,
                address: library.address,
                city: library.city,
                state: library.state,
                images: library.images,
                openingTime: library.openingTime,
                closingTime: library.closingTime,
                latitude: library.latitude,
                longitude: library.longitude,

                averageRating,
                totalReviews,
                distance,

                
            };
        });

        const bannerResponse = banners.map((banner: any) => {
            const library = librariesWithDetails.find(
                (lib) => lib.id === banner.libraryId,
            );

            return {
                id: banner.id,
                image: banner.image,
                createdAt: banner.createdAt,
                libraryId: banner.libraryId,

                library: library
                    ? {
                        id: library.id,
                        name: library.name,
                        city: library.city,
                        averageRating: library.averageRating,
                        totalReviews: library.totalReviews,
                    }
                    : null,
            };
        });

        const nearestLibraries = [...librariesWithDetails]
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);

        const topLibraries = [...librariesWithDetails]
            .filter(
                (library) =>
                    library.totalReviews > 0 &&
                    library.averageRating >= 4.2,
            )
            .sort((a, b) => {
                if (b.averageRating === a.averageRating) {
                    return b.totalReviews - a.totalReviews;
                }

                return b.averageRating - a.averageRating;
            })
            .slice(0, 5);

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedLibraries = librariesWithDetails.slice(
            startIndex,
            endIndex,
        );

        const hasMore = endIndex < librariesWithDetails.length;

        return {
            statistics: {
                totalLibraries: libraries.length,
                totalBanners: banners.length,
                totalFeedbacks: feedbacks.length,
            },

            banners: bannerResponse,

            topLibraries,

            nearestLibraries,

            allLibraries: {
                data: paginatedLibraries,
                pagination: {
                    page,
                    limit,
                    total: librariesWithDetails.length,
                    hasMore,
                },
            },
        };
    }
}