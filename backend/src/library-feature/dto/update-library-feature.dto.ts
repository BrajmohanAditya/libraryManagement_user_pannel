import { PartialType } from '@nestjs/mapped-types';
import { CreateLibraryFeatureDto } from './create-library-feature.dto';

export class UpdateLibraryFeatureDto extends PartialType(CreateLibraryFeatureDto) {}
