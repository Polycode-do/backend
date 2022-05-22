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
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/models/User';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Controller('challenge')
@UseGuards(JwtAuthGuard)
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Put()
  @HttpCode(201)
  async create(@Body() createChallengeDto: CreateChallengeDto, @Request() req) {
    const user = req.user as User;

    const createdChallenge = await this.challengeService.create(
      user.id,
      createChallengeDto,
    );

    return { challengeId: createdChallenge.id };
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('creatorId', new DefaultValuePipe(0), ParseIntPipe)
    creatorId?: number,
  ) {
    const currentUser = req.user as User;

    const challenges = await this.challengeService.findAll(
      currentUser.id,
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
