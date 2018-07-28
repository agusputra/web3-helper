export default {
  getNetwork
}

function getNetwork(cb) {
  let net = 'Unknown'

  web3.version.getNetwork((err, netId) => {
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