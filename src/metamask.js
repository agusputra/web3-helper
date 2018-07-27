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
  metamaskLogin
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