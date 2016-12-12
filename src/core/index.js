'use strict'

const BlockService = require('ipfs-block-service')
const IPLDResolver = require('ipld-resolver')
const PeerBook = require('peer-book')

const defaultRepo = require('./default-repo')

const goOnline = require('./components/go-online')
const goOffline = require('./components/go-offline')
const isOnline = require('./components/is-online')
const load = require('./components/load')
const version = require('./components/version')
const id = require('./components/id')
const repo = require('./components/repo')
const init = require('./components/init')
const bootstrap = require('./components/bootstrap')
const config = require('./components/config')
const block = require('./components/block')
const object = require('./components/object')
const libp2p = require('./components/libp2p')
const swarm = require('./components/swarm')
const ping = require('./components/ping')
const files = require('./components/files')
const bitswap = require('./components/bitswap')

/**
 * The core IPFS component.
 *
 * @example
 * const IPFS = require('ipfs')
 * // IPFS will need a repo, it can create one for you or you can pass
 * // it a repo instance of the type IPFS Repo
 * // https://github.com/ipfs/js-ipfs-repo
 * const repo = ipfsRepoOrPath
 *
 * // Create the IPFS node instance
 * const node = new IPFS(repo)
 *
 * // We need to init our repo, in this case the repo was empty
 * // We are picking 2048 bits for the RSA key that will be our PeerId
 * node.init({ emptyRepo: true, bits: 2048 }, (err) => {
 *    if (err) { throw err }
 *
 *    // Once the repo is initiated, we have to load it so that the IPFS
 *    // instance has its config values. This is useful when you have
 *    // previous created repos and you don't need to generate a new one
 *    node.load((err) => {
 *      if (err) { throw err }
 *
 *      // Last but not the least, we want our IPFS node to use its peer
 *      // connections to fetch and serve blocks from.
 *      node.goOnline((err) => {
 *        if (err) { throw err }
 *        // Here you should be good to go and call any IPFS function
 *    })
 * })
 *
 */
class IPFS {
  /**
   * @param {string|IpfsRepo} repoInstance
   */
  constructor (repoInstance) {
    if (typeof repoInstance === 'string' ||
        repoInstance === undefined) {
      repoInstance = defaultRepo(repoInstance)
    }

    // IPFS Core Internals
    this._repo = repoInstance
    this._peerInfoBook = new PeerBook()
    this._peerInfo = null
    this._libp2pNode = null
    this._bitswap = null
    this._blockService = new BlockService(this._repo)
    this._ipldResolver = new IPLDResolver(this._blockService)

    // IPFS Core exposed components

    //   for booting up a node
    this.goOnline = goOnline(this)
    this.goOffline = goOffline(this)
    this.isOnline = isOnline(this)
    this.load = load(this)
    this.init = init(this)

    //   interface-ipfs-core defined API
    this.version = version(this)
    this.id = id(this)
    this.repo = repo(this)
    this.bootstrap = bootstrap(this)
    this.config = config(this)
    this.block = block(this)
    this.object = object(this)
    this.libp2p = libp2p(this)
    this.swarm = swarm(this)
    this.files = files(this)
    this.bitswap = bitswap(this)
    this.ping = ping(this)
  }
}

exports = module.exports = IPFS