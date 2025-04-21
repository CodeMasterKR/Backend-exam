import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'ID of the Master being commented on', example: 'master-uuid-1111...' })
  @IsUUID()
  @IsNotEmpty()
  masterId: string;

  @ApiProperty({ description: 'Rating stars (1 to 5)', example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  stars: number;

  @ApiProperty({ description: 'ID of the User leaving the comment', example: 'user-uuid-2222...' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}