/**
 * Copyright 2017 - 2018  The Hyve B.V.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export class AppConfigMock {
  private config: Object = null;
  private env: Object = null;

  constructor() {
    this.config = {
      'app-version': '0.0.1-test',
      'api-version': 'v2',
      'api-url': 'https://transmart.example.com',
      'app-url': 'https://glowingbear.example.com',
      'gb-backend-url': 'https://gb-backend.example.com',
      'fractalis-url': 'https://fractalis.example.com',
      'fractalis-datasource-url': 'https://transmart.example.com',
      'enable-fractalis-analysis': true,
      'authentication-service-type': 'transmart',
      'export-mode': {
        'name': 'transmart',
        'data-view': 'dataTable'
      },
    };
  }

  public getConfig(key: any) {
    return this.config[key];
  }

  public getEnv(key: any) {
    return 'default';
  }

  load() {}
}

export class OidcConfigMock {
  private config: Object = null;
  private env: Object = {};

  constructor() {
    this.config = {
      'app-version': '0.0.1-test',
      'api-version': 'v2',
      'api-url': 'https://transmart.example.com',
      'app-url': 'https://glowingbear.example.com',
      'fractalis-url': 'https://fractalis.example.com',
      'authentication-service-type': 'oidc',
      'oidc-server-url': 'https://keycloak.example.com/auth/realms/transmart-dev/protocol/openid-connect',
      'oidc-client-id': 'transmart-client'
    };
  }

  public getConfig(key: any) {
    return this.config[key];
  }

  public getEnv(key: any) {
    return this.env[key];
  }

  load() {}
}

export class AppConfigPackerMock {
  private config: Object = null;
  private env: Object = null;

  constructor() {
    this.config = {
      'app-version': '0.0.1-test',
      'api-version': 'v2',
      'api-url': 'https://transmart.example.com',
      'app-url': 'https://glowingbear.example.com',
      'gb-backend-url': 'https://gb-backend.example.com',
      'fractalis-url': 'https://fractalis.example.com',
      'authentication-service-type': 'transmart',
      'export-mode': {
        'name': 'packer',
        'export-url': 'http://foo.bar',
        'data-view': 'basic-packer-export'
      },
    };
  }

  public getConfig(key: any) {
    return this.config[key];
  }


  public getEnv(key: any) {
    return this.env[key];
  }

  load() {}
}

export class AppConfigSurveyExportMock {
  private config: Object = null;
  private env: Object = null;

  constructor() {
    this.config = {
      'app-version': '0.0.1-test',
      'api-version': 'v2',
      'api-url': 'https://transmart.example.com',
      'app-url': 'https://glowingbear.example.com',
      'gb-backend-url': 'https://gb-backend.example.com',
      'fractalis-url': 'https://fractalis.example.com',
      'authentication-service-type': 'transmart',
      'export-mode': {
        'name': 'transmart',
        'data-view': 'surveyTable'
      },
    };
  }

  public getConfig(key: any) {
    return this.config[key];
  }


  public getEnv(key: any) {
    return this.env[key];
  }

  load() {}
}

export class AppConfigFractalisDisabledMock {
  private config: Object = null;
  private env: Object = null;

  constructor() {
    this.config = {
      'app-version': '0.0.1-test',
      'api-version': 'v2',
      'api-url': 'https://transmart.example.com',
      'app-url': 'https://glowingbear.example.com',
      'gb-backend-url': 'https://gb-backend.example.com',
      'fractalis-url': 'https://fractalis.example.com',
      'enable-fractalis-analysis': false,
      'authentication-service-type': 'transmart',
      'export-mode': {
        'name': 'transmart',
        'data-view': 'surveyTable'
      },
    };
  }

  public getConfig(key: any) {
    return this.config[key];
  }


  public getEnv(key: any) {
    return this.env[key];
  }

  load() {}
}
