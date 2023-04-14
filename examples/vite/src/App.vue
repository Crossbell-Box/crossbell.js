<script setup lang="ts">
import { Contract } from 'crossbell.js'
import { onErrorCaptured, ref } from 'vue'
import { useDark, useEventListener, useLocalStorage } from '@vueuse/core'
import { type Address } from 'abitype'

useDark()
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
  try {
    result.value = JSON.stringify(
      await p,
      (key: string, value: any) =>
        typeof value === 'bigint' ? value.toString() : value,
      2,
    )
  } catch (err: any) {
    result.value = err
  }
}

function balance() {
  showResult(contract.csb.getBalance(address.value))
}

function transfer() {
  showResult(contract.csb.transfer(address.value, 0))
}

function getPrimaryHandle() {
  showResult(contract.character.getPrimaryId(address.value))
}

function getCharacterByHandle() {
  showResult(contract.character.getByHandle(handle.value))
}

function getCharacter() {
  showResult(contract.character.get(BigInt(characterId.value)))
}
function setPrimaryCharacterId() {
  showResult(contract.character.setPrimaryId(+characterId.value))
}
</script>

<template>
  <h1 text="3xl" py4>Crossbell.js Demo</h1>
  <hr />
  <div flex="~ gap2 wrap" font-mono>
    <input v-model="address" type="text" placeholder="address" />
    <input v-model="characterId" type="text" placeholder="characterId" />
    <input v-model="handle" type="text" placeholder="handle" />
  </div>
  <hr />
  <div flex="~ gap2 wrap">
    <button @click="connect">connect</button>
    <button @click="balance">balance</button>
    <button @click="transfer">transfer</button>
    <button @click="getPrimaryHandle">getPrimaryHandle</button>
    <button @click="getCharacter">getCharacter</button>
    <button @click="getCharacterByHandle">getCharacterByHandle</button>
    <button @click="setPrimaryCharacterId">setPrimaryCharacterId</button>
  </div>
  <hr />
  <pre whitespace-pre-wrap break-words bg="gray/80" p4 rounded-4>{{
    result
  }}</pre>
</template>
