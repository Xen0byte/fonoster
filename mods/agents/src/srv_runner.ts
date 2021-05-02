#!/usr/bin/env node
import AgentsServer from "./service/agents";
import {AgentsService} from "./service/protos/agents_grpc_pb";
import {AuthMiddleware} from "@fonos/auth";
import {getSalt} from "@fonos/certs";
import {runServices} from "@fonos/core";

const services = [
  {
    name: "Agents",
    version: "v1alpha1",
    service: AgentsService,
    server: new AgentsServer()
  }
];

const middleware = {
  name: "Authentication",
  middlewareObj: new AuthMiddleware(getSalt()).middleware
};

runServices(services, [middleware]);
