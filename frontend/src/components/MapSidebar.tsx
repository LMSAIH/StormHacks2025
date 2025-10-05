import { useState } from 'react'
import { H3, H4, P, PSmall, PMuted } from './ui/typography'
import { Button } from './ui/button'
import { 
  FaHome, 
  FaBuilding, 
  FaUniversity, 
  FaIndustry, 
  FaCity, 
  FaHammer,
  FaChevronLeft,
  FaChevronRight 
} from 'react-icons/fa'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  permits?: any[]
  selectedPermit?: any
  onPermitSelect?: (permit: any) => void
}

const MapSidebar = ({ isOpen, onToggle, permits = [], selectedPermit, onPermitSelect }: SidebarProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects'>('overview')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Sort permits by project value (highest first)
  const sortedPermits = permits
    .filter(permit => permit.projectvalue) // Only show permits with project values
    .sort((a, b) => (b.projectvalue || 0) - (a.projectvalue || 0))

  // Pagination logic
  const totalPages = Math.ceil(sortedPermits.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPermits = sortedPermits.slice(startIndex, endIndex)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPropertyUseIcon = (use: string) => {
    switch (use.toLowerCase()) {
      case 'residential uses':
        return FaHome;
      case 'commercial uses':
        return FaBuilding;
      case 'institutional uses':
        return FaUniversity;
      case 'industrial uses':
        return FaIndustry;
      case 'mixed uses':
        return FaCity;
      default:
        return FaHammer;
    }
  };

  const getPropertyUseColor = (use: string) => {
    switch (use.toLowerCase()) {
      case 'residential uses':
        return 'bg-blue-500';
      case 'commercial uses':
        return 'bg-green-500';
      case 'institutional uses':
        return 'bg-purple-500';
      case 'industrial uses':
        return 'bg-orange-500';
      case 'mixed uses':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProjectSize = (projectValue: number) => {
    if (projectValue < 2000000) return 'Small';
    if (projectValue < 10000000) return 'Medium';
    return 'Large';
  };

  const truncateDescription = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

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
        className={`fixed left-0 top-0 z-40 h-full w-96 transform bg-card shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
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
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors font-['Roboto_Mono',monospace] ${activeTab === 'overview'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors font-['Roboto_Mono',monospace] ${activeTab === 'projects'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Projects
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}

                <div className="">
                  <PSmall className="text-muted-foreground">Total Projects</PSmall>
                  <H4 className="mt-1 text-primary">{permits.length}</H4>
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
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={onToggleBoundaries}
                    >
                      {showBoundaries ? '🗺️ Hide Boundaries' : '🗺️ Show Boundaries'}
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

                {/* Project Cards */}
                {currentPermits.length > 0 ? (
                  <div className="space-y-3">
                    {currentPermits.map((permit) => {
                      const primaryUse = permit.propertyuse?.[0] || 'Unknown';
                      const IconComponent = getPropertyUseIcon(primaryUse);
                      const isSelected = selectedPermit?._id === permit._id;
                      
                      return (
                        <div
                          key={permit._id}
                          className={`rounded-lg border p-4 transition-all cursor-pointer hover:shadow-md ${
                            isSelected 
                              ? 'border-primary bg-primary/5 shadow-md' 
                              : 'border-border bg-card hover:border-primary/50'
                          }`}
                          onClick={() => {
                            // Allow deselection by clicking the same permit
                            if (isSelected) {
                              onPermitSelect?.(null);
                            } else {
                              onPermitSelect?.(permit);
                            }
                          }}
                        >
                          {/* Header */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPropertyUseColor(primaryUse)}`}>
                              <IconComponent className="text-white text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <P className="font-semibold text-card-foreground leading-tight">
                                {permit.address}
                              </P>
                              <PSmall className="text-muted-foreground mt-1">
                                {primaryUse}
                              </PSmall>
                            </div>
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                              getProjectSize(permit.projectvalue) === 'Large'
                                ? 'bg-primary/20 text-primary'
                                : getProjectSize(permit.projectvalue) === 'Medium'
                                ? 'bg-accent/20 text-accent'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {getProjectSize(permit.projectvalue)}
                            </span>
                          </div>

                          {/* Project Details */}
                          <div className="space-y-2 border-t border-border pt-3">
                            <div className="flex justify-between">
                              <PSmall className="text-muted-foreground">Project Value:</PSmall>
                              <PSmall className="font-semibold text-green-600">
                                {formatCurrency(permit.projectvalue)}
                              </PSmall>
                            </div>
                            <div className="flex justify-between">
                              <PSmall className="text-muted-foreground">Issue Date:</PSmall>
                              <PSmall className="font-medium text-card-foreground">
                                {formatDate(permit.issuedate)}
                              </PSmall>
                            </div>
                            {permit.projectdescription && (
                              <div>
                                <PSmall className="text-muted-foreground mb-1">Description:</PSmall>
                                <PSmall className="text-card-foreground leading-relaxed">
                                  {truncateDescription(permit.projectdescription)}
                                </PSmall>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PSmall className="text-muted-foreground">No projects available</PSmall>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2"
                    >
                      <FaChevronLeft className="text-xs" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <PSmall className="text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </PSmall>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2"
                    >
                      Next
                      <FaChevronRight className="text-xs" />
                    </Button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}

export default MapSidebar
