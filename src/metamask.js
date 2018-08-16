let isCheckInstall = false;
let isCheckLogin = false;
let cbs = {
  checkInstall: [],
  checkLogin: []
}

export default {
  onCheckInstall,
  onCheckLogin,
  checkMetamask,
  metamaskInstalled,
  metamaskLogin,
  deployContract,
  submitTx
}

// This method will checking metamask installation first.
// And call the callback when metamask installed.
// The callback will be called immediately if checking process already done.
function onCheckInstall(cb) {
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
    retry--

    if (retry && !metamaskInstalled()) {
      return setTimeout(checkInstall, 500, retry);
    }
    isCheckInstall = true;
    cbs.checkInstall.forEach(cb => setTimeout(cb));
    cbs.checkInstall = [];
  }

  function checkLogin(retry) {
    retry--

    if (retry && !metamaskLogin()) {
      return setTimeout(checkLogin, 500, retry);
    }
    isCheckLogin = true;
    cbs.checkLogin.forEach(cb => setTimeout(cb));
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

function deployContract(Contract, byteCode, params, options, cb) {
  (!options) && (options = {});

  const data = Contract.new.getData(...params, {
    data: byteCode
  });

  web3.eth.estimateGas({
    data
  }, (err, data) => {
    if (err) {
      return cb(err);
    }

    Contract.new(
      ...params, {
        from: options.creator,
        gas: data + 1,
        gasPrice: options.gasPrice || 30 * 1e9,
        data: byteCode
      },
      (err, data) => {
        // When creating contract, this callback will be called 2 times.
        // The first time data.address will be undefined
        // The second time data.address will be filled

        if (err) {
          return cb(err);
        }

        return cb(null, data);
      })
  })
}

function submitTx(contract, method, params, options, cb) {
  (!options) && (options = {});

  contract[method].estimateGas(
    ...params, {
      value: options.value
    },
    (err, data) => {
      if (err) {
        return cb(err);
      }

      contract[method].sendTransaction(
        ...params, {
          value: options.value || 0,
          gas: data,
          gasPrice: options.gasPrice || 30 * 1e9
        },
        (err, data) => {
          if (err) {
            return cb(err);
          }

          return cb(null, data);
        }
      );
    }
  );
}