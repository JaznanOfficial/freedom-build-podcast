import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle, CreditCard, Download, FileText, Send, Users, UserCog } from 'lucide-react';

export default function SubscriptionPage() {
  return (
    <div className="py-4 md:py-6 px-4 lg:px-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your plan and billing</p>
          </div>
        </div>

        {/* Current Plan */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Pro Plan</CardTitle>
                  <CardDescription>Your current subscription</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Notices Used</span>
                    <span className="font-medium">142 / Unlimited</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Students</span>
                    <span className="font-medium">1,234 / 2,000</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Staff Accounts</span>
                    <span className="font-medium">5 / 10</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Emails Sent (This Month)</span>
                    <span className="font-medium">8,542</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Upgrade Plan
                </Button>
                <Button variant="outline">
                  Update Payment Method
                </Button>
                <Button variant="outline" className="text-red-600 hover:text-red-700">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Next Billing Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Dec 30, 2024</div>
                <p className="text-sm text-gray-600 mt-1">Auto-renewal enabled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$588</div>
                <p className="text-sm text-gray-600 mt-1">Last 12 months</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Available Plans */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">200 notices/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">500 students</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">3 staff accounts</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Downgrade
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan - Current */}
            <Card className="border-2 border-indigo-600 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </span>
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Unlimited notices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">2000 students</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">10 staff accounts</span>
                  </li>
                </ul>
                <Button disabled className="w-full bg-gray-200 text-gray-500 cursor-not-allowed">
                  Current Plan
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Everything unlimited</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Multi-branch support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Dedicated support</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>View your past invoices and payments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">Nov 30, 2024</TableCell>
                    <TableCell>Pro Plan - Monthly</TableCell>
                    <TableCell>$49.00</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Paid
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                Showing 1 to 5 of 12 invoices
              </p>
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                <Button variant="outline" size="sm" disabled className="hidden sm:inline-flex">
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled className="sm:hidden">
                  Prev
                </Button>
                <Button variant="outline" size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  3
                </Button>
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  Next
                </Button>
                <Button variant="outline" size="sm" className="sm:hidden">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
