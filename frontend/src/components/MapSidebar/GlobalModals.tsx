import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../ui/button';
import { H4, PSmall } from '../ui/typography';

interface GlobalModalsProps {
  // Command Palette
  showCommandPalette: boolean;
  onCloseCommandPalette: () => void;
  commandInput: string;
  onCommandInputChange: (value: string) => void;
  commandInputRef: React.RefObject<HTMLInputElement | null>;
  filteredCommands: Array<{
    name: string;
    shortcut?: string;
    action: () => void;
  }>;
  executeCommand: (command: any) => void;
  
  // Tutorial
  showTutorial: boolean;
  onCloseTutorial: () => void;
}

const GlobalModals: React.FC<GlobalModalsProps> = ({
  showCommandPalette,
  onCloseCommandPalette,
  commandInput,
  onCommandInputChange,
  commandInputRef,
  filteredCommands,
  executeCommand,
  showTutorial,
  onCloseTutorial,
}) => {
  const modalsRoot = document.body;

  if (!modalsRoot) return null;

  return ReactDOM.createPortal(
    <>
      {/* Command Palette Modal */}
      {showCommandPalette && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[10000]"
          onClick={onCloseCommandPalette}
        >
          <div 
            className="relative rounded-lg border border-border bg-card p-6 shadow-2xl max-w-lg w-full mx-4 animate-in fade-in slide-in-from-bottom-2 duration-300"

            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onCloseCommandPalette}
              className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <span className="text-xs">✕</span>
            </button>

            {/* Header */}
            <div className="mb-4 pr-8">
              <H4 className="text-card-foreground">Command Palette</H4>
              <PSmall className="text-muted-foreground mt-1">Search and execute commands quickly</PSmall>
            </div>

            {/* Search Input */}
            <div className="border-t border-border pt-4 space-y-3">
              <input
                ref={commandInputRef}
                type="text"
                value={commandInput}
                onChange={(e) => onCommandInputChange(e.target.value)}
                placeholder="Type a command or use shortcuts"
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredCommands.length > 0) {
                    executeCommand(filteredCommands[0]);
                  }
                  if (e.key === 'Escape') {
                    onCloseCommandPalette();
                  }
                }}
              />
              
              {/* Commands List */}
              <div className="space-y-1">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd, index) => (
                    <button
                      key={index}
                      onClick={() => executeCommand(cmd)}
                      className="w-full px-3 py-2.5 text-left text-sm hover:bg-primary/10 rounded-md flex justify-between items-center group transition-colors border border-transparent hover:border-primary/20 scrollbar-hidden"
                    >
                      <span className="text-foreground">{cmd.name}</span>
                      {cmd.shortcut && (
                        <span className="text-xs px-2 py-0.5 bg-muted rounded border border-border font-mono text-muted-foreground group-hover:text-primary">
                          {cmd.shortcut}
                        </span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <PSmall className="text-muted-foreground">No commands found</PSmall>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[10000]"
          onClick={onCloseTutorial}
        >
          <div 
            className="relative rounded-lg border border-border bg-card p-6 shadow-2xl max-w-2xl w-full mx-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onCloseTutorial}
              className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <span className="text-xs">✕</span>
            </button>

            {/* Header */}
            <div className="mb-4 pr-8">
              <H4 className="text-card-foreground">Welcome to Urban Development Insights</H4>
              <PSmall className="text-muted-foreground mt-1">Learn how to explore and analyze development projects</PSmall>
            </div>

            {/* Content */}
            <div className="border-t border-border pt-4 space-y-6">
              {/* Getting Started */}
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-3">Getting Started</h5>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>This application helps you visualize and analyze urban development projects in Vancouver.</p>
                  <p>Click on any marker on the map to view detailed information about a development project.</p>
                </div>
              </div>

              {/* Filtering Projects */}
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-3">Filtering Projects</h5>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Use the filter dropdown to control how many developments are displayed on the map.</p>
                  <p>Projects are automatically sorted by cost with the highest value projects shown first.</p>
                  <p>Available filter options: 10, 25, 50, 100, 250, 500, 1000, or show all projects.</p>
                </div>
              </div>

              {/* Hypothetical Analysis */}
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-3">Hypothetical Impact Analysis</h5>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Drop a pin anywhere on the map to analyze the potential impact of a hypothetical development.</p>
                  <p>Click the Drop Pin button, then click on the map where you want to place the development.</p>
                  <p>Fill in the project details to generate an AI-powered impact analysis.</p>
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-3">Keyboard Shortcuts</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-muted-foreground">Open Command Palette</span>
                    <code className="text-xs px-2 py-1 bg-muted rounded border border-border">Ctrl+K</code>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-muted-foreground">Toggle Boundaries</span>
                    <code className="text-xs px-2 py-1 bg-muted rounded border border-border">Ctrl+B</code>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-muted-foreground">Drop Pin</span>
                    <code className="text-xs px-2 py-1 bg-muted rounded border border-border">Ctrl+P</code>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-muted-foreground">Quick Filters</span>
                    <code className="text-xs px-2 py-1 bg-muted rounded border border-border">Alt+1 to Alt+8</code>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-3">Tips</h5>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Use the command palette for quick access to all features</li>
                  <li>Filters help you focus on specific project ranges and improve performance</li>
                  <li>The right panel shows detailed impact analysis for selected projects</li>
                  <li>Neighborhood boundaries can be toggled for better geographic context</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-4 mt-6">
              <Button
                onClick={onCloseTutorial}
                className="w-full"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </>,
    modalsRoot
  );
};

export default GlobalModals;
