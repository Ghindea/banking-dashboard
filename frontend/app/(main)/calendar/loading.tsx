import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container pt-0 pb-6 max-w-7xl">
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-6 w-32" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px">
                {Array(7)
                  .fill(0)
                  .map((_, i) => (
                    <div key={`header-${i}`} className="text-center py-2">
                      <Skeleton className="h-4 w-8 mx-auto" />
                    </div>
                  ))}

                {Array(6)
                  .fill(0)
                  .map((_, weekIndex) =>
                    Array(7)
                      .fill(0)
                      .map((_, dayIndex) => (
                        <div key={`day-${weekIndex}-${dayIndex}`} className="h-24 border border-gray-200 p-2">
                          <Skeleton className="h-4 w-4 mb-2" />
                          <Skeleton className="h-3 w-12 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      )),
                  )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={`stat-${i}`}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <Skeleton className="h-10 w-10 rounded-full mb-2" />
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-8" />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center h-full">
                <Skeleton className="h-16 w-16 rounded-full mb-4" />
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
