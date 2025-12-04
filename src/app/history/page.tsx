import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import Link from "next/link"

// Mock data for UI demonstration
const mockHistory = [
  {
    id: "1",
    petName: "Max",
    petType: "Dog",
    symptoms: "Limping on front left leg, slight swelling",
    urgency: "medium" as const,
    date: new Date(Date.now() - 86400000),
    status: "reviewed" as const,
  },
  {
    id: "2",
    petName: "Luna",
    petType: "Cat",
    symptoms: "Not eating for 2 days, very lethargic",
    urgency: "high" as const,
    date: new Date(Date.now() - 172800000),
    status: "pending" as const,
  },
  {
    id: "3",
    petName: "Charlie",
    petType: "Dog",
    symptoms: "Mild cough, no other symptoms",
    urgency: "low" as const,
    date: new Date(Date.now() - 259200000),
    status: "reviewed" as const,
  },
  {
    id: "4",
    petName: "Bella",
    petType: "Cat",
    symptoms: "Vomiting after meals",
    urgency: "medium" as const,
    date: new Date(Date.now() - 432000000),
    status: "archived" as const,
  },
  {
    id: "5",
    petName: "Rocky",
    petType: "Dog",
    symptoms: "Skin rash on belly",
    urgency: "low" as const,
    date: new Date(Date.now() - 604800000),
    status: "reviewed" as const,
  },
]

const urgencyColors = {
  critical: "bg-red-500 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-white",
  low: "bg-green-500 text-white",
}

const statusColors = {
  pending: "border-orange-500 text-orange-700 dark:text-orange-400",
  reviewed: "border-blue-500 text-blue-700 dark:text-blue-400",
  archived: "border-gray-500 text-gray-700 dark:text-gray-400",
}

export default function HistoryPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6 max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="mb-2">
              <h1 className="text-3xl font-bold mb-2">Assessment History</h1>
              <p className="text-muted-foreground">
                View and search through all your pet health assessments
              </p>
            </div>

            {/* Search and Filters */}
            <Card className="mb-2">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by pet name, symptoms, or condition..."
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline" className="sm:w-auto cursor-pointer">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Assessment List */}
            <div className="space-y-4">
              {mockHistory.map((assessment) => (
                <Link key={assessment.id} href={`/assessment/${assessment.id}`}>
                  <Card className="hover:bg-accent transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">
                              {assessment.petName}
                            </CardTitle>
                            <Badge variant="secondary" className="text-xs">
                              {assessment.petType}
                            </Badge>
                            <Badge className={urgencyColors[assessment.urgency]}>
                              {assessment.urgency}
                            </Badge>
                            <Badge variant="outline" className={statusColors[assessment.status]}>
                              {assessment.status}
                            </Badge>
                          </div>
                          <CardDescription className="line-clamp-2">
                            {assessment.symptoms}
                          </CardDescription>
                        </div>
                        <div className="text-right text-sm text-muted-foreground whitespace-nowrap">
                          {assessment.date.toLocaleDateString()}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled className="cursor-pointer">
                Previous
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="default" size="sm" className="cursor-pointer">
                  1
                </Button>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  2
                </Button>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  3
                </Button>
              </div>
              <Button variant="outline" size="sm" className="cursor-pointer">
                Next
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
