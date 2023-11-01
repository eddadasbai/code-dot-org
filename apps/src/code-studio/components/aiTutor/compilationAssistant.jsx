import React from 'react';
import Button from '@cdo/apps/templates/Button';
import {askAITutor} from '@cdo/apps/aiTutor/redux/aiTutorRedux';
import {useSelector, useDispatch} from 'react-redux';

// AI Tutor feature that explains to students why their code did not compile.
const CompilationAssistant = () => {
  const dispatch = useDispatch();
  const javalabState = useSelector(state => state.javalabEditor);
  const studentCode =
    javalabState.sources[javalabState.fileMetadata[javalabState.activeTabKey]]
      .text;
  const aiTutorState = useSelector(state => state.aiTutor);

  const handleSend = async studentCode => {
    dispatch(askAITutor(studentCode));
  };

  return (
    <div>
      <h4>Why didn't my code compile?</h4>
      <Button
        text="Ask AI Tutor"
        isPending={aiTutorState.isWaitingForAIResponse}
        pendingText="waiting"
        onClick={() => handleSend(studentCode)}
        disabled={!javalabState.hasCompilationError}
      />
      <p id="ai-response">{aiTutorState.aiResponse}</p>
    </div>
  );
};

export default CompilationAssistant;
