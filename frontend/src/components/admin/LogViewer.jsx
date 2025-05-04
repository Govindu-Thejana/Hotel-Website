import React, { useState, useEffect, useRef } from 'react';
import logService, { LOG_LEVELS } from '../../utils/LogService';
import { 
  FaSearch, 
  FaFilter, 
  FaTrash, 
  FaDownload, 
  FaInfoCircle, 
  FaExclamationTriangle, 
  FaBug, 
  FaExclamationCircle 
} from 'react-icons/fa';

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filter, setFilter] = useState({
    level: 'all',
    source: 'all',
    search: ''
  });
  const [isOpen, setIsOpen] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const logEndRef = useRef(null);

  useEffect(() => {
    // Subscribe to log updates
    const unsubscribe = logService.subscribe(updatedLogs => {
      setLogs(updatedLogs);
    });

    // Initial logs
    setLogs(logService.getLogs());

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Apply filtering
    let result = [...logs];
    
    if (filter.level !== 'all') {
      result = result.filter(log => log.level === filter.level);
    }
    
    if (filter.source !== 'all') {
      result = result.filter(log => log.source === filter.source);
    }
    
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      result = result.filter(log => 
        log.message.toLowerCase().includes(searchTerm) ||
        (log.data && JSON.stringify(log.data).toLowerCase().includes(searchTerm))
      );
    }
    
    setFilteredLogs(result);
  }, [logs, filter]);

  useEffect(() => {
    // Auto-scroll to the bottom when logs update
    if (autoScroll && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredLogs, autoScroll]);

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs?')) {
      logService.clearLogs();
    }
  };

  const handleExportLogs = () => {
    const logsToExport = filter.level !== 'all' || filter.source !== 'all' || filter.search 
      ? filteredLogs 
      : logs;
    
    const content = JSON.stringify(logsToExport, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `hotel-website-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Extract unique sources for filtering
  const sources = ['all', ...new Set(logs.map(log => log.source))];

  // Get the icon for log level
  const getLevelIcon = (level) => {
    switch(level) {
      case LOG_LEVELS.ERROR:
        return <FaExclamationCircle className="text-red-500" />;
      case LOG_LEVELS.WARNING:
        return <FaExclamationTriangle className="text-yellow-500" />;
      case LOG_LEVELS.DEBUG:
        return <FaBug className="text-purple-500" />;
      case LOG_LEVELS.INFO:
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FaBug className="mr-2 text-gray-600" />
          System Logs
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isOpen ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <label className="mr-2 text-sm font-medium text-gray-600">Level:</label>
                <select 
                  value={filter.level}
                  onChange={(e) => setFilter({...filter, level: e.target.value})}
                  className="p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value={LOG_LEVELS.INFO}>Info</option>
                  <option value={LOG_LEVELS.WARNING}>Warning</option>
                  <option value={LOG_LEVELS.ERROR}>Error</option>
                  <option value={LOG_LEVELS.DEBUG}>Debug</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <label className="mr-2 text-sm font-medium text-gray-600">Source:</label>
                <select 
                  value={filter.source}
                  onChange={(e) => setFilter({...filter, source: e.target.value})}
                  className="p-2 border border-gray-300 rounded-md text-sm"
                >
                  {sources.map(source => (
                    <option key={source} value={source}>
                      {source === 'all' ? 'All Sources' : source}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center relative flex-grow">
                <FaSearch className="absolute left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={filter.search}
                  onChange={(e) => setFilter({...filter, search: e.target.value})}
                  className="p-2 pl-9 border border-gray-300 rounded-md text-sm w-full"
                />
              </div>
              
              <div className="flex space-x-2 ml-auto">
                <button
                  onClick={handleClearLogs}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm flex items-center text-red-600"
                >
                  <FaTrash className="mr-1" /> Clear
                </button>
                <button
                  onClick={handleExportLogs}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm flex items-center text-blue-600"
                >
                  <FaDownload className="mr-1" /> Export
                </button>
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                    className="mr-1"
                  />
                  Auto-scroll
                </label>
              </div>
            </div>
          </div>
          
          <div className="p-0">
            <div className="h-96 overflow-auto bg-gray-50 font-mono text-sm">
              {filteredLogs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No logs to display
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                        Timestamp
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        Level
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Source
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className={`
                        ${log.level === LOG_LEVELS.ERROR ? 'bg-red-50' : ''}
                        ${log.level === LOG_LEVELS.WARNING ? 'bg-yellow-50' : ''}
                        hover:bg-gray-100
                      `}>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {log.timestamp.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            {getLevelIcon(log.level)}
                            <span className="ml-1 text-xs">
                              {log.level}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                          {log.source}
                        </td>
                        <td className="px-3 py-2 text-xs">
                          <div className="text-gray-900 whitespace-pre-wrap break-all">
                            {log.message}
                          </div>
                          {log.data && (
                            <div className="mt-1 text-gray-500 whitespace-pre-wrap break-all">
                              {typeof log.data === 'object' 
                                ? JSON.stringify(log.data, null, 2)
                                : String(log.data)
                              }
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div ref={logEndRef} />
            </div>
          </div>
          
          <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between">
            <span>Total logs: {logs.length}</span>
            <span>Filtered logs: {filteredLogs.length}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default LogViewer;
