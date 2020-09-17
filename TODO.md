- Use migration mechanism to import old tronmask extension private key
  https://github.com/tronmask/tronmask/blob/master/src/popup/store/index.js#L13
- Method name display when triggering a contract
- Always display addresses in Tron format
- Addresses should be input in Tron format
- It seems only "Received" transactions are displayed in transactions
  list fetched from tronscan? (not Sent)
- Ledger support

  - [x] import account from ledger
  - [x] display balances correctly in import page...
  - [x] normal transfer transaction
  - [x] trc20 token transfer
  - [x] contract trigger transaction
  - [] better handle errors (e.g. when ledger not unlocked/connected)

- In activity tab, when freezing the signed transaction's amount is 0
  but when it is fetched from tronscan through incoming-transaction
  controller, it displays the frozen amount. Need to fix that
  inconsistency.
- Display frozen balance along with available balance.
