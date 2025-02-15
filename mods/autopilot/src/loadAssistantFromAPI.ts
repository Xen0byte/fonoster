// @ts-nocheck - All inputs are validated by the APIServer
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
import { findIntegrationsCredentials, VoiceRequest } from "@fonoster/common";
import * as SDK from "@fonoster/sdk";
import { AssistantConfig } from "./assistants";
import { APISERVER_ENDPOINT } from "./envs";
import { getLogger } from "@fonoster/logger";
import { assistantSchema } from "@fonoster/common";

const logger = getLogger({ service: "autopilot", filePath: __filename });

function loadAssistantFromAPI(
  req: VoiceRequest,
  // TODO: Add validation for integrations
  integrations: {
    productRef: string;
    credentials: Record<string, unknown>;
  }[]
): Promise<AssistantConfig> {
  return new Promise((resolve, reject) => {
    const clientConfig = {
      accessKeyId: req.accessKeyId,
      endpoint: APISERVER_ENDPOINT,
      allowInsecure: true,
      withoutInterceptors: true
    };

    const client = new SDK.Client(clientConfig);
    client.setAccessToken(req.sessionToken);
    const applications = new SDK.Applications(client);

    logger.verbose(`loading assistant config from api`, {
      apiserver: APISERVER_ENDPOINT,
      appRef: req.appRef
    });

    applications
      .getApplication(req.appRef)
      .then((app) => {
        logger.verbose(`get credentials for assistant`, {
          appRef: req.appRef,
          productRef: app.intelligence?.productRef
        });

        const credentials = findIntegrationsCredentials(
          integrations,
          app.intelligence?.productRef
        );

        const assistantConfig = app.intelligence?.config as AssistantConfig;

        assistantConfig.languageModel.apiKey = credentials?.apiKey as string;

        resolve(assistantSchema.parse(assistantConfig));
      })
      .catch((err) => {
        reject(new Error(`Failed to load assistant config from API: ${err}`));
      });
  });
}

export { loadAssistantFromAPI };
