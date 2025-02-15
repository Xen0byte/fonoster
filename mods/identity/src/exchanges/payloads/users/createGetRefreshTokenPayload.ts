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
import { Prisma } from "../../../db";
import { RefreshToken, TokenUseEnum } from "@fonoster/common";
import { IdentityConfig } from "../../types";

function createGetRefreshTokenPayload(
  prisma: Prisma,
  identityConfig: IdentityConfig
) {
  return async function getRefreshTokenPayload(
    accessKeyId: string
  ): Promise<RefreshToken> {
    const user = await prisma.user.findFirst({
      where: {
        accessKeyId
      }
    });

    if (!user) {
      return null;
    }

    const { issuer, audience } = identityConfig;
    const { ref } = user;

    return {
      iss: issuer,
      sub: ref,
      aud: audience,
      tokenUse: TokenUseEnum.REFRESH,
      accessKeyId
    } as RefreshToken;
  };
}

export { createGetRefreshTokenPayload };
