import Metamask from './metamask'
import Net from './net'

const web3 = global.web3;

export default {
  viewAddressPath: 'https://rinkeby.etherscan.io/address',
  viewTxPath: 'https://rinkeby.etherscan.io/tx',
  getTxParams,
  ...Metamask,
  ...Net
}

function getTxParams(publicKey, to, value, data, gasPrice, web3, cb) {
  web3.eth.getTransactionCount(publicKey, (err, data) => {
    if (err) throw err;

    const params = {
      from: publicKey,
      nonce: web3.toHex(data),
      gasPrice: web3.toHex(gasPrice),
      to,
      value: web3.toHex(value),
      data,
      // EIP 155 chainId - mainnet: 1, ropsten: 3
      chainId: 4
    };

    return cb(null, params);
  });
}