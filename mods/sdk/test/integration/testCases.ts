/*
 * Copyright (C) 2024 by Fonoster Inc (https://fonoster.com)
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
import { createAgentsTestCases } from "./agentsTestCases";
import { createApiKeysTestCases } from "./apiKeysTestCases";
import { createApplicationsTestCases } from "./applicationsTestCases";
import { createDomainsTestCases } from "./domainsTestCases";
import { createSecretsTestCases } from "./secretsTestCases";
import { createUsersTestCases } from "./usersTestCases";

function createTestCases(expect) {
  return [
    createApplicationsTestCases(expect),
    // Muted for now
    // createCallsTestCases(expect),
    createApiKeysTestCases(expect),
    createUsersTestCases(expect),
    createSecretsTestCases(expect),
    createAgentsTestCases(expect),
    createDomainsTestCases(expect)
  ];
}

export { createTestCases };
