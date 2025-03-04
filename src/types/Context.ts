import { Request, Response } from 'express'
import { UserSimpleDTO } from '../dto/user.dto';

export type Context = {
  token: string | string[] | undefined;
  user: UserSimpleDTO | null,
  error: any | null,
	request: Request
	response: Response
}
