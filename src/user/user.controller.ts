import {Controller} from "@nestjs/common";
import {MessagePattern, Payload} from "@nestjs/microservices";
import {UserInterface, UserService} from "./user.service";

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@MessagePattern(`createUser`)
	create(@Payload() user: UserInterface) {
		return this.userService.create(user);
	}
}
