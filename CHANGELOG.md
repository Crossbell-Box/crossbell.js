# CHANGELOG

For future updates, please see GitHub Releases.

---

## 0.7.1 (2022-06-09)

- fix websocket reconnecting problem.

## 0.7.0 (2022-06-08)

- BREAKING CHANGE: A more general indexer.getNotes API.

## 0.6.0 (2022-06-08)

- BREAKING CHANGE: New Indexer API.

## 0.5.20 (2022-06-05)

- fix esm support.

## 0.5.19 (2022-06-02)

- New Abi.

## 0.5.18 (2022-06-01)

- Add more linkItem parser to `contract.getNote()`

## 0.5.17 (2022-05-28)

- New Abi.

## 0.5.16 (2022-05-27)

- Expose internal types.

## 0.5.15 (2022-05-27)

- Build outputs target node 12.
- New API
  - `contract.setNoteUri()`
  - `contract.setNoteMetadata()`
  - `contract.changeNoteMetadata()`
  - `contract.lockNote()`
- Improvements
  - `contract.mintNote()` now returns contract address and token id.

## 0.5.14 (2022-05-27)

- Build outputs target node 14.

## 0.5.13 (2022-05-26)

- Fix NoteMetadata typings.

## 0.5.12 (2022-05-26)

- Rollback esm dynamic import implementation.

## 0.5.11 (2022-05-26)

- Add `linkItem` response to `contract.getNote()`

## 0.5.10 (2022-05-25)

- Update abi.

## 0.5.8 (2022-05-25)

- New API
  - `contract.postNoteForAnyUri()`

## 0.5.6 (2022-05-19)

- Change default ipfs gateway to `https://gateway.ipfs.io/ipfs/`
- New API
  - `Network.setIpfsGateway('https://cf-ipfs.com/ipfs/')` to customize your gateway.
  - `contract.deleteNote()`

## 0.5.5 (2022-05-19)

- fix metadata type for note.

## 0.5.4 (2022-05-19)

- New APIs
  - `contract.postNote()`
  - `contract.getNote()`
  - `contract.mintNote()`

## 0.5.3 (2022-05-19)

- fix compatibility with browser

## 0.5.2 (2022-05-18)

- New APIs
  - `contract.setProfileMetadata()`, `contract.changeProfileMetadata()`.
  - `contract.linkProfilesInBatch()`
  - `Ipfs.uploadJson()` for metadata uploading.

## 0.5.1 (2022-05-17)

- fix compatibility with Next.js

## 0.5.0 (2022-05-17)

- Crossbell has breaking changes on `linkProfile` & `unlinkProfile` & `createThenLinkProfile`. This version is to be compatible with the latest version of the ABI. The API usage keeps the same as before.

## 0.4.0 (2022-05-13)

- Breaking changes to the Indexer API. See more on the docs.

## 0.3.5 (2022-05-12)

- support websocket rpc url.

## 0.3.4 (2022-05-12)

- fix backlink api issue.

## 0.3.3 (2022-05-11)

- add `Indexer`.

## 0.3.2 (2022-05-07)

- add `contract.existsProfileForAddress()` and `contract.getProfileForAddress()`

## 0.3.1 (2022-05-07)

- to prevent the confusion with `.eth` suffix, `.` is not allowed in profile handle
- add `contract.getRevision()` and `contract.checkRevision()`

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
