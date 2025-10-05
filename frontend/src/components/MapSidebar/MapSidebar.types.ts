// Types and interfaces for MapSidebar components

export interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  permits?: any[]
  selectedPermit?: any
  onPermitSelect?: (permit: any) => void
  showBoundaries?: boolean
  onToggleBoundaries?: () => void
  isPinDropMode?: boolean
  onPinDropModeToggle?: () => void
  pinnedLocation?: {lon: number, lat: number} | null
  onClearPin?: () => void
  onHypotheticalReportGenerated?: (report: any) => void
  maxDisplayCount?: number | null
  onMaxDisplayCountChange?: (count: number | null) => void
}

export interface Permit {
  _id: string
  address: string
  propertyuse?: string[]
  projectvalue: number
  issuedate: string
  projectdescription?: string
}

export type TabType = 'overview' | 'projects'

export interface TabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export interface OverviewTabProps {
  permits: any[]
  showBoundaries: boolean
  onToggleBoundaries?: () => void
  isPinDropMode?: boolean
  onPinDropModeToggle?: () => void
  pinnedLocation?: {lon: number, lat: number} | null
  onClearPin?: () => void
  onHypotheticalReportGenerated?: (report: any) => void
  maxDisplayCount?: number | null
  onMaxDisplayCountChange?: (count: number | null) => void
}

export interface ProjectsTabProps {
  permits: any[]
  selectedPermit?: any
  onPermitSelect?: (permit: any) => void
  maxDisplayCount?: number | null
  onMaxDisplayCountChange?: (count: number | null) => void
}

export interface ProjectCardProps {
  permit: any
  isSelected: boolean
  onSelect: () => void
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}