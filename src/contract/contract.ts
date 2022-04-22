import { Mixin } from 'ts-mixer'
import { CsbContract } from './subcontracts/csb'
import { LinkContract } from './subcontracts/link'
import { ProfileContract } from './subcontracts/profile'

const Contracts = Mixin(ProfileContract, LinkContract, CsbContract)

export class Contract extends Contracts {}
