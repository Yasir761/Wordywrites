import OverviewCards from "./components/OverviewCards"
import UsageChart from "./components/UsageChart"
import RecentBlogs from "./components/RecentBlogs"
import SmartTools from "./components/SmartTools"
import AIAgentsPanel from "./components/AiAgents"

export default function DashboardPage() {
  return (
    <div className="space-y-12 px-4 xl:px-6 pb-12">

      {/* revamp the dashboard layout and whole structure  */}
      <OverviewCards />
      <UsageChart />
      <RecentBlogs />
      <AIAgentsPanel />
      <SmartTools />
    </div>
  )
}
