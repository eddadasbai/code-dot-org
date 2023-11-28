import {BlockSvg, Workspace, WorkspaceSvg} from 'blockly';
import React, {useEffect, useRef} from 'react';
import moduleStyles from './ai-block-preview.module.scss';
import {generateAiEffectBlocksFromResult} from './utils';
import {GeneratedEffect} from './types';
import {useSelector} from 'react-redux';

interface AiBlockPreviewProps {
  results: GeneratedEffect;
}

/**
 * Previews the blocks generated by the AI block in Dance Party.
 */
const AiBlockPreview: React.FunctionComponent<AiBlockPreviewProps> = ({
  results,
}) => {
  const blockPreviewContainerRef = useRef<HTMLSpanElement>(null);
  const workspaceRef = useRef<Workspace | null>(null);
  const isRtl = useSelector((state: {isRtl: boolean}) => state.isRtl);

  // Create the workspace once the container has been rendered.
  useEffect(() => {
    if (!blockPreviewContainerRef.current) {
      return;
    }

    const emptyBlockXml = Blockly.utils.xml.textToDom('<xml></xml>');
    workspaceRef.current = Blockly.BlockSpace.createReadOnlyBlockSpace(
      blockPreviewContainerRef.current,
      emptyBlockXml,
      {rtl: isRtl}
    );
  }, [blockPreviewContainerRef, isRtl]);

  // Build out the blocks.
  useEffect(() => {
    if (!blockPreviewContainerRef.current || !workspaceRef.current) {
      return;
    }
    const blocksSvg = generateAiEffectBlocksFromResult(
      workspaceRef.current,
      results
    );
    blocksSvg.forEach((blockSvg: BlockSvg) => {
      blockSvg.initSvg();
      blockSvg.render();
    });
    Blockly.svgResize(workspaceRef.current as WorkspaceSvg);

    return () => {
      workspaceRef.current?.clear();
    };
  }, [blockPreviewContainerRef, results]);

  // Dispose of the workspace on unmount.
  useEffect(() => () => workspaceRef.current?.dispose(), []);

  return (
    <span ref={blockPreviewContainerRef} className={moduleStyles.container} />
  );
};

export default AiBlockPreview;
