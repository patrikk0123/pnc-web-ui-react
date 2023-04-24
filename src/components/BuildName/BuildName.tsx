import { Link } from 'react-router-dom';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { isBuild, isGroupBuild } from 'utils/entityRecognition';

export const calculateBuildName = (build: Build | GroupBuild) => {
  if (!build) return;

  if (isGroupBuild(build)) {
    return '#' + build.id;
  }
  if (isBuild(build)) {
    const buildItem = build as Build;
    if (buildItem.submitTime) {
      const dateObject = new Date(buildItem.submitTime);
      return [
        '#',
        dateObject.getUTCFullYear(),
        String(dateObject.getUTCMonth() + 1).padStart(2, '0'),
        String(dateObject.getUTCDate()).padStart(2, '0'),
        '-',
        String(dateObject.getUTCHours()).padStart(2, '0'),
        String(dateObject.getUTCMinutes()).padStart(2, '0'),
      ].join('');
    }
  }
  throw new Error('Invalid build: ' + build.id);
};

export const calculateBuildConfigName = (build: Build | GroupBuild) => {
  if (!build) return;

  if (isGroupBuild(build)) {
    return (build as GroupBuild).groupConfig!.name;
  }

  if (isBuild(build)) {
    return (build as Build).buildConfigRevision!.name;
  }
};

export const calculateLongBuildName = (build: Build | GroupBuild) => {
  return `${calculateBuildName(build)} of ${calculateBuildConfigName(build)}`;
};

interface IConfigAppendix {
  build: Build | GroupBuild;
  includeConfigLink?: boolean;
}

const ConfigAppendix = ({ build, includeConfigLink }: IConfigAppendix) => {
  const configName = calculateBuildConfigName(build);
  const configLink = 'TODO'; // TODO: FORMAT LINKS HERE
  return <> of {includeConfigLink ? <Link to={configLink}>{configName}</Link> : configName}</>;
};

interface IBuildName {
  build: Build | GroupBuild;
  long?: boolean;
  includeBuildLink?: boolean;
  includeConfigLink?: boolean;
}

/**
 * Represents a component for displaying the name of a build/groupBuild.
 * There are two versions: short (default) and long.
 *
 * Long version additionally also includes the name of the build config.
 * Both "short" and "long" versions can also contain links to the actual build/config.
 *
 * @param build - Build or GroupBuild
 * @param long - Whether the component should be of the long version
 * @param includeBuildLink - Whether the build name should be a link to the build page
 * @param includeConfigLink - Whether the build config (in the long version) should be a link to the build config page
 */
export const BuildName = ({ build, long, includeBuildLink, includeConfigLink }: IBuildName) => {
  const name = calculateBuildName(build);
  const buildLink = `/builds/${build.id}`;
  return (
    <span>
      {includeBuildLink ? <Link to={buildLink}>{name}</Link> : name}
      {long && <ConfigAppendix includeConfigLink={includeConfigLink} build={build} />}
    </span>
  );
};
