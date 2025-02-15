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
import { mapDialStatus } from "./mapDialStatus";
import { VoiceClient } from "../voice/types";

function createHandleDialEventsWithVoiceClient(voiceClient: VoiceClient) {
  return async function handleDialEventsWithVoiceClient(event: {
    dialstatus: string;
  }) {
    const mappedStatus = mapDialStatus(event.dialstatus);
    if (!mappedStatus) return; // Ignore the event if status is not mapped

    voiceClient.sendResponse({
      dialResponse: {
        status: mappedStatus
      }
    });
  };
}

export { createHandleDialEventsWithVoiceClient };
