import ethUtil from 'ethereumjs-util'
import { TRX, GSUN, SUN } from '../constants/common'
import { conversionUtil, addCurrencies, subtractCurrencies } from './conversion-util'

export function bnToHex (inputBn) {
  return ethUtil.addHexPrefix(inputBn.toString(16))
}

export function hexToDecimal (hexValue) {
  return conversionUtil(hexValue, {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
  })
}

export function decimalToHex (decimal) {
  return conversionUtil(decimal, {
    fromNumericBase: 'dec',
    toNumericBase: 'hex',
  })
}

export function getEthConversionFromWeiHex ({ value, fromCurrency = TRX, conversionRate, numberOfDecimals = 6 }) {
  const denominations = [fromCurrency, GSUN, SUN]

  let nonZeroDenomination

  for (let i = 0; i < denominations.length; i++) {
    const convertedValue = getValueFromWeiHex({
      value,
      conversionRate,
      fromCurrency,
      toCurrency: fromCurrency,
      numberOfDecimals,
      toDenomination: denominations[i],
    })

    if (convertedValue !== '0' || i === denominations.length - 1) {
      nonZeroDenomination = `${convertedValue} ${denominations[i]}`
      break
    }
  }

  return nonZeroDenomination
}

export function getValueFromWeiHex ({
  value,
  fromCurrency = TRX,
  toCurrency,
  conversionRate,
  numberOfDecimals,
  toDenomination,
}) {
  return conversionUtil(value, {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
    fromCurrency,
    toCurrency,
    numberOfDecimals,
    fromDenomination: SUN,
    toDenomination,
    conversionRate,
  })
}

export function getWeiHexFromDecimalValue ({
  value,
  fromCurrency,
  conversionRate,
  fromDenomination,
  invertConversionRate,
}) {
  return conversionUtil(value, {
    fromNumericBase: 'dec',
    toNumericBase: 'hex',
    toCurrency: TRX,
    fromCurrency,
    conversionRate,
    invertConversionRate,
    fromDenomination,
    toDenomination: SUN,
  })
}

export function addHexSUNsToDec (aHexSUN, bHexSUN) {
  return addCurrencies(aHexSUN, bHexSUN, {
    aBase: 16,
    bBase: 16,
    fromDenomination: 'SUN',
    numberOfDecimals: 6,
  })
}

export function subtractHexSUNsToDec (aHexSUN, bHexSUN) {
  return subtractCurrencies(aHexSUN, bHexSUN, {
    aBase: 16,
    bBase: 16,
    fromDenomination: 'SUN',
    numberOfDecimals: 6,
  })
}

export function decEthToConvertedCurrency (ethTotal, convertedCurrency, conversionRate) {
  return conversionUtil(ethTotal, {
    fromNumericBase: 'dec',
    toNumericBase: 'dec',
    fromCurrency: 'TRX',
    toCurrency: convertedCurrency,
    numberOfDecimals: 2,
    conversionRate,
  })
}

export function decGSUNToHexSUN (decGSUN) {
  return conversionUtil(decGSUN, {
    fromNumericBase: 'dec',
    toNumericBase: 'hex',
    fromDenomination: 'GSUN',
    toDenomination: 'SUN',
  })
}

export function hexSUNToDecGSUN (decGSUN) {
  return conversionUtil(decGSUN, {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
    fromDenomination: 'SUN',
    toDenomination: 'GSUN',
  })
}

export function decETHToDecSUN (decEth) {
  return conversionUtil(decEth, {
    fromNumericBase: 'dec',
    toNumericBase: 'dec',
    fromDenomination: 'TRX',
    toDenomination: 'SUN',
  })
}
