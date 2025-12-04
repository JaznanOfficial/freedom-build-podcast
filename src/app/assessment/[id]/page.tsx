import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UrgencyIndicator } from "@/components/assessment/urgency-indicator"
import { ConditionCard } from "@/components/assessment/condition-card"
import { RecommendationsPanel } from "@/components/assessment/recommendations-panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Share2, Printer, Download } from "lucide-react"

// Mock assessment data for UI demonstration
const mockAssessment = {
  id: "1",
  petName: "Max",
  petType: "Dog",
  symptoms: "Limping on front left leg, slight swelling, reluctant to put weight on it",
  urgencyLevel: "medium" as const,
  urgencyReason: "Possible sprain or minor injury. Should be examined within 24-48 hours to rule out fracture.",
  possibleConditions: [
    {
      name: "Soft Tissue Injury (Sprain/Strain)",
      probability: "high" as const,
      description: "Most likely cause given the symptoms. Rest and monitoring recommended.",
    },
    {
      name: "Minor Fracture",
      probability: "medium" as const,
      description: "Cannot be ruled out without X-ray. Veterinary examination needed.",
    },
    {
      name: "Arthritis Flare-up",
      probability: "low" as const,
      description: "Less likely in younger dogs, but possible if senior pet.",
    },
  ],
  recommendedTests: ["X-ray of affected leg", "Physical examination", "Range of motion assessment"],
  recommendedActions: {
    immediate: ["Limit activity and exercise", "Prevent jumping or running"],
    within24Hours: ["Schedule veterinary appointment", "Monitor for worsening symptoms"],
    monitoring: ["Watch for increased swelling", "Note any changes in appetite or behavior", "Check if limping worsens"],
  },
  careInstructions: "Keep your dog calm and limit physical activity. Apply a cold compress to the affected area for 10-15 minutes several times a day. Do not give human pain medication. If symptoms worsen or your dog shows signs of severe pain, seek immediate veterinary care.",
  createdAt: new Date(),
}

export default function AssessmentPage() {
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
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Assessment Results</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{mockAssessment.petName}</span>
                    <span>•</span>
                    <span>{mockAssessment.petType}</span>
                    <span>•</span>
                    <span>{mockAssessment.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <UrgencyIndicator level={mockAssessment.urgencyLevel} />
            </div>

            <div className="space-y-6">
              {/* Symptoms */}
              <Card>
                <CardHeader>
                  <CardTitle>Reported Symptoms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{mockAssessment.symptoms}</p>
                </CardContent>
              </Card>

              {/* Urgency Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle>Urgency Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{mockAssessment.urgencyReason}</p>
                </CardContent>
              </Card>

              {/* Possible Conditions */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Possible Conditions</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {mockAssessment.possibleConditions.map((condition, index) => (
                    <ConditionCard key={index} condition={condition} />
                  ))}
                </div>
              </div>

              {/* Recommended Tests */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Tests</CardTitle>
                  <CardDescription>
                    These tests can help confirm the diagnosis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockAssessment.recommendedTests.map((test, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5">
                          {index + 1}
                        </Badge>
                        <span className="text-sm">{test}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <RecommendationsPanel
                actions={mockAssessment.recommendedActions}
                careInstructions={mockAssessment.careInstructions}
              />

              {/* Disclaimer */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base">Medical Disclaimer</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    This assessment is generated by AI and is for informational purposes only. 
                    It does not constitute professional veterinary advice, diagnosis, or treatment. 
                    Always seek the advice of a qualified veterinarian with any questions you may have 
                    regarding your pet's health. Never disregard professional veterinary advice or delay 
                    in seeking it because of something you have read in this assessment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
