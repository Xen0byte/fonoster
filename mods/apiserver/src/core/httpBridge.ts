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
import { Readable } from "stream";
import { createUpdateMembershipStatus } from "@fonoster/identity";
import { getLogger } from "@fonoster/logger";
import express, { Request, Response } from "express";
import { identityConfig } from "./identityConfig";
import { APP_URL, IDENTITY_WORKSPACE_INVITATION_FAIL_URL } from "../envs";

const logger = getLogger({ service: "apiserver", filePath: __filename });

const CONTENT_TYPE = "audio/L16;rate=16000;channels=1";

function httpBridge(params: { port: number }) {
  const { port } = params;
  const app = express();
  const streamMap = new Map<string, Readable>();

  app.get("/api/sounds/:id", (req: Request, res: Response) => {
    const idWithoutExtension = req.params.id.split(".")[0];
    const stream = streamMap.get(idWithoutExtension);

    if (!stream) {
      res.status(404).send(`Stream not found for id: ${req.params.id}`);
      return;
    }

    res.setHeader("content-type", CONTENT_TYPE);

    stream.on("error", (error) => {
      logger.error(`Error reading file: ${error.message}`);
      res.status(500).send("Error reading file!");
    });

    stream.on("end", () => {
      res.end();
    });

    stream.on("close", () => {
      res.end();
    });

    stream.pipe(res);
  });

  app.get(
    "/api/identity/accept-invite",
    async (req: Request, res: Response) => {
      try {
        await createUpdateMembershipStatus(identityConfig)(
          req.query.token as string
        );
        res.redirect(APP_URL);
      } catch (error) {
        logger.verbose("error updating membership status", error);
        res.redirect(IDENTITY_WORKSPACE_INVITATION_FAIL_URL);
      }
    }
  );

  app.listen(port, () => {
    logger.info(`HTTP bridge is running on port ${port}`);
  });

  return {
    addStream: (id: string, stream: Readable) => {
      streamMap.set(id, stream);
    },
    removeStream: (id: string) => {
      streamMap.delete(id);
    },
    getStream: (id: string) => {
      return streamMap.get(id);
    }
  };
}

export { httpBridge };
