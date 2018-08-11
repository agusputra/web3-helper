import Metamask from './metamask'
import Net from './net'

// We set window.web3 to prevent error "web3 is not defined" when other code access web3 (without window.)
window.web3 = window.web3;

export default {
  ...Metamask,
  ...Net
}
