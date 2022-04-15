import { Mixin } from 'ts-mixer'
import { LinkContract } from './subcontracts/link'
import { ProfileContract } from './subcontracts/profile'

const Contracts = Mixin(ProfileContract, LinkContract)

export class Contract extends Contracts {}
