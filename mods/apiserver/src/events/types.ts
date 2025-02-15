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
// The register event is sent by Routr when a new endpoint is registered
type RegisterEvent = {
  // The address of record (aor) is the unique identifier for the endpoint
  // And it is formatted as `sip:username@domain`
  aor: string;
  registeredAt: Date;
  expires: number;
  extraHeaders: Record<string, string>;
};

type NatsEventCallback = (registerEvent: Record<string, unknown>) => void;

export { NatsEventCallback, RegisterEvent };
