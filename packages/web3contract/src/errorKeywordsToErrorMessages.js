
const errorKeywordsToErrorMessages = {
    'server response 502 Bad Gateway': 'Web3.Server502BadGateway',
    'server response 504 Gateway Time-out': 'Web3.Server504GatewayTimeOut',
    'Failed without revert reason': 'Web3.FailedWithoutRevertReason',
    'nonce has already been used': 'Web3.NonceHasBeenUsed',
    'Nonce too high': 'Web3.NonceTooHigh',
    'Transaction ran out of gas': 'Web3.TransactionRanOutOfGas',
    'Transaction gas price lower than current eth_gasPrice': 'Web3.TransactionUnderpriced',
    'transaction underpriced': 'Web3.TransactionUnderpriced',
    'Server response 404 Not Found': 'Web3.InvalidRpcUrl',
    'insufficient funds': 'Web3.InsufficientBalance',
    'could not replace existing tx': 'Web3.CouldNotReplaceExistingTx',
    'replacement fee too low': 'Web3.ReplacementFeeTooLow',
    'could not coalesce error': 'Web3.CouldNotCoalesceError',
    'Invalid method parameters': 'Web3.InvalidMethodParameters',
    INVALID_PARAMS: 'Web3.InvalidParams',
    InsufficientBalance: 'Web3.InsufficientBalance',
    BalanceQueryForZeroAddress: 'Web3.BalanceQueryForZeroAddress',
    TransferToZeroAddress: 'Web3.TransferToZeroAddress',
    InvalidAddress: 'Web3.InvalidAddress',
}


module.exports = errorKeywordsToErrorMessages
