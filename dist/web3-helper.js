'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Metamask = {
  deployContract: deployContract,
  submitTx: submitTx
};

function deployContract(Contract, byteCode, params, options, cb) {
  var _Contract$new;

  !options && (options = {});

  var data = (_Contract$new = Contract.new).getData.apply(_Contract$new, _toConsumableArray(params).concat([{
    data: byteCode
  }]));

  web3.eth.estimateGas({
    data: data
  }, function (err, data) {
    if (err) {
      return cb(err);
    }

    Contract.new.apply(Contract, _toConsumableArray(params).concat([{
      from: options.creator,
      gas: data + 1,
      gasPrice: options.gasPrice || 30 * 1e9,
      data: byteCode
    }, function (err, data) {
      // When creating contract, this callback will be called 2 times.
      // The first time data.address will be undefined
      // The second time data.address will be filled

      if (err) {
        return cb(err);
      }

      return cb(null, data);
    }]));
  });
}

function submitTx(contract, method, params, options, cb) {
  var _contract$method;

  !options && (options = {});

  (_contract$method = contract[method]).estimateGas.apply(_contract$method, _toConsumableArray(params).concat([{
    value: options.value
  }, function (err, data) {
    var _contract$method2;

    if (err) {
      return cb(err);
    }

    (_contract$method2 = contract[method]).sendTransaction.apply(_contract$method2, _toConsumableArray(params).concat([{
      value: options.value || 0,
      gas: data,
      gasPrice: options.gasPrice || 30 * 1e9
    }, function (err, data) {
      if (err) {
        return cb(err);
      }

      return cb(null, data);
    }]));
  }]));
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
