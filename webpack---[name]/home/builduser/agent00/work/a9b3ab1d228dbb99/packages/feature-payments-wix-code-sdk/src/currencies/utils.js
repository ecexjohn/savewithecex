const CURRENCY_CONVERTER_APP_DEF_ID = '5e762334-899c-4e32-a7ad-b80f03471dfb'
export const getInstance = () => self['wix-site'].getAppToken(CURRENCY_CONVERTER_APP_DEF_ID)

export const convertRateFromStringToNumber = (rate) => {
    let rateString = rate.value
    let decimalIndex = rateString.length - rate.decimalPlaces

    if (decimalIndex <= 0) {
        const missingDecimalAndWholeZeros = Math.abs(decimalIndex) + 1
        const missingZeros = '0'.repeat(missingDecimalAndWholeZeros)
        rateString = missingZeros + rateString
        decimalIndex = rateString.length - rate.decimalPlaces
    }
    const rateWithDecimal = `${rateString.slice(0, decimalIndex)}.${rateString.slice(decimalIndex)}`
    return parseFloat(rateWithDecimal)
}

export const convertRateFromNumberToString = (rate) => {
    const stringValue = `${rate}`
    const decimalIndex = stringValue.indexOf('.')

    const value = stringValue.replace('.', '')
    const decimalPlaces = decimalIndex === -1 ? 0 : value.length - decimalIndex

    return {
        value,
        decimalPlaces,
    }
}