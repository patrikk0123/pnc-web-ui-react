import {
  ActionGroup,
  Button,
  Card,
  CardBody,
  CardTitle,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  FormHelperText,
  Select,
  SelectOption,
  SelectVariant,
  TextArea,
  TextInput,
  Tooltip,
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { useDataBuffer } from '../../containers/useDataBuffer';
import { IFields, useForm } from '../../containers/useForm';
import { useTitle } from '../../containers/useTitle';

import { maxLength, minLength } from '../../utils/formValidationHelpers';
import { timestampHiglighter } from '../../utils/preprocessorHelper';

import '../../index.css';
import { ActionButton } from '../ActionButton/ActionButton';
import { AttributesItems } from '../AttributesItems/AttributesItems';
import { BuildMetrics } from '../BuildMetrics/BuildMetrics';
import { BuildName } from '../BuildName/BuildName';
import { BuildStartButton } from '../BuildStartButton/BuildStartButton';
import { BuildStatus } from '../BuildStatus/BuildStatus';
import { BuildStatusIcon } from '../BuildStatusIcon/BuildStatusIcon';
import { DependencyTree } from '../DependencyTree/DependencyTree';
import { LogViewer } from '../LogViewer/LogViewer';
import { PageLayout } from '../PageLayout/PageLayout';
import { ProductMilestoneReleaseLabel } from '../ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';
import mockBuildData from './data/mock-build-data.json';

const buildRes: Build[] = mockBuildData;

const formConfig = {
  inputFieldA: {
    value: '',
    isRequired: true,
    validators: [
      { validator: minLength(2), errorMessage: 'Text must be at least two characters long.' },
      {
        validator: maxLength(10),
        errorMessage: 'Text cannot be longer than 10 characters.',
      },
    ],
  },
  textAreaA: {
    value: '',
  },
  selectA: {
    value: '',
    isRequired: true,
  },
};

const initLogData = [
  '[2022-08-15T14:11:36.929Z] Push 1 started.',
  '[2022-08-15T14:11:36.986Z] Making POST request to http://causeway-master-devel.psi.redhat.com/causeway/rest/import/build.',
  '[2022-08-15T14:11:37.014Z] Importing external build ATINBQK54TIAA to tag fb-1.0-pnc.',
  '[2022-08-15T14:11:37.015Z] Response status: 202',
  '[2022-08-15T14:11:37.018Z] Push 1 ACCEPTED.',
  '[2022-08-15T14:11:37.958Z] Applying tag fb-1.0-pnc on build org.jboss.modules-jboss-modules-1.5.0.Final_temporary_redhat_00033-1.',
  '[2022-08-15T14:11:38.884Z] Sending callback to http://orch-master-devel.psi.redhat.com/pnc-rest/v2/builds/ATINBQK54TIAA/brew-push/complete.',
  '[2022-08-15T14:11:38.91Z] Brew push completed.',
  '[2022-08-15T14:11:36.929Z] Push 2 started.',
  '[2022-08-15T14:11:36.986Z] Making POST request to http://causeway-master-devel.psi.redhat.com/causeway/rest/import/build.',
  '[2022-08-15T14:11:37.014Z] Importing external build ATINBQK54TIAA to tag fb-1.0-pnc.',
  '[2022-08-15T14:11:37.015Z] Response status: 202',
  '[2022-08-15T14:11:37.018Z] Push 2 ACCEPTED.',
  '[2022-08-15T14:11:37.958Z] Applying tag fb-1.0-pnc on build org.jboss.modules-jboss-modules-1.5.0.Final_temporary_redhat_00033-1.',
  '[2022-08-15T14:11:38.884Z] Sending callback to http://orch-master-devel.psi.redhat.com/pnc-rest/v2/builds/ATINBQK54TIAA/brew-push/complete.',
  '[2022-08-15T14:11:38.91Z] Brew push completed.',
  '[2022-08-15T14:11:36.929Z] Push 3 started.',
  '[2022-08-15T14:11:36.986Z] Making POST request to http://causeway-master-devel.psi.redhat.com/causeway/rest/import/build.',
  '[2022-08-15T14:11:37.014Z] Importing external build ATINBQK54TIAA to tag fb-1.0-pnc.',
  '[2022-08-15T14:11:37.015Z] Response status: 202',
  '[2022-08-15T14:11:37.018Z] Push 3 ACCEPTED.',
  '[2022-08-15T14:11:37.958Z] Applying tag fb-1.0-pnc on build org.jboss.modules-jboss-modules-1.5.0.Final_temporary_redhat_00033-1.',
  '[2022-08-15T14:11:38.884Z] Sending callback to http://orch-master-devel.psi.redhat.com/pnc-rest/v2/builds/ATINBQK54TIAA/brew-push/complete.',
  '[2022-08-15T14:11:38.91Z] Brew push completed.',
  '[2022-08-15T14:11:36.929Z] Push 4 started.',
  '[2022-08-15T14:11:36.986Z] Making POST request to http://causeway-master-devel.psi.redhat.com/causeway/rest/import/build.',
  '[2022-08-15T14:11:37.014Z] Importing external build ATINBQK54TIAA to tag fb-1.0-pnc.',
  '[2022-08-15T14:11:37.015Z] Response status: 202',
  '[2022-08-15T14:11:37.018Z] Push 4 ACCEPTED.',
  '[2022-08-15T14:11:37.958Z] Applying tag fb-1.0-pnc on build org.jboss.modules-jboss-modules-1.5.0.Final_temporary_redhat_00033-1.',
  '[2022-08-15T14:11:38.884Z] Sending callback to http://orch-master-devel.psi.redhat.com/pnc-rest/v2/builds/ATINBQK54TIAA/brew-push/complete.',
  '[2022-08-15T14:11:38.91Z] Brew push completed.',
  '[2022-08-15T14:11:36.986Z] Making POST request to http://causeway-master-devel.psi.redhat.com/causeway/rest/import/build.',
  '[2022-08-15T14:11:37.014Z] Importing external build ATINBQK54TIAA to tag fb-1.0-pnc.',
  '[2022-08-15T14:11:37.015Z] Response status: 202',
  '[2022-08-15T14:11:37.018Z] Push 5 ACCEPTED.',
  '[2022-08-15T14:11:37.958Z] Applying tag fb-1.0-pnc on build org.jboss.modules-jboss-modules-1.5.0.Final_temporary_redhat_00033-1.',
  '[2022-08-15T14:11:38.884Z] Sending callback to http://orch-master-devel.psi.redhat.com/pnc-rest/v2/builds/ATINBQK54TIAA/brew-push/complete.',
  '[2022-08-15T14:11:38.91Z] Brew push completed.',
  '[2022-08-15T14:11:36.929Z] Push 6 started.',
  '[2022-08-15T14:11:36.986Z] Making POST request to http://causeway-master-devel.psi.redhat.com/causeway/rest/import/build.',
  '[2022-08-15T14:11:37.014Z] Importing external build ATINBQK54TIAA to tag fb-1.0-pnc.',
  '[2022-08-15T14:11:37.015Z] Response status: 202',
  '[2022-08-15T14:11:37.018Z] Push 7 ACCEPTED.',
  '[2022-08-15T14:11:37.018Z] Push 8 ACCEPTED.',
  '[2022-08-15T14:11:37.958Z] Applying tag fb-1.0-pnc on build org.jboss.modules-jboss-modules-1.5.0.Final_temporary_redhat_00033-1.',
  '[2022-08-15T14:11:38.884Z] Sending callback to http://orch-master-devel.psi.redhat.com/pnc-rest/v2/builds/ATINBQK54TIAA/brew-push/complete.',
  '[2022-08-15T14:11:38.91Z] Brew push completed.',
  '[2022-08-15T14:11:36.986Z] Making POST request to http://causeway-master-devel.psi.redhat.com/causeway/rest/import/build.',
  '[2022-08-15T14:11:37.014Z] Importing external build ATINBQK54TIAA to tag fb-1.0-pnc.',
  '[2022-08-15T14:11:37.015Z] Response status: 202',
  '[2022-08-15T14:11:37.018Z] Push 10 ACCEPTED.',
  '[2022-08-15T14:11:37.958Z] Applying tag fb-1.0-pnc on build org.jboss.modules-jboss-modules-1.5.0.Final_temporary_redhat_00033-1.',
  '[2022-08-15T14:11:38.884Z] Sending callback to http://orch-master-devel.psi.redhat.com/pnc-rest/v2/builds/ATINBQK54TIAA/brew-push/complete.',
  '[2022-08-15T14:11:38.91Z] Brew push completed.',
  '[2022-08-15T14:11:36.929Z] Push 11 started.',
  '[2022-08-15T14:11:36.986Z] Making POST request to http://causeway-master-devel.psi.redhat.com/causeway/rest/import/build.',
  '[2022-08-15T14:11:37.014Z] Importing external build ATINBQK54TIAA to tag fb-1.0-pnc.',
  '[2022-08-15T14:11:37.015Z] Response status: 202',
  '[2022-08-15T14:11:37.018Z] Push 12 ACCEPTED.',
  '[2022-08-15T14:11:37.018Z] Push 13 ACCEPTED.',
  '[2022-08-15T14:11:37.958Z] Applying tag fb-1.0-pnc on build org.jboss.modules-jboss-modules-1.5.0.Final_temporary_redhat_00033-1.',
  '[2022-08-15T14:11:38.884Z] Sending callback to http://orch-master-devel.psi.redhat.com/pnc-rest/v2/builds/ATINBQK54TIAA/brew-push/complete.',
  '[2022-08-15T14:11:38.91Z] Brew push completed.',
  '[2022-08-15T14:11:36.986Z] Making POST request to http://causeway-master-devel.psi.redhat.com/causeway/rest/import/build.',
  '[2022-08-15T14:11:37.014Z] Importing external build ATINBQK54TIAA to tag fb-1.0-pnc.',
  '[2022-08-15T14:11:37.015Z] Response status: 202',
  '[2022-08-15T14:11:37.018Z] Push 14 ACCEPTED.',
  '[2022-08-15T14:11:37.958Z] Applying tag fb-1.0-pnc on build org.jboss.modules-jboss-modules-1.5.0.Final_temporary_redhat_00033-1.',
  '[2022-08-15T14:11:38.884Z] Sending callback to http://orch-master-devel.psi.redhat.com/pnc-rest/v2/builds/ATINBQK54TIAA/brew-push/complete.',
  '[2022-08-15T14:11:38.91Z] Brew push completed.',
  '[2022-08-15T14:11:36.929Z] Push 15 started.',
  '[2022-08-15T14:11:36.986Z] Making POST request to http://causeway-master-devel.psi.redhat.com/causeway/rest/import/build.',
  '[2022-08-15T14:11:37.014Z] Importing external build ATINBQK54TIAA to tag fb-1.0-pnc.',
  '[2022-08-15T14:11:37.015Z] Response status: 202',
  '[2022-08-15T14:11:37.018Z] Push 15 ACCEPTED.',
  '[2022-08-15T14:11:37.018Z] Push 16 ACCEPTED.',
  '[2022-08-15T14:11:37.958Z] Applying tag fb-1.0-pnc on build org.jboss.modules-jboss-modules-1.5.0.Final_temporary_redhat_00033-1.',
  '[2022-08-15T14:11:38.884Z] Sending callback to http://orch-master-devel.psi.redhat.com/pnc-rest/v2/builds/ATINBQK54TIAA/brew-push/complete.',
  '[2022-08-15T14:11:38.91Z] Brew push completed.',
  '[2022-08-15T14:11:36.986Z] Making POST request to http://causeway-master-devel.psi.redhat.com/causeway/rest/import/build.',
  '[2022-08-15T14:11:37.014Z] Importing external build ATINBQK54TIAA to tag fb-1.0-pnc.',
  '[2022-08-15T14:11:37.015Z] Response status: 202',
  '[2022-08-15T14:11:37.018Z] Push 17 ACCEPTED.',
  '[2022-08-15T14:11:37.958Z] Applying tag fb-1.0-pnc on build org.jboss.modules-jboss-modules-1.5.0.Final_temporary_redhat_00033-1.',
  '[2022-08-15T14:11:38.884Z] Sending callback to http://orch-master-devel.psi.redhat.com/pnc-rest/v2/builds/ATINBQK54TIAA/brew-push/complete.',
  '[2022-08-15T14:11:38.91Z] Brew push completed.',
  '[2022-08-15T14:11:36.929Z] Push 18 started.',
  '[2022-08-15T14:11:36.986Z] Making POST request to http://causeway-master-devel.psi.redhat.com/causeway/rest/import/build.',
  '[2022-08-15T14:11:37.014Z] Importing external build ATINBQK54TIAA to tag fb-1.0-pnc.',
  '[2022-08-15T14:11:37.015Z] Response status: 202',
  '[2022-08-15T14:11:37.018Z] Push 18 ACCEPTED.',
];

const DEPENDENCY_TREE_ROOT_BUILD: Build = {
  id: 'ATFZH3MH4TIAG',
  submitTime: '2017-12-01T13:17:18.007Z',
  status: 'REJECTED_FAILED_DEPENDENCIES',
  buildConfigRevision: {
    id: '2',
    name: 'whatever',
  },
  user: {
    id: '3',
    username: 'robot',
  },
};

const DEPENDENCY_TREE_ROOT_GROUP_BUILD: GroupBuild = {
  id: '754',
  status: 'REJECTED_FAILED_DEPENDENCIES',
  groupConfig: {
    id: '166',
    name: 'DnsGCProductVersion2208',
  },
  user: {
    id: '3',
    username: 'robot',
  },
};

export const DemoPage = () => {
  useTitle('Demo Page');

  const [previousLineCount, setPreviousLineCount] = useState<number>(0);
  const [currentLineCount, setCurrentLineCount] = useState<number>(0);
  const savedTimer: MutableRefObject<NodeJS.Timer | undefined> = useRef();

  const [buffer, addLines] = useDataBuffer(1500, timestampHiglighter);

  useEffect(() => {
    savedTimer.current = setInterval(() => {
      // In a future React version (potentially in React 17) this could be removed as it will be default behavior
      // https://stackoverflow.com/questions/48563650/does-react-keep-the-order-for-state-updates/48610973#48610973
      unstable_batchedUpdates(() => {
        setPreviousLineCount(currentLineCount);
        setCurrentLineCount((currentLineCount) => currentLineCount + ((Math.random() * 1000) % 6));
      });
    }, 10);
    return () => {
      clearInterval(savedTimer.current);
    };
  }, [currentLineCount]);

  useEffect(() => {
    if (currentLineCount > initLogData.length) {
      clearInterval(savedTimer.current);
    }
    addLines(initLogData.slice(previousLineCount, currentLineCount));
  }, [currentLineCount, previousLineCount, addLines]);

  const submitForm = (data: IFields) => {
    console.log('form state when submitted:', {
      ...data,
    });
  };

  const { fields, onChange, onSubmit, isSubmitDisabled } = useForm(formConfig, submitForm);

  const defaultSelectOptions = [{ value: 'Build' }, { value: 'Option' }, { value: 'Project' }, { value: 'Version' }];

  const [selectOptions, setSelectOptions] = useState<any>(defaultSelectOptions);
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);

  const clearSelection = () => {
    onChange('selectA', null);
    setIsSelectOpen(false);
    setSelectOptions(defaultSelectOptions);
  };

  const formComponent = (
    <Card>
      <CardBody>
        <div className="w-70">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <FormGroup
              isRequired
              label="Input Field"
              fieldId="inputFieldA"
              helperText={
                <FormHelperText isHidden={fields.inputFieldA.state !== 'error'} isError>
                  {fields.inputFieldA.errorMessages?.join(' ')}
                </FormHelperText>
              }
            >
              <TextInput
                isRequired
                validated={fields.inputFieldA.state}
                type="text"
                id="inputFieldA"
                name="inputFieldA"
                value={fields.inputFieldA.value}
                autoComplete="off"
                onChange={(text) => {
                  onChange('inputFieldA', text);
                }}
              />
            </FormGroup>
            <FormGroup label="Text Area" fieldId="textAreaA">
              <TextArea
                id="textAreaA"
                name="textAreaA"
                value={fields.textAreaA.value}
                onChange={(text) => {
                  onChange('textAreaA', text);
                }}
                autoResize
              />
            </FormGroup>
            <FormGroup
              isRequired
              label="Filtered Select"
              fieldId="selectA"
              helperText={
                <FormHelperText isHidden={fields.selectA.state !== 'error'} isError>
                  {fields.selectA.errorMessages?.join(' ')}
                </FormHelperText>
              }
            >
              <Select
                validated={fields.selectA.state}
                id="selectA"
                variant={SelectVariant.typeahead}
                typeAheadAriaLabel="Select an option"
                onToggle={(isOpen) => {
                  setIsSelectOpen(isOpen);
                }}
                onSelect={(event, selection, isPlaceholder) => {
                  if (isPlaceholder) clearSelection();
                  else {
                    onChange('selectA', selection);
                    setIsSelectOpen(false);
                  }
                }}
                onClear={clearSelection}
                selections={fields.selectA.value}
                isOpen={isSelectOpen}
                aria-labelledby={'selectA'}
                placeholderText="Select an option"
              >
                {selectOptions.map((option: any, index: any) => (
                  <SelectOption key={index} value={option.value} />
                ))}
              </Select>
            </FormGroup>
            <ActionGroup>
              <Button
                variant="primary"
                isDisabled={isSubmitDisabled}
                onClick={() => {
                  onSubmit();
                }}
              >
                Submit
              </Button>
            </ActionGroup>
          </Form>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <PageLayout title="Component Demo" description="Component demo page intended for showcasing React components.">
      <Flex direction={{ default: 'column' }}>
        <FlexItem>
          <Card>
            <CardTitle>DependencyTree - Build</CardTitle>
            <CardBody>
              <DependencyTree build={DEPENDENCY_TREE_ROOT_BUILD}></DependencyTree>
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>DependencyTree - Group Build</CardTitle>
            <CardBody>
              <DependencyTree groupBuild={DEPENDENCY_TREE_ROOT_GROUP_BUILD}></DependencyTree>
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <div className="p-15">
              <LogViewer data={buffer} />
            </div>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>Form Demo</CardTitle>
            <CardBody>{formComponent}</CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>BuildStatus</CardTitle>
            <CardBody>
              <BuildStatus
                long
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'BUILDING',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                  attributes: {
                    POST_BUILD_REPO_VALIDATION: 'REPO_SYSTEM_ERROR',
                    PNC_SYSTEM_ERROR: 'DISABLED_FIREWALL',
                  },
                }}
              />
              <BuildStatus
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'SUCCESS',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                }}
              />
              <BuildStatus
                long
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'FAILED',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                }}
              />
              <BuildStatus
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'REJECTED_FAILED_DEPENDENCIES',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                }}
              />
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>BuildStatusIcon</CardTitle>
            <CardBody>
              <BuildStatusIcon
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'BUILDING',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                  attributes: {
                    POST_BUILD_REPO_VALIDATION: 'REPO_SYSTEM_ERROR',
                    PNC_SYSTEM_ERROR: 'DISABLED_FIREWALL',
                  },
                  alignmentPreference: 'PREFER_PERSISTENT',
                }}
              />
              <br />
              <BuildStatusIcon
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'SYSTEM_ERROR',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                  alignmentPreference: 'PREFER_TEMPORARY',
                }}
              />
              <br />
              <BuildStatusIcon
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'REJECTED_FAILED_DEPENDENCIES',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                }}
              />
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>BuildName</CardTitle>
            <CardBody>
              <BuildName
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'BUILDING',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                  attributes: {
                    POST_BUILD_REPO_VALIDATION: 'REPO_SYSTEM_ERROR',
                    PNC_SYSTEM_ERROR: 'DISABLED_FIREWALL',
                  },
                }}
                long
                includeBuildLink
                includeConfigLink
              />
              <br />
              <BuildName
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'BUILDING',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                  attributes: {
                    POST_BUILD_REPO_VALIDATION: 'REPO_SYSTEM_ERROR',
                    PNC_SYSTEM_ERROR: 'DISABLED_FIREWALL',
                  },
                }}
                long
                includeConfigLink
              />
              <br />
              <BuildName
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'BUILDING',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                  attributes: {
                    POST_BUILD_REPO_VALIDATION: 'REPO_SYSTEM_ERROR',
                    PNC_SYSTEM_ERROR: 'DISABLED_FIREWALL',
                  },
                }}
                includeBuildLink
                includeConfigLink
              />
              <br />
              <BuildName
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'BUILDING',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                  attributes: {
                    POST_BUILD_REPO_VALIDATION: 'REPO_SYSTEM_ERROR',
                    PNC_SYSTEM_ERROR: 'DISABLED_FIREWALL',
                  },
                }}
              />
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>ProductMilestoneReleaseLabel</CardTitle>
            <CardBody>
              <ProductMilestoneReleaseLabel
                productMilestoneRelease={{
                  id: '5',
                  version: 'ERP1.2.3',
                  startingDate: '2000-12-26T05:00:00Z',
                  plannedEndDate: '2030-12-26T05:00:00Z',
                  endDate: '2030-12-26T05:00:00Z',
                }}
                isCurrent={false}
              />
              <br />
              <ProductMilestoneReleaseLabel
                productMilestoneRelease={{
                  id: '5',
                  version: 'ERP1.2.4-C',
                  startingDate: '2000-12-26T05:00:00Z',
                  plannedEndDate: '2030-12-26T05:00:00Z',
                  endDate: '2030-12-26T05:00:00Z',
                }}
                isCurrent={true}
              />
              <br />
              <ProductMilestoneReleaseLabel
                productMilestoneRelease={{
                  id: '5',
                  version: 'CAM1.2.5',
                  supportLevel: 'EARLYACCESS',
                  releaseDate: '2021-12-10T05:00:00Z',
                }}
                isCurrent={true}
              />
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>BuildMetrics</CardTitle>
            <CardBody>
              <BuildMetrics builds={buildRes} chartType="line" componentId="BMTEST1"></BuildMetrics>
              <br />
              <BuildMetrics builds={buildRes} chartType="horizontalBar" componentId="BMTEST2"></BuildMetrics>
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>BuildStartButtonGroup</CardTitle>
            <CardBody>
              <BuildStartButton
                buildConfig={{
                  buildType: 'MVN',
                  id: 'demoId',
                  name: 'Demo Name',
                }}
              ></BuildStartButton>
              Build Config Verison
              <br />
              <br />
              <BuildStartButton
                groupConfig={{
                  id: 'demoId',
                  name: 'Demo Name',
                }}
              ></BuildStartButton>
              Group Config Version
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>AttributesItems</CardTitle>
            <CardBody>
              <AttributesItems
                attributes={[
                  {
                    name: 'Project URL',
                    value: (
                      <a href={'demo'} target="_blank" rel="noopener noreferrer">
                        Text Example
                      </a>
                    ),
                  },
                  {
                    name: (
                      <span>
                        Icon has Tooltip{' '}
                        <Tooltip content={<div>This icon has a tooltip!</div>}>
                          <InfoCircleIcon />
                        </Tooltip>
                      </span>
                    ),
                    value: undefined,
                  },
                ]}
              />
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>ActionButton</CardTitle>
            <CardBody>
              <ActionButton iconType="create" link="/projects">
                Button with create icon
              </ActionButton>
              <span>On click, move to the specified web link (this one links to projects)</span>
              <br />
              <ActionButton iconType="edit" action={() => alert('Hello this is actionbutton!')}>
                Edit
              </ActionButton>
              <span>On click, performs a function (this one creates an alert)</span>
              <br />
              <ActionButton iconType="delete">Delete</ActionButton>
              <br />
              <ActionButton iconType="clone">Clone</ActionButton>
              <br />
              <ActionButton iconType="quality">Quality</ActionButton>
              <br />
              <ActionButton iconType="external">External, set text such as Push to Brew</ActionButton>
              <br />
              <ActionButton iconType="mark">Mark as current</ActionButton>
              <br />
              <ActionButton>No Icon</ActionButton>
            </CardBody>
          </Card>
        </FlexItem>
      </Flex>
    </PageLayout>
  );
};
