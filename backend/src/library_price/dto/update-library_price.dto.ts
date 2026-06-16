import { PartialType } from '@nestjs/mapped-types';
import { CreateLibraryPriceDto } from './create-library_price.dto';

export class UpdateLibraryPriceDto extends PartialType(CreateLibraryPriceDto) {}
