import React, { useState, useEffect, useRef } from 'react';
import { H4, PSmall } from '../ui/typography';
import { Button } from '../ui/button';
import type { OverviewTabProps } from './MapSidebar.types';
import { VANCOUVER_STATS } from './MapSidebar.constants';
import HypotheticalReportDialog from './HypotheticalReportDialog';
import GlobalModals from './GlobalModals';
import { FiFilter, FiCommand } from 'react-icons/fi';

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  permits, 
  showBoundaries, 
  onToggleBoundaries,
  isPinDropMode,
  onPinDropModeToggle,
  pinnedLocation,
  onClearPin,
  onHypotheticalReportGenerated,
  maxDisplayCount,
  onMaxDisplayCountChange
}) => {
  const [showHypotheticalForm, setShowHypotheticalForm] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const commandInputRef = useRef<HTMLInputElement>(null);

  const filterOptions = [10, 25, 50, 100, 250, 500, 1000, null]; // null means "All"

  const handleGenerateHypothetical = () => {
    console.log('Generate hypothetical clicked, pinnedLocation:', pinnedLocation, 'isPinDropMode:', isPinDropMode); // Debug log
    if (!pinnedLocation) {
      // No pin dropped yet, activate pin drop mode
      console.log('Activating pin drop mode'); // Debug log
      onPinDropModeToggle?.();
    } else {
      // Pin already dropped, show form
      console.log('Opening form with pinned location'); // Debug log
      setShowHypotheticalForm(true);
    }
  };

  const handleReportGenerated = (report: any) => {
    console.log('Generated hypothetical report:', report);
    // Call the parent callback to handle the report
    onHypotheticalReportGenerated?.(report);
  };

  const handleCloseDialog = () => {
    setShowHypotheticalForm(false);
  };

  // Available commands
  const commands = [
    { 
      name: 'Toggle Boundaries', 
      shortcut: 'Ctrl+B', 
      action: () => onToggleBoundaries?.(),
      keywords: ['boundaries', 'show', 'hide', 'toggle']
    },
    { 
      name: 'Drop Pin', 
      shortcut: 'Ctrl+P', 
      action: handleGenerateHypothetical,
      keywords: ['pin', 'drop', 'location', 'hypothetical']
    },
    { 
      name: 'Clear Pin', 
      shortcut: 'Ctrl+Shift+P', 
      action: () => onClearPin?.(),
      keywords: ['clear', 'remove', 'pin'],
      disabled: !pinnedLocation
    },
    { 
      name: 'Filter 10', 
      shortcut: 'Alt+1',
      action: () => onMaxDisplayCountChange?.(10),
      keywords: ['filter', '10', 'limit']
    },
    { 
      name: 'Filter 25', 
      shortcut: 'Alt+2',
      action: () => onMaxDisplayCountChange?.(25),
      keywords: ['filter', '25', 'limit']
    },
    { 
      name: 'Filter 50', 
      shortcut: 'Alt+3',
      action: () => onMaxDisplayCountChange?.(50),
      keywords: ['filter', '50', 'limit']
    },
    { 
      name: 'Filter 100', 
      shortcut: 'Alt+4',
      action: () => onMaxDisplayCountChange?.(100),
      keywords: ['filter', '100', 'limit']
    },
    { 
      name: 'Filter 250', 
      shortcut: 'Alt+5',
      action: () => onMaxDisplayCountChange?.(250),
      keywords: ['filter', '250', 'limit']
    },
    { 
      name: 'Filter 500', 
      shortcut: 'Alt+6',
      action: () => onMaxDisplayCountChange?.(500),
      keywords: ['filter', '500', 'limit']
    },
    { 
      name: 'Filter 1000', 
      shortcut: 'Alt+7',
      action: () => onMaxDisplayCountChange?.(1000),
      keywords: ['filter', '1000', 'limit']
    },
    { 
      name: 'Show All', 
      shortcut: 'Alt+8',
      action: () => onMaxDisplayCountChange?.(null),
      keywords: ['filter', 'all', 'show', 'unlimited']
    },
  ];

  // Filter commands based on input
  const filteredCommands = commands.filter(cmd => 
    !cmd.disabled && (
      cmd.name.toLowerCase().includes(commandInput.toLowerCase()) ||
      cmd.keywords?.some(k => k.toLowerCase().includes(commandInput.toLowerCase()))
    )
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        // Only allow Escape and Enter in command palette input
        if (e.key === 'Escape' || e.key === 'Enter') {
          return; // Let the input handler deal with these
        }
        return; // Ignore all other keys when typing
      }

      // Ctrl+K or Cmd+K to open command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
        return;
      }

      // Ctrl+B to toggle boundaries
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        onToggleBoundaries?.();
        return;
      }

      // Ctrl+P to drop pin
      if ((e.ctrlKey || e.metaKey) && e.key === 'p' && !e.shiftKey) {
        e.preventDefault();
        handleGenerateHypothetical();
        return;
      }

      // Ctrl+Shift+P to clear pin
      if ((e.ctrlKey || e.metaKey) && e.key === 'P' && e.shiftKey) {
        e.preventDefault();
        onClearPin?.();
        return;
      }

      // Alt + Number keys 1-8 for filters
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const filterMap: Record<string, number | null> = {
          '1': 10,
          '2': 25,
          '3': 50,
          '4': 100,
          '5': 250,
          '6': 500,
          '7': 1000,
          '8': null, // All
        };
        
        if (e.key in filterMap) {
          e.preventDefault();
          onMaxDisplayCountChange?.(filterMap[e.key]);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette, pinnedLocation, isPinDropMode, onToggleBoundaries, onClearPin, onMaxDisplayCountChange]);

  // Focus command input when palette opens
  useEffect(() => {
    if (showCommandPalette && commandInputRef.current) {
      commandInputRef.current.focus();
    }
  }, [showCommandPalette]);

  const executeCommand = (command: typeof commands[0]) => {
    command.action();
    setShowCommandPalette(false);
    setCommandInput('');
  };

  // Calculate currently displayed count
  const totalPermits = permits.length;
  const displayedPermits = maxDisplayCount !== null && maxDisplayCount !== undefined && maxDisplayCount > 0 
    ? Math.min(maxDisplayCount, totalPermits) 
    : totalPermits;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="">
        <PSmall className="text-muted-foreground">Total Projects</PSmall>
        <H4 className="mt-1 text-primary">{displayedPermits} / {totalPermits}</H4>
      </div>

      {/* Area Info */}
      <div>
        <H4 className="mb-3 text-foreground">Area Information</H4>
        <div className="space-y-3 rounded-lg bg-muted/30 p-4 border border-border">
          <div className="flex justify-between">
            <PSmall className="text-muted-foreground">Population</PSmall>
            <PSmall className="font-medium text-foreground">{VANCOUVER_STATS.POPULATION}</PSmall>
          </div>
          <div className="flex justify-between">
            <PSmall className="text-muted-foreground">Area</PSmall>
            <PSmall className="font-medium text-foreground">{VANCOUVER_STATS.AREA}</PSmall>
          </div>
          <div className="flex justify-between">
            <PSmall className="text-muted-foreground">Density</PSmall>
            <PSmall className="font-medium text-foreground">{VANCOUVER_STATS.DENSITY}</PSmall>
          </div>
          <div className="flex justify-between">
            <PSmall className="text-muted-foreground">Growth Rate</PSmall>
            <PSmall className="font-medium text-primary">{VANCOUVER_STATS.GROWTH_RATE}</PSmall>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <H4 className="mb-3 text-foreground">Quick Actions</H4>
        <div className="space-y-2">
          {/* Command Palette */}
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setShowCommandPalette(!showCommandPalette)}
          >
            <span className="flex items-center gap-2">
              <FiCommand className="h-4 w-4" />
              Command Palette
            </span>
            <span className="text-xs text-muted-foreground">
              Ctrl+K
            </span>
          </Button>

          {/* Development Count Filter */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowFilterOptions(!showFilterOptions)}
            >
              <span className="flex items-center gap-2">
                <FiFilter className="h-4 w-4" />
                Filter Developments
              </span>
              <span className="text-xs text-muted-foreground">
                {maxDisplayCount === null ? 'All' : maxDisplayCount}
              </span>
            </Button>
            {showFilterOptions && (
              <div className="rounded-lg bg-muted/30 p-3 border border-border space-y-1.5">
                <PSmall className="text-muted-foreground mb-2">Show developments:</PSmall>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.map((count) => (
                    <Button
                      key={count === null ? 'all' : count}
                      variant={maxDisplayCount === count ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => {
                        onMaxDisplayCountChange?.(count);
                        setShowFilterOptions(false);
                      }}
                    >
                      {count === null ? 'All' : count}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            className={`w-full justify-start ${showBoundaries ? 'bg-primary/10 border-primary' : ''}`}
            onClick={onToggleBoundaries}
          >
            {showBoundaries ? 'Hide' : 'Show'} Boundaries
          </Button>
          <Button
            variant="outline"
            className={`w-full justify-start ${isPinDropMode ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
            onClick={handleGenerateHypothetical}
          >
            {isPinDropMode 
              ? 'Click map to drop pin...' 
              : pinnedLocation 
                ? 'Generate Report (Pin Set)' 
                : 'Drop Pin for Report'
            }
          </Button>
          {pinnedLocation && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs text-muted-foreground"
              onClick={onClearPin}
            >
              Clear Pin ({pinnedLocation.lat.toFixed(4)}, {pinnedLocation.lon.toFixed(4)})
            </Button>
          )}
        </div>
      </div>

      {/* Hypothetical Report Dialog */}
      <HypotheticalReportDialog
        isOpen={showHypotheticalForm}
        onClose={handleCloseDialog}
        onReportGenerated={handleReportGenerated}
        pinnedLocation={pinnedLocation}
      />

      {/* Tutorial Button */}
      <div>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setShowTutorial(true)}
        >
          How to Use This App
        </Button>
      </div>

      {/* Global Modals - Rendered at document.body level via portal */}
      <GlobalModals
        showCommandPalette={showCommandPalette}
        onCloseCommandPalette={() => setShowCommandPalette(false)}
        commandInput={commandInput}
        onCommandInputChange={setCommandInput}
        commandInputRef={commandInputRef}
        filteredCommands={filteredCommands}
        executeCommand={executeCommand}
        showTutorial={showTutorial}
        onCloseTutorial={() => setShowTutorial(false)}
      />
    </div>
  );
};

export default OverviewTab;