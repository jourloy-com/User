import {Injectable} from "@nestjs/common";
import { UserInterface, UserService } from "src/user/user.service";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
	) {}

	private generateTokens(email: string) {
		const refresh = jwt.sign({email: email}, process.env.SECRET, {expiresIn: `1w`});
		const access = jwt.sign({email: email}, process.env.SECRET, {expiresIn: `1h`});
		return [refresh, access];
	}

	public async register(user: UserInterface) {
		const code = await this.userService.create(user);
		if (code === `OK`) {
			const [refresh, access] = this.generateTokens(user.email);
			const u = await this.userService.findUserByEmail(user.email);
			u.refreshToken = refresh;
			await this.userService.updateUser(u);
			return {state: `OK`, access: access, refresh: refresh};
		}
	}

	public async login(user: UserInterface) {
		return await this.userService.login(user);
	}
}
