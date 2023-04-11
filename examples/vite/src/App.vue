<script setup lang="ts">
import { Contract } from 'crossbell.js'
import { ref, onErrorCaptured } from 'vue'
import { useLocalStorage, useEventListener } from '@vueuse/core'
import { type Address } from 'abitype'

useEventListener(window, 'error', (event) => showResult(event))
useEventListener(window, 'unhandledrejection', (event) =>
  showResult(event.reason.toString()),
)
onErrorCaptured((err) => {
  showResult(err)
})

const metamask = window.ethereum

const contract = new Contract(metamask)
const address = useLocalStorage<Address>('address', '0x')
const characterId = useLocalStorage('characterId', '')
const handle = useLocalStorage('handle', '')
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

function getCharacterByHandle() {
  showResult(contract.character.getCharacterByHandle(handle.value))
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
    <div style="display: flex; gap: 4px; flex-wrap: wrap">
      <input type="text" v-model="address" placeholder="address" />
      <input type="text" v-model="characterId" placeholder="characterId" />
      <input type="text" v-model="handle" placeholder="handle" />
    </div>
    <hr />
    <div style="display: flex; gap: 4px; flex-wrap: wrap">
      <button @click="connect">connect</button>
      <button @click="balance">balance</button>
      <button @click="transfer">transfer</button>
      <button @click="getPrimaryHandle">getPrimaryHandle</button>
      <button @click="getCharacter">getCharacter</button>
      <button @click="getCharacterByHandle">getCharacterByHandle</button>
      <button @click="setPrimaryCharacterId">setPrimaryCharacterId</button>
    </div>
    <hr />
    <pre style="white-space: pre-wrap">{{ result }}</pre>
  </div>
</template>
