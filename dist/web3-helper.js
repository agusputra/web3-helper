'use strict';

var isCheckInstall = false;
var isCheckLogin = false;
var cbs = {
  checkInstall: [],
  checkLogin: []
};

var Metamask = {
  onCheckInstall: onCheckInstall,
  onCheckLogin: onCheckLogin,
  checkMetamask: checkMetamask,
  metamaskInstalled: metamaskInstalled,
  metamaskLogin: metamaskLogin
};

function onCheckInstall(cb) {
  if (isCheckInstall) {
    return cb();
  }
  cbs.checkInstall.push(cb);
}

function onCheckLogin(cb) {
  if (isCheckLogin) {
    return cb();
  }
  cbs.checkLogin.push(cb);
}

function checkMetamask(retry) {
  setTimeout(checkInstall, 0, retry);
  setTimeout(checkLogin, 0, retry);

  function checkInstall(retry) {
    retry--;

    if (retry && !metamaskInstalled()) {
      return setTimeout(checkInstall, 500, retry);
    }
    isCheckInstall = true;
    cbs.checkInstall.forEach(function (cb) {
      return setTimeout(cb);
    });
    cbs.checkInstall = [];
  }

  function checkLogin(retry) {
    retry--;

    if (retry && !metamaskLogin()) {
      return setTimeout(checkLogin, 500, retry);
    }
    isCheckLogin = true;
    cbs.checkLogin.forEach(function (cb) {
      return setTimeout(cb);
    });
    cbs.checkLogin = [];
  }
}

function metamaskInstalled() {
  // The line below temporary because it's not the right way to use MetaMask.
  // (The right way to use MetaMask: https://github.com/MetaMask/faq/blob/master/detecting_metamask.md#web3-deprecation)
  if (web3 && web3.currentProvider.isMetaMask) {
    return true;
  }
  return false;
}

function metamaskLogin() {
  if (metamaskInstalled() && web3.eth.defaultAccount) {
    return true;
  }
  return false;
}

var Net = {
  getNetwork: getNetwork
};

function getNetwork(cb) {
  var net = 'Unknown';

  web3.version.getNetwork(function (err, netId) {
    switch (netId) {
      case "1":
        net = "Mainnet";
        break;
      case "2":
        net = "Morden";
        break;
      case "3":
        net = "Ropsten";
        break;
      case "4":
        net = "Rinkeby";
        break;
      case "42":
        net = "Kovan";
        break;
    }

    return cb(null, net);
  });
}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var index = _extends({
  viewAddressPath: 'https://rinkeby.etherscan.io/address',
  viewTxPath: 'https://rinkeby.etherscan.io/tx',
  getTxParams: getTxParams
}, Metamask, Net, {
  test: function test() {
    return 3;
  }
});

function getTxParams(publicKey, to, value, data, gasPrice, web3, cb) {
  web3.eth.getTransactionCount(publicKey, function (err, data) {
    if (err) throw err;

    var params = {
      from: publicKey,
      nonce: web3.toHex(data),
      gasPrice: web3.toHex(gasPrice),
      to: to,
      value: web3.toHex(value),
      data: data,
      // EIP 155 chainId - mainnet: 1, ropsten: 3
      chainId: 4
    };

    return cb(null, params);
  });
}

module.exports = index;
