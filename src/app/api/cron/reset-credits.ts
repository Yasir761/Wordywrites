// import { NextResponse } from 'next/server'
// import { connectDB } from '@/app/api/utils/db'
// import { UserModel } from '@/app/models/user'
// import { PLANS } from '@/app/constants/plans'

// export async function GET() {
//   await connectDB()

//   const now = new Date()

//   const users = await UserModel.find({ nextResetDate: { $lt: now } })

//   type PlanKey = keyof typeof PLANS;
//   for (const user of users) {
//     const plan = (user.plan as PlanKey) || 'Free';
//     const credits = PLANS[plan]?.monthlyCredits || PLANS.Free.monthlyCredits;
//     user.credits = credits;
//     user.nextResetDate = getNextMonthDate();
//     await user.save();
//   }

//   return NextResponse.json({ updated: users.length })
// }

// function getNextMonthDate(): Date {
//   const now = new Date()
//   now.setMonth(now.getMonth() + 1)
//   return now
// }
