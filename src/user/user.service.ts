import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import {Model} from "mongoose";
import * as crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from 'lodash';
import { uniqueNamesGenerator, adjectives, names } from 'unique-names-generator';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
	) {}
	
	private getRandomUsername() {
		return uniqueNamesGenerator({
			separator: ` `,
			length: 2,
			dictionaries: [adjectives, names]
		});
	}

	public async create(user: UserInterface) {
		const _u = await this.userModel.findOne({email: user.email}).exec();
		if (_u) return `EMAIL_ALREDY_USED`;
		const username = this.getRandomUsername();

		const u = await new this.userModel({
			email: user.email,
			password: crypto.createHash(`sha256`).update(user.password).digest(`hex`),
			username: username,
			avatar: `https://avatars.dicebear.com/api/identicon/${username}.svg`,
			emailVerified: false,
			role: `user`,
		}).save()
			.catch(() => null);

		if (u) return `OK`;
		return `DB_ERROR`;
	}

	public async login(user: UserInterface) {
		const u = await this.userModel.findOne({email: user.email}).exec();
		if (!u) return `USER_NOT_FOUND`;
		const pass = crypto.createHash(`sha256`).update(user.password).digest(`hex`);
		if (pass !== u.password) return `PASSWORD_INCORRECT`;
		return `OK`;
	}

	public async findUserByEmail(email: string) {
		return this.userModel.findOne({email: email}).exec();
	}

	public async updateUser(user: FullUserInterface) {
		const u = await this.userModel.findOne({email: user.email}).exec();
		if (!u) return `USER_NOT_FOUND`;
		u.username = user.username;
		u.avatar = user.avatar;
		u.email = user.email;
		u.password = user.password;
		u.emailVerified = user.emailVerified;
		u.refreshToken = user.refreshToken;
		u.role = user.role;
		const _u = await u.save()
			.catch(() => null);
		if (!_u) return `DB_ERROR`;
		return `OK`;
	}
}

export interface UserInterface {
	email: string;
	password: string;
}

export interface FullUserInterface {
	username: string;
	avatar: string;
	email: string;
	password: string;
	emailVerified: boolean;
	refreshToken: string;
	role: string;
}