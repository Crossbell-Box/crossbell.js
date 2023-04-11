<script setup lang="ts">
import { Contract } from 'crossbell.js'
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { type Address } from 'abitype'

const metamask = window.ethereum

let contract: Contract
const address = useLocalStorage<Address>('address', '0x')
const characterId = useLocalStorage('characterId', '')
const result = ref('')

async function init() {
  contract = new Contract(metamask)
  await contract.walletClient!.requestAddresses()
}

async function withResult(p: Promise<any>) {
  result.value = JSON.stringify(
    await p,
    (key: string, value: any) =>
      typeof value === 'bigint' ? value.toString() : value,
    2,
  )
}

function balance() {
  withResult(contract.csb.getBalance(address.value))
}

function transfer() {
  withResult(contract.csb.transferCsb(address.value, 0))
}

function getPrimaryHandle() {
  withResult(contract.character.getPrimaryCharacterId(address.value))
}
function getCharacter() {
  withResult(contract.character.getCharacter(BigInt(characterId.value)))
}
function setPrimaryCharacterId() {
  withResult(contract.character.setPrimaryCharacterId(+characterId.value))
}
</script>

<template>
  <div>
    <h1>Crossbell.js Demo</h1>
    <hr />
    <div><input type="text" v-model="address" placeholder="Address" /></div>
    <div>
      <input type="text" v-model="characterId" placeholder="CharacterId" />
    </div>
    <hr />
    <button @click="init">init</button>
    <button @click="balance">balance</button>
    <button @click="transfer">transfer</button>
    <button @click="getPrimaryHandle">getPrimaryHandle</button>
    <button @click="getCharacter">getCharacter</button>
    <button @click="setPrimaryCharacterId">setPrimaryCharacterId</button>
    <hr />
    <pre>{{ result }}</pre>
  </div>
</template>
