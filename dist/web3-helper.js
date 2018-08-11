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

  // This method will checking metamask installation first.
  // And call the callback when metamask installed.
  // The callback will be called immediately if checking process already done.
};function onCheckInstall(cb) {
  if (isCheckInstall) {
    return cb();
  }
  cbs.checkInstall.push(cb);
}

// This method will checking if user login to metamask first.
// And call the callback if user login.
// The callback will be called immediately if checking process already done.
function onCheckLogin(cb) {
  if (isCheckLogin) {
    return cb();
  }
  cbs.checkLogin.push(cb);
}

// Trigger metamask checking for <retry> times.
// This method will also call callback after checking process done.
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

// Check if metamask installed or not
function metamaskInstalled() {
  // The line below temporary because it's not the right way to use MetaMask.
  // (The right way to use MetaMask: https://github.com/MetaMask/faq/blob/master/detecting_metamask.md#web3-deprecation)
  if (web3 && web3.currentProvider.isMetaMask) {
    return true;
  }
  return false;
}

// Check if user login to metamask or not
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

  if (!web3) {
    return cb(null, net);
  }

  web3.version.getNetwork(function (err, netId) {
    switch (netId) {
      case "1":
        net = "mainnet";
        break;
      case "2":
        net = "morden";
        break;
      case "3":
        net = "ropsten";
        break;
      case "4":
        net = "rinkeby";
        break;
      case "42":
        net = "kovan";
        break;
    }

    return cb(null, net);
  });
}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// We set window.web3 to prevent error "web3 is not defined" when other code access web3 (without window.)
window.web3 = window.web3;

var index = _extends({}, Metamask, Net);

module.exports = index;
