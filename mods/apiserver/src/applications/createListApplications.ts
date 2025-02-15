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
import {
  GrpcErrorMessage,
  Validators as V,
  withErrorHandlingAndValidation,
  getAccessKeyIdFromCall
} from "@fonoster/common";
import { getLogger } from "@fonoster/logger";
import {
  ListApplicationsRequest,
  ListApplicationsResponse
} from "@fonoster/types";
import { ServerInterceptingCall } from "@grpc/grpc-js";
import { applicationWithEncodedStruct } from "./utils/applicationWithEncodedStruct";
import { Prisma } from "../core/db";

const logger = getLogger({ service: "apiserver", filePath: __filename });

function createListApplications(prisma: Prisma) {
  const listApplications = async (
    call: {
      request: ListApplicationsRequest;
    },
    callback: (
      error: GrpcErrorMessage,
      response?: ListApplicationsResponse
    ) => void
  ) => {
    const { pageSize, pageToken } = call.request;

    const accessKeyId = getAccessKeyIdFromCall(
      call as unknown as ServerInterceptingCall
    );

    logger.verbose("call to getApplication", {
      accessKeyId,
      pageSize,
      pageToken
    });

    const result = await prisma.application.findMany({
      where: { accessKeyId },
      include: {
        textToSpeech: true,
        speechToText: true,
        intelligence: true
      },
      take: pageSize,
      skip: pageToken ? 1 : 0,
      cursor: pageToken ? { ref: pageToken } : undefined
    });

    const items = result.map(applicationWithEncodedStruct);

    callback(null, {
      items,
      nextPageToken: result[result.length - 1]?.ref
    });
  };

  return withErrorHandlingAndValidation(listApplications, V.listRequestSchema);
}

export { createListApplications };
