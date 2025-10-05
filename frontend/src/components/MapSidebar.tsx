import { useState } from 'react'
import { H3, H4, P, PSmall, PMuted } from './ui/typography'
import { Button } from './ui/button'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const MapSidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'impact'>('overview')

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-lg transition-all hover:scale-105 hover:shadow-xl border border-border"
      >
        <span className="text-xl">{isOpen ? '←' : '→'}</span>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 h-full w-96 transform bg-card shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-border`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-border bg-muted/30 px-6 py-4">
            <H3 className="text-foreground">Vancouver, BC</H3>
            <PMuted className="mt-1">Building Impact Analysis</PMuted>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border bg-background/50">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors font-['Roboto_Mono',monospace] ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors font-['Roboto_Mono',monospace] ${
                activeTab === 'projects'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors font-['Roboto_Mono',monospace] ${
                activeTab === 'impact'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Impact
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
                    <PSmall className="text-muted-foreground">Total Projects</PSmall>
                    <H4 className="mt-1 text-primary">24</H4>
                  </div>
                  <div className="rounded-lg bg-accent/10 p-4 border border-accent/20">
                    <PSmall className="text-muted-foreground">Active</PSmall>
                    <H4 className="mt-1 text-accent">12</H4>
                  </div>
                  <div className="rounded-lg bg-chart-1/10 p-4 border border-chart-1/20">
                    <PSmall className="text-muted-foreground">Completed</PSmall>
                    <H4 className="mt-1 text-chart-1">8</H4>
                  </div>
                  <div className="rounded-lg bg-chart-2/10 p-4 border border-chart-2/20">
                    <PSmall className="text-muted-foreground">Planned</PSmall>
                    <H4 className="mt-1 text-chart-2">4</H4>
                  </div>
                </div>

                {/* Area Info */}
                <div>
                  <H4 className="mb-3 text-foreground">Area Information</H4>
                  <div className="space-y-3 rounded-lg bg-muted/30 p-4 border border-border">
                    <div className="flex justify-between">
                      <PSmall className="text-muted-foreground">Population</PSmall>
                      <PSmall className="font-medium text-foreground">2.6M</PSmall>
                    </div>
                    <div className="flex justify-between">
                      <PSmall className="text-muted-foreground">Area</PSmall>
                      <PSmall className="font-medium text-foreground">115 km²</PSmall>
                    </div>
                    <div className="flex justify-between">
                      <PSmall className="text-muted-foreground">Density</PSmall>
                      <PSmall className="font-medium text-foreground">5,493/km²</PSmall>
                    </div>
                    <div className="flex justify-between">
                      <PSmall className="text-muted-foreground">Growth Rate</PSmall>
                      <PSmall className="font-medium text-primary">+2.3%</PSmall>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <H4 className="mb-3 text-foreground">Quick Actions</H4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      📊 Generate Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      🔍 Filter Projects
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      📍 Add Location
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                <H4 className="text-foreground">Active Projects</H4>
                
                {/* Project Cards */}
                {[
                  { name: 'BC Cancer Center', type: 'Healthcare', status: 'Active', impact: 'High' },
                  { name: 'Queen Elizabeth Park Renovation', type: 'Recreation', status: 'Planning', impact: 'Medium' },
                  { name: 'Transit Hub Expansion', type: 'Infrastructure', status: 'Active', impact: 'High' },
                ].map((project, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/50 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <P className="font-semibold text-foreground">{project.name}</P>
                        <PSmall className="mt-1 text-muted-foreground">{project.type}</PSmall>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        project.impact === 'High' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-accent/20 text-accent'
                      }`}>
                        {project.impact}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        project.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <PSmall className="text-muted-foreground">{project.status}</PSmall>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'impact' && (
              <div className="space-y-6">
                <H4 className="text-foreground">Community Impact</H4>

                {/* Impact Metrics */}
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex justify-between">
                      <PSmall className="text-muted-foreground">Housing Availability</PSmall>
                      <PSmall className="font-medium text-foreground">78%</PSmall>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[78%] bg-primary transition-all" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between">
                      <PSmall className="text-muted-foreground">Transportation Access</PSmall>
                      <PSmall className="font-medium text-foreground">85%</PSmall>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[85%] bg-accent transition-all" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between">
                      <PSmall className="text-muted-foreground">Green Spaces</PSmall>
                      <PSmall className="font-medium text-foreground">62%</PSmall>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[62%] bg-chart-1 transition-all" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between">
                      <PSmall className="text-muted-foreground">Healthcare Access</PSmall>
                      <PSmall className="font-medium text-foreground">91%</PSmall>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[91%] bg-chart-2 transition-all" />
                    </div>
                  </div>
                </div>

                {/* Impact Summary */}
                <div className="rounded-lg bg-muted/30 p-4 border border-border">
                  <H4 className="mb-2 text-foreground">Overall Assessment</H4>
                  <PMuted>
                    Building projects in this area show positive impact on community infrastructure. 
                    Transportation and healthcare access are strong, while green space development 
                    could benefit from additional focus.
                  </PMuted>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border bg-muted/30 px-6 py-4">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Generate Full Report
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default MapSidebar
