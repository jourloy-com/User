import {Controller} from "@nestjs/common";
import {MessagePattern, Payload} from "@nestjs/microservices";
import { UserInterface } from "src/user/user.service";
import {AuthService} from "./auth.service";

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@MessagePattern(`register`)
	async register(@Payload() user: UserInterface) {
		return await this.authService.register(user);
	}

	@MessagePattern(`login`)
	async login(@Payload() user: UserInterface) {
		return await this.authService.login(user);
	}
}
