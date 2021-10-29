import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class GroupMemberModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  allowPrivateChat: string;

  @Column({nullable: true})
  banTime: number;

  @Column({nullable: true})
  clusterName: string;

  @Column({nullable: true})
  groupId: string;

  @Column({nullable: true})
  groupOwner: string;

  @Column({nullable: true})
  groupOwnerName: string;

  @Column({nullable: true})
  identity: string;

  @Column({nullable: true})
  isAdmin: number = 0;

  @Column({nullable: true})
  showNickname: string;

  @Column({nullable: true})
  status: number;

  @Column({nullable: true})
  stopTalk: number;

  @Column({nullable: true})
  updateAvatarTimestamp: number;

  @Column({nullable: true})
  userAvatarFileName: string;

  @Column({nullable: true})
  userUid: string;

  @Column({nullable: true})
  latestLoginTime: number;
}


