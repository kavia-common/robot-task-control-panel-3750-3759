#!/bin/bash
cd /home/kavia/workspace/code-generation/robot-task-control-panel-3750-3759/robot_runner_gui_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

