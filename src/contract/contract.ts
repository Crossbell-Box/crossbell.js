import { Mixin } from 'ts-mixer'
import { CsbContract } from './subcontracts/csb'
import { LinkContract } from './subcontracts/link'
import { ProfileContract } from './subcontracts/profile'
import { RevisionContract } from './subcontracts/revision'

const Contracts = Mixin(
  ProfileContract,
  LinkContract,
  CsbContract,
  RevisionContract,
)

export class Contract extends Contracts {}
