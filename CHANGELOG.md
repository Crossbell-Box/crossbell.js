# CHANGELOG

## 0.3.0 (2022-04-28)

- BREAKING CHANGE: new contract address

## 0.2.7 (2022-04-26)

- throw error when no log event is found

## 0.2.6 （2022-04-25)

- add `Contract.getLinklistIdByTransaction(txhash: string)` and `Contract.getProfileByTransaction(txhash: string)`

## 0.2.5 （2022-04-25)

- fix the `provider.enable()` bug

## 0.2.4 (2022-04-25)

- convert handle to lowercase when `getProfileByHandle` is called

## 0.2.3 (2022-04-25)

- handle can only contains `[a-z, 0-9, '.-_']`. now the SDK will throw an error if you try to create a profile or set a handle with an invalid handle.
- when connecting, fallback to `provider.enable()` if `provider.send("eth_requestAccounts")` fails.

## 0.2.2 (2022-04-22)

- update contract abi to latest version (DO UPDATE!)
- auto switch to crossbell mainnet when calling contract if connected to other network
- add changelog

## 0.2.1 (2022-04-21)

- allow connect contract with read-only provider

## 0.2.0 (2022-04-20)

- switch network to crossbell mainnet

## 0.1.0 (2022-04-18)

- initial release
