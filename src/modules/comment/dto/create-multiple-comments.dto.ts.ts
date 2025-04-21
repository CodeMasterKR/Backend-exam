import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class CreateMultipleCommentsDto {
  @ApiProperty({
    type: [CreateCommentDto],
    description: 'Array of comments to create',
    example: [
      { masterId: 'master-uuid-1111...', stars: 5, userId: 'user-uuid-2222...' },
      { masterId: 'master-uuid-3333...', stars: 4, userId: 'user-uuid-4444...' }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateCommentDto)
  comments: CreateCommentDto[];
}