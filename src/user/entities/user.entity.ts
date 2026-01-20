import { Day } from './day.entity';

export class User {
  id: number;
  username: string;
  password: string;
  history: Day[];
}
