<script setup lang="ts">
import { Contract } from 'crossbell.js'
import { ref, onErrorCaptured } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { type Address } from 'abitype'

window.addEventListener('error', (event) => showResult(event))
window.addEventListener('unhandledrejection', (event) =>
  showResult(event.reason.toString()),
)
onErrorCaptured((err) => {
  showResult(err)
})

const metamask = window.ethereum

const contract = new Contract(metamask)
const address = useLocalStorage<Address>('address', '0x')
const characterId = useLocalStorage('characterId', '')
const result = ref('')

async function connect() {
  await showResult(contract.walletClient!.requestAddresses())
}

async function showResult(p: any) {
  result.value = JSON.stringify(
    await p,
    (key: string, value: any) =>
      typeof value === 'bigint' ? value.toString() : value,
    2,
  )
}

function balance() {
  showResult(contract.csb.getBalance(address.value))
}

function transfer() {
  showResult(contract.csb.transferCsb(address.value, 0))
}

function getPrimaryHandle() {
  showResult(contract.character.getPrimaryCharacterId(address.value))
}
function getCharacter() {
  showResult(contract.character.getCharacter(BigInt(characterId.value)))
}
function setPrimaryCharacterId() {
  showResult(contract.character.setPrimaryCharacterId(+characterId.value))
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
    <div style="display: flex; gap: 4px; flex-wrap: wrap">
      <button @click="connect">connect</button>
      <button @click="balance">balance</button>
      <button @click="transfer">transfer</button>
      <button @click="getPrimaryHandle">getPrimaryHandle</button>
      <button @click="getCharacter">getCharacter</button>
      <button @click="setPrimaryCharacterId">setPrimaryCharacterId</button>
    </div>
    <hr />
    <pre style="white-space: pre-wrap">{{ result }}</pre>
  </div>
</template>
