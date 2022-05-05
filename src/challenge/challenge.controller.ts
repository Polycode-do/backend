import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpCode,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Put()
  @HttpCode(201)
  async create(@Body() createChallengeDto: CreateChallengeDto) {
    //TODO Implement authentication logic and replace this dummy with the real user id
    const userId = 1;

    const createdChallenge = await this.challengeService.create(
      userId,
      createChallengeDto,
    );

    return { challengeId: createdChallenge.id };
  }

  @Get()
  async findAll(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('creatorId', new DefaultValuePipe(0), ParseIntPipe)
    creatorId?: number,
  ) {
    const challenges = await this.challengeService.findAll(
      limit,
      offset,
      creatorId === 0 ? {} : { creatorId },
    );

    if (!challenges.length) throw new NotFoundException('Challenges not found');

    return { challenges };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const challenge = await this.challengeService.findOne(id);

    if (!challenge) throw new NotFoundException('Challenge not found');

    return { challenge };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ) {
    const challenge = await this.challengeService.findOne(id);

    if (!challenge) throw new NotFoundException('Challenge not found');

    const [count] = await this.challengeService.update(id, updateChallengeDto);

    return { count };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const challenge = await this.challengeService.findOne(id);

    if (!challenge) throw new NotFoundException('Challenge not found');

    const count = await this.challengeService.remove(id);

    return { count };
  }
}
