import { Controller } from '@nestjs/common';
import { SocketUserService } from './socket-user.service';

@Controller('socket-user')
export class SocketUserController {
  constructor(private socketUserService: SocketUserService) {}
}
