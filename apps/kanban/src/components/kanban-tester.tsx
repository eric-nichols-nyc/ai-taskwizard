import React, { useState, useEffect, useCallback } from 'react';
import { Play, Plus, RotateCcw, Zap, CheckCircle, XCircle } from 'lucide-react';
import { KanbanPositionCalculator } from '../lib/kanban-position-calculator';
import { Task } from '@turbo-with-tailwind-v4/database/types';


// React Component
interface Column {
  id: string;
  title: string;
  color: string;
}

interface TestResult {
  timestamp: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const KanbanPositionTester: React.FC = () => {
  // Simulate realistic database data (tasks already exist with positions)
  const generateDatabaseData = useCallback(() => {
    const columns: Column[] = [
      { id: 'backlog', title: 'Backlog', color: 'border-gray-300 bg-gray-50' },
      { id: 'todo', title: 'To Do', color: 'border-red-300 bg-red-50' },
      { id: 'progress', title: 'In Progress', color: 'border-yellow-300 bg-yellow-50' },
      { id: 'review', title: 'In Review', color: 'border-blue-300 bg-blue-50' },
      { id: 'done', title: 'Done', color: 'border-green-300 bg-green-50' }
    ];

    // ✅ SIMULATE DATABASE: Pre-existing tasks with realistic positions
    const existingTasks: Task[] = [
      // Backlog tasks
      { id: 'task_001', column_id: 'backlog', title: 'Design user dashboard', description: 'Create wireframes and high-fidelity mockups for the main dashboard', position: 1000, priority: 'Medium' },
      { id: 'task_002', column_id: 'backlog', title: 'Market analysis report', description: 'Competitive analysis and pricing strategy research', position: 2000, priority: 'Medium' },
      { id: 'task_003', column_id: 'backlog', title: 'Setup Storybook', position: 3000, priority: 'Low' },

      // Todo tasks
      { id: 'task_004', column_id: 'todo', title: 'Implement dark mode', description: 'Add theme switching functionality with system preference detection', position: 1000, priority: 'Medium' },
      { id: 'task_005', column_id: 'todo', title: 'Build responsive navbar', position: 1500, priority: 'Medium' }, // Fractional position from previous move
      { id: 'task_006', column_id: 'todo', title: 'Add form validation', description: 'Implement client-side validation with error messaging', position: 2000, priority: 'Medium' },
      { id: 'task_007', column_id: 'todo', title: 'Database migrations', position: 3000, priority: 'Low' },

      // In Progress tasks
      { id: 'task_008', column_id: 'progress', title: 'Implement JWT auth', description: 'Secure authentication with refresh token rotation', position: 750, priority: 'Medium' }, // Moved to first position
      { id: 'task_009', column_id: 'progress', title: 'Build REST API', description: 'Create RESTful endpoints with OpenAPI documentation', position: 1000, priority: 'Medium' },
      { id: 'task_010', column_id: 'progress', title: 'Configure monitoring', position: 2000, priority: 'Medium' },

      // In Review tasks
      { id: 'task_011', column_id: 'review', title: 'SSL certificate setup', description: 'Implement HTTPS with automatic certificate renewal', position: 1000, priority: 'Medium' },
      { id: 'task_012', column_id: 'review', title: 'Load balancer config', position: 1250, priority: 'Low' }, // Inserted between tasks
      { id: 'task_013', column_id: 'review', title: 'User research interviews', description: 'Conduct 10 user interviews to validate feature requirements', position: 1500, priority: 'Medium' },
      { id: 'task_014', column_id: 'review', title: 'Add rate limiting', position: 2000, priority: 'Medium' },

      // Done tasks
      { id: 'task_015', column_id: 'done', title: 'Setup CI/CD pipeline', description: 'Automated testing and deployment with GitHub Actions', position: 1000, priority: 'Medium' },
      { id: 'task_016', column_id: 'done', title: 'Design database schema', description: 'Plan relational structure with proper indexing strategy', position: 2000, priority: 'Medium' },
      { id: 'task_017', column_id: 'done', title: 'Backup strategy', position: 3000, priority: 'Medium' }
    ];

    // ✅ REALISTIC: Some positions show evidence of previous drag operations
    // (fractional positions, gaps from rebalancing, etc.)

    return {
      columns,
      tasks: existingTasks,
      nextTaskId: 18 // Next ID to use when adding new tasks
    };
  }, []);

  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nextTaskId, setNextTaskId] = useState(18);
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<'first' | 'last' | 'before' | 'after'>('first');
  const [selectedTargetTask, setSelectedTargetTask] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  // Initialize with database-like data
  useEffect(() => {
    const { columns: newColumns, tasks: newTasks, nextTaskId: newNextId } = generateDatabaseData();
    setColumns(newColumns);
    setTasks(newTasks);
    setNextTaskId(newNextId);
  }, [generateDatabaseData]);

  const addTestResult = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newResult: TestResult = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setTestResults(prev => [newResult, ...prev.slice(0, 19)]); // Keep last 20 results
  };

  const moveTask = () => {
    try {
      if (!selectedTask || !selectedColumn || !selectedPosition) {
        throw new Error('Please select task, column, and position');
      }

      if (['before', 'after'].includes(selectedPosition) && !selectedTargetTask) {
        throw new Error('Please select target task for before/after positioning');
      }

      const startTime = performance.now();
      const result = KanbanPositionCalculator.calculatePosition({
        tasks,
        taskId: selectedTask,
        targetColumnId: selectedColumn,
        dropPosition: selectedPosition,
        targetTaskId: selectedTargetTask || undefined
      });
      const endTime = performance.now();

      setTasks(result.updatedTasks);

      const task = result.updatedTasks.find(t => t.id === selectedTask);
      addTestResult(
        `✅ Moved ${task?.title}: New position: ${result.newPosition.toFixed(3)}, Rebalancing: ${result.needsRebalancing ? 'YES' : 'NO'}, Time: ${(endTime - startTime).toFixed(2)}ms`,
        'success'
      );

    } catch (error) {
      addTestResult(`❌ Error: ${(error as Error).message}`, 'error');
    }
  };

  const addTask = () => {
    const columnId = selectedColumn || columns[0]?.id || 'todo';
    const taskId = `task_${nextTaskId.toString().padStart(3, '0')}`; // Database-style ID
    const position = KanbanPositionCalculator.getNewTaskPosition(tasks, columnId);

    const taskTemplates = [
      'Fix critical bug in payment system',
      'Update user documentation',
      'Refactor legacy code module',
      'Add unit tests for auth service',
      'Design new feature mockups',
      'Optimize database queries',
      'Setup error tracking',
      'Create performance benchmarks'
    ];

    const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];

    const newTask: Task = {
      id: taskId,
      column_id: columnId,
      title: template,
      description: Math.random() > 0.5 ? `Detailed description for ${template.toLowerCase()}` : undefined,
      position,
      priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High'
    };

    setTasks(prev => [...prev, newTask]);
    setNextTaskId(prev => prev + 1);
    addTestResult(`➕ Added task: ${newTask.title} (ID: ${taskId}, position: ${position.toFixed(3)})`, 'success');
  };

  const reset = () => {
    const { columns: newColumns, tasks: newTasks, nextTaskId: newCounter } = generateDatabaseData();
    setColumns(newColumns);
    setTasks(newTasks);
    setNextTaskId(newCounter);
    setSelectedTask('');
    setSelectedColumn('');
    setSelectedTargetTask('');
    addTestResult('🔄 Generated fresh dummy data', 'info');
  };

  const stressTest = () => {
    addTestResult('🏃‍♂️ Running stress test...', 'info');

    const startTime = performance.now();
    let operations = 0;
    let currentTasks = [...tasks];

    // Perform 100 random moves
    for (let i = 0; i < 100; i++) {
      const taskId = currentTasks[Math.floor(Math.random() * currentTasks.length)].id;
      const columnId = columns[Math.floor(Math.random() * columns.length)].id;
      const positions: Array<'first' | 'last'> = ['first', 'last'];
      const dropPosition = positions[Math.floor(Math.random() * positions.length)];

      try {
        const result = KanbanPositionCalculator.calculatePosition({
          tasks: currentTasks,
          taskId,
          targetColumnId: columnId,
          dropPosition
        });
        currentTasks = result.updatedTasks;
        operations++;
      } catch (error) {
        console.error('Stress test error:', error);
        // Skip invalid operations
      }
    }

    const endTime = performance.now();
    setTasks(currentTasks);

    addTestResult(
      `🎯 Stress test completed: ${operations} operations, Total: ${(endTime - startTime).toFixed(2)}ms, Avg: ${((endTime - startTime) / operations).toFixed(3)}ms per operation`,
      'success'
    );
  };

  const runAutomatedTests = () => {
    addTestResult('🤖 Running automated tests...', 'info');

    const testCases = [
      {
        name: 'Move to first position',
        tasks: [
          { id: '1', column_id: 'col1', title: 'Task 1', position: 1000 },
          { id: '2', column_id: 'col1', title: 'Task 2', position: 2000 },
        ],
        params: { taskId: '2', targetColumnId: 'col1', dropPosition: 'first' as const },
        expected: { position: 500, needsRebalancing: false }
      },
      {
        name: 'Move to last position',
        tasks: [
          { id: '1', column_id: 'col1', title: 'Task 1', position: 1000 },
          { id: '2', column_id: 'col1', title: 'Task 2', position: 2000 },
        ],
        params: { taskId: '1', targetColumnId: 'col1', dropPosition: 'last' as const },
        expected: { position: 3000, needsRebalancing: false }
      },
      {
        name: 'Trigger rebalancing',
        tasks: [
          { id: '1', column_id: 'col1', title: 'Task 1', position: 1.0 },
          { id: '2', column_id: 'col1', title: 'Task 2', position: 1.0001 },
          { id: '3', column_id: 'col2', title: 'Task 3', position: 1000 },
        ],
        params: { taskId: '3', targetColumnId: 'col1', dropPosition: 'before' as const, targetTaskId: '2' },
        expected: { needsRebalancing: true }
      }
    ];

    let passed = 0;
    let failed = 0;

    testCases.forEach(test => {
      try {
        const result = KanbanPositionCalculator.calculatePosition({
          tasks: test.tasks,
          ...test.params
        });

        let testPassed = true;
        if (test.expected.position !== undefined && Math.abs(result.newPosition - test.expected.position) > 0.001) {
          testPassed = false;
        }
        if (test.expected.needsRebalancing !== undefined && result.needsRebalancing !== test.expected.needsRebalancing) {
          testPassed = false;
        }

        if (testPassed) {
          addTestResult(`✅ ${test.name}`, 'success');
          passed++;
        } else {
          addTestResult(`❌ ${test.name} - Expected: ${JSON.stringify(test.expected)}, Got: ${JSON.stringify({ position: result.newPosition, needsRebalancing: result.needsRebalancing })}`, 'error');
          failed++;
        }
      } catch (error) {
        addTestResult(`❌ ${test.name} - Error: ${(error as Error).message}`, 'error');
        failed++;
      }
    });

    addTestResult(`📊 Automated tests completed: ${passed} passed, ${failed} failed`, passed === testCases.length ? 'success' : 'error');
  };

  // Get target tasks for selected column
  const getTargetTasks = () => {
    if (!selectedColumn) return tasks;
    return tasks.filter(t => t.column_id === selectedColumn && t.id !== selectedTask);
  };

  useEffect(() => {
    // Run automated tests on component mount
    setTimeout(() => runAutomatedTests(), 1000);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🧪 Kanban Position Calculator Tester</h1>
        <p className="text-gray-600">Test drag-and-drop position calculations with visual feedback</p>
      </div>

      {/* Test Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task to Move</label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Task</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title} ({task.column_id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Column</label>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Column</option>
              {columns.map(col => (
                <option key={col.id} value={col.id}>{col.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value as 'first' | 'last' | 'before' | 'after')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="first">First</option>
              <option value="last">Last</option>
              <option value="before">Before</option>
              <option value="after">After</option>
            </select>
          </div>

          <div className={['before', 'after'].includes(selectedPosition) ? '' : 'opacity-50'}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Task</label>
            <select
              value={selectedTargetTask}
              onChange={(e) => setSelectedTargetTask(e.target.value)}
              disabled={!['before', 'after'].includes(selectedPosition)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select Target</option>
              {getTargetTasks().map(task => (
                <option key={task.id} value={task.id}>{task.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={moveTask}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            <Play size={16} />
            Move Task
          </button>
          <button
            onClick={addTask}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            <Plus size={16} />
            Add Task
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            onClick={stressTest}
            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
          >
            <Zap size={16} />
            Stress Test
          </button>
          <button
            onClick={runAutomatedTests}
            className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors"
          >
            <CheckCircle size={16} />
            Run Tests
          </button>
        </div>
      </div>
      {/* Visual Board */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Visual Board State</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map(column => {
            const columnTasks = tasks
              .filter(task => task.column_id === column.id)
              .sort((a, b) => a.position - b.position);

            return (
              <div key={column.id} className={`flex-1 min-w-80 ${column.color} border-2 rounded-lg p-4`}>
                <h3 className="font-semibold text-gray-700 mb-3 flex justify-between items-center">
                  <span>{column.title}</span>
                  <span className="text-sm font-normal bg-white px-2 py-1 rounded">
                    {columnTasks.length} tasks
                  </span>
                </h3>
                <div className="space-y-2">
                  {columnTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`bg-white rounded-lg shadow-sm p-3 border-l-4 transition-all duration-200 ${
                        task.id === selectedTask ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                      } hover:shadow-md`}
                    >
                      <div className="font-medium text-sm text-gray-800">{task.title}</div>
                      {task.description && (
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-2 flex justify-between items-center">
                        <span>ID: {task.id}</span>
                        <span>Pos: {task.position.toFixed(3)}</span>
                      </div>
                      <div className="text-xs text-gray-400 flex justify-between items-center">
                        <span>Index: {index}</span>
                        {task.priority && (
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            task.priority === 'High' ? 'bg-red-100 text-red-700' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      No tasks in this column
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

          {/* Test Results */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        <div className="bg-gray-50 p-4 rounded-lg h-64 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500 text-center">No test results yet...</p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className={`flex items-start gap-2 text-sm ${
                  result.type === 'success' ? 'text-green-700' :
                  result.type === 'error' ? 'text-red-700' : 'text-gray-700'
                }`}>
                  {result.type === 'success' && <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />}
                  {result.type === 'error' && <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />}
                  {result.type === 'info' && <div className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                  <div>
                    <span className="text-gray-400 font-mono text-xs">[{result.timestamp}]</span>
                    <span className="ml-2">{result.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
