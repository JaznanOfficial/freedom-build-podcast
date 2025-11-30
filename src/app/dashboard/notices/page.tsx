import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Eye, Download, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function NoticeHistoryPage() {
  return (
    <div className="py-4 md:py-6 px-4 lg:px-6">
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notice History</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage all your notices</p>
        </div>
        <Link href="/dashboard/notices/create">
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
            Create Notice
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input placeholder="Search notices..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="exam">Exam Notice</SelectItem>
                <SelectItem value="holiday">Holiday Notice</SelectItem>
                <SelectItem value="meeting">Parent Meeting</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Email Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    Exam Schedule Announcement
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Exam Notice</Badge>
                  </TableCell>
                  <TableCell>Students, Parents</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Sent (90/90)
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">2 hours ago</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              Showing 1 to 8 of 142 notices
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
              <span className="px-1 sm:px-2 hidden sm:inline">...</span>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                18
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
