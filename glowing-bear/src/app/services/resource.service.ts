/**
 * Copyright 2017 - 2019  The Hyve B.V.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


import {Observable, of as observableOf, throwError as observableThrowError} from 'rxjs';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Study} from '../models/constraint-models/study';
import {Constraint} from '../models/constraint-models/constraint';
import {TrialVisit} from '../models/constraint-models/trial-visit';
import {ExportJob} from '../models/export-models/export-job';
import {Cohort} from '../models/cohort-models/cohort';
import {SubjectSet} from '../models/constraint-models/subject-set';
import {Pedigree} from '../models/constraint-models/pedigree';
import {CohortRepresentation} from '../models/gb-backend-models/cohort-representation';
import {DataTable} from '../models/table-models/data-table';
import {TransmartMapper} from '../utilities/transmart-utilities/transmart-mapper';
import {ExportDataType} from '../models/export-models/export-data-type';
import {ConceptConstraint} from '../models/constraint-models/concept-constraint';
import {Aggregate} from '../models/aggregate-models/aggregate';
import {CrossTable} from '../models/table-models/cross-table';
import {TransmartCrossTable} from '../models/transmart-models/transmart-cross-table';
import {ConstraintHelper} from '../utilities/constraint-utilities/constraint-helper';
import {CountItem} from '../models/aggregate-models/count-item';
import {TransmartCrossTableMapper} from '../utilities/transmart-utilities/transmart-cross-table-mapper';
import {TransmartCountItem} from '../models/transmart-models/transmart-count-item';
import {EndpointMode} from '../models/endpoint-mode';
import {TransmartTrialVisit} from '../models/transmart-models/transmart-trial-visit';
import {CategoricalAggregate} from '../models/aggregate-models/categorical-aggregate';
import {TransmartResourceService} from './transmart-resource.service';
import {TransmartExportJob} from '../models/transmart-models/transmart-export-job';
import {TransmartPatient} from '../models/transmart-models/transmart-patient';
import {GbBackendHttpService} from './http/gb-backend-http.service';
import {CohortMapper} from '../utilities/cohort-utilities/cohort-mapper';
import {Dimension} from '../models/constraint-models/dimension';
import {TransmartDimension} from '../models/transmart-models/transmart-dimension';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {

  private _endpointMode: EndpointMode;

  constructor(private transmartResourceService: TransmartResourceService,
              private gbBackendHttpService: GbBackendHttpService) {
    this.endpointMode = EndpointMode.TRANSMART;
  }

  handleEndpointModeError(): Observable<any> {
    const msg = 'Incorrect Endpoint Mode is used.';
    console.error(msg);
    return observableThrowError(new Error(msg));
  }

  // -------------------------------------- tree node calls --------------------------------------
  /**
   * Returns the available studies.
   * @returns {Observable<Study[]>}
   */
  getStudies(): Observable<Study[]> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.getStudies();
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  /**
   * Get a specific branch of the tree nodes
   * @param {string} root - the path to the specific tree node
   * @param {number} depth - the depth of the tree we want to access
   * @param {boolean} hasCounts - whether we want to include patient and observation counts in the tree nodes
   * @param {boolean} hasTags - whether we want to include metadata in the tree nodes
   * @returns {Observable<Object>}
   */
  getTreeNodes(root: string, depth: number, hasCounts: boolean, hasTags: boolean): Observable<object> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.getTreeNodes(root, depth, hasCounts, hasTags);
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  // -------------------------------------- count calls --------------------------------------
  updateCohortSelectionCounts(constraint: Constraint): Promise<CountItem> {
    return new Promise<any>((resolve, reject) => {
      switch (this.endpointMode) {
        case EndpointMode.TRANSMART: {
          this.transmartResourceService
            .updateCohortSelectionCounts(constraint)
            .then(() => {
              resolve(TransmartMapper.mapTransmartCountItem(this.transmartResourceService.counts));
            })
            .catch(err => {
              reject(err);
            });
          break;
        }
        default: {
          return this.handleEndpointModeError();
        }
      }
    });
  }

  /**
   * Given a constraint, get the patient counts and observation counts
   * organized per study, then per concept
   * @param {Constraint} constraint
   * @returns {Observable<Object>}
   */
  getCountsPerStudyAndConcept(constraint: Constraint): Observable<Map<string, Map<string, CountItem>>> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.getCountsPerStudyAndConcept(constraint).pipe(
          map((response: object) => {
            return TransmartMapper.mapStudyConceptCountObject(response);
          }));
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  /**
   * Give a constraint, get the patient counts and observation counts
   * organized per study
   * @param {Constraint} constraint
   * @returns {Observable<Map<string, CountItem>>}
   */
  getCountsPerStudy(constraint: Constraint): Observable<Map<string, CountItem>> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.getCountsPerStudy(constraint).pipe(
          map((response: object) => {
            return TransmartMapper.mapStudyCountObject(response);
          }));
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  /**
   * Give a constraint, get the map from concept code to subject+observation counts
   * @param {Constraint} constraint
   * @returns {Observable<Map<string, CountItem>>}
   */
  getCountsPerConcept(constraint: Constraint): Observable<Map<string, CountItem>> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.getCountsPerConcept(constraint).pipe(
          map((response: object) => {
            return TransmartMapper.mapConceptCountObject(response);
          }));
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  /**
   * Give a constraint, get the corresponding patient count and observation count.
   * @param {Constraint} constraint
   * @returns {Observable<Object>}
   */
  getCounts(constraint: Constraint): Observable<CountItem> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.getCounts(constraint).pipe(
          map((tmCountItem: TransmartCountItem) => {
            return TransmartMapper.mapTransmartCountItem(tmCountItem);
          }));
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  // -------------------------------------- aggregate calls --------------------------------------
  /**
   * Get the aggregate based on the given constraint and aggregate options,
   * the options can be {min, max, count, values, average}
   * @param {Constraint} constraint
   * @returns {Observable<object>}
   */
  getAggregate(constraint: ConceptConstraint): Observable<Aggregate> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.getAggregate(constraint).pipe(
          map((tmConceptAggregate: object) => {
            return TransmartMapper.mapTransmartConceptAggregate(tmConceptAggregate, constraint.concept.code);
          }));
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  getCategoricalAggregate(constraint: ConceptConstraint): Observable<CategoricalAggregate> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.getCategoricalAggregate(constraint).pipe(
          map((tmConceptAggregate: object) => {
            return TransmartMapper.mapTransmartCategoricalConceptAggregate(tmConceptAggregate, constraint.concept.code);
          }));
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  // -------------------------------------- trial visit calls --------------------------------------
  /**
   * Given a constraint, normally a concept or a study constraint, return the corresponding trial visit list
   * @param constraint
   * @returns {Observable<R|T>}
   */
  getTrialVisits(constraint: Constraint): Observable<TrialVisit[]> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.getTrialVisits(constraint).pipe(
          map((tmTrialVisits: TransmartTrialVisit[]) => {
            return TransmartMapper.mapTransmartTrialVisits(tmTrialVisits);
          }));
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  // -------------------------------------- pedigree calls --------------------------------------
  /**
   * Get the available pedigree relation types such as parent, child, spouse, sibling and various twin types
   * @returns {Observable<Object[]>}
   */
  getPedigrees(): Observable<Pedigree[]> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.getPedigrees();
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  // -------------------------------------- export calls --------------------------------------
  getExportDataTypes(constraint: Constraint): Observable<ExportDataType[]> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.getExportDataTypes(constraint);
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  /**
   * Get the current user's existing export jobs
   * @returns {Observable<ExportJob[]>}
   */
  getExportJobs(): Observable<ExportJob[]> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.getExportJobs().pipe(
          map((tmExportJobs: TransmartExportJob[]) => {
            return TransmartMapper.mapTransmartExportJobs(tmExportJobs);
          })
        );
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  /**
   * Create a new export job for the current user, with a given name
   * @param name
   * @returns {Observable<ExportJob>}
   */
  createExportJob(name: string): Observable<ExportJob> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.createExportJob(name).pipe(
          map((tmExportJob: TransmartExportJob) => {
            return TransmartMapper.mapTransmartExportJob(tmExportJob);
          })
        );
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  /**
   * Run an export job
   * @param {ExportJob} job
   * @param {ExportDataType[]} dataTypes
   * @param {Constraint} subjectConstraint
   * @param {Constraint} variableConstraint
   * @param {DataTable} dataTable - included only if at least one of the formats of elements is 'TSV'
   * @param {boolean} dateColumnsIncluded
   * @returns {Observable<ExportJob>}
   */
  runExportJob(job: ExportJob,
               dataTypes: ExportDataType[],
               subjectConstraint: Constraint,
               variableConstraint: Constraint,
               dataTable: DataTable,
               dateColumnsIncluded: boolean): Observable<ExportJob> {
    let hasSelectedFormat = false;
    for (let dataType of dataTypes) {
      if (dataType.checked) {
        for (let fileFormat of dataType.fileFormats) {
          if (fileFormat.checked) {
            hasSelectedFormat = true;
          }
        }
      }
    }
    if (hasSelectedFormat) {
      switch (this.endpointMode) {
        case EndpointMode.TRANSMART: {
          return this.transmartResourceService
            .runExportJob(job.id, job.name, subjectConstraint, variableConstraint, dataTypes, dataTable, dateColumnsIncluded).pipe(
              map((tmExportJob: TransmartExportJob) => {
                return TransmartMapper.mapTransmartExportJob(tmExportJob);
              })
            );
        }
        default: {
          return this.handleEndpointModeError();
        }
      }
    } else {
      return observableOf(null);
    }
  }

  /**
   * Given an export job id, return the blob (zipped file) ready to be used on frontend
   * @param jobId
   * @returns {Observable<blob>}
   */
  downloadExportJob(jobId: string): Observable<Blob> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.downloadExportJob(jobId);
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  /**
   * Cancels an export job with the given export job id
   * @param jobId
   * @returns {Observable<blob>}
   */
  cancelExportJob(jobId: string): Observable<{}> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.cancelExportJob(jobId);
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  /**
   * Removes an export job from the jobs table
   * @param jobId
   * @returns {Observable<blob>}
   */
  archiveExportJob(jobId: string): Observable<{}> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.archiveExportJob(jobId);
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  // -------------------------------------- cohort calls --------------------------------------
  /**
   * Get the queries that the current user has saved.
   * @returns {Observable<CohortRepresentation[]>}
   */
  getCohorts(): Observable<Cohort[]> {
    return this.gbBackendHttpService.getQueries().pipe(
      map((gbBackendQueries: CohortRepresentation[]) => {
        return CohortMapper.deserialiseList(gbBackendQueries);
      }));
  }

  /**
   * Save a new query.
   * @param {Cohort} cohort
   * @returns {Observable<Cohort>}
   */
  saveCohort(cohort: Cohort): Observable<Cohort> {
    let gbBackendQuery: CohortRepresentation = CohortMapper.serialise(cohort);
    return this.gbBackendHttpService.saveQuery(gbBackendQuery).pipe(
      map((savedGbBackendQuery: CohortRepresentation) => {
        return CohortMapper.deserialise(savedGbBackendQuery);
      }));
  }

  /**
   * Modify an existing cohort.
   * @param {string} id
   * @param {Object} body
   * @returns {Observable<{}>}
   */
  editCohort(id: string, body: object): Observable<{}> {
    return this.gbBackendHttpService.updateQuery(id, body);
  }

  /**
   * Delete an existing cohort.
   * @param {string} id
   * @returns {Observable<any>}
   */
  deleteCohort(id: string): Observable<{}> {
    return this.gbBackendHttpService.deleteQuery(id);
  }

  // -------------------------------------- cohort differences --------------------------------------
  diffCohort(id: string): Observable<object[]> {
    return this.gbBackendHttpService.diffQuery(id);
  }

  // -------------------------------------- subject calls --------------------------------------
  saveSubjectSet(name: string, constraint: Constraint): Observable<SubjectSet> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.savePatientSet(name, constraint);
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  getSubjects(constraint: Constraint): Observable<TransmartPatient[]> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.getPatients(constraint);
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }



  // -------------------------------------- data table ---------------------------------------------
  getDataTable(dataTable: DataTable): Observable<DataTable> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.getDataTable(dataTable);
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  get sortableDimensions(): Set<string> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.sortableDimensions;
      }
      default: {
        this.handleEndpointModeError();
      }
    }
  }

  get subjectDimensions(): Observable<Dimension[]> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService.getSubjectDimensions().pipe(
          map((transmartDimensions: TransmartDimension[]) => TransmartMapper.mapDimensions(transmartDimensions)))
      }
      default: {
        this.handleEndpointModeError();
      }
    }
  }

  // -------------------------------------- cross table ---------------------------------------------
  public getCrossTable(crossTable: CrossTable): Observable<CrossTable> {
    switch (this.endpointMode) {
      case EndpointMode.TRANSMART: {
        return this.transmartResourceService
          .getCrossTable(
            crossTable.constraint,
            crossTable.rowHeaderConstraints
              .map(constraints => ConstraintHelper.combineSubjectLevelConstraints(constraints)),
            crossTable.columnHeaderConstraints
              .map(constraints => ConstraintHelper.combineSubjectLevelConstraints(constraints)))
          .pipe(
            map((tmCrossTable: TransmartCrossTable) => {
              return TransmartCrossTableMapper.mapTransmartCrossTable(tmCrossTable, crossTable);
            }));
      }
      default: {
        return this.handleEndpointModeError();
      }
    }
  }

  get endpointMode(): EndpointMode {
    return this._endpointMode;
  }

  set endpointMode(value: EndpointMode) {
    this._endpointMode = value;
  }

}
