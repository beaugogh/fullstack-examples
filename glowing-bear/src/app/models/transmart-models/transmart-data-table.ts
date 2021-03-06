/**
 * Copyright 2017 - 2018  The Hyve B.V.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {TransmartRow} from 'app/models/transmart-models/transmart-row';
import {TransmartSort} from './transmart-sort';
import {TransmartColumnHeaders} from './transmart-column-headers';
import {TransmartTableDimension} from './transmart-table-dimension';

export class TransmartDataTable {
  rows: Array<TransmartRow>;
  columnHeaders: Array<TransmartColumnHeaders>;
  rowDimensions: Array<TransmartTableDimension>;
  columnDimensions: Array<TransmartTableDimension>;
  sort: Array<TransmartSort>;
  offset: number;
  rowCount: number;
}
