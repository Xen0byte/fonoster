/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable mocha/no-async-describe */
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
import { expect } from "chai";
import Mustache from "mustache";
import { createTestCases } from "./cases/testCases";
import { TestCase, runTestCase } from "./runTestCase";
import * as SDK from "../../src/node";

const endpoint = "localhost:50051";
const accessKeyId = "WO00000000000000000000000000000000";
const username = "admin@fonoster.local";
const password = "changeme";

/**
 * This test is exactly the same as the one in the web.integration.ts file.
 * The only difference are the imports and the client initialization.
 */
describe("@sdk[integration]", async function () {
  const resultStore = {};
  let client: SDK.Client;

  before(async function () {
    client = new SDK.Client({
      endpoint,
      accessKeyId,
      allowInsecure: true
    });
    await client.login(username, password);
  });

  createTestCases(expect).forEach(async function (params: {
    api: string;
    cases: TestCase[];
  }) {
    describe(params.api, async function () {
      params.cases.forEach(async function (testCase: TestCase) {
        const {
          id,
          name,
          method,
          request,
          grpcCode,
          dependsOn,
          responseValidator,
          only,
          skip,
          afterTestDelay
        } = testCase;

        await new Promise<void>((resolve) => {
          const itFn = only ? it.only : skip ? it.skip : it;

          itFn(name, async function () {
            if (dependsOn) {
              expect(resultStore[dependsOn]).to.be.not.undefined;
            }

            const computedRequest = Mustache.render(
              JSON.stringify(request),
              resultStore[dependsOn]
            );

            const response = await runTestCase({
              client,
              api: params.api,
              testCase: {
                id,
                name,
                method,
                request: JSON.parse(computedRequest),
                grpcCode,
                dependsOn,
                afterTestDelay,
                responseValidator
              },
              tooling: { expect, SDK }
            });

            if (response) {
              resultStore[id] = response;
            }
            resolve();
          });
        });
      });
    });
  });
});
