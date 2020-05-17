var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt (value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled (value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected (value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step (result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
const { Agent } = require('@fonos/type')
const { logger } = require('@fonos/core')
const { FonosService, AgentsService, AgentsPB } = require('@fonos/core')
const promisifyAll = require('grpc-promise').promisifyAll
/**
 * @classdesc Use Fonos Agents, a capability of Fonos SIP Proxy subsystem,
 * to create, update, get and delete Agents. Fonos Agents requires of a
 * running Fonos deployment.
 *
 * @extends FonosService
 * @example
 *
 * const Fonos = require('@fonos/sdk')
 * const agents = new Fonos.Agents()
 *
 * const request = {
 *   name: 'John Doe',
 *   username: 'john',
 *   secret: '1234',
 *   domains: ['sip.local']
 * }
 *
 * agents.createAgent(request)
 * .then(result => {
 *   console.log(result)             // successful response
 * }).catch(e => console.error(e))   // an error occurred
 */
class Agents extends FonosService {
  /**
   * Constructs a new Agents object.
   *
   * @see module:core:FonosService
   */
  constructor (options) {
    super(AgentsService.AgentsClient, options)
    super.init()
    promisifyAll(super.getService(), { metadata: super.getMeta() })
  }
  /**
   * Creates a new Agent on the SIP Proxy subsystem.
   *
   * @param {Object} request -  Request for the provision of a new Agent
   * @param {string} request.name - Friendly name for the SIP device
   * @param {string} request.username -Agent's credential username
   * @param {string} request.secret - Agent's credential secret
   * @param {string[]} request.privacy - If set to 'Private' Fonos removes
   * identifiable information for the requests. Defaults to 'None'
   * @param {string[]} request.domains - List of domains this Agent has access to
   * @return {Promise<Object>} The Agent from the database
   * @example
   *
   * const request = {
   *   name: 'John Doe',
   *   username: 'john',
   *   secret: '1234',
   *   domains: ['sip.local']
   * }
   *
   * agents.createAgent(request)
   * .then(result => {
   *   console.log(result)            // returns the Agent object
   * }).catch(e => console.error(e))  // an error occurred
   */
  createAgent (request) {
    const _super = Object.create(null, {
      getService: { get: () => super.getService }
    })
    return __awaiter(this, void 0, void 0, function * () {
      logger.log(
        'verbose',
        `@fonos/agents createAgent [request: ${JSON.stringify(request)}]`
      )
      logger.log(
        'debug',
        `@fonos/agents createAgent [validating agent: ${request.name}]`
      )
      const agent = new AgentsPB.Agent()
      agent.setName(request.name)
      agent.setUsername(request.username)
      agent.setSecret(request.secret)
      agent.setDomainsList(request.domains)
      agent.setPrivacy(request.privacy)
      const req = new AgentsPB.CreateAgentRequest()
      req.setAgent(agent)
      return _super.getService
        .call(this)
        .createAgent()
        .sendMessage(req)
    })
  }
  /**
   * Retrives a Agent by its reference.
   *
   * @param {string} ref - Reference to Agent
   * @return {Promise<Object>} The agent
   * @throws if ref is null or Agent does not exist
   * @example
   *
   * agents.getAgent(ref)
   * .then(result => {
   *   console.log(result)             // returns the Agent object
   * }).catch(e => console.error(e))   // an error occurred
   */
  getAgent (ref) {
    return __awaiter(this, void 0, void 0, function * () {
      const request = new AgentsPB.GetAgentRequest()
      request.setRef(ref)
      return this.service.getAgent().sendMessage(request)
    })
  }
  /**
   * Update a Agent at the SIP Proxy subsystem.
   *
   * @param {Object} request - Request update of an Agent
   * @param {string} request.ref - Reference to the Agent
   * @param {string} request.name - Friendly name for the SIP device
   * @param {string} request.secret - Agent's credential secret
   * @return {Promise<Object>} The Agent from the database
   * @example
   *
   * const request = {
   *   name: 'John Dee',
   *   secret: '12345'
   * }
   *
   * agents.updateAgent(request)
   * .then(result => {
   *   console.log(result)            // returns the Agent from the DB
   * }).catch(e => console.error(e))  // an error occurred
   */
  updateAgent (request) {
    const _super = Object.create(null, {
      getService: { get: () => super.getService }
    })
    return __awaiter(this, void 0, void 0, function * () {
      logger.log(
        'verbose',
        `@fonos/agents updateAgent [request: ${JSON.stringify(request)}]`
      )
      const agentFromDB = yield this.getAgent(request.ref)
      if (request.name) agentFromDB.setName(request.name)
      if (request.secret) agentFromDB.setSecret(request.secret)
      if (request.privacy) agentFromDB.setPrivacy(request.privacy)
      const req = new AgentsPB.UpdateAgentRequest()
      req.setAgent(agentFromDB)
      return _super.getService
        .call(this)
        .updateAgent()
        .sendMessage(req)
    })
  }
  /**
   * List the Agents registered in Fonos SIP Proxy subsystem.
   *
   * @param {Object} request
   * @param {agent} request.pageSize - Agent of element per page
   * (defaults to 20)
   * @param {string} request.pageToken - The next_page_token value returned from
   * a previous List request, if any
   * @return {Promise<ListAgentsResponse>} List of Agents
   * @example
   *
   * const request = {
   *    pageSize: 20,
   *    pageToken: 2
   * }
   *
   * agents.listAgents(request)
   * .then(() => {
   *   console.log(result)            // returns a ListAgentsResponse object
   * }).catch(e => console.error(e))  // an error occurred
   */
  listAgents (request) {
    return __awaiter(this, void 0, void 0, function * () {
      logger.log(
        'verbose',
        `@fonos/agents listAgent [request -> ${JSON.stringify(request)}]`
      )
      const r = new AgentsPB.ListAgentsRequest()
      r.setPageSize(request.pageSize)
      r.setPageToken(request.pageToken)
      r.setView(request.view)
      return this.service.listAgents().sendMessage(r)
    })
  }
  /**
   * Deletes a Agent from SIP Proxy subsystem.
   *
   * @param {string} ref - Reference to the Agent
   * @example
   *
   * const ref = '507f1f77bcf86cd799439011'
   *
   * agents.deleteAgent(ref)
   * .then(() => {
   *   console.log('done')            // returns an empty object
   * }).catch(e => console.error(e))  // an error occurred
   */
  deleteAgent (ref) {
    const _super = Object.create(null, {
      getService: { get: () => super.getService }
    })
    return __awaiter(this, void 0, void 0, function * () {
      logger.log('verbose', `@fonos/agents deleteAgent [ref: ${ref}]`)
      const req = new AgentsPB.DeleteAgentRequest()
      req.setRef(ref)
      return _super.getService
        .call(this)
        .deleteAgent()
        .sendMessage(req)
    })
  }
}
module.exports = Agents
//# sourceMappingURL=agents.js.map
