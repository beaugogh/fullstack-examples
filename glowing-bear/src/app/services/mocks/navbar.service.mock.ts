/**
 * Copyright 2017 - 2018  The Hyve B.V.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {MenuItem} from 'primeng/api';

export class NavbarServiceMock {
  private _items: MenuItem[];
  private _activeItem: MenuItem;

  private _isDataSelection = true;
  private _isAnalysis = false;
  private _isExport = false;


  constructor() {
    this.items = [
      {label: 'Cohort Selection', routerLink: '/cohort-selection'},
      {label: 'Analysis', routerLink: '/analysis'},
      {label: 'Export', routerLink: '/export'}
    ];
  }

  updateNavbar(whichStep: string) {
    this.isDataSelection = (whichStep === 'cohort-selection' || whichStep === '');
    this.isAnalysis = (whichStep === 'analysis');
    this.isExport = (whichStep === 'export');

    if (this.isDataSelection) {
      this.activeItem = this._items[0];
    } else if (this.isAnalysis) {
      this.activeItem = this._items[1];
    } else if (this.isExport) {
      this.activeItem = this._items[2];
    }
  }

  logout() {}

  get items(): MenuItem[] {
    return this._items;
  }

  set items(value: MenuItem[]) {
    this._items = value;
  }

  get activeItem(): MenuItem {
    return this._activeItem;
  }

  set activeItem(value: MenuItem) {
    this._activeItem = value;
  }

  get isDataSelection(): boolean {
    return this._isDataSelection;
  }

  set isDataSelection(value: boolean) {
    this._isDataSelection = value;
  }

  get isAnalysis(): boolean {
    return this._isAnalysis;
  }

  set isAnalysis(value: boolean) {
    this._isAnalysis = value;
  }

  get isExport(): boolean {
    return this._isExport;
  }

  set isExport(value: boolean) {
    this._isExport = value;
  }
}
