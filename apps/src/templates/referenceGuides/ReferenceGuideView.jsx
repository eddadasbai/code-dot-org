import React from 'react';
import PropTypes from 'prop-types';
import EnhancedSafeMarkdown from '@cdo/apps/templates/EnhancedSafeMarkdown';
import {
  NavigationBar,
  NavigationCategory,
  NavigationItem
} from './NavigationBar';
import {organizeReferenceGuides} from '@cdo/apps/util/referenceGuideHelpers';

const baseUrl = window.location.href
  .split('/')
  .slice(0, -1)
  .join('/');

const referenceGuideShape = PropTypes.shape({
  display_name: PropTypes.string,
  content: PropTypes.string,
  position: PropTypes.number,
  parent_reference_guide_key: PropTypes.string
});

export default function ReferenceGuideView({referenceGuide, referenceGuides}) {
  let rootCategory = referenceGuide;
  // TODO(tim): re-organize things to get rid of the concepts guide
  while (rootCategory.parent_reference_guide_key !== 'concepts') {
    rootCategory = referenceGuides.find(
      guide => guide.key === rootCategory.parent_reference_guide_key
    );
  }
  const topLevelGuides = referenceGuides.filter(
    guide => guide.parent_reference_guide_key === 'concepts'
  );
  const navCategories = topLevelGuides
    .sort((a, b) => a.position - b.position)
    .map(guide => {
      const children = organizeReferenceGuides(referenceGuides, guide.key, 1);
      return {
        key: guide.key,
        name: guide.display_name,
        items: children
      };
    });
  return (
    <>
      <h1>{referenceGuide.display_name}</h1>
      <div className="page-content">
        <NavigationBar initialCategoryKey={rootCategory.key}>
          {navCategories.map(category => (
            <NavigationCategory
              key={category.key}
              name={category.name}
              initialIsOpen={category.key === rootCategory.key}
            >
              {category.items.map(guide => (
                <NavigationItem
                  key={guide.key}
                  text={guide.display_name}
                  indentLevel={guide.level}
                  href={`${baseUrl}/${guide.key}`}
                  isActive={guide.key === referenceGuide.key}
                />
              ))}
            </NavigationCategory>
          ))}
        </NavigationBar>
        <EnhancedSafeMarkdown markdown={referenceGuide.content} />
      </div>
    </>
  );
}

ReferenceGuideView.propTypes = {
  referenceGuide: referenceGuideShape.isRequired,
  referenceGuides: PropTypes.arrayOf(referenceGuideShape).isRequired
};
