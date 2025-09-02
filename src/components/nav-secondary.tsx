// "use client"

// import * as React from "react"
// import { usePathname } from "next/navigation"
// import { type Icon } from "@tabler/icons-react"
// import Link from "next/link"

// import {
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// export function NavSecondary({
//   items,
//   ...props
// }: {
//   items: {
//     title: string
//     url: string
//     icon: Icon
//   }[]
// } & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
//   const pathname = usePathname()

//   return (
//     <SidebarGroup {...props}>
//       <SidebarGroupContent className="flex flex-col gap-2">
//         <SidebarMenu>
//           {items.map((item) => {
//             const isActive = pathname === item.url

//             return (
//               <SidebarMenuItem key={item.title}>
//                 <SidebarMenuButton asChild tooltip={item.title}>
//                   <Link
//                     href={item.url}
//                     className={`flex items-center gap-3 px-3 py-2 rounded-xl group transition-all duration-300 backdrop-blur-md ${
//                       isActive
//                         ? "bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg"
//                         : "hover:bg-gradient-to-r hover:from-purple-100/30 hover:to-cyan-100/30 hover:shadow-md"
//                     }`}
//                   >
//                     <item.icon
//                       className={`size-4 transition-transform duration-300 ${
//                         isActive
//                           ? "text-white scale-110"
//                           : "text-gray-500 group-hover:text-purple-600 group-hover:scale-110"
//                       }`}
//                     />
//                     <span
//                       className={`text-sm font-medium transition-all duration-300 ${
//                         isActive
//                           ? "text-white"
//                           : "text-gray-700 group-hover:text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600"
//                       }`}
//                     >
//                       {item.title}
//                     </span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             )
//           })}
//         </SidebarMenu>
//       </SidebarGroupContent>
//     </SidebarGroup>
//   )
// }
