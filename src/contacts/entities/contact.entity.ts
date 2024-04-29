import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  homeAddress: string;

  @ManyToOne((type) => User, (user) => user.contact)
  user: User;
}
