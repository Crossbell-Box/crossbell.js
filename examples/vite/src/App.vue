<script setup lang="ts">
import { Contract } from 'crossbell.js'
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const metamask = window.ethereum
const contract = new Contract(metamask)

const address = useLocalStorage('address', '')
const characterId = useLocalStorage('characterId', '')
const result = ref('')

async function withResult(p: Promise<any>) {
  result.value = JSON.stringify(await p, undefined, 2)
}

function balance() {
  withResult(contract.getBalance(address.value))
}

function transfer() {
  withResult(contract.transferCsb(address.value, 0))
}

function getPrimaryHandle() {
  withResult(contract.getPrimaryCharacterId(address.value))
}
function getCharacter() {
  withResult(contract.getCharacter(characterId.value))
}
</script>

<template>
  <div>
    <h1>Crossbell.js Demo</h1>
    <hr />
    <div>Address: <input type="text" v-model="address" /></div>
    <div>CharacterId: <input type="text" v-model="characterId" /></div>
    <hr />
    <button @click="balance">balance</button>
    <button @click="transfer">transfer</button>
    <button @click="getPrimaryHandle">getPrimaryHandle</button>
    <button @click="getCharacter">getCharacter</button>
    <hr />
    <pre>{{ result }}</pre>
  </div>
</template>
