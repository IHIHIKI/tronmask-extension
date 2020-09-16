// import { Transaction } from '@tronscan/client/src/protocol/core/Tron_pb'
// https://github.com/tronscan/tronscan-node-client/blob/master/src/protocol/core/Tron_pb.js#L6685

const nameToId = {
  AccountCreateContract: 0,
  TransferContract: 1,
  TransferAssetContract: 2,
  VoteAssetContract: 3,
  VoteWitnessContract: 4,
  WitnessCreateContract: 5,
  AssetIssueContract: 6,
  WitnessUpdateContract: 8,
  ParticipateAssetIssueContract: 9,
  AccountUpdateContract: 10,
  FreezeBalanceContract: 11,
  UnfreezeBalanceContract: 12,
  WithdrawBalanceContract: 13,
  UnfreezeAssetContract: 14,
  UpdateAssetContract: 15,
  ProposalCreateContract: 16,
  ProposalApproveContract: 17,
  ProposalDeleteContract: 18,
  SetAccountIdContract: 19,
  CustomContract: 20,
  CreateSmartContract: 30,
  TriggerSmartContract: 31,
  GetContract: 32,
  UpdateSettingContract: 33,
  ExchangeCreateContract: 41,
  ExchangeInjectContract: 42,
  ExchangeWithdrawContract: 43,
  ExchangeTransactionContract: 44,
  UpdateEnergyLimitContract: 45,
  AccountPermissionUpdateContract: 46,
  ClearAbiContract: 48,
  UpdateBrokerageContract: 49,
}

const idToName = {}

for (const name of Object.keys(nameToId)) {
  const id = nameToId[name]
  idToName[id] = name
}

export const contractTypes = idToName
