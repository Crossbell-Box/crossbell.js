import { Mixin } from 'ts-mixer'
import { LinkContract } from './link'
import { ProfileContract } from './profile'

const Contracts = Mixin(ProfileContract, LinkContract)

export class Contract extends Contracts {}
