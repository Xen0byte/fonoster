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
import * as grpc from "@grpc/grpc-js";
import { serviceDefinition } from "../serviceDefinition";
import {
  CheckMethodAuthorizedRequest,
  ChargeAccountRequest,
  GetAccountBalanceRequest,
  VoiceRequest
} from "../types";
import { AuthzServiceClient } from "./AuthzServiceClient";

/**
 * AuthzClient class to interact with the AuthzServer via gRPC.
 */
export class AuthzClient {
  private readonly client: AuthzServiceClient;

  /**
   * Initializes the AuthzClient with the given configuration.
   * @param address The address of the AuthzServer (e.g., "localhost:50051").
   */
  constructor(address: string) {
    this.client = new (grpc.makeGenericClientConstructor(
      serviceDefinition,
      "AuthzService",
      {}
    ))(
      address,
      grpc.credentials.createInsecure()
    ) as unknown as AuthzServiceClient;
  }

  /**
   * Checks if the session is authorized.
   * @param request VoiceRequest containing session details.
   * @returns Promise resolving to a boolean indicating authorization.
   */
  async checkSessionAuthorized(
    request: VoiceRequest
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.client.checkSessionAuthorized(request, (error, response) => {
        if (error) {
          reject(
            new Error(
              `checkSessionAuthorized failed: ${error.message || error}`
            )
          );
        } else if (response && typeof response.authorized === "boolean") {
          resolve(response.authorized);
        } else {
          reject(
            new Error(
              `checkSessionAuthorized failed: Invalid response format.`
            )
          );
        }
      });
    });
  }

  /**
   * Checks if a specific method is authorized.
   * @param request CheckMethodAuthorizedRequest containing accessKeyId and method.
   * @returns Promise resolving to a boolean indicating authorization.
   */
  async checkMethodAuthorized(
    request: CheckMethodAuthorizedRequest
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.client.checkMethodAuthorized(request, (error, response) => {
        if (error) {
          reject(
            new Error(
              `checkMethodAuthorized failed: ${error.message || error}`
            )
          );
        } else if (response && typeof response.authorized === "boolean") {
          resolve(response.authorized);
        } else {
          reject(
            new Error(
              `checkMethodAuthorized failed: Invalid response format.`
            )
          );
        }
      });
    });
  }

  /**
   * Charges an account by a specified amount.
   * @param request ChargeAccountRequest containing accessKeyId and amount.
   * @returns Promise resolving when the charge is successful.
   */
  async chargeAccount(request: ChargeAccountRequest): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.chargeAccount(request, (error, _response) => {
        if (error) {
          reject(
            new Error(`chargeAccount failed: ${error.message || error}`)
          );
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Retrieves the account balance.
   * @param request GetAccountBalanceRequest containing accessKeyId.
   * @returns Promise resolving to the account balance.
   */
  async getAccountBalance(
    request: GetAccountBalanceRequest
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.client.getAccountBalance(request, (error, response) => {
        if (error) {
          reject(
            new Error(
              `getAccountBalance failed: ${error.message || error}`
            )
          );
        } else if (response && typeof response.balance === "number") {
          resolve(response.balance);
        } else {
          reject(
            new Error(
              `getAccountBalance failed: Invalid response format.`
            )
          );
        }
      });
    });
  }

  /**
   * Closes the gRPC client connection.
   */
  close(): void {
    this.client.close();
  }
}
