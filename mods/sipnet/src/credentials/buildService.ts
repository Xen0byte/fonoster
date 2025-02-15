/*
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * This file is part of Fonoster
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import SDK from "@routr/sdk";
import {
  createCredentials,
  deleteCredentials,
  getCredentials,
  listCredentials,
  updateCredentials
} from "./operations";
import { ClientOptions } from "../types";

function buildService(clientOptions: ClientOptions) {
  const client = new SDK.Credentials(clientOptions);

  return {
    definition: {
      serviceName: "CredentialsService",
      pckg: "credentials",
      version: "v1beta2",
      proto: "credentials.proto"
    },
    handlers: {
      createCredentials: createCredentials(client),
      updateCredentials: updateCredentials(client),
      getCredentials: getCredentials(client),
      listCredentials: listCredentials(client),
      deleteCredentials: deleteCredentials(client)
    }
  };
}

export { buildService };
